# 1. 빌드 환경 (Builder Stage)
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Next.js 프로덕션 빌드
RUN npm run build

# 2. 프로덕션 환경 (Production Stage)
FROM node:18-alpine

WORKDIR /app

# 빌드 환경에서 필요한 파일만 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 3000번 포트 노출 (기본 Next.js 포트)
EXPOSE 3000

# 애플리케이션 실행 (포트 3000에서 실행)
CMD ["npm", "start"]
