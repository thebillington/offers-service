output "api_endpoint" {
  value       = aws_apigatewayv2_api.http.api_endpoint
  description = "Base URL for the HTTP API"
}

output "db_secret_arn" {
  value       = aws_secretsmanager_secret.db.arn
  description = "Secrets Manager ARN containing DB credentials"
}
