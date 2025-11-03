@echo off
REM GitHub에 커밋 및 푸시 스크립트

echo ========================================
echo 파일 추가 및 커밋
echo ========================================
echo.

echo [1/3] 모든 파일 추가 중...
git add .
if %errorlevel% neq 0 (
    echo [오류] 파일 추가 실패
    pause
    exit /b 1
)
echo [완료] 파일 추가 완료
echo.

echo [2/3] 커밋 중...
git commit -m "feat: 어드민 목업 개발 완료 (v0.6)"
if %errorlevel% neq 0 (
    echo [경고] 커밋 실패 또는 변경사항이 없습니다
)
echo [완료] 커밋 완료
echo.

echo [3/3] GitHub에 푸시 중...
git push -u origin v0.6-admin-mockup
if %errorlevel% neq 0 (
    echo [오류] 푸시 실패
    echo.
    echo 인증이 필요할 수 있습니다:
    echo - GitHub Personal Access Token을 사용하세요
    echo - 또는 GitHub Desktop을 사용하세요
    pause
    exit /b 1
)
echo [완료] 푸시 완료!
echo.
echo ========================================
echo 모든 작업이 완료되었습니다!
echo ========================================
pause

