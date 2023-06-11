/** TODO: 
  * - Group togheter information of the same resource
  *   output "rds_info" {
  *     description = "ARN of the credential secrets."
  *     value       = {
  *       rds_proxy_sg_id = aws_security_group.rds_proxy_sg.id
  *       rds_proxy_arn   = aws_rds_cluster_proxy.rds_proxy.arn
  *       rds_cluster_arn = aws_rds_cluster.rds_cluster.arn
  *     }
  *    sensitive   = true
  *   }
  */

output "vpc_id" {
  description = "ID of the VPC."
  value       = aws_vpc.vpc.id
  sensitive   = true
}

output "lambda_code_bucket_id" {
  description = "Name of the S3 bucket where the Lambda code is stored."
  value       = aws_s3_bucket.lambda_code_bucket.id
  sensitive   = true
}

output "compute_subnet_ids" {
  description = "Subnet IDs for the compute subnet."
  value       = aws_subnet.compute_subnet.*.id
  sensitive   = true
}

output "apigateway_domain_name_id" {
  description = "ID of the API Gateway domain name."
  value       = aws_apigatewayv2_domain_name.apigatewayv2_domain_name.id
  sensitive   = true
}

output "rds_proxy_sg_id" {
  description = "ID of the RDS proxy security group."
  value       = aws_security_group.rds_proxy_sg.id
  sensitive   = true
}

output "rds_proxy_endpoint" {
  description = "Endpoint of the RDS proxy."
  value       = aws_db_proxy.rds_proxy.endpoint
  sensitive   = true
}

output "rds_username" {
  description = "Username of the RDS database."
  value       = aws_db_instance.rds_instance.username
  sensitive   = true
}

output "rds_password" {
  description = "Password of the RDS database."
  value       = aws_db_instance.rds_instance.password
  sensitive   = true
}

output "lambda_to_rds_proxy_sg_id" {
  description = "ID of the Lambda to RDS security group."
  value       = aws_security_group.lambda_to_rds_proxy_sg.id
  sensitive   = true
}
