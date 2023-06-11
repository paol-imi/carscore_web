resource "aws_apigatewayv2_domain_name" "apigatewayv2_domain_name" {
  domain_name = "api.carsdemo.win"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.acm_certificate.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_acm_certificate" "acm_certificate" {
  private_key      = var.PRIVATE_KEY_PEM
  certificate_body = var.CERTIFICATE_BODY_PEM
}
