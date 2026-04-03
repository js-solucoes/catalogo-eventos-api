output "iam_role_arn" {
  description = "Valor do secret AWS_ROLE_TO_ASSUME no GitHub"
  value       = aws_iam_role.github_actions.arn
}

output "iam_role_name" {
  value = aws_iam_role.github_actions.name
}

output "oidc_provider_arn" {
  description = "ARN do provedor OIDC usado na trust policy"
  value       = local.github_oidc_provider_arn
}
