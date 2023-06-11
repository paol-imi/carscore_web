locals {
  api_lambda_code_path = "dist/build.zip"

  java17_layer_path = "resources/java17layer.zip"
}

locals {
  api_endpoints = [
    { method = "GET", path = "/address" },
    { method = "GET", path = "/address/{id}" },
    { method = "POST", path = "/address" },
    { method = "PUT", path = "/address/{id}" },
    { method = "DELETE", path = "/address/{id}" },
  ]
}
