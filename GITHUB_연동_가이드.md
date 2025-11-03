# GitHub 저장소 연동 가이드

## 저장소 정보
- **GitHub URL**: https://github.com/yewonit/tychicus-dashboard
- **기본 브랜치**: main
- **새 브랜치**: v0.6-admin-mockup

## 빠른 시작 (3단계)

### 방법 1: 자동화 스크립트 사용 (권장)

#### Git Bash 사용 (권장)
1. Git Bash 실행 (Windows 시작 메뉴에서 "Git Bash" 검색)
2. 프로젝트 폴더로 이동:
   ```bash
   cd "/c/Users/Kim Woonbi/OneDrive/바탕 화면/DUGIGO_v0.6"
   ```
3. 스크립트 실행:
   ```bash
   bash setup-github.sh
   ```
4. 스크립트가 자동으로 진행합니다.
5. 마지막으로 파일 커밋 및 푸시:
   ```bash
   git add .
   git commit -m "feat: 어드민 목업 개발 완료 (v0.6)"
   git push -u origin v0.6-admin-mockup
   ```

#### PowerShell 사용
1. **PowerShell을 관리자 권한으로 재시작** (중요!)
2. 프로젝트 폴더로 이동
3. 스크립트 실행:
   ```powershell
   .\setup-github.ps1
   ```
4. 파일 커밋 및 푸시:
   ```powershell
   git add .
   git commit -m "feat: 어드민 목업 개발 완료 (v0.6)"
   git push -u origin v0.6-admin-mockup
   ```

### 방법 2: 수동 실행

Git Bash에서 다음 명령어를 순서대로 실행하세요:

```bash
# 1. Git 저장소 초기화 (처음 한 번만)
git init

# 2. 사용자 정보 설정 (처음 한 번만)
git config --global user.name "kimwoonbi"
git config --global user.email "prisca0524@gmail.com"

# 3. 원격 저장소 연결
git remote add origin https://github.com/yewonit/tychicus-dashboard.git

# 4. 원격 저장소 정보 가져오기
git fetch origin

# 5. 새 브랜치 생성
git checkout -b v0.6-admin-mockup origin/main

# 6. 모든 파일 추가
git add .

# 7. 커밋
git commit -m "feat: 어드민 목업 개발 완료 (v0.6)"

# 8. GitHub에 푸시
git push -u origin v0.6-admin-mockup
```

## 문제 해결

### Git이 인식되지 않는 경우

1. **PowerShell 재시작**
   - PowerShell을 완전히 닫고 다시 열기
   - 또는 관리자 권한으로 실행

2. **Git Bash 사용**
   - Windows 시작 메뉴에서 "Git Bash" 검색
   - Git Bash에서 모든 명령어 실행

3. **Git 설치 확인**
   ```bash
   # Git Bash에서
   git --version
   ```

### 인증 오류가 발생하는 경우

GitHub에서 Personal Access Token 사용이 필요할 수 있습니다:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 다음 권한 선택:
   - `repo` (전체 저장소 권한)
4. 토큰 생성 후 복사
5. `git push` 실행 시:
   - Username: GitHub 사용자명
   - Password: **토큰을 입력** (비밀번호가 아님!)

### 충돌이 발생하는 경우

기존 저장소에 같은 이름의 파일이 있을 수 있습니다:

```bash
# 원격 저장소의 최신 내용 가져오기
git fetch origin

# 병합 (충돌이 발생하면 수동 해결 필요)
git merge origin/main

# 충돌 해결 후
git add .
git commit -m "Merge: 충돌 해결"
git push -u origin v0.6-admin-mockup
```

## 생성된 파일들

다음 파일들이 생성되었습니다:

- `.gitignore`: Git에서 제외할 파일 목록
- `setup-github.ps1`: PowerShell용 자동화 스크립트
- `setup-github.sh`: Git Bash용 자동화 스크립트
- `commit-and-push.bat`: Windows 배치 파일 (간단한 커밋/푸시용)

## 다음 단계

푸시가 완료되면:

1. GitHub 저장소 페이지로 이동: https://github.com/yewonit/tychicus-dashboard
2. 새 브랜치 `v0.6-admin-mockup` 확인
3. Pull Request 생성하여 main 브랜치로 병합 (선택사항)

## 주의사항

- `.env` 파일은 자동으로 제외됩니다 (민감한 정보 포함)
- `node_modules/` 폴더는 자동으로 제외됩니다
- `build/` 폴더는 자동으로 제외됩니다
- `backend/uploads/` 폴더의 업로드 파일은 제외됩니다

