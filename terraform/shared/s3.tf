resource "aws_s3_bucket" "lambda_code_bucket" {
  bucket = "cars-lambda-code-bucket-${random_string.random.result}"

  tags = {
    Name = "lambda-code-bucket"
  }
}

resource "aws_s3_bucket_ownership_controls" "s3_ownership" {
  bucket = aws_s3_bucket.lambda_code_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_code_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.s3_ownership]
  bucket     = aws_s3_bucket.lambda_code_bucket.id
  acl        = "private"
}
