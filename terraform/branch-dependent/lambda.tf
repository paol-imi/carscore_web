
# TODO: create custom cname for each api gateway stage on cloudflare

data "archive_file" "lambda_code" {
  for_each = toset(local.lambdas)

  type = "zip"

  source_file = "${path.module}/dist/example.jar"
  output_path = "${path.module}/dist/example.zip"
}

resource "aws_s3_object" "lambda_code_object" {
  for_each = toset(local.lambdas)

  bucket        = aws_s3_bucket.lambda_bucket.id
  storage_class = "ONEZONE_IA"

  key    = "${local.LINE_PREFIX}${each.value}.zip"
  source = data.archive_file.lambda_code[each.value].output_path

  etag = filemd5(data.archive_file.lambda_code[each.value].output_path)
}

resource "aws_lambda_function" "lambda" {
  for_each = toset(local.lambdas)

  function_name = "${local.LINE_PREFIX}${each.value}"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_code_object[each.value].key

  runtime = "java11"
  handler = "example.${each.value}::handleRequest"

  source_code_hash = data.archive_file.lambda_code[each.value].output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "lambda_cloudwatch_log_group" {
  for_each = toset(local.lambdas)

  name = "/aws/lambda/${aws_lambda_function.lambda[each.value].function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "${local.LINE_PREFIX}serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_apigatewayv2_integration" "lambda_apigatewayvw2_integration" {
  for_each = toset(local.lambdas)

  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.lambda[each.value].invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "lambda_apigatewayvw2_route" {
  for_each = toset(local.lambdas)

  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /${each.value}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_apigatewayvw2_integration[each.value].id}"
}

resource "aws_lambda_permission" "api_gw" {
  for_each = toset(local.lambdas)

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda[each.value].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}
