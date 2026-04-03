FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/contracts/package.json ./packages/contracts/

RUN corepack enable && yarn set version 4.6.0 && yarn install

COPY apps/web ./apps/web
COPY packages/contracts ./packages/contracts

ARG VITE_API_BASE=

ENV VITE_API_BASE=$VITE_API_BASE

RUN yarn workspace web build

FROM nginx:1.27-alpine

COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
