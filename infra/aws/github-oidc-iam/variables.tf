variable "aws_region" {
  type        = string
  description = "Região onde a role será criada (alinhada ao ECS/ECR)"
  default     = "us-east-1"
}

variable "github_org" {
  type        = string
  description = "Organização ou usuário GitHub (OWNER em repo:OWNER/REPO)"
}

variable "github_repo" {
  type        = string
  description = "Nome do repositório (REPO em repo:OWNER/REPO)"
}

variable "github_oidc_sub_pattern" {
  type        = string
  description = "Claim sub permitido. Padrão: qualquer ref do repositório. Restringir ex.: repo:ORG/REPO:ref:refs/heads/main"
  default     = ""
}

variable "iam_role_name" {
  type        = string
  description = "Nome da role IAM assumida pelo GitHub Actions"
  default     = "GitHubActionsDeploy"
}

variable "create_oidc_provider" {
  type        = bool
  description = "false se a conta já tiver o provedor OIDC do GitHub (evita erro EntityAlreadyExists)"
  default     = true
}

variable "attach_readonly_access" {
  type        = bool
  description = "Anexa AWS managed ReadOnlyAccess (recomendado para job terraform plan no CI)"
  default     = true
}

variable "terraform_lock_table_arn" {
  type        = string
  description = "ARN da tabela DynamoDB de lock do Terraform state; vazio = não cria política de lock"
  default     = ""
}

variable "ecr_repository_name" {
  type        = string
  description = "Nome do repositório ECR (sem URL); vazio = não adiciona política de push ECR"
  default     = ""
}

variable "ecs_cluster_name" {
  type        = string
  description = "Nome curto do cluster ECS; vazio = não restringe UpdateService neste módulo"
  default     = ""
}

variable "github_oidc_thumbprints" {
  type        = list(string)
  description = "Thumbprints do certificado do OIDC GitHub; atualize se a AWS documentar novos valores"
  default = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a7718e544d5072d6e874499fc51515065c",
  ]
}
