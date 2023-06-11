resource "aws_apigatewayv2_api" "apigatewayv2_api" {
  name          = "cars-api-gateway--${var.BRANCH}"
  protocol_type = "HTTP"

  cors_configuration {
    # FIXME: Beacuse we don't have stable domain name for each branch (yet), we 
    # need to allow all origins for non-production branches. This is not ideal
    # and should be fixed in the future.
    # allow_origins = var.BRANCH == "main" ? ["https://carsdemo.win"] : ["*"]
    allow_origins = ["*"]
    allow_methods = ["*"]
    # TODO: Restrict allowed headers to only those that are needed once the 
    # backend is implemented.
    allow_headers = ["*"]
    max_age       = 300
    # allow_credentials = var.BRANCH == "main" ? true : null
  }

  tags = {
    Name = "api-gateway"
  }
}

resource "aws_cloudwatch_log_group" "apigatewayv2_cloudwatch_log_group" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.apigatewayv2_api.name}"

  retention_in_days = 7
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.apigatewayv2_api.id

  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.apigatewayv2_cloudwatch_log_group.arn

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

resource "aws_apigatewayv2_api_mapping" "lambda" {
  count = var.BRANCH == "main" ? 1 : 0

  api_id      = aws_apigatewayv2_api.apigatewayv2_api.id
  domain_name = data.tfe_outputs.shared.values.apigateway_domain_name_id
  stage       = aws_apigatewayv2_stage.lambda.id
}
