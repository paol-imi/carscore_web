locals {
  DOT_PREFIX        = var.RESOURCES_PREFIX != "" ? "${var.RESOURCES_PREFIX}." : ""
  LINE_PREFIX       = var.RESOURCES_PREFIX != "" ? "${var.RESOURCES_PREFIX}-" : ""
  UNDERSCORE_PREFIX = var.RESOURCES_PREFIX != "" ? "${var.RESOURCES_PREFIX}_" : ""
}


locals {
  lambdas = [
    "Handler",
    "HandlerDivide",
  ]
}
