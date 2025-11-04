# GitHub Pull Request 생성 스크립트 (PowerShell)

# GitHub Personal Access Token (환경 변수에서 가져오기)
# 사용 전에 환경 변수를 설정하세요: $env:GITHUB_TOKEN = "your_token_here"
$token = $env:GITHUB_TOKEN
if (-not $token) {
    Write-Host "❌ 오류: GITHUB_TOKEN 환경 변수가 설정되지 않았습니다." -ForegroundColor Red
    Write-Host "다음 명령으로 토큰을 설정하세요:" -ForegroundColor Yellow
    Write-Host '  $env:GITHUB_TOKEN = "your_github_token_here"' -ForegroundColor Yellow
    exit 1
}

$repoOwner = "yewonit"
$repoName = "tychicus-dashboard"
$prTitle = "feat: 어드민 목업 개발 완료 (v0.6)"
$headBranch = "v0.6-admin-mockup"
$baseBranch = "main"

# PULL_REQUEST.md 파일 읽기
$prBody = Get-Content "PULL_REQUEST.md" -Raw -Encoding UTF8

# JSON 본문 생성
$body = @{
    title = $prTitle
    head = $headBranch
    base = $baseBranch
    body = $prBody
    maintainer_can_modify = $true
} | ConvertTo-Json -Depth 10

# API 요청
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
}

$uri = "https://api.github.com/repos/$repoOwner/$repoName/pulls"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Pull Request 생성 중..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "제목: $prTitle" -ForegroundColor Yellow
Write-Host "Base: $baseBranch ← Head: $headBranch" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "✅ Pull Request 생성 성공!" -ForegroundColor Green
    Write-Host ""
    Write-Host "PR 번호: #$($response.number)" -ForegroundColor Cyan
    Write-Host "제목: $($response.title)" -ForegroundColor Cyan
    Write-Host "상태: $($response.state)" -ForegroundColor Cyan
    Write-Host "URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "위 링크에서 PR을 확인할 수 있습니다." -ForegroundColor Green
    
    # 브라우저에서 열기
    Start-Process $response.html_url
}
catch {
    Write-Host "❌ 오류 발생:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host ""
        Write-Host "오류 메시지: $($errorObj.message)" -ForegroundColor Red
        
        if ($errorObj.errors) {
            foreach ($err in $errorObj.errors) {
                Write-Host "  - $($err.message)" -ForegroundColor Red
            }
        }
    }
}




