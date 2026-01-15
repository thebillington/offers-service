# Database and credentials.
resource "aws_security_group" "rds" {
  name        = "${var.db_name}-sg"
  description = "RDS security group for Lambda access"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [
      aws_security_group.lambda.id,
      aws_security_group.migrations.id,
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_subnet_group" "default" {
  name       = "${var.db_name}-subnets"
  subnet_ids = data.aws_subnets.default.ids
}

resource "random_password" "db" {
  length  = 24
  special = true
  override_special = "!#$%&()*+,-.:;<=>?[]^_{|}~"
}

resource "aws_db_instance" "postgres" {
  identifier              = var.db_identifier
  engine                  = "postgres"
  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  db_name                 = var.db_name
  username                = var.db_username
  password                = random_password.db.result
  db_subnet_group_name    = aws_db_subnet_group.default.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  publicly_accessible     = var.db_publicly_accessible
  skip_final_snapshot     = var.db_skip_final_snapshot
  deletion_protection     = false
}

resource "aws_secretsmanager_secret" "db" {
  name = "${var.db_name}-credentials"
}

locals {
  database_url = "postgresql://${var.db_username}:${urlencode(random_password.db.result)}@${aws_db_instance.postgres.address}:${aws_db_instance.postgres.port}/${var.db_name}?sslmode=require"
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db.result
    host     = aws_db_instance.postgres.address
    port     = aws_db_instance.postgres.port
    database = var.db_name
    url      = local.database_url
  })
}
