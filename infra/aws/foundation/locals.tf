locals {
  name = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  effective_db_host = length(aws_db_instance.mysql) > 0 ? aws_db_instance.mysql[0].address : var.external_db_host

  effective_db_password = length(random_password.db_master) > 0 ? random_password.db_master[0].result : var.external_db_password

  ecs_subnet_ids = var.nat_gateway_enabled ? aws_subnet.private[*].id : aws_subnet.public[*].id

  alb_cloudwatch_dimension = regex("loadbalancer/(.+)$", aws_lb.main.arn)[0]
  tg_cloudwatch_dimension  = regex("targetgroup/(.+)$", aws_lb_target_group.app.arn)[0]
}

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 2)
}
