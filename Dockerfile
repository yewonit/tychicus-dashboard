# ================================
# Stage 1: Build React Application
# ================================
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 인자로 환경 설정 받기
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (production 의존성만)
RUN npm ci --only=production --ignore-scripts

# devDependencies도 설치 (빌드에 필요)
RUN npm ci --ignore-scripts

# 소스 코드 복사
COPY . .

# React 앱 빌드
# NODE_ENV에 따라 다른 설정으로 빌드됨
RUN npm run build

# ================================
# Stage 2: Nginx Server
# ================================
FROM nginx:1.25-alpine

# Nginx 설정 파일 복사 (커스텀 설정이 필요한 경우)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 React 앱을 Nginx 서빙 디렉토리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 시작 (foreground 모드)
CMD ["nginx", "-g", "daemon off;"]
