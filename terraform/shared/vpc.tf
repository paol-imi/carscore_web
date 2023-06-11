/** TODO:
 * - Remove the route tables and make the subnets private, the use a NAT gateway 
 *   to allow lambda to access the internet.
 * - Define the ACLs for the subnets.
 * - Remove dns supoort from the VPC.
 */

resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"

  enable_dns_hostnames = true

  tags = {
    Name = "vpc-shared"
  }
}

resource "aws_subnet" "compute_subnet" {
  count = length(local.lambda_availability_zones)

  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = local.lambda_availability_zones[count.index]

  tags = {
    Name = "compute-subnet-${local.lambda_availability_zones[count.index]}"
    AZ   = "${local.lambda_availability_zones[count.index]}"
  }
}

resource "aws_subnet" "database_subnet" {
  count = length(local.rds_availability_zones)

  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.${count.index + 3}.0/24"
  availability_zone = local.rds_availability_zones[count.index]

  tags = {
    Name = "database_subnet-${local.rds_availability_zones[count.index]}"
    AZ   = "${local.rds_availability_zones[count.index]}"
  }
}

resource "aws_subnet" "public_subnet" {
  count = length(local.lambda_availability_zones)

  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "10.0.${count.index + 5}.0/24"
  availability_zone = local.lambda_availability_zones[count.index]

  tags = {
    Name = "public-subnet-${local.lambda_availability_zones[count.index]}"
    AZ   = "${local.lambda_availability_zones[count.index]}"
  }
}


resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "internet-gateway"
  }
}

resource "aws_nat_gateway" "nat_gateway" {
  count = length(local.lambda_availability_zones)

  allocation_id = aws_eip.nat_eip[count.index].id
  subnet_id     = aws_subnet.public_subnet[count.index].id

  depends_on = [aws_internet_gateway.internet_gateway]

  tags = {
    Name = "nat-gateway-${local.lambda_availability_zones[count.index]}"
  }
}

resource "aws_eip" "nat_eip" {
  count = length(local.lambda_availability_zones)
  vpc   = true

  tags = {
    Name = "nat-eip-${local.lambda_availability_zones[count.index]}"
  }
}


resource "aws_route_table" "compute_subnet_rtb" {
  count  = length(local.lambda_availability_zones)
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway[count.index].id
  }

  tags = {
    Name = "compute-subnet-rtb"
  }
}

resource "aws_route_table_association" "compute_subnet_rtb_association" {
  count          = length(aws_subnet.compute_subnet)
  subnet_id      = aws_subnet.compute_subnet[count.index].id
  route_table_id = aws_route_table.compute_subnet_rtb[count.index].id
}

resource "aws_route_table" "database_subnet_rtb" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "database-subnet-rtb"
  }
}

resource "aws_route_table_association" "database_subnet_rtb_association" {
  count          = length(aws_subnet.database_subnet)
  subnet_id      = aws_subnet.database_subnet[count.index].id
  route_table_id = aws_route_table.database_subnet_rtb.id
}

resource "aws_route_table" "public_subnet_rtb" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "public-subnet-rtb"
  }
}

resource "aws_route_table_association" "public_subnet_rtb_association" {
  count          = length(aws_subnet.public_subnet)
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_subnet_rtb.id
}

/*
resource "aws_network_acl" "compute_subnet-acl" {
  vpc_id     = aws_vpc.vpc.id
  subnet_ids = aws_subnet.compute_subnet.*.id

  ingress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = aws_vpc.vpc.cidr_block
    from_port  = 443
    to_port    = 443
  }

  egress {
    protocol   = "tcp"
    rule_no    = 100
    action     = "allow"
    cidr_block = aws_vpc.vpc.cidr_block
    from_port  = 1024
    to_port    = 65535
  }

  // Allow traffic from 

  tags = {
    Name = "compute_subnet-acl"
  }
}
*/
