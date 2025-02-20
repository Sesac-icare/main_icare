# **iCare 프로젝트 안내 및 사용자 가이드**

---

## **목차**
1. [iCare 사용자 가이드 및 소개](#iCare-사용자-가이드-및-소개)
2. [프론트 소개](#프론트-소개)
3. [프론트 주요 기능](#프론트-주요-기능)
4. [프론트 기술 스택](#프론트-기술-스택)
5. [프론트 설치 및 설정](#프론트-설치-및-설정)
6. [프론트 주요 라이브러리 및 버전](#프론트-주요-라이브러리-및-버전)
7. [프론트 디렉토리 구조](#프론트-디렉토리-구조)
8. [백엔드 소개](#백엔드-소개)
9. [백엔드 주요 기능](#백엔드-주요-기능)
10. [백엔드 기술 스택](#백엔드-기술-스택)
11. [백엔드 설치 및 설정](#백엔드-설치-및-설정)
12. [백엔드 주요 라이브러리 및 버전](#백엔드-주요-라이브러리-및-버전)
13. [백엔드 디렉토리 구조](#백엔드-디렉토리-구조)
14. [배포](#배포)
15. [테스트](#테스트)
16. [기여 방법](#기여-방법)
17. [라이선스](#라이선스)
18. [문의](#문의)

---
# iCare 사용자 가이드 및 소개
1. 서비스 소개
iCare는 24시간 의료 정보를 제공하는 AI 기반 헬스케어 서비스입니다. 근처 병원과 약국 찾기, 처방전 관리, AI 상담 등을 제공합니다.

2. 시작하기
2.1 회원가입/로그인
- 앱 실행 후 회원가입 또는 로그인
- 필수 정보: 아이디, 이메일, 비밀번호, 비밀번호 확인
- 위치 정보 접근 권한 허용 필요
- 서비스 이용약관 동의

2.2 홈 화면 구성
- 병원 찾기
- 약국 찾기
- 하단에 홈, 채팅, 마이페이지 메뉴 구성

3. 주요 기능 안내
3.1 AI 아이케어 챗봇
사용 방법
- 하단 입력창에 질문 입력
- 음성 버튼으로 음성 입력 가능
- 자연어로 자유롭게 질문
주요 기능
- 의료기관 검색
  - 현재 위치 기반 병원/약국 검색
  - 진료과목별 병원 찾기
  - 영업 중인 의료기관 확인
  - 24시간 운영 의료기관 검색
- 의료 상담
  - 증상에 따른 진료과목 추천하여 병원 검색

예시 질문
```bash
[병원 검색]
- "근처 소아과 찾아줘"
- "지금 영업중인 내과 알려줘"
- "주말에 하는 치과 있어?"
- "야간진료하는 이비인후과 찾아줘"

[약국 검색]
- "근처 24시간 약국 어디있어?"
- "지금 문 연 약국 찾아줘"
- "심야 약국 알려줘"
- "주말에 하는 약국 알려줘"

[의료 상담]
- "열이 나고 목이 아파요"
- "두통이 심한데 어느 과로 가야할까요?"
- "소아과 야간진료 병원 추천해주세요"
- "감기약 복용 시 주의사항이 뭔가요?"
```

주의사항
1. 위치 기반 서비스
  - 정확한 검색을 위해 위치 정보 권한 필요
  - GPS가 활성화되어 있어야 함
  - 위치 정보가 부정확할 경우 새로 로그인 필요
2. 운영 정보 
  - 공휴일/특별 운영 시간은 직접 확인 필요
  - 실시간 정보와 차이가 있을 수 있음
  - 중요한 방문은 전화 확인 권장

정확한 검색을 위한 이용 가이드
  - 구체적인 증상/과목 명시
  - 위치 정보 최신 상태 유지

**이 AI 챗봇은 사용자의 편의를 위한 보조 도구이며, 전문적인 의료 상담이나 진단을 대체할 수 없습니다. 정확한 의료 서비스는 반드시 전문 의료진과 상담하시기 바랍니다.**

3.2 마이페이지 > 서류보관함
3.2.1 처방전 등록
  - 처방전 촬영 가이드

  촬영 방법
  1. 처방전 등록 버튼 클릭
  2. 처방전은 약제비 계산서/영수증 부분만 촬영하여 등록

  주요 촬영 포인트
  - 촬영 시 주의사항
  - 처방전이 구겨지거나 접히지 않도록 주의
  - 글자가 선명하게 보이도록 초점 맞추기
  - 빛 반사 피하기
  - 기울어지지 않게 촬영

3.2.2 처방전 리스트
  - 등록된 처방전 목록 확인
  - 처방전 리스트 내 정보 확인
    - 자녀 이름
    - 교부 날짜
    - 약국 이름
    - 총 처방 일자
    - 총 약 투여 까지 남은 일자
  - 처방전 삭제

3.2.3 처방전 상세 정보 조회

3.2.4 처방전 내 약품 정보 조회

3.3 병원 찾기
- 검색 방법
  - 현재 위치 기준 가까운 순 검색
  - 영업 중인 병원 검색

-제공 정보
  - 병원명과 주소
  - 현재 위치에서의 거리
  - 영업 상태 (영업중/종료/점심시간)
  - 진료 시간
  - 연락처

3.4 약국 찾기
- 검색 방법
  - 현재 위치 기준 가까운 순 검색
  - 영업중인 약국 필터링
- 제공 정보
  - 약국명과 주소
  - 현재 영업 상태
  - 영업 시간 
  - 거리
  - 연락처
  

5. 자주 묻는 질문
5.1 위치 서비스
Q: 위치 정보가 부정확해요.
A: 설정에서 위치 권한을 확인하고, GPS를 활성화해주세요.

5.2 처방전 등록
Q: 처방전 인식이 잘 안돼요.
A: 밝은 곳에서 처방전 전체가 잘 보이도록 다시 촬영해주세요.

5.3 검색 관련
Q: 영업시간이 실제와 다릅니다.
A: 공휴일이나 특별 영업시간의 경우 직접 확인이 필요합니다.

## **프론트 소개**
iCare는 React Native와 Expo를 기반으로 한 모바일 애플리케이션입니다. 사용자 친화적인 인터페이스와 다양한 기능을 제공하여 의료 서비스 접근성을 높였습니다.

## **프론트 주요 기능**
- **AI 챗봇 인터페이스**
  - 텍스트 기반 대화
  - 음성 인식 및 음성 출력 (TTS)
  - 실시간 응답 표시

- **위치 기반 서비스**
  - 현재 위치 기반 병원/약국 검색
  - 거리 계산 및 정렬
  - 실시간 위치 업데이트

- **처방전 관리**
  - 카메라를 통한 처방전 등록
  - OCR 기반 텍스트 인식
  - 처방전 목록 관리 및 상세 조회

- **사용자 인증**
  - 토큰 기반 인증
  - 자동 로그인
  - 프로필 관리

## **프론트 기술 스택**
- **프레임워크:** React Native 0.76.7
- **개발 플랫폼:** Expo SDK 52
- **상태 관리:** React Hooks
- **네비게이션:** React Navigation 7
- **HTTP 클라이언트:** Axios
- **스타일링:** Styled Components

## **프론트 설치 및 설정**

### **1. 환경 설정**
```bash
# Node.js 설치 (v16 이상)
# Expo CLI 설치
npm install -g expo-cli

# 프로젝트 클론
git clone [repository-url]
cd iCare
```

### **2. 의존성 설치**
```bash
npm install
```

### **3. 환경 변수 설정**
프로젝트 루트에 .env 파일 생성:
```bash
API_BASE_URL=your_api_url
```

### **4. 개발 서버 실행**
```bash
npm start
# 또는
expo start
```

## **프론트 주요 라이브러리 및 버전**
```json
{
  "dependencies": {
    // 네비게이션
    "@react-navigation/bottom-tabs": "^7.2.0",
    "@react-navigation/native": "^7.0.14",
    "@react-navigation/native-stack": "^7.2.0",

    // 데이터 관리
    "@react-native-async-storage/async-storage": "^1.23.1",
    "axios": "^1.7.9",

    // UI/UX
    "expo": "~52.0.32",
    "expo-camera": "~16.0.16",
    "expo-image-picker": "~16.0.6",
    "styled-components": "^6.1.14",

    // 위치 서비스
    "expo-location": "~18.0.6",

    // 음성 관련
    "@react-native-voice/voice": "^3.2.4",
    "expo-av": "~15.0.2",
    "expo-speech": "~13.0.1",
    "expo-speech-recognition": "^1.1.1",

    // 유틸리티
    "moment": "^2.30.1"
  }
}
```

## **프론트 디렉토리 구조**
```bash
iCare/
├── App.js                # 앱 진입점
├── components/           # 컴포넌트
│   ├── auth/            # 인증 관련 컴포넌트
│   │   ├── Login.js
│   │   └── SignUp.js
│   ├── ChatScreen.js    # AI 챗봇 화면
│   ├── Contents.js      # 메인 콘텐츠
│   └── DocumentStorage.js # 처방전 관리
├── config/              # 설정 파일
│   └── api.js          # API 설정
├── hooks/               # 커스텀 훅
├── navigation/          # 네비게이션 설정
├── screens/             # 화면 컴포넌트
├── styles/              # 스타일 정의
└── utils/              # 유틸리티 함수
```


## **백엔드 소개**
이 프로젝트는 **Django 프레임워크**를 사용하여 백엔드 서비스를 구축한 **웹 애플리케이션**입니다.  
다양한 라이브러리와 Django 패키지를 활용하여 **확장성**과 **유지보수성**을 높였습니다.

---

## **주요 기능**
- **사용자 인증 및 권한 관리** (`djangorestframework_simplejwt`)
- **RESTful API 설계** (`Django REST framework`)
- **데이터베이스 관리 및 ORM 활용** (`Django ORM`)
- **스케줄러 기능** (`django-apscheduler`)
- **CORS 처리** (`django-cors-headers`)

---

## **기술 스택**
- **프레임워크:** Django 4.2.18, Django REST Framework 3.15.2  
- **데이터베이스:** MySQL (`mysqlclient`)  
- **배포 환경:** Docker, Nginx, Gunicorn  
- **기타 라이브러리:**  
  - **인증:** djangorestframework_simplejwt  
  - **스케줄러:** django-apscheduler  
  - **CORS 처리:** django-cors-headers  
  - **HTTP 요청:** requests, httpx  
  - **데이터 분석 및 처리:** pandas, numpy  
  - **웹 스크래핑:** beautifulsoup4, playwright  
  - **머신러닝:** scikit-learn, transformers, torch  

---

## **설치 및 설정**

### **1. 환경 설정**  
- **Python 3.8 이상 설치**  
- **가상환경 생성 및 활성화**  

```bash
python -m venv venv
source venv/bin/activate   # MacOS / Linux
venv\Scripts\activate      # Windows
```

### **2. 패키지 설치**  
```bash
pip install -r requirements.txt
```

### **3. 환경 변수 설정**  
프로젝트 루트 디렉토리에 .env 파일을 생성하고 아래와 같은 내용을 추가합니다:
```bash
# .env

# Django 설정
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1

# 데이터베이스 설정
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=3306

# CORS 설정
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# API 키
OPENAI_API_KEY=your_openai_api_key
CLOVA_OCR_SECRET=your_clova_secret_key
CLOVA_OCR_INVOKE_URL=your_clova_invoke_url

# 공공 데이터 API
PUBLIC_DATA_API_KEY=your_public_data_api_key

# 구글 API
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key

# JWT 설정
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

```
2. 환경 변수 설명
  - Django 기본 설정
    - DEBUG: 개발 모드 설정 (운영 시 False)
    - SECRET_KEY: Django 보안 키
    - ALLOWED_HOSTS: 허용된 호스트 목록
  - 데이터베이스 설정
    - DB_NAME: 데이터베이스 이름
    - DB_USER: 데이터베이스 사용자
    - DB_PASSWORD: 데이터베이스 비밀번호
    - DB_HOST: 데이터베이스 호스트
    - DB_PORT: 데이터베이스 포트
  - API 인증 키
    - OPENAI_API_KEY: GPT API 키
    - CLOVA_OCR_SECRET: CLOVA OCR 비밀키
    - CLOVA_OCR_INVOKE_URL: CLOVA OCR API URL
    - PUBLIC_DATA_API_KEY: 공공데이터 포털 API 키
  - 보안 설정
    - JWT_SECRET_KEY: JWT 토큰 암호화 키
    - JWT_ACCESS_TOKEN_EXPIRE_MINUTES: 액세스 토큰 만료 시간
    - JWT_REFRESH_TOKEN_EXPIRE_DAYS: 리프레시 토큰 만료 기간

예시
```bash
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
DB_HOST=localhost
```

### **4. 데이터베이스 마이그레이션**  
```bash
python manage.py makemigrations
python manage.py migrate
```

### **5. 서버 실행**
```bash
python manage.py runserver
```

---

## **주요 라이브러리 및 버전**
```bash
# Requirements.txt 설치

# Django & DRF
Django==4.2.18
djangorestframework==3.15.2
djangorestframework_simplejwt==5.4.0  # JWT 인증
django-environ==0.12.0                # 환경 변수 관리
django-cors-headers==4.6.0           # CORS 설정
django-apscheduler==0.7.0            # 크론 작업 스케줄러

# 데이터베이스
mysqlclient==2.1.1                   # MySQL 연동

# AI & NLP
openai==0.34.1                       # GPT API 연동
anthropic==0.34.1                    # Claude API
langchain==0.1.12                    # LLM 프레임워크

# 음성 처리
gTTS==2.5.1                          # Google Text-to-Speech
SpeechRecognition==3.10.1            # 음성 인식

# 데이터 처리
pandas==2.2.2                        # 데이터 분석
numpy==1.26.4                        # 수치 연산
requests==2.31.0                     # HTTP 요청 처리

# 유틸리티
python-dotenv==1.0.2                 # 환경 변수
APScheduler==3.11.0                  # 스케줄러
pytz==2024.1                         # 시간대 처리

# 로깅 & 모니터링
logging==0.4.9.6
coloredlogs==15.0.1

# 테스트
pytest==8.1.1
pytest-django==4.8.0
```
주요 패키지 설명
1. 웹 프레임워크
  - Django: 메인 웹 프레임워크
  - DRF: REST API 구현
  - SimpleJWT: 토큰 기반 인증
  - CORS Headers: 크로스 오리진 요청 처리
2. AI & 자연어 처리
  - OpenAI: GPT 기반 챗봇 구현
  - Anthropic: Claude 모델 사용
  - Langchain: LLM 통합 및 관리
3. 데이터베이스 & 캐싱
  - mysqlclient: MySQL 데이터베이스 연동
  - Redis: 캐싱 시스템 (추가 예정)
4. 스케줄링 & 배치 작업
  - APScheduler: 의료 데이터 동기화
  - django-apscheduler: Django 통합 스케줄러
5. 유틸리티
  - python-dotenv: 환경 변수 관리
  - pytz: 시간대 처리
  - requests: API 호출
6. 음성 처리
  - gTTS: 텍스트 음성 변환
  - SpeechRecognition: 음성 인식

---

## **디렉토리 구조**
```bash
icare/
├── manage.py
├── requirements.txt
├── .env                    # 환경 변수 설정
│
├── icare/                  # 프로젝트 설정
│   ├── __init__.py
│   ├── settings.py        # 프로젝트 설정 파일
│   ├── urls.py            # 메인 URL 설정
│   ├── asgi.py
│   └── wsgi.py
│
├── users/                  # 사용자 관리 앱
│   ├── __init__.py
│   ├── models.py          # 사용자 모델
│   ├── views.py           # 사용자 관련 뷰
│   ├── serializers.py     # 사용자 데이터 시리얼라이저
│   └── urls.py            # 사용자 관련 URL
│
├── chat/                   # AI 챗봇 앱
│   ├── __init__.py
│   ├── models.py          # 채팅 모델
│   ├── views.py           # 챗봇 로직 처리
│   ├── urls.py            # 챗봇 관련 URL
│   └── utils/             # 유틸리티 함수
│       └── chat_tools.py  # 챗봇 도구 함수
│
├── searchHospital/         # 병원 검색 앱
│   ├── __init__.py
│   ├── models.py          # 병원 정보 모델
│   ├── views.py           # 병원 검색 로직
│   ├── serializers.py     # 병원 데이터 시리얼라이저
│   └── urls.py            # 병원 검색 URL
│
├── searchPharmacy/         # 약국 검색 앱
│   ├── __init__.py
│   ├── models.py          # 약국 정보 모델
│   ├── views.py           # 약국 검색 로직
│   ├── serializers.py     # 약국 데이터 시리얼라이저
│   └── urls.py            # 약국 검색 URL
│
├── registerPrescription/   # 처방전 관리 앱
│   ├── __init__.py
│   ├── models.py          # 처방전 모델
│   ├── views.py           # OCR 처리 및 처방전 관리
│   ├── serializers.py     # 처방전 데이터 시리얼라이저
│   └── urls.py            # 처방전 관련 URL
│
├── cron/                   # 크론 작업
│   ├── __init__.py
│   └── medical_data_sync.py  # 의료 데이터 동기화
│
└── utils/                  # 공통 유틸리티
    ├── __init__.py
    ├── distance.py        # 거리 계산 유틸
    └── time_utils.py      # 시간 처리 유틸
    
```
주요 디렉토리 설명
1. 프로젝트 설정 (icare/)
  - 프로젝트의 핵심 설정 파일들 포함
  - 전체 URL 라우팅 설정
  - 데이터베이스, 캐시 등 기본 설정
2. 앱 디렉토리
  - users/: 사용자 인증 및 관리
  - chat/: AI 챗봇 기능 구현
  - searchHospital/: 병원 검색 기능
  - searchPharmacy/: 약국 검색 기능
  - registerPrescription/: 처방전 OCR 및 관리
3. 유틸리티 (utils/)
  - 여러 앱에서 공통으로 사용하는 기능
  - 거리 계산, 시간 처리 등 유틸리티 함수
4. 크론 작업 (cron/)
  - 정기적인 데이터 동기화
  - 배치 작업 관리
5. 환경 설정
  - .env: 환경 변수 설정
  - requirements.txt: 프로젝트 의존성
  
  이 구조는 기능별로 모듈화되어 있어 유지보수와 확장이 용이하며, Django의 best practice를 따르고 있습니다.

# **라이선스**

## 오픈소스 라이선스
본 프로젝트는 MIT 라이선스를 따릅니다.

### MIT License

Copyright (c) 2024 iCare

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 사용된 주요 라이브러리 라이선스

### Django
- License: BSD-3-Clause
- https://github.com/django/django/blob/main/LICENSE

### Django REST Framework
- License: BSD-3-Clause
- https://github.com/encode/django-rest-framework/blob/master/LICENSE.md

### Simple JWT
- License: MIT
- https://github.com/jazzband/djangorestframework-simplejwt/blob/master/LICENSE.txt

### CLOVA OCR
- 네이버 클라우드 플랫폼 서비스 약관을 따름
- https://www.ncloud.com/policy/terms/svc

### OpenAI API
- OpenAI API 사용 약관을 따름
- https://openai.com/policies/terms-of-use

## 데이터 출처
- 건강보험심사평가원 API
- 공공데이터포털 약국 정보

---

