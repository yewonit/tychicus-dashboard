@echo off
echo 청년회 어드민 시스템 - 전체 시작
echo.
echo 백엔드 서버를 백그라운드에서 시작합니다...
start "Backend Server" cmd /c "start-backend.bat"
echo.
echo 5초 후 프론트엔드 서버를 시작합니다...
timeout /t 5 /nobreak > nul
echo.
echo 프론트엔드 서버를 시작합니다...
start "Frontend Server" cmd /c "start-frontend.bat"
echo.
echo 모든 서버가 시작되었습니다!
echo - 프론트엔드: http://localhost:3000
echo - 백엔드 API: http://localhost:8000
echo - API 문서: http://localhost:8000/docs
echo.
pause 