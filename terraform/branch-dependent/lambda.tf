/** TODO: 
  * - Restrict the resource of the api lambda policy db-connect to only the db 
  *   instance (define the output in the hsared workspace). One the development 
  *   branches define a standrd on which table to use in rds, restricy the 
  *   access also to that tables.
  */


resource "aws_s3_object" "java17_layer_object" {
  bucket = data.tfe_outputs.shared.values.lambda_code_bucket_id
  key    = "java17layer.zip"
  source = local.java17_layer_path

  # Cheap storage class
  storage_class = "ONEZONE_IA"

  #TODO: the etag has been commented to make the run faster filemd5(local.java17_layer_path)
  # Document this
  etag = "java17runtime"
}

resource "aws_lambda_layer_version" "java17_layer" {
  s3_bucket  = data.tfe_outputs.shared.values.lambda_code_bucket_id
  s3_key     = aws_s3_object.java17_layer_object.key
  layer_name = "java17layer"

  compatible_runtimes = ["provided.al2"]
}

resource "aws_s3_object" "api_lambda_code_object" {
  bucket = data.tfe_outputs.shared.values.lambda_code_bucket_id
  # Cheap storage class
  storage_class = "ONEZONE_IA"

  key    = "backend-build--${var.BRANCH}"
  source = local.api_lambda_code_path

  etag = filemd5(local.api_lambda_code_path)

  tags = {
    Name = "api-lambda-code-object"
  }
}

resource "aws_lambda_function" "api_lambda" {
  function_name = "cars-api-lambda--${var.BRANCH}"

  s3_bucket        = data.tfe_outputs.shared.values.lambda_code_bucket_id
  s3_key           = aws_s3_object.api_lambda_code_object.key
  source_code_hash = filebase64sha256(local.api_lambda_code_path)

  handler = "com.cars.backend.LambdaHandler::handleRequest"
  runtime = "provided.al2"
  layers = [
    aws_lambda_layer_version.java17_layer.arn
  ]

  memory_size = 512
  timeout     = 6

  role = aws_iam_role.api_lambda_role.arn

  vpc_config {
    security_group_ids = [aws_security_group.lambda_sg.id, data.tfe_outputs.shared.values.lambda_to_rds_proxy_sg_id]
    subnet_ids         = data.tfe_outputs.shared.values.compute_subnet_ids
  }

  environment {
    variables = {
      DB_HOST     = data.tfe_outputs.shared.values.rds_proxy_endpoint
      DB_NAME     = "carsdb"
      DB_USER     = data.tfe_outputs.shared.values.rds_username
      DB_PASSWORD = data.tfe_outputs.shared.values.rds_password

      GOOGLE_CLIENT_ID     = var.GOOGLE_CLIENT_ID
      GOOGLE_CLIENT_SECRET = var.GOOGLE_CLIENT_SECRET
      AZURE_CLIENT_ID      = var.AZURE_CLIENT_ID
      AZURE_CLIENT_SECRET  = var.AZURE_CLIENT_SECRET

      BRANCH = var.BRANCH
    }
  }

  tags = {
    Name = "api-lambda"
  }
}

resource "aws_security_group" "lambda_sg" {
  name_prefix = "api-lambda-sg--${var.BRANCH}"
  vpc_id      = data.tfe_outputs.shared.values.vpc_id
}

resource "aws_security_group_rule" "internet_http_to_lambda" {
  security_group_id = aws_security_group.lambda_sg.id
  description       = "Allow internet to connect to lambda"

  type        = "ingress"
  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "internet_https_to_lambda" {
  security_group_id = aws_security_group.lambda_sg.id

  type        = "ingress"
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "lambda_to_internet_sg_rule" {
  security_group_id = aws_security_group.lambda_sg.id
  description       = "Allow Lambda to connect to internet"

  type        = "egress"
  from_port   = 0
  to_port     = 65535
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}


resource "aws_cloudwatch_log_group" "lambda_cloudwatch_log_group" {
  name = "/aws/lambda/${aws_lambda_function.api_lambda.function_name}"

  retention_in_days = 7
}

resource "aws_iam_role" "api_lambda_role" {
  name = "cars-api-lambda-role--${var.BRANCH}"

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
  role       = aws_iam_role.api_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "api-lambda-policy-vpc-access" {
  role       = aws_iam_role.api_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "api-lambda-policy-custom" {
  policy_arn = aws_iam_policy.api_lambda_policy.arn
  role       = aws_iam_role.api_lambda_role.name
}

resource "aws_iam_policy" "api_lambda_policy" {
  name = "cars-api-lambda-policy--${var.BRANCH}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["rds-db:connect"]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })

  tags = {
    Name = "api-lambda-policy-custom"
  }
}

resource "aws_apigatewayv2_integration" "lambda_apigatewayvw2_integration" {
  api_id = aws_apigatewayv2_api.apigatewayv2_api.id

  integration_uri    = aws_lambda_function.api_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"

  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "lambda_apigatewayvw2_route" {
  for_each = { for api in local.api_endpoints : "${api.method}${api.path}" => api }

  api_id = aws_apigatewayv2_api.apigatewayv2_api.id

  route_key = "${each.value.method} ${each.value.path}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_apigatewayvw2_integration.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.apigatewayv2_api.execution_arn}/*/*"
}
