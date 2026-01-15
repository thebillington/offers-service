# Lambda function and HTTP API Gateway.
resource "aws_iam_role" "lambda" {
  name = var.lambda_role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Principal = { Service = "lambda.amazonaws.com" }
      Effect    = "Allow"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logging" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_vpc" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_security_group" "lambda" {
  name        = "${var.lambda_name}-sg"
  description = "Lambda security group for RDS access"
  vpc_id      = data.aws_vpc.default.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${var.lambda_name}"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "api" {
  filename         = var.lambda_zip_path
  function_name    = var.lambda_name
  role             = aws_iam_role.lambda.arn
  handler          = var.lambda_handler
  runtime          = var.lambda_runtime
  architectures    = [var.lambda_architecture]
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  vpc_config {
    subnet_ids         = data.aws_subnets.default.ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      DATABASE_URL               = local.database_url
      PG_MAX_CONNECTIONS         = var.pg_max_connections
      PG_SSL                     = true
      PG_SSL_REJECT_UNAUTHORIZED = true
      NODE_EXTRA_CA_CERTS        = "/var/task/rds-ca-bundle.pem"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logging,
    aws_iam_role_policy_attachment.lambda_vpc
  ]
}

resource "aws_apigatewayv2_api" "http" {
  name          = var.api_name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "api" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api.arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "api_base" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "ANY /api"
  target    = "integrations/${aws_apigatewayv2_integration.api.id}"
}

resource "aws_apigatewayv2_route" "api_proxy" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "ANY /api/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.api.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowHttpApiInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*/api*"
}
