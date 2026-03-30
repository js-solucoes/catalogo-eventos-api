# Catálogo de eventos — API (Node.js + Express + Sequelize)

API modular (`core` + contextos de negócio), pronta para execução local, testes em CI e publicação na **AWS** (S3, ECS Fargate, ALB, RDS MySQL, ECR). Este README concentra o fluxo para **clonar o repositório, criar uma conta AWS nova e subir o ambiente**, além de **manutenção, publicação de alterações** e **orientações para CI/CD no GitHub**.

Documentação complementar: pasta [`docs/deployment/`](docs/deployment/README.md).

---

## Pré-requisitos na máquina do desenvolvedor

| Ferramenta | Uso |
|------------|-----|
| **Node.js 22** | Alinhado ao `Dockerfile` e ao CI (`nvm`, `fnm` ou instalador oficial). |
| **npm** | `npm ci`, scripts do `package.json`. |
| **Docker** | Build da imagem de produção e push para o ECR. |
| **Terraform ≥ 1.5** | Infraestrutura em `infra/aws/`. |
| **AWS CLI v2** | `aws configure` e comandos opcionais de diagnóstico. |
| **Conta AWS** | Acesso ao console + usuário IAM com chave de acesso para Terraform/CLI (em laboratório costuma-se `AdministratorAccess`; em produção, política restrita). |

---

## 1. Clonar e rodar localmente

```bash
git clone <url-do-repositório>
cd catalogo-eventos-api
cp .env-exemplo .env   # ajuste variáveis (JWT ≥ 16 caracteres, DB, etc.)
npm ci
npm run dev            # ou: npm run build && npm start
```

Testes e qualidade:

```bash
npm run check          # typecheck + lint + testes com cobertura
npm run smoke:http     # sobe servidor de teste e valida /health (ver script)
```

---

## 2. Conta AWS nova — primeiro acesso

