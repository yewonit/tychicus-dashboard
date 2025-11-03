# 기존 GitHub 저장소 연동 가이드

## 필요한 정보

기존 GitHub 저장소에 이 개발사항을 추가하기 위해 다음 정보가 필요합니다:

1. **GitHub 저장소 URL**
   - 예: `https://github.com/username/repository-name.git`
   - GitHub 저장소 페이지의 "Code" 버튼에서 확인 가능

2. **기본 브랜치 이름**
   - 보통 `main` 또는 `master`
   - GitHub 저장소의 기본 브랜치 설정에서 확인 가능

3. **병합 방식 선택**
   - **옵션 A**: 새 브랜치 생성 (권장)
     - `v0.6-admin-mockup` 같은 새 브랜치를 만들어 작업
     - 나중에 main 브랜치로 병합 가능
   - **옵션 B**: 기존 브랜치에 직접 푸시
     - 기존 main/master 브랜치에 직접 추가

## 진행 절차

### 1단계: Git 설치 확인

**방법 1: PowerShell 재시작 후 확인**
```powershell
# PowerShell을 닫고 다시 열어서 실행
git --version
```

**방법 2: Git Bash 사용**
- 설치된 Git에서 "Git Bash" 실행
- Git Bash에서 모든 명령어 실행

### 2단계: 프로젝트 폴더로 이동
```bash
cd "C:\Users\Kim Woonbi\OneDrive\바탕 화면\DUGIGO_v0.6"
```

### 3단계: Git 저장소 초기화 (아직 안 했다면)
```bash
git init
```

### 4단계: 사용자 정보 설정 (처음 한 번만)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 5단계: 기존 원격 저장소 연결

**기존 저장소와 연결**
```bash
# 기존 원격 저장소 URL로 연결
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 또는 기존 origin이 있다면 변경
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 원격 저장소 확인
git remote -v
```

### 6단계: 원격 저장소의 내용 가져오기
```bash
# 원격 저장소의 브랜치와 커밋 히스토리 가져오기
git fetch origin

# 원격 브랜치 확인
git branch -r
```

### 7단계: 파일 추가 및 커밋

**옵션 A: 새 브랜치 생성 (권장)**
```bash
# 새 브랜치 생성 및 전환
git checkout -b v0.6-admin-mockup

# 또는 main 브랜치에서 시작하려면
git checkout -b v0.6-admin-mockup origin/main
```

**옵션 B: 기존 브랜치 사용**
```bash
# 기존 브랜치 체크아웃
git checkout main
# 또는
git checkout master

# 원격 저장소의 최신 내용 가져오기
git pull origin main
```

```bash
# 모든 파일 추가
git add .

# 커밋
git commit -m "feat: 어드민 목업 개발 완료 (v0.6)"
```

### 8단계: GitHub에 푸시

**옵션 A: 새 브랜치로 푸시**
```bash
git push -u origin v0.6-admin-mockup
```

**옵션 B: 기존 브랜치에 푸시**
```bash
git push origin main
```

## 자동화 스크립트

다음 정보를 제공해주시면 자동화 스크립트를 만들어드릴 수 있습니다:
- GitHub 저장소 URL
- 브랜치 이름 (main/master)
- 새 브랜치를 만들지, 기존 브랜치에 직접 푸시할지

## 주의사항

1. **기존 파일과의 충돌**
   - 기존 저장소에 같은 이름의 파일이 있다면 충돌이 발생할 수 있습니다
   - 충돌 시 수동으로 해결해야 합니다

2. **병합 전략**
   - 새 브랜치를 만드는 것이 더 안전합니다
   - 나중에 Pull Request를 통해 코드 리뷰 후 병합 가능

3. **.gitignore 확인**
   - 이미 `.gitignore` 파일이 생성되어 있습니다
   - `node_modules`, `build` 등은 자동으로 제외됩니다

