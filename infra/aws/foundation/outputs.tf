output "alb_dns_name" {
  description = "Nome DNS do ALB (use alb_public_base_url para o esquema correto)"
  value       = aws_lb.main.dns_name
}

output "alb_public_base_url" {
  description = "Base URL pública (https se acm_certificate_arn definido, senão http)"
  value       = var.acm_certificate_arn != "" ? "https://${aws_lb.main.dns_name}" : "http://${aws_lb.main.dns_name}"
}

output "ecr_repository_url" {
  description = "docker build ... && docker tag ... && docker push ..."
  value       = aws_ecr_repository.api.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  value = aws_ecs_service.app.name
}

output "rds_endpoint" {
  description = "Host MySQL gerenciado (null se use_managed_rds=false)"
  value       = var.use_managed_rds ? aws_db_instance.mysql[0].address : null
}

output "ecs_tasks_security_group_id" {
  description = "Anexe no Aurora (allowed_security_group_ids) quando use_managed_rds=false"
  value       = aws_security_group.ecs_tasks.id
}

output "app_secrets_arn" {
  description = "Secrets Manager — JWT + DB_PASSWORD"
  value       = aws_secretsmanager_secret.app.arn
  sensitive   = true
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "nat_gateway_public_ip" {
  description = "IP elástico do NAT quando nat_gateway_enabled=true (egress das tasks)"
  value       = var.nat_gateway_enabled ? aws_eip.nat[0].public_ip : null
}
