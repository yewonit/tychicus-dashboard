#!/bin/bash
# GitHub 저장소 연동 스크립트 (Git Bash용)

echo "========================================"
echo "GitHub 저장소 연동 시작"
echo "========================================"
echo ""

# Git 설치 확인
echo "[1/6] Git 설치 확인 중..."
if command -v git &> /dev/null; then
    git_version=$(git --version)
    echo "✓ Git 설치 확인됨: $git_version"
else
    echo "✗ Git이 설치되어 있지 않습니다."
    exit 1
fi

# 사용자 정보 확인
echo ""
echo "[2/6] Git 사용자 정보 확인 중..."
user_name=$(git config --global user.name)
user_email=$(git config --global user.email)

if [ -z "$user_name" ] || [ -z "$user_email" ]; then
    echo "⚠ Git 사용자 정보가 설정되지 않았습니다."
    read -p "이름을 입력하세요: " name
    read -p "이메일을 입력하세요: " email
    git config --global user.name "$name"
    git config --global user.email "$email"
    echo "✓ 사용자 정보 설정 완료"
else
    echo "✓ 사용자 정보: $user_name <$user_email>"
fi

# Git 저장소 초기화
echo ""
echo "[3/6] Git 저장소 초기화 중..."
if [ -d .git ]; then
    echo "✓ Git 저장소가 이미 초기화되어 있습니다."
else
    git init
    echo "✓ Git 저장소 초기화 완료"
fi

# 원격 저장소 연결
echo ""
echo "[4/6] 원격 저장소 연결 중..."
remote_url="https://github.com/yewonit/tychicus-dashboard.git"

# 기존 origin 확인
if git remote get-url origin &> /dev/null; then
    existing_origin=$(git remote get-url origin)
    if [ "$existing_origin" != "$remote_url" ]; then
        echo "⚠ 기존 원격 저장소가 있습니다: $existing_origin"
        read -p "새로운 URL로 변경하시겠습니까? (y/n): " change
        if [ "$change" = "y" ]; then
            git remote set-url origin "$remote_url"
            echo "✓ 원격 저장소 URL 변경 완료"
        fi
    else
        echo "✓ 원격 저장소가 이미 올바르게 설정되어 있습니다."
    fi
else
    git remote add origin "$remote_url"
    echo "✓ 원격 저장소 연결 완료: $remote_url"
fi

# 원격 저장소 정보 가져오기
echo ""
echo "[5/6] 원격 저장소 정보 가져오기..."
if git fetch origin; then
    echo "✓ 원격 저장소 정보 가져오기 완료"
else
    echo "⚠ 원격 저장소에 접근할 수 없습니다. 인증이 필요할 수 있습니다."
fi

# 새 브랜치 생성
echo ""
echo "[6/6] 새 브랜치 생성 중..."
branch_name="v0.6-admin-mockup"

# 현재 브랜치 확인
current_branch=$(git branch --show-current 2>/dev/null)
if [ -z "$current_branch" ]; then
    # 브랜치가 없으면 main에서 시작
    if git checkout -b "$branch_name" origin/main &> /dev/null; then
        echo "✓ 새 브랜치 생성: $branch_name (origin/main 기반)"
    else
        # main 브랜치가 없으면 새로 생성
        git checkout -b "$branch_name"
        echo "✓ 새 브랜치 생성: $branch_name"
    fi
else
    if [ "$current_branch" != "$branch_name" ]; then
        git checkout -b "$branch_name"
        echo "✓ 새 브랜치 생성: $branch_name"
    else
        echo "✓ 이미 $branch_name 브랜치에 있습니다."
    fi
fi

echo ""
echo "========================================"
echo "준비 완료!"
echo "========================================"
echo ""
echo "다음 명령어를 실행하여 파일을 추가하고 커밋하세요:"
echo ""
echo "  git add ."
echo "  git commit -m \"feat: 어드민 목업 개발 완료 (v0.6)\""
echo "  git push -u origin $branch_name"
echo ""

