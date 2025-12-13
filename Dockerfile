# ================================
# Stage 1: Build React Application
# ================================
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 인자로 환경 설정 받기
ARG BUILD_MODE=production

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (production 의존성만)
RUN npm ci --only=production --ignore-scripts

# devDependencies도 설치 (빌드에 필요)
RUN npm ci --ignore-scripts

# 소스 코드 복사
COPY . .

# React 앱 빌드
# --mode 인자를 통해 환경별 빌드
# 예: npm run build -- --mode development
RUN npm run build -- --mode ${BUILD_MODE}

# ================================
# Stage 2: Nginx Server
# ================================
FROM nginx:1.25-alpine

# Nginx 설정 파일 복사 (커스텀 설정이 필요한 경우)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 앱을 Nginx 서빙 디렉토리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# Entrypoint 스크립트 복사 및 실행 권한 부여
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 포트 노출
EXPOSE 80

# 환경 변수 기본값 설정
ENV NODE_ENV=production
ENV REACT_APP_ENV=production

# Entrypoint 스크립트 실행 (런타임 환경 변수 주입)
ENTRYPOINT ["/docker-entrypoint.sh"]
