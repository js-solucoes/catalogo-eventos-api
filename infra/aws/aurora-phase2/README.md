# Fase 2 — Aurora MySQL (sem RDS Proxy)

Cluster **Aurora MySQL compatível com 8.0**, **1 instância writer**, endpoint direto (sem proxy). Alinhado ao Sequelize/`mysql2` já usados no projeto.

## Pré-requisitos

- VPC e **pelo menos 2 subnets em AZs diferentes** (ex.: stack `foundation`).
- Terraform + credenciais AWS com permissão para RDS, EC2 SG, Secrets Manager, subnet groups.

## Aplicar

```bash
cd infra/aws/aurora-phase2
cp terraform.tfvars.example terraform.tfvars
# Edite vpc_id, subnets, allowed_cidr_blocks, publicly_accessible

terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

Credenciais após o apply:

```bash
aws secretsmanager get-secret-value \
  --secret-id "$(terraform output -raw secrets_manager_arn)" \
  --query SecretString --output text | jq .
```

## Integração com o stack foundation

1. `terraform output vpc_id` e subnets **públicas** (para lab com `publicly_accessible`) ou **privadas** + bastion/VPN (padrão mais seguro).
2. Opcional: `allowed_security_group_ids` com o SG das tasks ECS (`terraform output` do foundation — consulte `aws_security_group.ecs_tasks` no state do foundation).

Documentação operacional completa: [`docs/deployment/aurora-phase2.md`](../../../docs/deployment/aurora-phase2.md).
