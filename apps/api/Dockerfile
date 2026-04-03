FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock .yarnrc.yml ./
COPY tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/contracts/package.json ./packages/contracts/

RUN corepack enable && yarn set version 4.6.0 && yarn install

COPY apps/api ./apps/api
COPY packages/contracts ./packages/contracts

ENV NODE_ENV=production

RUN yarn workspace api build

WORKDIR /app/apps/api

RUN mkdir -p /data

ENV HOST=0.0.0.0
ENV PORT=3000
ENV DATABASE_URL=file:/data/app.db

EXPOSE 3000

CMD ["node", "dist/index.js"]
