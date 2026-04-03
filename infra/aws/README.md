# Infraestrutura AWS (Terraform)

Ordem sugerida:

1. **[`terraform-remote-state/`](./terraform-remote-state/)** — bucket S3 **só para state** Terraform + tabela DynamoDB de lock (bootstrap com state **local** neste diretório). Opcional se você já tem backend remoto; necessário para alinhar CI (`TF_STATE_*`) sem criar bucket na mão na console.
2. **[`s3-phase1/`](./s3-phase1/)** — bucket de mídia + políticas (fotos/arquivos da aplicação — **outro** bucket).
3. **[`foundation/`](./foundation/)** — VPC, RDS, ECR, ALB, ECS Fargate, Secrets, IAM da task; perfil produção em `terraform.tfvars.production.example` (NAT, ACM, WAF, alarmes, autoscaling).
4. **[`aurora-phase2/`](./aurora-phase2/)** — cluster **Aurora MySQL** (sem RDS Proxy), SG + Secrets; reutiliza VPC/subnets do foundation.
5. **Fase 3 (publicação)** — container Docker, ECR, ECS com imagem da API, smoke no ALB: [`docs/deployment/phase3-ecs-publish.md`](../../docs/deployment/phase3-ecs-publish.md).

Credenciais: configure **`aws configure`** (ou variáveis de ambiente / perfil) **antes** de rodar `terraform apply`, com um usuário ou role que tenha permissão de criar esses recursos na conta. Isso é o **operador Terraform**, não confundir com a **task role** do ECS (criada pelo próprio Terraform).
