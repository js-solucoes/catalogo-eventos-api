# syntax=docker/dockerfile:1
# Fase 3 — imagem de produção para ECS Fargate (Node 22 + dist/)
FROM node:22-bookworm-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
  && mkdir -p /app/certs \
  && curl -fsSL -o /app/certs/rds-global-bundle.pem \
    https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
  && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 nodejs \
  && useradd --uid 1001 --gid nodejs --shell /usr/sbin/nologin nodejs

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER nodejs
EXPOSE 3000
ENV PORT=3000
ENV DB_SSL_CA_PATH=/app/certs/rds-global-bundle.pem

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/server.js"]
