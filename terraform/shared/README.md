Dependent workspace can access shared resources as described here https://developer.hashicorp.com/terraform/language/state/remote-state-data.

One way is using `terraform_remote_state`

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
