import openai
import os
from google.cloud import speech
from gtts import gTTS
from playsound import playsound
import tempfile
import os
from langchain.tools import tool
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent
from langchain.agents import AgentExecutor
from typing import List, Dict, Annotated
from math import radians, sin, cos, sqrt, atan2
import time

# ✅ 환경 변수 로드
load_dotenv()

# ✅ OpenAI API 키 설정
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'C:\Users\pc\Desktop\project\icare\BackEndiCare\chat\test\sesac-429413-3b81cf585a9f.json'

# 음성 녹음 함수
def record_audio(file_name, duration=5):
    import sounddevice as sd
    import wavio

    samplerate = 16000  # Hertz
    print("녹음시작")
    recording = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1)
    sd.wait()  # Wait until recording is finished
    print("녹음 끝")
    wavio.write(file_name, recording, samplerate, sampwidth=2)

# 음성을 텍스트로 변환하는 함수
def transcribe_speech(audio_file_path):
    try:
        client = speech.SpeechClient()
        print("Speech client created")  # 디버깅 로그

        with open(audio_file_path, "rb") as audio_file:
            content = audio_file.read()
        print("Audio file read")  # 디버깅 로그

        audio = speech.RecognitionAudio(content=content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="ko-KR",
        )
        print("Recognition config created")  # 디버깅 로그

        response = client.recognize(config=config, audio=audio)
        print("Recognition response:", response)  # 디버깅 로그

        for result in response.results:
            return result.alternatives[0].transcript

        print("No transcription results")  # 디버깅 로그
        return None
        
    except Exception as e:
        print(f"Error in transcribe_speech: {str(e)}")  # 에러 로깅
        return None

# 텍스트를 음성으로 변환하는 함수
def text_to_speech(text, output_file):
    tts = gTTS(text=text, lang='ko')
    tts.save(output_file)
    return output_file

# 음성 파일을 재생하는 함수
def play_audio(file_path):
    # Windows의 경우
    os.system(f'start {file_path}')
    # Linux/macOS의 경우
    # os.system(f"mpg321 {file_path}")

def get_temp_filename():
    # 현재 시간을 이용해 고유한 파일 이름 생성
    timestamp = int(time.time() * 1000)
    return f"output_{timestamp}.mp3"

def cleanup_mp3_files():
    # output로 시작하는 mp3 파일들 정리
    current_dir = os.path.dirname(os.path.abspath(__file__))
    for file in os.listdir(current_dir):
        if file.startswith("output_") and file.endswith(".mp3"):
            try:
                file_path = os.path.join(current_dir, file)
                os.remove(file_path)
            except:
                pass

# 메인 함수
def main():
    audio_file = "voice.wav"
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    
    # 시작할 때 이전 파일들 정리
    cleanup_mp3_files()
    
    while True:
        try:
            # Step 1: 음성을 녹음하고 파일로 저장
            record_audio(audio_file)
            print(f"Audio file saved to: {audio_file}")

            # Step 2: 음성을 텍스트로 변환
            transcript = transcribe_speech(audio_file)
            if transcript is None:
                print("음성 인식에 실패했습니다. 다시 시도해주세요.")
                continue
            
            print(f"Transcribed Text: {transcript}")

            # Step 3: ChatGPT로 응답 생성
            messages.append({"role": "user", "content": transcript})
            
            try:
                print("Calling OpenAI API...")  # 디버깅 로그 추가
                completion = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                    max_tokens=150
                )
                print("OpenAI API response received")  # 디버깅 로그 추가
                response_text = completion.choices[0].message.content.strip()
                print(f"GPT Response: {response_text}")
                
                print("Converting to speech...")  # 디버깅 로그 추가
                # 응답을 메시지 히스토리에 추가
                messages.append({"role": "assistant", "content": response_text})

                # 음성으로 변환 및 재생
                output_file = get_temp_filename()  # 매번 새로운 파일 이름 사용
                text_to_speech(response_text, output_file)
                print(f"Playing audio response: {output_file}")
                play_audio(output_file)
                
                # 파일 삭제는 약간의 딜레이 후에
                time.sleep(3)  # 재생 시간 좀 더 늘림
                try:
                    os.remove(output_file)
                except:
                    pass  # 삭제 실패해도 계속 진행

            except Exception as e:
                print(f"Error in OpenAI API call: {str(e)}")
                print(f"Error type: {type(e)}")
                import traceback
                print(traceback.format_exc())
                continue

            # 계속할지 확인
            cont = input("계속 대화하시겠습니까? (yes/no): ").strip().lower()
            if cont != 'yes':
                break

        except Exception as e:
            print(f"Error in main loop: {str(e)}")
            continue

    # 프로그램 종료 시 파일들 정리
    cleanup_mp3_files()

if __name__ == "__main__":
    main()