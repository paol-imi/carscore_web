provider "aws" {
  region = var.AWS_REGION
  # Since we are using Terraform Cloud, the configuration lives in env variable
  #assume_role {
  #role_arn = "arn:aws:iam::513968370036:role/TerraformCloudRole"
  #   session_name = "SESSION_NAME"
  #   external_id  = "EXTERNAL_ID"
  #}
}

terraform {

  cloud {
    organization = "cars-org"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.62.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5.1"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.3.0"
    }
  }

  required_version = "~> 1.4.5"
}
