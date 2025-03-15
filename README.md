# DevHub Forum

**DevHub Forum** is a full‑stack cloud application that showcases modern cloud engineering practices. It demonstrates best practices in containerization, infrastructure as code, continuous integration and deployment, and cloud‑native architecture using AWS services and GitHub Actions.

> **Note:** This repository contains the complete application code and infrastructure configuration, and includes detailed documentation and case study materials.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Local Development](#local-development)
4. [Production Deployment on AWS](#production-deployment-on-aws)
5. [CI/CD Workflow (GitHub Actions)](#cicd-workflow-github-actions)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting & Optimization](#troubleshooting--optimization)
8. [Future Improvements](#future-improvements)
9. [License](#license)
10. [Final Note](#final-note)

---

## Overview

**DevHub Forum** is designed as an end‑to‑end demonstration of modern cloud‑native development. The project includes:

- **Frontend:** Built with Vue.js and Tailwind CSS for a dynamic, responsive UI.
- **Backend:** Developed using Node.js and Express to provide RESTful API endpoints for authentication, posts, and comments.
- **Database:** PostgreSQL hosted on AWS RDS for production‑grade data management.
- **Containerization & Orchestration:** Deployed using Docker containers on AWS ECS Fargate.
- **Load Balancing:** Managed via an Application Load Balancer (ALB) to distribute traffic.
- **CI/CD Pipeline:** Automated builds, tests, and deployments using GitHub Actions and AWS CodePipeline/CodeDeploy.
- **Infrastructure as Code:** All AWS resources are provisioned and managed via Terraform.
- **Security & Monitoring:** Implements security best practices (IAM roles with least privilege, encryption with KMS, secure VPC configuration) and utilizes custom CloudWatch dashboards for real‑time monitoring.

Users can register, log in, create posts, and leave comments. The project serves as a robust proof‑of‑concept for cloud‑native practices and as a case study for modern cloud engineering.

---

## Architecture Diagram

For a visual overview of the AWS infrastructure:
- **Diagram:** ![Architecture Diagram](./architecture-diagram.png)  
  *The diagram illustrates the VPC setup, ECS Fargate deployment, ALB routing, RDS PostgreSQL database, S3/CloudFront for static assets, and CI/CD pipeline integration.*

---

## Local Development

To run DevHub Forum locally:

### Clone the Repository

git clone https://github.com/andres-j-ramirez/devhub-forum.git
cd devhub-forumß
Set Up the Backend
bash
Copy
cd backend
npm install
npm start
The backend server will listen on port 5001. A /health endpoint is available for health checks.

---

 ## Environment Variables for Local Development
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

--- 

 ## Production Deployment on AWS
DevHub Forum is deployed on AWS using Terraform. Key components include:

VPC & Subnets: Creation of a secure VPC with public subnets (for the ALB) and private subnets (for ECS tasks and RDS). NAT gateways and an Internet Gateway are configured for proper routing.
ECS & Fargate: The backend runs as a container in an ECS Fargate service. The service is behind an Application Load Balancer (ALB) with health checks.
RDS PostgreSQL: The production database is deployed in a private subnet and secured by a dedicated security group. Encryption is enabled using AWS KMS.
S3 & CloudFront: The Vue.js application is hosted on an S3 bucket and served via CloudFront for low latency and global distribution.
Security & Monitoring:
Security: IAM roles are set with least privilege; security groups, VPC isolation, and encryption (KMS for both RDS and S3) are enforced.
Monitoring: Custom CloudWatch dashboards are configured to monitor ECS, ALB, and RDS metrics, with alerts set for critical thresholds.
Deployment Process
Initialize Terraform:

bash:
Copy
cd terraform
terraform init -upgrade
Apply the Terraform Configuration:

bash:
Copy
terraform apply -var-file="env/dev.tfvars"
Review the plan and confirm to provision the AWS resources.

---

 ## CI/CD Workflow (GitHub Actions)
The CI/CD pipeline is implemented using GitHub Actions. Key steps include:

Checkout Code: The workflow checks out the repository.
Set Up Docker Buildx: Configures Docker Buildx for multi‑platform builds.
Configure AWS Credentials: Uses AWS IAM credentials stored in GitHub Secrets.
Amazon ECR Login: Authenticates with Amazon ECR.
Build, Tag, and Push Docker Image: Builds the Docker image from the backend directory, tags it, and pushes it to ECR.
Deploy ECS Task Definition: Updates the ECS service with the new task definition.
A sample workflow file (.github/workflows/deploy.yml) is included in the repository.

Environment Variables in Production
In production, environment variables are set in the ECS task definition or managed via AWS Secrets Manager:

env
Copy
DB_HOST=devhub-db.cjgm8c8gyefy.us-east-2.rds.amazonaws.com
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_production_password
DB_NAME=postgres
JWT_SECRET=your_production_jwt_secret
NODE_TLS_REJECT_UNAUTHORIZED=0  # Ensure proper TLS verification in production
PGSSLMODE=require

---

 ## Troubleshooting & Optimization

Large File Handling:
Resolved issues with large Terraform provider files by using BFG Repo-Cleaner and Git Large File Storage (LFS).
Networking & DNS:
Debugged and resolved networking issues, including DNS resolution for the ALB and RDS connectivity challenges.
Health Checks & Security Group Issues:
Implemented container health checks and resolved target type mismatches, ensuring ECS and ALB configurations are robust.
General Optimization:
Fine-tuned Terraform scripts to manage resource dependencies and state file size.

--- 

 ## Future Improvements

Custom Domain & HTTPS:
Configure a custom domain using Route 53 and set up an ACM certificate for HTTPS.
Auto Scaling:
Implement ECS Service Auto Scaling to handle load variations dynamically.
Enhanced Monitoring:
Further integrate AWS CloudWatch and potentially third‑party monitoring tools for detailed performance tracking.
Security Enhancements:
Migrate secrets to AWS Secrets Manager, tighten IAM policies, and consider additional encryption measures.
Multi-Cloud Deployment:
Explore deploying parts of the application to additional cloud providers (e.g., Azure or GCP) for multi-cloud experience.

---

 ## License
This project is licensed under the MIT License.

 ## Final Note
DevHub Forum is a comprehensive demonstration of modern cloud‑native development practices. The project leverages Docker and AWS ECS Fargate for containerization and orchestration, Terraform for Infrastructure as Code, and GitHub Actions for continuous deployment. This repository includes both the application code and the infrastructure configuration, serving as a case study for end‑to‑end cloud engineering solutions.

For more details, please refer to the accompanying case study and blog post published on my website.