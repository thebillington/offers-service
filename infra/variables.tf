variable "aws_region" {
  type        = string
  description = "AWS region to deploy into"
  default     = "eu-west-2"
}

variable "lambda_zip_path" {
  type        = string
  description = "Path to the Lambda deployment zip"
  default     = "../backend/dist/function.zip"
}

variable "lambda_name" {
  type        = string
  description = "Name of the Lambda function"
  default     = "blc-api"
}

variable "lambda_role_name" {
  type        = string
  description = "IAM role name for Lambda"
  default     = "blc-api-role"
}

variable "lambda_handler" {
  type        = string
  description = "Lambda handler entrypoint"
  default     = "index.handler"
}

variable "lambda_runtime" {
  type        = string
  description = "Lambda runtime"
  default     = "nodejs20.x"
}

variable "lambda_architecture" {
  type        = string
  description = "Lambda architecture (arm64 or x86_64)"
  default     = "x86_64"
}

variable "api_name" {
  type        = string
  description = "HTTP API name"
  default     = "blc-http-api"
}

variable "pg_max_connections" {
  type        = number
  description = "Max Postgres pool size"
  default     = 5
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch log retention period"
  default     = 14
}

variable "db_identifier" {
  type        = string
  description = "RDS instance identifier"
  default     = "blc-postgres"
}

variable "db_name" {
  type        = string
  description = "Database name"
  default     = "blc_db"
}

variable "db_username" {
  type        = string
  description = "Database master username"
  default     = "blc_user"
}

variable "db_instance_class" {
  type        = string
  description = "RDS instance class"
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  type        = number
  description = "RDS storage size (GB)"
  default     = 20
}

variable "db_publicly_accessible" {
  type        = bool
  description = "Whether the database is publicly accessible"
  default     = false
}

variable "db_deletion_protection" {
  type        = bool
  description = "Enable deletion protection for the DB instance"
  default     = true
}

variable "db_skip_final_snapshot" {
  type        = bool
  description = "Skip final snapshot when destroying the DB"
  default     = false
}

variable "migrations_cluster_name" {
  type        = string
  description = "ECS cluster name for migrations"
  default     = "blc-migrations"
}

variable "migrations_task_family" {
  type        = string
  description = "ECS task definition family for migrations"
  default     = "blc-migrations"
}

variable "migrations_ecr_repo_name" {
  type        = string
  description = "ECR repository name for migrations image"
  default     = "blc-migrations"
}

variable "migrations_task_cpu" {
  type        = string
  description = "CPU units for the migrations task"
  default     = "256"
}

variable "migrations_task_memory" {
  type        = string
  description = "Memory for the migrations task (MiB)"
  default     = "512"
}

variable "migrations_image_tag" {
  type        = string
  description = "Image tag for the migrations task"
  default     = "latest"
}

variable "seed_task_family" {
  type        = string
  description = "ECS task definition family for seed"
  default     = "blc-seed"
}

variable "seed_image_tag" {
  type        = string
  description = "Image tag for the seed task"
  default     = "seed"
}
