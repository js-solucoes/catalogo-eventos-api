# Remote state — bucket S3 + DynamoDB (bootstrap)

Cria **na AWS**, só via Terraform:

- **Bucket S3** privado para o arquivo de state do Terraform (versionamento, criptografia SSE-S3, bloqueio de acesso público, política só TLS).
- **Tabela DynamoDB** (opcional, padrão ligado) para **lock** de state (`terraform plan/apply` concorrentes e CI).

É **independente** do bucket de mídia em [`../s3-phase1/`](../s3-phase1/) — outro recurso, outro propósito.

## Por que state local neste módulo?

Este stack é o **bootstrap**: se o backend fosse o próprio bucket que ele cria, haveria dependência circular. O state deste diretório fica **local** (`terraform.tfstate` no disco, no `.gitignore`). O módulo [`../foundation/`](../foundation/) passa a usar **remote backend** apontando para os outputs abaixo.

## Ordem sugerida (conta nova)

1. **Este diretório** — `terraform init && terraform apply`
2. [`../s3-phase1/`](../s3-phase1/) — mídia
3. [`../foundation/`](../foundation/) — `terraform init` com `-backend-config` usando os outputs deste módulo (ou migrar state existente)

## Aplicar

```bash
cd infra/aws/terraform-remote-state
cp terraform.tfvars.example terraform.tfvars   # ajuste se precisar
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

## Outputs para GitHub Actions / foundation

Após o apply:

```bash
terraform output -raw terraform_state_bucket_name
terraform output -raw suggested_tf_state_key_foundation
terraform output -raw terraform_state_lock_table_name
```

Configure no repositório:

| Destino | Valor |
|--------|--------|
| Variable `TF_STATE_BUCKET` | `terraform output -raw terraform_state_bucket_name` |
| Variable `TF_STATE_KEY` | `terraform output -raw suggested_tf_state_key_foundation` (ou outra key por ambiente) |
| Variable `TF_STATE_DYNAMODB_TABLE` | output `terraform_state_lock_table_name` (se não vazio) |

## IAM (CI / operador)

O principal que roda Terraform (OIDC do GitHub, seu usuário) precisa, no mínimo, de permissões de leitura/escrita nesse bucket e `dynamodb:GetItem`, `PutItem`, `DeleteItem` na tabela de lock. Detalhes em [`docs/deployment/github-oidc-aws.md`](../../../docs/deployment/github-oidc-aws.md).

## Destruir

O bucket tem `prevent_destroy = true` para evitar perda acidental de state. Remova temporariamente no `.tf` só se tiver certeza absoluta e backup do state.
