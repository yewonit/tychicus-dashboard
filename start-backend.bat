@echo off
echo 청년회 어드민 시스템 - 백엔드 시작
echo.
cd backend
echo 의존성 설치 중...
pip install -r requirements.txt
echo.
echo API 서버 시작 중...
python main.py 