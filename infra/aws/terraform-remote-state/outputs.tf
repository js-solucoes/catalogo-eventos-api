output "terraform_state_bucket_name" {
  description = "Use em TF_STATE_BUCKET (GitHub) ou backend \"s3\" bucket="
  value       = aws_s3_bucket.terraform_state.id
}

output "terraform_state_bucket_arn" {
  description = "ARN do bucket (políticas IAM)"
  value       = aws_s3_bucket.terraform_state.arn
}

output "terraform_state_lock_table_name" {
  description = "Use em TF_STATE_DYNAMODB_TABLE quando create_dynamodb_lock_table=true; vazio se desligado"
  value       = try(aws_dynamodb_table.terraform_lock[0].name, "")
}

output "suggested_tf_state_key_foundation" {
  description = "Chave sugerida para o state do módulo foundation"
  value       = "foundation/terraform.tfstate"
}
