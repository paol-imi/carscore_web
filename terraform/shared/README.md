Dependent workspace can access shared resources as described here https://developer.hashicorp.com/terraform/language/state/remote-state-data.

One way is using `tfe_outputs`

```tf
terraform {
  required_providers {
    tfe = {
      version = "~> 0.43.0"
    }
  }
}

provider "tfe" {
  hostname = var.hostname # Optional, defaults to Terraform Cloud `app.terraform.io`
  token    = var.token
  version  = "~> 0.43.0"
}

data "tfe_outputs" "foo" {
  organization = "my-org"
  workspace = "my-workspace"
}

resource "random_id" "vpc_id" {
  keepers = {
    # Generate a new ID any time the value of 'bar' in workspace 'my-org/my-workspace' changes.
    bar = data.tfe_outputs.foo.values.bar
  }

  byte_length = 8
}

```

or `terraform_remote_state`

```tf

data "terraform_remote_state" "shared" {
  backend = "remote"
  config = {
    organization = "my-org"
    workspaces = {
      name = shared_workspace_name
    }
  }
}

resource "aws_instance" "web" {
  ami           = "ami-0c94855ba95c71c99"
  instance_type = "t2.micro"
  subnet_id     = data.terraform_remote_state.shared.outputs.subnet_id
}

```
