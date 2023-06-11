data "aws_availability_zones" "available" {}

locals {
  lambda_availability_zones = [
    data.aws_availability_zones.available.names[0],
    // data.aws_availability_zones.available.names[1],
  ]

  rds_availability_zones = [
    data.aws_availability_zones.available.names[0],
    data.aws_availability_zones.available.names[1],
  ]
}

locals {
  script_lambda_code_path = "dist/package.zip"

  model_configurations_paths = ["dist/XGBOOST_full.joblib", "dist/LogReg_full.joblib", "dist/scaler_full.joblib"]
}
