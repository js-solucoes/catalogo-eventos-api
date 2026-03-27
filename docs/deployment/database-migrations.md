# Banco de dados: `sync` vs migrations

## Estado atual

- **Models** Sequelize vivem em `src/modules/*/infra/model/*-model.ts`.
- No boot (`initializeDatabaseAndServer`), se `UPDATE_MODEL=true`, a aplicação carrega models, associa e chama `sequelize.sync()` com opções que dependem de `NODE_ENV` (ex.: `force` em test, `alter` em development).

## Política recomendada para Aurora / produção

1. **`UPDATE_MODEL=false` em produção** (padrão atual) — evita `sync` automático contra dados reais.
2. **Alterações de schema versionadas** com **Sequelize CLI** (`database/migrations/`).
3. Rodar **`npm run db:migrate`** (ou equivalente no pipeline) **antes** ou como etapa controlada do deploy, com backup e janela de manutenção quando necessário.
4. Manter **`GET /ready`** com `READINESS_CHECK_DB=true` para o target group só receber tráfego quando o app **e** a conexão com o banco estiverem ok.

## Comandos

Configuração: `.sequelizerc` + `database/sequelize-cli-config.cjs` (lê `.env` / `.env.<NODE_ENV>` como `env.ts`).

```bash
# NODE_ENV define qual chave do config é usada (development | test | production)
export NODE_ENV=production
npm run db:migrate          # aplica pendentes
npm run db:migrate:status   # inspeciona
npm run db:migrate:undo     # desfaz última (use com cuidado)
npm run db:seed             # aplica seeders (admin inicial + cidades MS)
npm run db:seed:undo        # desfaz todos os seeders registrados
npm run db:bootstrap        # migrate + seed (ambiente local/staging com .env)
```

A migration `20250326120000-phase1-schema-placeholder` é **no-op** (histórico / `SequelizeMeta`). O DDL das tabelas da aplicação está em `20250326120100-create-application-schema.cjs`. Os seeders exigem **`ADMIN_PASSWORD`** no ambiente para criar o usuário `admin@celeirodoms.com.br` (hash bcrypt com 12 rounds, alinhado aos factories de auth).

O workflow **CI** (`.github/workflows/ci.yml`, job `database`) sobe **MySQL 8** em serviço e executa `npm run db:bootstrap` para validar migrations e seeders em cada push/PR.

MySQL local opcional: `docker compose -f docker-compose.mysql.yml up -d` (credenciais espelham `.env-exemplo`; ajuste o `.env` se mudar usuário ou senha).

## Sequelize CLI e dialect

O `sequelize-cli-config.cjs` usa o mesmo `DB_*` da aplicação. Para **SQLite** (testes da app), o CLI ainda aponta para MySQL por padrão — use migrations contra um banco de desenvolvimento/staging compatível com produção.

## Build / artefatos

Migrations **não** são copiadas para `dist/` pelo TypeScript. O deploy deve:

- executar migrations a partir do **repositório** (CI/CD) ou de uma imagem que inclua a pasta `database/`, ou
- usar imagem de release que rode `sequelize-cli` com os arquivos versionados.
