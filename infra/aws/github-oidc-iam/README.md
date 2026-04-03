# GitHub Actions → AWS (OIDC) via Terraform

Provisiona na conta do **cliente**:

1. **IAM OIDC provider** `token.actions.githubusercontent.com` (opcional se já existir).
2. **IAM role** com trust `repo:ORG/REPO:*` (ou padrão restrito via `github_oidc_sub_pattern`).
3. **`ReadOnlyAccess`** (opcional) — necessário para o job **Terraform plan** no CI.
4. **Política inline** para **DynamoDB lock** do state (opcional).
5. **Política inline** **ECR push + ECS UpdateService** (opcional), quando `ecr_repository_name` e `ecs_cluster_name` estiverem preenchidos.

State **local** neste diretório (bootstrap de permissões, não depende do bucket de state do foundation).

## Ordem sugerida na conta do cliente

1. `terraform-remote-state` (opcional) → bucket/key/table para state.
2. `s3-phase1` → mídia.
3. `foundation` → apply (gera ECR, cluster ECS, etc.).
4. **Este módulo** → preencha `ecr_repository_name` e `ecs_cluster_name` com outputs do foundation (`terraform output -raw ...`), além de `terraform_lock_table_arn` se usar lock.
5. GitHub → secret `AWS_ROLE_TO_ASSUME` = `terraform output -raw iam_role_arn`.

**Primeira vez sem ECR/cluster:** rode este módulo só com OIDC + role + ReadOnly + lock; depois `terraform apply` de novo com ECR/ECS preenchidos (ou anexe política manualmente conforme [github-oidc-aws.md](../../../docs/deployment/github-oidc-aws.md)).

## Provedor OIDC já existente

Se `apply` falhar com `EntityAlreadyExists` no OIDC:

```hcl
create_oidc_provider = false
```

## Comandos

```bash
cd infra/aws/github-oidc-iam
cp terraform.tfvars.example terraform.tfvars
# Edite github_org, github_repo e demais campos
terraform init
terraform apply
```

## Referência manual equivalente

[docs/deployment/github-oidc-aws.md](../../../docs/deployment/github-oidc-aws.md)
