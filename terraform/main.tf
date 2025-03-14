###############################################################################
# PROVIDER
###############################################################################
provider "aws" {
  region = "us-east-2"
}

###############################################################################
# DATA: Availability Zones
###############################################################################
data "aws_availability_zones" "available" {}

locals {
  public_subnet_keys  = ["public1", "public2"]
  private_subnet_keys = ["private1", "private2"]
}

###############################################################################
# VPC
###############################################################################
resource "aws_vpc" "devhub_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "devhub-vpc"
  }
}

###############################################################################
# PUBLIC SUBNETS (using static keys)
###############################################################################
resource "aws_subnet" "public_subnets" {
  for_each = {
    public1 = "10.0.0.0/24"
    public2 = "10.0.1.0/24"
  }
  vpc_id                  = aws_vpc.devhub_vpc.id
  cidr_block              = each.value
  map_public_ip_on_launch = true

  # Pick AZs using static keys – ensure your AZ list has at least 2 elements
  availability_zone = element(
    data.aws_availability_zones.available.names,
    index(["public1", "public2"], each.key)
  )

  tags = {
    Name = "devhub-${each.key}"
  }
}

###############################################################################
# PRIVATE SUBNETS (using static keys)
###############################################################################
resource "aws_subnet" "private_subnets" {
  for_each = {
    private1 = "10.0.100.0/24"
    private2 = "10.0.101.0/24"
  }
  vpc_id     = aws_vpc.devhub_vpc.id
  cidr_block = each.value

  availability_zone = element(
    data.aws_availability_zones.available.names,
    index(["private1", "private2"], each.key)
  )

  tags = {
    Name = "devhub-${each.key}"
  }
}

###############################################################################
# INTERNET GATEWAY + NAT GATEWAY
###############################################################################
resource "aws_internet_gateway" "devhub_igw" {
  vpc_id = aws_vpc.devhub_vpc.id

  tags = {
    Name = "devhub-igw"
  }
}

resource "aws_eip" "nat_eip" {
  # Use "domain" instead of the deprecated "vpc" argument
  domain = "vpc"
  tags = {
    Name = "devhub-nat-eip"
  }
}

resource "aws_nat_gateway" "devhub_nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_subnets["public1"].id

  tags = {
    Name = "devhub-nat"
  }
}

###############################################################################
# ROUTE TABLES + ASSOCIATIONS
###############################################################################
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.devhub_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.devhub_igw.id
  }

  tags = {
    Name = "devhub-public-rt"
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  for_each = { for key in local.public_subnet_keys : key => key }
  subnet_id      = aws_subnet.public_subnets[each.value].id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.devhub_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.devhub_nat.id
  }

  tags = {
    Name = "devhub-private-rt"
  }
}

resource "aws_route_table_association" "private_rt_assoc" {
  for_each = { for key in local.private_subnet_keys : key => key }
  subnet_id      = aws_subnet.private_subnets[each.value].id
  route_table_id = aws_route_table.private_rt.id
}

###############################################################################
# ECS CLUSTER + ECR REPOSITORY
###############################################################################
resource "aws_ecs_cluster" "devhub_cluster" {
  name = "DevHubCluster"
}

resource "aws_ecr_repository" "devhub_repository" {
  name = "devhub-backend"
  force_delete = true

  lifecycle {
    ignore_changes = [repository_url]
  }
}

###############################################################################
# RDS: DB SUBNET GROUP, SECURITY GROUP, INSTANCE
###############################################################################
resource "aws_db_subnet_group" "devhub_db_subnet" {
  name       = "devhub-db-subnet-group"
  subnet_ids = [for key in local.private_subnet_keys : aws_subnet.private_subnets[key].id]

  tags = {
    Name = "devhub-db-subnet"
  }
}

resource "aws_security_group" "devhub_db_sg" {
  name        = "devhub-db-sg"
  description = "Security group for DevHub RDS instance"
  vpc_id      = aws_vpc.devhub_vpc.id

  ingress {
    description = "Allow Postgres from within VPC"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.devhub_vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "devhub_db" {
  identifier           = "devhub-db"
  engine               = "postgres"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  username             = "postgres"
  password             = "R1VcDzZoTm1JPPCVPXCh"  # Replace with your actual password
  db_subnet_group_name = aws_db_subnet_group.devhub_db_subnet.name
  vpc_security_group_ids = [aws_security_group.devhub_db_sg.id]
  skip_final_snapshot  = true
  publicly_accessible  = false

  tags = {
    Name = "devhub-db"
  }
}

###############################################################################
# APPLICATION LOAD BALANCER + TARGET GROUP + LISTENER
###############################################################################
resource "aws_security_group" "devhub_alb_sg" {
  name        = "devhub-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.devhub_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "devhub_alb" {
  name               = "devhub-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.devhub_alb_sg.id]
  subnets            = [for key in local.public_subnet_keys : aws_subnet.public_subnets[key].id]

  tags = {
    Name = "devhub-alb"
  }
}

resource "aws_lb_target_group" "devhub_tg" {
  name     = "devhub-tg"
  port     = 5001
  protocol = "HTTP"
  vpc_id   = aws_vpc.devhub_vpc.id

  # For Fargate with awsvpc, use target_type "ip"
  target_type = "ip"

  health_check {
    path                = "/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "devhub_listener" {
  load_balancer_arn = aws_lb.devhub_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.devhub_tg.arn
  }
}

###############################################################################
# IAM: ECS TASK EXECUTION ROLE
###############################################################################
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

###############################################################################
# ECS TASK DEFINITION + SERVICE
###############################################################################
resource "aws_ecs_task_definition" "devhub_task" {
  family                   = "DevHubTask"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "devhub-backend",
      image = "${aws_ecr_repository.devhub_repository.repository_url}:latest",
      cpu   = 0,
      portMappings = [
        {
          containerPort = 5001,
          hostPort      = 5001,
          protocol      = "tcp"
        }
      ],
      essential = true,
      environment = [
        { name = "DB_PORT", value = "5432" },
        { name = "JWT_SECRET", value = "hellomoto" },
        { name = "DB_USER", value = "postgres" },
        { name = "PGSSLMODE", value = "require" },
        { name = "NODE_TLS_REJECT_UNAUTHORIZED", value = "0" },
        { name = "DB_NAME", value = "postgres" },
        { name = "DB_HOST", value = "devhub-db.cjgm8c8gyefy.us-east-2.rds.amazonaws.com" },
        { name = "DB_PASSWORD", value = "R1VcDzZoTm1JPPCVPXCh" }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = "/ecs/DevHubTask",
          "awslogs-region"        = "us-east-2",
          "awslogs-stream-prefix" = "ecs"
        }
      },
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:5001/health || exit 1"],
        interval    = 30,
        timeout     = 5,
        retries     = 3,
        startPeriod = 30
      }
    }
  ])
}

resource "aws_ecs_service" "devhub_service" {
  name            = "devhub-backend-service"
  cluster         = aws_ecs_cluster.devhub_cluster.id
  task_definition = aws_ecs_task_definition.devhub_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [for key in local.public_subnet_keys : aws_subnet.public_subnets[key].id]
    security_groups = [aws_security_group.devhub_alb_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.devhub_tg.arn
    container_name   = "devhub-backend"
    container_port   = 5001
  }

  depends_on = [aws_lb_listener.devhub_listener]
}
