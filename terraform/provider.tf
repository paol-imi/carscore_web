provider "aws" {
  region     = var.AWS_REGION
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
  # Since we are using Terraform Cloud, the configuration lives in env variable
}

terraform {

  backend "cloud" {
    organization = "cars-org-2"
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

  required_version = "~> 1.4.4"
}
