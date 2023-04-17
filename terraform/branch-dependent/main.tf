
resource "random_pet" "lambda_bucket_name" {
  prefix = "${local.LINE_PREFIX}cars-lambda-functions"
  length = 4
}


resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}


resource "aws_s3_bucket_acl" "bucket_acl" {
  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

resource "aws_apigatewayv2_api" "lambda" {
  name          = "${local.UNDERSCORE_PREFIX}serverless_lambda_gw"
  protocol_type = "HTTP"
}

# TODO: Move all the resources that are common in a workspace share between branches
resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "${local.UNDERSCORE_PREFIX}v1"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    })
  }
}

resource "aws_apigatewayv2_domain_name" "lambda" {
  domain_name = "${local.DOT_PREFIX}api.carsdemo.win"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.lambda.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_acm_certificate" "lambda" {
  private_key      = var.PRIVATE_KEY_PEM
  certificate_body = var.CERTIFICATE_BODY_PEM
}

resource "aws_apigatewayv2_api_mapping" "lambda" {
  api_id      = aws_apigatewayv2_api.lambda.id
  domain_name = aws_apigatewayv2_domain_name.lambda.id
  stage       = aws_apigatewayv2_stage.lambda.id
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${local.UNDERSCORE_PREFIX}${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

resource "cloudflare_record" "api" {
  zone_id = "40cfee311e8c12bd6c6e4ccdee9b6cd1"
  name    = "${local.DOT_PREFIX}api.carsdemo.win"
  value   = aws_apigatewayv2_domain_name.lambda.domain_name
  type    = "CNAME"
  ttl     = 1
}
