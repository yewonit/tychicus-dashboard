@echo off
echo ========================================
echo GitHub 자격 증명 삭제 및 푸시
echo ========================================
echo.

echo [1/3] Windows 자격 증명 관리자 열기...
echo.
echo 자격 증명 관리자 창이 열리면:
echo   1. "Windows 자격 증명" 탭 선택
echo   2. "git:https://github.com" 또는 "github.com" 검색
echo   3. 관련 항목들을 모두 삭제
echo   4. 창을 닫고 여기서 아무 키나 누르세요
echo.
pause

echo.
echo [2/3] Git Bash를 통해 푸시 시도...
echo.
"C:\Program Files\Git\bin\bash.exe" -c "cd '/c/Users/Kim Woonbi/OneDrive/바탕 화면/DUGIGO_v0.6' && git push -u origin v0.6-admin-mockup"

if %errorlevel% equ 0 (
    echo.
    echo [3/3] 푸시 성공!
    echo.
    echo GitHub 저장소 확인:
    echo https://github.com/yewonit/tychicus-dashboard/tree/v0.6-admin-mockup
) else (
    echo.
    echo [오류] 푸시 실패
    echo.
    echo 인증 정보를 다시 확인해주세요:
    echo - Username: yewonit
    echo - Password: Personal Access Token
)

pause




