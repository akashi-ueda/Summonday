# frontend/Dockerfile
FROM node:24-alpine

WORKDIR /app

# パッケージファイルのコピーとインストール
COPY package*.json ./
RUN npm install

# コードのコピー
COPY . .

# ポートの公開
EXPOSE 3000

# 開発サーバーの起動
CMD ["npm", "run", "dev"]