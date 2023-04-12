provider "aws" {
  region = var.AWS_REGION
  # Since we are using Terraform Cloud, the configuration lives in env variable
  access_key = "AKIAXPKXG6F2MFPZW6OF"
  secret_key = "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"
}


terraform {

  cloud {
    organization = "cars-org"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.15.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = "~> 1.4.3"
}
