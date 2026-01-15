output "api_endpoint" {
  value       = aws_apigatewayv2_api.http.api_endpoint
  description = "Base URL for the HTTP API"
}

output "db_secret_arn" {
  value       = aws_secretsmanager_secret.db.arn
  description = "Secrets Manager ARN containing DB credentials"
}

output "migrations_cluster_name" {
  value       = aws_ecs_cluster.migrations.name
  description = "ECS cluster for migrations"
}

output "migrations_task_definition" {
  value       = aws_ecs_task_definition.migrations.family
  description = "ECS task definition family for migrations"
}

output "seed_task_definition" {
  value       = aws_ecs_task_definition.seed.family
  description = "ECS task definition family for seed"
}

output "migrations_security_group_id" {
  value       = aws_security_group.migrations.id
  description = "Security group for migrations tasks"
}
