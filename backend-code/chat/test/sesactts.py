from gtts import gTTS
import os

# 변환할 텍스트
text = "안녕하세요, gTTS입니다."
# 언어 설정
language = 'ko'

# gTTS 객체 생성
speech = gTTS(text=text, lang=language, slow=False)

# 음성 파일로 저장
speech.save("output.mp3")

# 저장된 음성 파일 재생 (이 코드는 Linux/macOS에서 작동합니다)
os.system("mpg321 output.mp3")
