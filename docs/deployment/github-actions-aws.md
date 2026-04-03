# Deploy via GitHub Actions (ECR + ECS)

O workflow [`.github/workflows/deploy-aws.yml`](../../.github/workflows/deploy-aws.yml) automatiza o que você já fazia manualmente com:

- [`scripts/ecr-build-push.sh`](../../scripts/ecr-build-push.sh) — build da imagem e push para o ECR  
- [`scripts/ecs-force-new-deployment.sh`](../../scripts/ecs-force-new-deployment.sh) — nova revisão do serviço ECS (mesma task definition)

Além disso (opcional):

- **`terraform plan`** no `infra/aws/foundation` (job paralelo, só leitura) quando você marcar o input no dispatch.  
- **Espera `services-stable` + smoke** (`scripts/smoke-alb.cjs`) após o rollout, se `SMOKE_BASE_URL` estiver configurada.

## O que **não** está no workflow (de propósito)

- **`terraform apply`**: mantenha no seu fluxo (local, Terraform Cloud, outro pipeline). O job opcional só executa **`plan`**.  
- **Migrations**: o RDS costuma ser só na VPC; o runner do GitHub não alcança o banco. Use task one-off no ECS, bastion ou [`scripts/ecs-run-db-migrate.sh`](../../scripts/ecs-run-db-migrate.sh) — ver [database-migrations.md](./database-migrations.md).

## Configuração no GitHub

### 1. Secrets do repositório (Settings → Secrets and variables → Actions)

| Secret | Descrição |
|--------|-----------|
| `AWS_ACCESS_KEY_ID` | IAM com ECR (push), ECS (`UpdateService`, `DescribeServices`), e — se usar plan — leitura Terraform/state. |
| `AWS_SECRET_ACCESS_KEY` | Par da chave acima. |
| `ECR_REPOSITORY_URL` | `terraform output -raw ecr_repository_url` no `infra/aws/foundation`. |
| `ECS_CLUSTER_NAME` | `terraform output -raw ecs_cluster_name`. |
| `ECS_SERVICE_NAME` | `terraform output -raw ecs_service_name`. |
| `TERRAFORM_TFVARS` | *(Opcional, só para job plan)* Conteúdo **multiline** equivalente ao seu `terraform.tfvars` (o arquivo real está no `.gitignore`). |
| `SMOKE_BASE_URL` | *(Opcional)* Base URL do ALB se preferir secret em vez de variable (ex.: `https://xxx.elb.amazonaws.com`). |

Opcional: `AWS_REGION` como **secret** se não usar variável.

### 2. Variáveis de repositório

| Variable | Uso |
|----------|-----|
| `AWS_REGION` | ex.: `us-east-1` (ou use secret `AWS_REGION`). |
| `SMOKE_BASE_URL` | Base URL pública da API (ALB). Com isso, após rollout o workflow roda `aws ecs wait services-stable` e `node scripts/smoke-alb.cjs`. |
| `SMOKE_SKIP_READY` | `true` para pular `GET /ready` no smoke (mesmo comportamento que localmente). |
| `TF_STATE_BUCKET` | *(Plan)* Bucket S3 do backend de state. |
| `TF_STATE_KEY` | *(Plan)* Chave do objeto de state (ex.: `foundation/terraform.tfstate`). |
| `TF_STATE_REGION` | *(Opcional)* Região do bucket; se vazio, usa `AWS_REGION`. |
| `TF_STATE_DYNAMODB_TABLE` | *(Opcional)* Tabela DynamoDB de lock de state. |

### 3. Inputs do *workflow dispatch*

| Input | Efeito |
|-------|--------|
| **image_tag** | Tag no ECR; vazio = SHA curto do commit. |
| **skip_ecs_rollout** | Só build/push; não chama `UpdateService`. |
| **skip_smoke** | Não executa espera ECS nem smoke (mesmo com `SMOKE_BASE_URL`). |
| **run_terraform_plan** | Dispara o job **Terraform plan (foundation)** em paralelo ao deploy (exige backend + `TERRAFORM_TFVARS`). |

### 4. IAM (resumo)

- **ECR**: push da imagem da API.  
- **ECS**: `UpdateService`, `DescribeServices`, e **`ecs:DescribeServices` + `ecs:Wait`** implícitos no `wait services-stable`.  
- **Terraform plan** (se usar): leitura do state no S3 (`s3:GetObject` no objeto de state), opcional DynamoDB lock (`dynamodb:GetItem`, `PutItem`, …), mais APIs de leitura que o `plan` fizer *refresh* (EC2, ELB, etc.). Na prática costuma-se uma policy anexa “TerraformRead” ou estado compartilhado com o mesmo usuário que aplica em outro lugar, com cuidado ao princípio do menor privilégio.

### 5. OIDC em vez de access keys

Ver seção anterior da documentação: trust no GitHub, `role-to-assume`, `permissions: id-token: write` nos jobs. Estenda a role com as mesmas permissões extras se habilitar **plan** ou **smoke/wait**.

Guia: [Configuring OpenID Connect in Amazon Web Services](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services).

## Job Terraform plan

- Só roda quando **Run workflow** marca **run_terraform_plan**.  
- Roda **em paralelo** com o job `deploy` (não bloqueia o push da imagem).  
- Exige **backend S3** alinhado às variáveis `TF_STATE_BUCKET` / `TF_STATE_KEY` (e lock opcional).  
- O secret **`TERRAFORM_TFVARS`** é gravado como `infra/aws/foundation/terraform.tfvars` só no runner (efêmero). Revise se não há segredos que devam ficar só no Terraform Cloud / vault.  
- Não altera infra: apenas `terraform plan`.

## Smoke e espera no ECS

1. Configure **`SMOKE_BASE_URL`** (variable ou secret) com a mesma base que você usaria em `yarn smoke:alb`.  
2. Após um rollout bem-sucedido, o workflow:  
   - `aws ecs wait services-stable` (pode levar vários minutos).  
   - `node scripts/smoke-alb.cjs` (`/health` e, se não `SMOKE_SKIP_READY=true`, `/ready`).  
3. Se **skip_ecs_rollout** estiver marcado, não há rollout → **não** roda espera nem smoke.  
4. **skip_smoke** desliga espera + smoke mesmo com URL configurada.

## Como disparar o deploy

1. **Actions** → **Deploy AWS (ECR + ECS)** → **Run workflow**.  
2. Ajuste inputs conforme a tabela acima.

Deploy automático a cada merge em `main`: descomente `push` no YAML — use [environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) com aprovação quando for produção.

## Alinhamento com Terraform e tags

- Task definition usando `:latest` + push com tag `latest` → `force-new-deployment` puxa a nova digest.  
- Tag imutável (`v1.2.3`) → atualize `container_image` / task definition com `terraform apply` ou outro processo; este workflow só força deploy da revisão **já** referenciada no ECS.

## Smoke manual (alternativa)

```bash
export SMOKE_BASE_URL="$(cd infra/aws/foundation && terraform output -raw alb_public_base_url)"
yarn smoke:alb
```
