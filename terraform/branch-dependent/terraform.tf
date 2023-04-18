provider "aws" {
  region = var.AWS_REGION

  # FIXME: Terraform has problems in athenticating with OIDC in AWS
  # issue: https://github.com/hashicorp/terraform-provider-aws/issues/23110
  # For now we use access and secret keys
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
  # assume_role {
  #  role_arn = var.AWS_ROLE_ARN
  # }
}

#  provider "cloudflare" {
#   # FIXME: Terraform has problems in athenticating with CLOUDFLARE
#   # For now we use email and acces key
#   # api_token = var.CLOUDFLARE_API_TOKEN
#   email   = var.CLOUDFLARE_EMAIL
#   api_key = var.CLOUDFLARE_API_KEY
# }

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

    #    cloudflare = {
    #      source  = "cloudflare/cloudflare"
    #      version = "~> 3.0"
    #    }
  }

  required_version = "~> 1.4.4"
}
