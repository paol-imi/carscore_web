/** TODO:
  * - ensure that the the compute subnet in which the Lambda is deployed is in 
  *   the same AZ as the RDS master instance.
  * - Move the Lambda to the dependent subnet.
  */

// Common lambda group

resource "aws_security_group" "lambda_to_rds_proxy_sg" {
  name   = "lambda_to_rds_sg"
  vpc_id = aws_vpc.vpc.id
}

resource "aws_security_group_rule" "lambda_to_rds_proxy_sg" {
  security_group_id = aws_security_group.lambda_to_rds_proxy_sg.id
  description       = "Allow Lambda to connect to RDS proxy"

  type                     = "egress"
  from_port                = 0
  to_port                  = 65535
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.rds_proxy_sg.id
}

// Script lambda

resource "aws_security_group" "lambda_to_internet_sg" {
  name   = "lambda_to_internet_sg"
  vpc_id = aws_vpc.vpc.id
}

resource "aws_security_group_rule" "lambda_to_internet_sg_rule" {
  security_group_id = aws_security_group.lambda_to_internet_sg.id
  description       = "Allow Lambda to connect to internet"

  type        = "egress"
  from_port   = 0
  to_port     = 65535
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_ecr_repository" "script_lambda_repository" {
  name = "script-image"
}

resource "aws_lambda_function" "script_lambda" {
  function_name = "cars-script-lambda"
  package_type  = "Image"

  image_uri = "${aws_ecr_repository.script_lambda_repository.repository_url}:latest"

  memory_size = 10240
  timeout     = 900

  role = aws_iam_role.script_lambda_role.arn

  ephemeral_storage {
    size = 10240 # Min 512 MB and the Max 10240 MB
  }

  vpc_config {
    security_group_ids = [aws_security_group.lambda_to_internet_sg.id, aws_security_group.lambda_to_rds_proxy_sg.id]
    subnet_ids         = [aws_subnet.compute_subnet[0].id]
  }

  environment {
    variables = {
      DB_HOST     = aws_db_proxy.rds_proxy.endpoint
      DB_NAME     = "carsdb"
      DB_USER     = aws_db_instance.rds_instance.username
      DB_PASSWORD = aws_db_instance.rds_instance.password

      BUCKET_NAME = aws_s3_bucket.lambda_code_bucket.bucket
      BTC_API_KEY = var.BTC_API_KEY
    }
  }

  tags = {
    Name = "script-lambda"
  }
}

resource "aws_cloudwatch_log_group" "script_lambda_cloudwatch_log_group" {
  name = "/aws/lambda/${aws_lambda_function.script_lambda.function_name}"

  retention_in_days = 7
}

resource "aws_iam_role" "script_lambda_role" {
  name = "cars-script-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api-lambda-policy-basic" {
  role       = aws_iam_role.script_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "api-lambda-policy-vpc-access" {
  role       = aws_iam_role.script_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}


resource "aws_cloudwatch_event_rule" "monthly_event_rule" {
  name        = "monthly-event"
  description = "Trigger my Lambda function once a month"
  # Run at 12:00 UTC on the 1st of every month
  schedule_expression = "cron(0 12 1 * ? *)"
}

resource "aws_cloudwatch_event_target" "my_event_target" {
  rule      = aws_cloudwatch_event_rule.monthly_event_rule.name
  target_id = "my-lambda-function"
  arn       = aws_lambda_function.script_lambda.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_invoke_my_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.script_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.monthly_event_rule.arn
}

resource "aws_iam_role_policy_attachment" "script-lambda-policy-custom" {
  policy_arn = aws_iam_policy.script_lambda_policy.arn
  role       = aws_iam_role.script_lambda_role.name
}

resource "aws_iam_policy" "script_lambda_policy" {
  name = "cars-script-lambda-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["rds-db:connect"]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = "*"
      },
    ]
  })

  tags = {
    Name = "script-lambda-policy-custom"
  }
}

resource "aws_s3_object" "model_object" {
  count  = length(local.model_configurations_paths)
  bucket = aws_s3_bucket.lambda_code_bucket.id

  key    = replace(local.model_configurations_paths[count.index], "dist/", "")
  source = local.model_configurations_paths[count.index]

  etag = filebase64sha256(local.model_configurations_paths[count.index])

  tags = {
    Name = "model-object"
  }
}
