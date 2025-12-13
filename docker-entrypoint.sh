#!/bin/sh

# 런타임 환경 변수를 HTML 파일에 주입하는 스크립트

# 환경 변수 기본값 설정
NODE_ENV=${NODE_ENV:-production}
REACT_APP_ENV=${REACT_APP_ENV:-${NODE_ENV}}

# HTML 파일 경로
HTML_FILE="/usr/share/nginx/html/index.html"

# 환경 변수를 HTML에 주입
# 플레이스홀더를 실제 환경 변수 값으로 교체
sed -i "s/ENV_PLACEHOLDER_NODE_ENV/${NODE_ENV}/g" "$HTML_FILE"
sed -i "s/ENV_PLACEHOLDER_REACT_APP_ENV/${REACT_APP_ENV}/g" "$HTML_FILE"

echo "Environment variables injected:"
echo "  NODE_ENV=${NODE_ENV}"
echo "  REACT_APP_ENV=${REACT_APP_ENV}"

# Nginx 시작
exec nginx -g "daemon off;"