1. Crie a **conta AWS** e faça login no [console](https://console.aws.amazon.com).
2. Crie um usuário **IAM** (ex.: `terraform-local`) **sem** usar a conta root no dia a dia.
3. Gere **Access key** (CLI): IAM → usuário → *Security credentials* → *Create access key*.
4. Na sua máquina:

```bash
aws configure
# Informe Access Key, Secret, região padrão (ex.: us-east-1), output json
aws sts get-caller-identity   # deve retornar Account e Arn
```

**Permissões:** o usuário que roda o Terraform precisa criar VPC, EC2, RDS, ECS, ECR, ALB, IAM (roles da task), Secrets Manager, CloudWatch, etc. Sem isso, o `plan`/`apply` falhará com `AccessDenied`.

---

## 3. Infraestrutura AWS (ordem obrigatória)

Use **sempre a mesma região** (ex.: `us-east-1`) em S3, foundation e `aws configure`.

### 3.1 Fase 1 — Bucket S3 (mídia)

```bash
cd infra/aws/s3-phase1
cp terraform.tfvars.example terraform.tfvars
# Edite: project_name, environment, aws_region, etc.
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

**Guarde os outputs** (serão usados no foundation):

```bash
terraform output -raw bucket_name
terraform output -raw s3_public_base_url
```

O nome do bucket inclui um **sufixo aleatório** (ex.: `celeiro-api-media-a1b2c3d4`). **Não** use placeholders como `xxxxxxxx` no próximo passo.

### 3.2 Foundation — VPC, RDS, ECR, ALB, ECS Fargate, Secrets

```bash
cd ../foundation
cp terraform.tfvars.example terraform.tfvars
```

Edite `terraform.tfvars`:

- `aws_region`, `project_name`, `environment`
- `media_bucket_name` = output **`bucket_name`** do passo 3.1
- `s3_public_base_url` = output **`s3_public_base_url`** (sem barra final)
- `jwt_secret`, `jwt_access_secret`, `jwt_refresh_secret` — **cada um com pelo menos 16 caracteres**
- **Primeiro deploy (opcional):** deixe comentadas `container_image`, `container_port`, `health_check_path` para validar ALB/ECS com a imagem **nginx** padrão do Terraform
- **API em produção:** após o push no ECR (seção 4), defina:

```hcl
container_image     = "<account>.dkr.ecr.<região>.amazonaws.com/<projeto>-<env>-api:<tag>"
container_port      = 3000
health_check_path   = "/health"
```

```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

Outputs úteis:

```bash
terraform output -raw ecr_repository_url
terraform output -raw alb_public_base_url
terraform output -raw ecs_cluster_name
terraform output -raw ecs_service_name
```

**Arquivos sensíveis:** `terraform.tfvars` está no `.gitignore` — **não commite** segredos. Use `*.example` como modelo.

**Produção endurecida (NAT, HTTPS ACM, WAF, alarmes):** veja [`infra/aws/foundation/terraform.tfvars.production.example`](infra/aws/foundation/terraform.tfvars.production.example) e [`docs/deployment/phase3-ecs-publish.md`](docs/deployment/phase3-ecs-publish.md).

---

## 4. Imagem Docker e publicação no ECR

Na **raiz do repositório**:

```bash
npm ci
npm run build
export AWS_REGION=us-east-1   # sua região
export ECR_REPOSITORY_URL="$(cd infra/aws/foundation && terraform output -raw ecr_repository_url)"
./scripts/ecr-build-push.sh
```

Opcional: tag imutável — `export IMAGE_TAG=v1.0.0` antes do script.

Atualize `container_image` no `foundation/terraform.tfvars` com a **mesma** URI + tag e rode:

```bash
cd infra/aws/foundation
terraform apply
```

**Novo deploy** só com nova imagem (mesma tag `latest` repushed):

```bash
export AWS_REGION=us-east-1
export ECS_CLUSTER_NAME="$(cd infra/aws/foundation && terraform output -raw ecs_cluster_name)"
export ECS_SERVICE_NAME="$(cd infra/aws/foundation && terraform output -raw ecs_service_name)"
./scripts/ecs-force-new-deployment.sh
```

---

## 5. Validação pós-deploy (smoke)

```bash
cd /caminho/para/catalogo-eventos-api
export SMOKE_BASE_URL="$(cd infra/aws/foundation && terraform output -raw alb_public_base_url)"
npm run smoke:alb
```

- **`/health`** — liveness (sem banco).
- **`/ready`** — readiness com banco (se falhar, ver SG do RDS e migrations).

Se precisar isolar o ALB: `SMOKE_SKIP_READY=true npm run smoke:alb`.

---

## 6. Banco de dados e migrations

Em **produção** o Terraform define `UPDATE_MODEL=false` — o schema evolui com **migrations** (`database/migrations/`), não com `sync` automático.

O **RDS** criado pelo foundation fica em **subnet privada** e **não** é público. Para rodar `npm run db:migrate` ou `db:migrate:status` você precisa de **rota à VPC**: bastion, VPN, SSM port forwarding, task one-off no Fargate ou runner de CI na VPC.

Detalhes: [`docs/deployment/database-migrations.md`](docs/deployment/database-migrations.md).

---

## 7. S3 — checagens rápidas

```bash
BUCKET="$(cd infra/aws/s3-phase1 && terraform output -raw bucket_name)"
aws s3api head-bucket --bucket "$BUCKET"
```

Validação via API (admin + JWT): [`docs/deployment/s3-phase1.md`](docs/deployment/s3-phase1.md) (`GET /api/media/verify`).

---

## 8. Destruir a infraestrutura (reset de ambiente)

No **foundation**:

```bash
cd infra/aws/foundation
rm -f destroy.tfplan
terraform plan -destroy -out=destroy.tfplan
terraform apply destroy.tfplan
```

O repositório ECR está com **`force_delete = true`** para permitir apagar o repositório **com imagens**. Se usar um **plano de destroy antigo** gerado antes dessa configuração, gere um **novo** `plan -destroy` (planos salvos não “enxergam” alterações posteriores no `.tf`).

O **bucket S3** não é removido pelo foundation (apenas referenciado). Para apagar o bucket, use o destroy em `infra/aws/s3-phase1` (apaga também o conteúdo).

---

## 9. GitHub — CI existente

O repositório inclui [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

| Job | O que faz |
|-----|-----------|
| **quality** | `npm ci`, `npm run check`, `npm run build && npm run verify:dist`, `npm run smoke:http` em branches `main`, `master`, `develop` e em PRs. |
| **database** | Sobe **MySQL 8** como serviço e roda `npm run db:bootstrap` (migrations + seeds) para validar o pipeline de banco. |

**Não há CD (deploy automático para AWS)** neste repositório. O deploy continua sendo: build da imagem, push ECR, `terraform apply` e/ou `ecs-force-new-deployment` (ou equivalente automatizado por vocês).

### 9.1 Habilitar CI no fork/cliente

- Ative **Actions** no repositório GitHub.
- Os jobs usam apenas **secrets simulados** no YAML (`JWT_*` fixos para teste) — não precisam de secrets de AWS para o CI atual.

### 9.2 Opcional — CD com GitHub Actions (orientação)

Para publicar a cada tag ou push em `main`, uma abordagem comum é:

1. Criar secrets no repositório: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (ou usar **OIDC** com IAM role — recomendado em produção).
2. Workflow com passos: `aws ecr get-login-password`, `docker build/push`, `aws ecs update-service --force-new-deployment` ou `terraform apply` com backend remoto (S3 + DynamoDB lock).

Mantenha **Terraform state** fora do git (backend S3) se várias pessoas forem aplicar infra.

---

## 10. Referências úteis

| Documento | Conteúdo |
|-----------|----------|
| [`docs/deployment/README.md`](docs/deployment/README.md) | Índice de deploy, variáveis, secrets, S3, Aurora, Fase 3 ECS |
| [`infra/aws/README.md`](infra/aws/README.md) | Ordem dos stacks Terraform |
| [`infra/aws/foundation/README.md`](infra/aws/foundation/README.md) | Foundation em detalhe |
| [`infra/aws/s3-phase1/README.md`](infra/aws/s3-phase1/README.md) | Bucket de mídia |

---

## 11. Resumo do fluxo “conta AWS nova”

1. `aws configure` + IAM com permissões suficientes  
2. `infra/aws/s3-phase1` → `apply` → copiar `bucket_name` e `s3_public_base_url`  
3. `infra/aws/foundation` → preencher `terraform.tfvars` → `apply`  
4. `npm ci` && `npm run build` → `./scripts/ecr-build-push.sh`  
5. Ajustar `container_image` / porta / health no `terraform.tfvars` → `terraform apply`  
6. Migrations com acesso à VPC  
7. `npm run smoke:alb` com `SMOKE_BASE_URL` do output do ALB  

Com isso, quem clonar o projeto consegue **reproduzir o ambiente**, **alterar código**, **republicar imagens** e **evoluir a infra** seguindo a mesma sequência.
