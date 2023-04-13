variable "AWS_REGION" {
  type        = string
  description = "AWS region in which deploy the resources."
}

variable "ENV" {
  type        = string
  description = "Define if the deploy for for 'prod' or 'dev'."

  validation {
    condition     = contains(["prod", "dev"], var.ENV)
    error_message = "The ENV variable must be 'prod' or 'dev'."
  }
}
