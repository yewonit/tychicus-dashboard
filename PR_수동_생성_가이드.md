# Pull Request 수동 생성 가이드

## ⚠️ 중요 안내

**PR을 생성하려면 먼저 브랜치가 GitHub에 푸시되어 있어야 합니다.**

현재 브랜치 `v0.6-admin-mockup`가 로컬에만 있으므로, 다음 중 하나를 선택하세요:

## 방법 1: GitHub 웹사이트에서 PR 생성 (권장)

### 1단계: 브랜치 확인 또는 푸시

브랜치가 GitHub에 있는지 확인:
- https://github.com/yewonit/tychicus-dashboard/branches

브랜치가 없다면 먼저 푸시:
```bash
git push -u origin v0.6-admin-mockup
```

### 2단계: Pull Request 생성

1. **GitHub 저장소 접속**
   - https://github.com/yewonit/tychicus-dashboard

2. **Pull Request 생성**
   - 저장소 페이지에서 "Pull requests" 탭 클릭
   - "New pull request" 버튼 클릭
   - 또는 브랜치 페이지에서 "Compare & pull request" 버튼 클릭

3. **브랜치 선택**
   - Base: `main`
   - Compare: `v0.6-admin-mockup`

4. **PR 정보 입력**
   - **제목**: `feat: 어드민 목업 개발 완료 (v0.6)`
   - **설명**: `PULL_REQUEST.md` 파일 내용 복사하여 붙여넣기

5. **PR 생성**
   - "Create pull request" 버튼 클릭

## 방법 2: curl을 사용한 PR 생성

브랜치가 GitHub에 푸시된 후:

```bash
curl -X POST \
  https://api.github.com/repos/yewonit/tychicus-dashboard/pulls \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d '{
    "title": "feat: 어드민 목업 개발 완료 (v0.6)",
    "head": "v0.6-admin-mockup",
    "base": "main",
    "body": "'"$(cat PULL_REQUEST.md | sed 's/"/\\"/g' | tr '\n' '\\n')"'"
  }'
```

## 방법 3: GitHub CLI 사용 (설치되어 있다면)

```bash
gh pr create \
  --title "feat: 어드민 목업 개발 완료 (v0.6)" \
  --body-file PULL_REQUEST.md \
  --base main \
  --head v0.6-admin-mockup
```

## 현재 상태

- ✅ PR 템플릿 준비 완료 (`PULL_REQUEST.md`)
- ✅ 브랜치 준비 완료 (로컬: `v0.6-admin-mockup`)
- ⏳ GitHub 푸시 필요 (PR 생성 전 필수)
- ⏳ Pull Request 생성 대기

## 다음 작업

1. **브랜치 푸시** (필수)
   ```bash
   git push -u origin v0.6-admin-mockup
   ```

2. **PR 생성**
   - 웹사이트에서 수동 생성 (방법 1)
   - 또는 API 사용 (방법 2)

---

**참고**: 브랜치가 GitHub에 없으면 PR을 생성할 수 없습니다. 먼저 푸시를 완료해주세요.




