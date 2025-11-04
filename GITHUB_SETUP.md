# GitHub 연동 가이드

## 1. Git 설치

### Windows에서 Git 설치
1. [Git 공식 웹사이트](https://git-scm.com/download/win)에서 다운로드
2. 설치 파일을 실행하고 기본 설정으로 설치 진행
3. 설치 완료 후 PowerShell 또는 명령 프롬프트를 재시작

### 설치 확인
```bash
git --version
```

## 2. GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 "+" 버튼 클릭 → "New repository" 선택
3. 저장소 정보 입력:
   - Repository name: `DUGIGO_v0.6` (또는 원하는 이름)
   - Description: "청년회 어드민 시스템"
   - Public 또는 Private 선택
   - **Initialize this repository with a README 체크하지 않기** (이미 README.md가 있음)
4. "Create repository" 클릭

## 3. 로컬 저장소 초기화 및 GitHub 연동

프로젝트 폴더에서 다음 명령어들을 순서대로 실행하세요:

```bash
# 1. Git 저장소 초기화
git init

# 2. 사용자 정보 설정 (처음 한 번만)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 3. 모든 파일 추가
git add .

# 4. 첫 번째 커밋
git commit -m "Initial commit: 어드민 목업 개발 완료"

# 5. GitHub 원격 저장소 연결 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. 브랜치 이름을 main으로 설정 (필요한 경우)
git branch -M main

# 7. GitHub에 푸시
git push -u origin main
```

## 4. 추가 작업

### .gitignore 파일
이미 생성되어 있으며, 다음 파일들이 Git에서 제외됩니다:
- `node_modules/`
- `build/`
- `venv/`
- `.env` 파일
- IDE 설정 파일
- 업로드된 파일들

### 향후 업데이트
변경사항을 GitHub에 업로드하려면:

```bash
# 변경된 파일 확인
git status

# 변경된 파일 추가
git add .

# 커밋 메시지와 함께 커밋
git commit -m "변경사항 설명"

# GitHub에 푸시
git push
```

## 5. 주의사항

- 민감한 정보(API 키, 비밀번호 등)는 절대 커밋하지 마세요
- `.env` 파일은 자동으로 제외됩니다
- `backend/uploads/` 폴더의 사용자 업로드 파일도 제외됩니다

## 문제 해결

### 인증 오류 발생 시
GitHub에서 Personal Access Token 사용이 필요할 수 있습니다:
1. GitHub → Settings → Developer settings → Personal access tokens
2. "Generate new token" 클릭
3. `repo` 권한 선택
4. 토큰 생성 후, `git push` 시 비밀번호 대신 토큰 입력

### 충돌 발생 시
```bash
# 원격 저장소의 최신 변경사항 가져오기
git pull origin main

# 충돌 해결 후
git add .
git commit -m "Merge conflicts resolved"
git push
```




