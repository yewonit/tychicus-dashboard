# GitHub 저장소 연동 스크립트
# PowerShell에서 실행하거나 Git Bash에서 실행 가능

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub 저장소 연동 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Git 설치 확인
Write-Host "[1/6] Git 설치 확인 중..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "✓ Git 설치 확인됨: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git이 설치되어 있지 않거나 PATH에 추가되지 않았습니다." -ForegroundColor Red
    Write-Host "  PowerShell을 재시작하거나 Git Bash를 사용해주세요." -ForegroundColor Yellow
    exit 1
}

# 사용자 정보 확인
Write-Host ""
Write-Host "[2/6] Git 사용자 정보 확인 중..." -ForegroundColor Yellow
$userName = git config --global user.name
$userEmail = git config --global user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "⚠ Git 사용자 정보가 설정되지 않았습니다." -ForegroundColor Yellow
    $name = Read-Host "이름을 입력하세요"
    $email = Read-Host "이메일을 입력하세요"
    git config --global user.name $name
    git config --global user.email $email
    Write-Host "✓ 사용자 정보 설정 완료" -ForegroundColor Green
} else {
    Write-Host "✓ 사용자 정보: $userName <$userEmail>" -ForegroundColor Green
}

# Git 저장소 초기화
Write-Host ""
Write-Host "[3/6] Git 저장소 초기화 중..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "✓ Git 저장소가 이미 초기화되어 있습니다." -ForegroundColor Green
} else {
    git init
    Write-Host "✓ Git 저장소 초기화 완료" -ForegroundColor Green
}

# 원격 저장소 연결
Write-Host ""
Write-Host "[4/6] 원격 저장소 연결 중..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/yewonit/tychicus-dashboard.git"

# 기존 origin 확인
$existingOrigin = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    if ($existingOrigin -ne $remoteUrl) {
        Write-Host "⚠ 기존 원격 저장소가 있습니다: $existingOrigin" -ForegroundColor Yellow
        $change = Read-Host "새로운 URL로 변경하시겠습니까? (y/n)"
        if ($change -eq "y") {
            git remote set-url origin $remoteUrl
            Write-Host "✓ 원격 저장소 URL 변경 완료" -ForegroundColor Green
        }
    } else {
        Write-Host "✓ 원격 저장소가 이미 올바르게 설정되어 있습니다." -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "✓ 원격 저장소 연결 완료: $remoteUrl" -ForegroundColor Green
}

# 원격 저장소 정보 가져오기
Write-Host ""
Write-Host "[5/6] 원격 저장소 정보 가져오기..." -ForegroundColor Yellow
git fetch origin
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 원격 저장소 정보 가져오기 완료" -ForegroundColor Green
} else {
    Write-Host "⚠ 원격 저장소에 접근할 수 없습니다. 인증이 필요할 수 있습니다." -ForegroundColor Yellow
}

# 새 브랜치 생성
Write-Host ""
Write-Host "[6/6] 새 브랜치 생성 중..." -ForegroundColor Yellow
$branchName = "v0.6-admin-mockup"

# 현재 브랜치 확인
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    # 브랜치가 없으면 main에서 시작
    git checkout -b $branchName origin/main 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        # main 브랜치가 없으면 새로 생성
        git checkout -b $branchName
        Write-Host "✓ 새 브랜치 생성: $branchName" -ForegroundColor Green
    } else {
        Write-Host "✓ 새 브랜치 생성: $branchName (origin/main 기반)" -ForegroundColor Green
    }
} else {
    if ($currentBranch -ne $branchName) {
        git checkout -b $branchName
        Write-Host "✓ 새 브랜치 생성: $branchName" -ForegroundColor Green
    } else {
        Write-Host "✓ 이미 $branchName 브랜치에 있습니다." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "준비 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 명령어를 실행하여 파일을 추가하고 커밋하세요:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m `"feat: 어드민 목업 개발 완료 (v0.6)`"" -ForegroundColor White
Write-Host "  git push -u origin $branchName" -ForegroundColor White
Write-Host ""

