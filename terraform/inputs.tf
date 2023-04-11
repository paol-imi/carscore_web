variable "AWS_REGION" {
  type        = string
  description = "AWS region in which deploy the service."
}

variable "WORKSPACE_PREFIX" {
  type        = string
  description = "Prefix of the workspaces."
}

variable "ENV" {
  type        = string
  description = "Define if the deploy for for 'prod' or 'dev'."

  validation {
    condition     = contains(["prod", "dev"], var.ENV)
    error_message = "The ENV variable must be 'prod' or 'dev'."
  }
}
