/** TODO:
  * - Remove publicly accesible attribute from the RDS instance.
  * - Manage secrets with AWS Secrets Manager, and pass the secret manager 
  *   secrets to aws lambda as env variables.
  * - Create a custom endpoint for api lambda.
  */

resource "random_password" "password" {
  length           = 18
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "cars-rds-subnet-group"
  subnet_ids = aws_subnet.database_subnet.*.id

  tags = {
    Name = "rds-subnet-group"
  }
}

resource "aws_db_instance" "rds_instance" {
  allocated_storage       = 100
  max_allocated_storage   = 1000
  engine                  = "mysql"
  engine_version          = "8.0.28"
  instance_class          = "db.t3.micro"
  db_name                 = "carsdb"
  username                = "admin"
  password                = random_password.password.result
  db_subnet_group_name    = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]
  multi_az                = false
  publicly_accessible     = true
  backup_retention_period = 7
  backup_window           = "00:00-00:30"
  deletion_protection     = true

  tags = {
    Name = "rds-instance"
  }
}

resource "aws_db_proxy" "rds_proxy" {
  name                   = "cars-rds-proxy"
  debug_logging          = false
  engine_family          = "MYSQL"
  idle_client_timeout    = 1800
  require_tls            = false
  role_arn               = aws_iam_role.rds_proxy_role.arn
  vpc_security_group_ids = [aws_security_group.rds_proxy_sg.id]
  vpc_subnet_ids         = aws_subnet.database_subnet.*.id

  auth {
    auth_scheme               = "SECRETS"
    description               = "data proxy auth"
    iam_auth                  = "DISABLED"
    secret_arn                = aws_secretsmanager_secret.db.arn
    client_password_auth_type = "MYSQL_NATIVE_PASSWORD"
  }

  tags = {
    Name = "rds-data-proxy"
  }
}

resource "aws_db_proxy_default_target_group" "default" {
  db_proxy_name = aws_db_proxy.rds_proxy.name

  connection_pool_config {
    max_connections_percent = 100
  }
}

resource "aws_db_proxy_target" "target" {
  db_instance_identifier = aws_db_instance.rds_instance.id
  db_proxy_name          = aws_db_proxy.rds_proxy.name
  target_group_name      = aws_db_proxy_default_target_group.default.name
}

/* 
resource "aws_db_proxy_endpoint" "api_endpoint" {
  db_proxy_endpoint_name = "api-endpoint"
  db_proxy_name          = aws_db_proxy.rds_proxy.name
  vpc_subnet_ids         = aws_subnet.database_subnet.*.id
  target_role            = "READ_WRITE"
  vpc_security_group_ids = [aws_security_group.rds_proxy_api_endpoint_sg.id]
}
*/

resource "aws_security_group" "rds_sg" {
  name   = "cars-rds-sg"
  vpc_id = aws_vpc.vpc.id
}

resource "aws_security_group_rule" "rds_from_rds_proxy_sg" {
  security_group_id = aws_security_group.rds_sg.id
  description       = "Allow RDS instance to connect to RDS proxy"

  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.rds_proxy_sg.id
}

resource "aws_security_group" "rds_proxy_sg" {
  name   = "cars-rds-proxy-sg"
  vpc_id = aws_vpc.vpc.id
}


resource "aws_security_group_rule" "rds_proxy_to_rds_sg" {
  security_group_id = aws_security_group.rds_proxy_sg.id
  description       = "Allow RDS proxy to connect to RDS instance"

  type                     = "egress"
  from_port                = 0
  to_port                  = 65535
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.rds_sg.id
}

resource "aws_security_group_rule" "rds_proxy_from_lambda_sg" {
  security_group_id = aws_security_group.rds_proxy_sg.id
  description       = "Allow RDS proxy to connect to lambda"

  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.lambda_to_rds_proxy_sg.id
}

resource "aws_kms_key" "secrets" {
  description = "Secrets encryption key"
}

resource "aws_secretsmanager_secret" "db" {
  name       = "cars-rds-credential-secret"
  kms_key_id = aws_kms_key.secrets.arn
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    username = aws_db_instance.rds_instance.username
    password = aws_db_instance.rds_instance.password
  })
}

resource "aws_iam_role" "rds_proxy_role" {
  name = "cars-rds-proxy-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "rds.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "rds_proxy_policy_attachment" {
  policy_arn = aws_iam_policy.rds_proxy_policy.arn
  role       = aws_iam_role.rds_proxy_role.name
}

resource "aws_iam_policy" "rds_proxy_policy" {
  name = "cars-rds-proxy-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "GetSecretValue",
        Action   = ["secretsmanager:GetSecretValue"]
        Effect   = "Allow"
        Resource = [aws_secretsmanager_secret.db.arn]
      },
      {
        Sid      = "DecryptSecretValue",
        Action   = ["kms:Decrypt"],
        Effect   = "Allow",
        Resource = [aws_kms_key.secrets.arn],
      }
    ]
  })
}
