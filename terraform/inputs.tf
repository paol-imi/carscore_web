variable "AWS_REGION" {
  type        = string
  description = "AWS region in which deploy the resources."
  default     = "us-east-1"
}

variable "RESOURCES_PREFIX" {
  type        = string
  description = "Branch name."
}

variable "AWS_ACCESS_KEY_ID" {
  type        = string
  description = "AWS access key id."
}

variable "AWS_SECRET_ACCESS_KEY" {
  type        = string
  description = "AWS secret access key."
}

# variable "AWS_ROLE_ARN" {
#   type = string
# }
