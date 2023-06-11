/** TODO:
  * - Replace AWS IAM authentication with OIDC.
  * - Add (Fix) Clouflare authentication.
  */

variable "AWS_REGION" {
  type        = string
  description = "AWS region in which deploy the resources."
  default     = "us-east-1"
}

variable "PRIVATE_KEY_PEM" {
  type        = string
  description = "Private key."
}

variable "CERTIFICATE_BODY_PEM" {
  type        = string
  description = "Certificate body."
}

variable "BTC_API_KEY" {
  type        = string
  description = "Certificate chain."
}
