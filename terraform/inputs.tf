variable "AWS_REGION" {
  type = string
}

variable "WORKSPACE_PREFIX" {
  type = string
}

variable "ENV" {
  type           = string
  allowed_values = ["prod", "dev"]
}
