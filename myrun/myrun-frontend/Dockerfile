FROM node:22-alpine

WORKDIR /app

# package.json, package-lock.json 먼저 복사 후 설치
COPY package*.json ./
RUN npm install

# 나머지 소스 복사
COPY . .

# Vite dev 서버를 3000 포트로 띄우기
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
