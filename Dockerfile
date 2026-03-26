# Build (inclui devDependencies: TypeScript, copyfiles, tsc-alias)
FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Runtime — apenas dependências de produção
FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs apiuser

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER apiuser

EXPOSE 3000

CMD ["node", "dist/server.js"]
