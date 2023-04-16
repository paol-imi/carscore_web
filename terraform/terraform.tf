provider "aws" {
  region = var.AWS_REGION

  # FIXME: Terraform has problems in athenticating with OIDC in AWS
  # issue: https://github.com/hashicorp/terraform-provider-aws/issues/23110
  # For now we use the access key and secret key
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
  # assume_role {
  #  role_arn = var.AWS_ROLE_ARN
  # }
}

provider "cloudflare" {
  api_token = var.CLOUDFLARE_API_TOKEN
}

terraform {

  cloud {
    organization = "cars-organization"
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

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }

  required_version = "~> 1.4.4"
}
