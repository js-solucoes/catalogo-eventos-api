variable "aws_region" {
  type        = string
  description = "Região do bucket e da tabela DynamoDB"
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Prefixo dos nomes (minúsculas; sufixo aleatório evita colisão global de bucket)"
  default     = "catalogo-eventos-api"
}

variable "create_dynamodb_lock_table" {
  type        = bool
  description = "Tabela DynamoDB para lock de state (recomendado para CI e equipe)"
  default     = true
}
