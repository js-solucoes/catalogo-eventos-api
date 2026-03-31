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

Configuração: `.sequelizerc` + `database/sequelize-cli-config.cjs` (lê `.env` / `.env.<NODE_ENV>`). Com **`DB_SSL=true`**, defina **`DB_SSL_CA_PATH`** apontando para o PEM da AWS (ex.: `global-bundle.pem` baixado de https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem) — igual à app; sem isso o Node costuma falhar com *self-signed certificate in certificate chain* contra RDS/Aurora.

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

A migration `20250326120000-phase1-schema-placeholder` é **no-op** (histórico / `SequelizeMeta`). O DDL das tabelas da aplicação está em `20250326120100-create-application-schema.cjs`. Os seeders exigem **`ADMIN_PASSWORD`** no ambiente para criar o usuário `admin@catalogo-eventos.com.br` (hash bcrypt com 12 rounds, alinhado aos factories de auth).

O workflow **CI** (`.github/workflows/ci.yml`, job `database`) sobe **MySQL 8** em serviço e executa `npm run db:bootstrap` para validar migrations e seeders em cada push/PR.

## Rodar migrate **de dentro da VPC** (RDS privado)

O MySQL do `foundation` não tem endpoint público; da sua máquina na internet o `npm run db:migrate` não conecta. Opções:

### 1) ECS **Run Task** (recomendado com este repositório)

A imagem de produção inclui `database/`, `.sequelizerc` e `sequelize-cli`; as variáveis `DB_*` e o segredo vêm da **mesma task definition** do serviço (já apontam para o RDS).

1. Faça **build e push** da imagem para o ECR (Dockerfile atualizado).
2. Atualize o serviço ECS (ou force new deployment) para usar a nova imagem.
3. No diretório do projeto:

   ```bash
   ./scripts/ecs-run-db-migrate.sh
   ```

   O script lê `ecs_cluster_name` e `ecs_service_name` via Terraform no `infra/aws/foundation`, copia subnets/SG do serviço e dispara uma task Fargate com comando `npm run db:migrate` (sem ALB).

4. Acompanhe em **CloudWatch Logs** → grupo `/ecs/<project>-<env>` (stream da task).

### 2) Outras formas

- **AWS CodeBuild** na mesma VPC/subnets com acesso ao RDS (checkout do repo + `npm ci` + `npm run db:migrate` com `DB_*` em variáveis ou Secrets Manager).
- **Bastion** (EC2 ou SSM) na VPC com Node + clone do repo + `.env` com `DB_HOST` interno.
- **Runner de CI** (GitHub self-hosted, etc.) com interface de rede na VPC.

MySQL local opcional: `docker compose -f docker-compose.mysql.yml up -d` (credenciais espelham `.env-exemplo`; ajuste o `.env` se mudar usuário ou senha).

## Sequelize CLI e dialect

O `sequelize-cli-config.cjs` usa o mesmo `DB_*` da aplicação. Para **SQLite** (testes da app), o CLI ainda aponta para MySQL por padrão — use migrations contra um banco de desenvolvimento/staging compatível com produção.

## Build / artefatos

Migrations **não** são copiadas para `dist/` pelo TypeScript. O deploy deve:

- executar migrations a partir do **repositório** (CI/CD) ou de uma imagem que inclua a pasta `database/`, ou
- usar imagem de release que rode `sequelize-cli` com os arquivos versionados.
