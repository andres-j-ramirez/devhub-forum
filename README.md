# DevHub Forum

**DevHub Forum** is a full‐stack cloud application that showcases modern cloud engineering practices. It demonstrates best practices in containerization, infrastructure as code, continuous integration and deployment, and cloud‑native architecture using AWS services and GitHub Actions.

> **Note:** This repository contains the complete application code and infrastructure configuration.

---

## Table of Contents

1. [Overview](#overview)
2. [Local Development](#local-development)
3. [Production Deployment on AWS](#production-deployment-on-aws)
4. [CI/CD Workflow (GitHub Actions)](#cicd-workflow-github-actions)
5. [Environment Variables](#environment-variables)
6. [Future Improvements](#future-improvements)
7. [License](#license)
8. [Final Note](#final-note)

---

## Overview

**DevHub Forum** is designed as an end‑to‑end demonstration of modern cloud‑native development. The project includes:

- **Frontend:** Built with Vue.js and Tailwind CSS for a dynamic, responsive UI.
- **Backend:** Developed using Node.js and Express to provide RESTful API endpoints for authentication, posts, and comments.
- **Database:** PostgreSQL hosted on AWS RDS.
- **Containerization & Orchestration:** Deployed using Docker containers on AWS ECS Fargate.
- **Load Balancing:** Managed via an Application Load Balancer (ALB) to distribute traffic.
- **CI/CD Pipeline:** Automated builds, tests, and deployments using GitHub Actions.
- **Infrastructure as Code:** All AWS resources are provisioned and managed via Terraform.

Users can register, log in, create posts, and leave comments. The project serves as a robust proof‑of‑concept for cloud‑native practices.

---

## Local Development

To run DevHub Forum locally:

### Clone the Repository

```bash
git clone https://github.com/andres-j-ramirez/devhub-forum.git
cd devhub-forum
Set Up the Backend
bash
Copy
cd backend
npm install
npm start
The backend server will listen on port 5001. A /health endpoint is available for health checks.

Set Up the Frontend
Follow the instructions in the frontend directory to install dependencies and start the development server.

Environment Variables for Local Development
Create a .env file in the backend directory with the following keys (adjust values as needed):

env
Copy
DB_HOST=your_db_host_or_endpoint
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
NODE_TLS_REJECT_UNAUTHORIZED=0
PGSSLMODE=require
Production Deployment on AWS
DevHub Forum is deployed on AWS using Terraform. Key components include:

VPC & Subnets: Public and private subnets are created for isolating resources.
ECS & Fargate: The backend runs as a container in an ECS Fargate service.
RDS PostgreSQL: The database is deployed within a private subnet and secured by a dedicated security group.
ALB: An Application Load Balancer routes external traffic to the ECS service.
Infrastructure as Code: Terraform provisions and manages all AWS resources.
Deployment Process
Initialize Terraform:
bash
Copy
cd terraform
terraform init -upgrade
Apply the Terraform Configuration:
bash
Copy
terraform apply
Review the plan and confirm to provision the AWS resources.

CI/CD Workflow (GitHub Actions)
The CI/CD pipeline is implemented using GitHub Actions. Key steps include:

Checkout Code: The workflow checks out the repository.
Set Up Docker Buildx: Configures Docker Buildx for multi‑platform builds.
Configure AWS Credentials: Uses AWS IAM credentials stored in GitHub Secrets.
Amazon ECR Login: Authenticates with Amazon ECR.
Build, Tag, and Push Docker Image: Builds the Docker image from the backend directory, tags it, and pushes it to ECR.
Deploy ECS Task Definition: Updates the ECS service with the new task definition.
A sample workflow file (.github/workflows/deploy.yml) is included in the repository.

Environment Variables in Production
In production, the following environment variables are set in the ECS task definition (or managed via AWS Secrets Manager):

DB_HOST: The endpoint of your RDS instance (e.g., devhub-db.cjgm8c8gyefy.us-east-2.rds.amazonaws.com)
DB_PORT: Typically 5432
DB_USER: Your database user (e.g., postgres)
DB_PASSWORD: Your database password
DB_NAME: The name of your database (e.g., postgres)
JWT_SECRET: A secret key used for JWT authentication
NODE_TLS_REJECT_UNAUTHORIZED: Set to 0 for development only (ensure proper TLS verification in production)
PGSSLMODE: Typically set to require for secure connections
Future Improvements
Custom Domain & HTTPS: Configure a custom domain using Route 53 and set up an ACM certificate for HTTPS.
Auto Scaling: Implement ECS Service Auto Scaling to handle load variations.
Enhanced Monitoring: Integrate AWS CloudWatch for detailed monitoring and alerting.
Security Enhancements: Migrate secrets to AWS Secrets Manager and tighten IAM policies.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Final Note
DevHub Forum is a comprehensive demonstration of modern cloud‑native development practices. The project leverages Docker and AWS ECS Fargate for containerization and orchestration, Terraform for infrastructure as code, and GitHub Actions for continuous deployment. This repository includes both the application code and the infrastructure configuration, showcasing an end‑to‑end cloud engineering solution.

pgsql
Copy
