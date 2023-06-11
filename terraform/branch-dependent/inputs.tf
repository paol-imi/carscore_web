/** TODO:
  * - Replace AWS IAM authentication with OIDC.
  * - Add (Fix) Clouflare authentication.
  */

variable "AWS_REGION" {
  type        = string
  description = "AWS region in which deploy the resources."
  default     = "us-east-1"
}

variable "BRANCH" {
  type        = string
  description = "Branch name."
}

variable "TF_API_TOKEN" {
  type        = string
  description = "Terraform Cloud API token."
}

variable "GOOGLE_CLIENT_ID" {
  type        = string
  description = "Google client id."
}

variable "GOOGLE_CLIENT_SECRET" {
  type        = string
  description = "Google client secret."
}

variable "AZURE_CLIENT_ID" {
  type        = string
  description = "Azure client id."
}

variable "AZURE_CLIENT_SECRET" {
  type        = string
  description = "Azure client secret."
}
