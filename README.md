# DevHub Forum

**DevHub Forum** is a full‐stack cloud application that showcases modern cloud engineering practices. It demonstrates best practices in containerization, infrastructure as code, continuous integration and deployment, and cloud-native architecture using AWS services and GitHub Actions.

> **Live Demo**: [http://devhub-alb-XXXX.us-east-2.elb.amazonaws.com](http://devhub-alb-XXXX.us-east-2.elb.amazonaws.com)  
> *(Users can register, create posts, and leave comments.)*

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Local Development](#local-development)
4. [Production Deployment on AWS](#production-deployment-on-aws)
5. [CI/CD Workflow (GitHub Actions)](#cicd-workflow-github-actions)
6. [Environment Variables](#environment-variables)
7. [Future Improvements](#future-improvements)
8. [Screenshots](#screenshots)
9. [License](#license)

---

## Overview

**DevHub Forum** is designed to serve as a proof-of-concept for modern cloud-native development. It includes:

- **Frontend**: Developed with Vue.js and Tailwind CSS for a dynamic, responsive UI.
- **Backend**: Built with Node.js and Express, providing RESTful API endpoints for authentication, posts, and comments.
- **Database**: Uses PostgreSQL on AWS RDS for production data storage.
- **Containerization & Orchestration**: Deployed via AWS ECS Fargate with Docker images stored in Amazon ECR.
- **Load Balancing**: Managed by an Application Load Balancer (ALB) to distribute traffic.
- **CI/CD Pipeline**: Automated builds, tests, and deployments using GitHub Actions.
- **Infrastructure as Code**: Managed with Terraform to ensure reproducible and version-controlled deployments.

Users can **register**, **log in**, **create posts**, and **comment**. The project serves as an end-to-end demonstration of cloud engineering practices.

---

## Architecture

The architecture is composed of several AWS services:

- **GitHub Actions** build and push Docker images to **Amazon ECR**.
- **AWS ECS Fargate** runs the containerized backend service.
- An **Application Load Balancer (ALB)** routes user requests to the ECS service.
- **Amazon RDS** hosts a PostgreSQL database in a private subnet.
- **Terraform** manages the entire infrastructure as code.

Below is a simplified diagram of the architecture:

```mermaid
flowchart LR
    A[Developer Pushes Code]
    B[GitHub Actions CI/CD Pipeline]
    C[Amazon ECR: Docker Images]
    D[AWS ECS Fargate: Backend Service]
    E[Application Load Balancer]
    F[Amazon RDS: PostgreSQL Database]

    A --> B
    B --> C
    C --> D
    D -->|Container Traffic| E
    E -->|Routes HTTP Requests| D
    D --> F
