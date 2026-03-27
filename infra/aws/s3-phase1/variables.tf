variable "aws_region" {
  type        = string
  description = "Região do bucket e da política IAM"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Prefixo do nome do bucket (minúsculas; usado em celeiro-api-media-xxxx)"
  default     = "celeiro-api"
}

variable "s3_public_prefix" {
  type        = string
  description = "Prefixo lógico público (deve coincidir com S3_PUBLIC_PREFIX na API)"
  default     = "public"
}

variable "developer_iam_user_name" {
  type        = string
  description = "Se não vazio, anexa a política mínima de app a este usuário IAM (credenciais locais)"
  default     = ""
}

variable "enable_versioning" {
  type        = bool
  description = "Versionamento S3 (recomendado; facilita rollback de objetos)"
  default     = true
}
