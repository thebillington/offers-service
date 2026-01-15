# ECS tasks for migrations and seeding.
resource "aws_security_group" "migrations" {
  name        = "${var.migrations_task_family}-sg"
  description = "ECS migrations security group for RDS access"
  vpc_id      = data.aws_vpc.default.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecr_repository" "migrations" {
  name = var.migrations_ecr_repo_name
}

resource "aws_ecs_cluster" "migrations" {
  name = var.migrations_cluster_name
}

resource "aws_cloudwatch_log_group" "migrations" {
  name              = "/ecs/${var.migrations_task_family}"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "seed" {
  name              = "/ecs/${var.seed_task_family}"
  retention_in_days = var.log_retention_days
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.migrations_task_family}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Effect    = "Allow"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_task_execution_secrets" {
  name = "${var.migrations_task_family}-secrets"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = aws_secretsmanager_secret.db.arn
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.migrations_task_family}-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Effect    = "Allow"
    }]
  })
}

resource "aws_ecs_task_definition" "migrations" {
  family                   = var.migrations_task_family
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.migrations_task_cpu
  memory                   = var.migrations_task_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "migrations"
      image     = "${aws_ecr_repository.migrations.repository_url}:${var.migrations_image_tag}"
      essential = true
      command   = ["up"]
      environment = [
        { name = "PGSSLMODE", value = "require" },
        { name = "PGSSLROOTCERT", value = "/app/rds-ca-bundle.pem" }
      ]
      secrets = [
        { name = "PGUSER", valueFrom = "${aws_secretsmanager_secret.db.arn}:username::" },
        { name = "PGPASSWORD", valueFrom = "${aws_secretsmanager_secret.db.arn}:password::" },
        { name = "PGHOST", valueFrom = "${aws_secretsmanager_secret.db.arn}:host::" },
        { name = "PGPORT", valueFrom = "${aws_secretsmanager_secret.db.arn}:port::" },
        { name = "PGDATABASE", valueFrom = "${aws_secretsmanager_secret.db.arn}:database::" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.migrations.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  depends_on = [
    aws_iam_role_policy_attachment.ecs_task_execution,
    aws_iam_role_policy.ecs_task_execution_secrets,
  ]
}

resource "aws_ecs_task_definition" "seed" {
  family                   = var.seed_task_family
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.migrations_task_cpu
  memory                   = var.migrations_task_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "seed"
      image     = "${aws_ecr_repository.migrations.repository_url}:${var.seed_image_tag}"
      essential = true
      environment = [
        { name = "PGSSLMODE", value = "require" },
        { name = "PGSSLROOTCERT", value = "/app/rds-ca-bundle.pem" }
      ]
      secrets = [
        { name = "DATABASE_URL", valueFrom = "${aws_secretsmanager_secret.db.arn}:url::" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.seed.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  depends_on = [
    aws_iam_role_policy_attachment.ecs_task_execution,
    aws_iam_role_policy.ecs_task_execution_secrets,
  ]
}
