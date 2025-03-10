import os
import json
import openai
from transformers import pipeline
from langchain.tools import tool
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent
from langchain.agents import AgentExecutor
from google.cloud import speech
from gtts import gTTS
from playsound import playsound
import tempfile
import torch

# 디버깅을 위한 print 추가
print("Starting program...")

try:
    # ✅ 환경 변수 로드
    load_dotenv()
    print("Environment variables loaded")

    # ✅ OpenAI API 키 설정
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    print(f"OpenAI API Key loaded: {OPENAI_API_KEY[:10]}...")
    client = openai.OpenAI(api_key=OPENAI_API_KEY)

    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'C:/Users/com/Desktop/sesac/sesac-429413-3b81cf585a9f.json'

    # Whisper 모델 초기화
    print("Initializing Whisper model...")
    transcriber = pipeline(
        "automatic-speech-recognition",
        model="openai/whisper-large-v3",  # 또는 "jonatasgrosman/wav2vec2-large-xlsr-53-korean"
        device="cuda" if torch.cuda.is_available() else "cpu"
    )
    print(f"Using device: {'cuda' if torch.cuda.is_available() else 'cpu'}")

    # 음성 녹음 함수
    def record_audio(file_name, duration=5):
        import sounddevice as sd
        import wavio

        samplerate = 16000
        print("녹음시작")
        recording = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1)
        sd.wait()
        print("녹음 끝")
        wavio.write(file_name, recording, samplerate, sampwidth=2)

    # 음성을 텍스트로 변환하는 함수 (Whisper 사용)
    def transcribe_speech(audio_file_path):
        try:
            result = transcriber(audio_file_path)
            return result["text"]
        except Exception as e:
            print(f"Error during transcription: {e}")
            return None

    # ChatGPT와 상호작용하여 응답을 생성하는 함수
    def generate_text(messages, model="gpt-3.5-turbo"):
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            max_tokens=150
        )
        return response.choices[0].message['content'].strip()

    # 텍스트를 음성으로 변환하는 함수
    def text_to_speech(text, output_file):
        tts = gTTS(text=text, lang='ko')
        tts.save(output_file)
        return output_file

    # 음성 파일을 재생하는 함수
    def play_audio(file_path):
        playsound(file_path)

    # 메인 함수
    def main():
        print("Starting main function...")
        audio_file = "voice.wav"
        messages = [{"role": "system", "content": "You are a helpful assistant."}]
        
        while True:
            try:
                # Step 1: 음성을 녹음하고 파일로 저장
                print("Recording audio...")
                record_audio(audio_file)

                # Step 2: 음성을 텍스트로 변환
                transcript = transcribe_speech(audio_file)
                if transcript is None:
                    print("프로그램을 종료합니다.")
                    break
                print(f"Transcribed Text: {transcript}")

                # Step 3: 변환된 텍스트를 메시지 히스토리에 추가
                messages.append({"role": "user", "content": transcript})

                # Step 4: 변환된 텍스트를 ChatGPT에 전달하여 응답을 생성
                response_text = generate_text(messages)
                print(f"GPT Response: {response_text}")

                # Step 5: 응답을 메시지 히스토리에 추가
                messages.append({"role": "assistant", "content": response_text})

                # Step 6: 생성된 응답을 다시 음성으로 변환하여 파일로 저장
                with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
                    response_audio_file = temp_file.name
                    text_to_speech(response_text, response_audio_file)

                # Step 7: 응답 음성을 재생
                play_audio(response_audio_file)

                # Step 8: 임시 파일 삭제
                os.remove(response_audio_file)

                # 대화를 계속할지 묻기
                cont = input("계속 대화하시겠습니까? (yes/no): ").strip().lower()
                if cont != 'yes':
                    break

            except Exception as e:
                print(f"Error occurred: {str(e)}")
                print(f"Error type: {type(e)}")
                import traceback
                print(traceback.format_exc())

except Exception as e:
    print(f"Error occurred: {str(e)}")
    print(f"Error type: {type(e)}")
    import traceback
    print(traceback.format_exc())

if __name__ == "__main__":
    main()