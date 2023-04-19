
resource "random_pet" "lambda_bucket_name" {
  prefix = "${local.LINE_PREFIX}cars-lambda-functions"
  length = 4
}

