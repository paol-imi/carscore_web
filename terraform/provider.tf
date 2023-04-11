provider "aws" {
  region = var.AWS_REGION
  # Since we are using Terraform Cloud, the configuration lives in env variable
  #assume_role {
  #role_arn     = "arn:aws:iam::123456789012:role/ROLE_NAME"
  #session_name = "SESSION_NAME"
  #external_id  = "EXTERNAL_ID"
  #}
}

terraform {

  cloud {
    organization = "cars-org"

    workspaces {
      tags = []
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.15.0"
    }
  }

  required_version = "~> 1.4.3"
}
