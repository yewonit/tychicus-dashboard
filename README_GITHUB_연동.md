# GitHub 연동 완료 가이드

## 현재 상태

✅ **완료된 작업:**
- Git 저장소 초기화
- 원격 저장소 연결 (https://github.com/yewonit/tychicus-dashboard)
- 새 브랜치 생성: `v0.6-admin-mockup`
- 파일 커밋 완료 (53개 파일)

⚠️ **인증 문제:**
- Windows 자격 증명 관리자에 "kimwoonbi" 계정이 저장되어 있어 "yewonit" 계정으로 인증이 안 됩니다.

## 해결 방법

### 단계별 안내

1. **Windows 자격 증명 관리자 열기**
   - Windows 키 누르기
   - "자격 증명 관리자" 검색
   - 또는 `cmdkey.exe` 실행

2. **GitHub 자격 증명 삭제**
   - "Windows 자격 증명" 탭 선택
   - 검색창에 "github" 입력
   - 다음 항목들을 모두 삭제:
     - `git:https://github.com`
     - `github.com`
     - 관련된 모든 GitHub 항목

3. **Git Bash에서 푸시 다시 시도**
   ```bash
   cd "/c/Users/Kim Woonbi/OneDrive/바탕 화면/DUGIGO_v0.6"
   git push -u origin v0.6-admin-mockup
   ```

4. **인증 정보 입력**
   - Username: `yewonbi` (또는 저장소에 접근 가능한 계정)
   - Password: **Personal Access Token** (일반 비밀번호가 아님!)

## Personal Access Token 생성 방법

1. GitHub 로그인: https://github.com
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token (classic)" 클릭
4. 설정:
   - Note: "DUGIGO v0.6"
   - Expiration: 원하는 기간
   - Scopes: **`repo`** 체크
5. "Generate token" 클릭
6. **토큰 복사** (한 번만 표시됨!)

## 대안: 자동화 스크립트 사용

생성된 `자격증명_삭제_및_푸시.bat` 파일을 실행하세요.

또는 Git Bash에서 직접:

```bash
cd "/c/Users/Kim Woonbi/OneDrive/바탕 화면/DUGIGO_v0.6"
git push -u origin v0.6-admin-mockup
```

## 성공 후 확인

푸시가 성공하면 다음 링크에서 확인할 수 있습니다:
https://github.com/yewonit/tychicus-dashboard/tree/v0.6-admin-mockup

## 문제가 계속되면

1. **SSH 키 사용** (장기적으로 권장)
2. **GitHub Desktop 사용** (가장 쉬운 방법)
3. **다른 Git 클라이언트 사용** (SourceTree, GitKraken 등)




