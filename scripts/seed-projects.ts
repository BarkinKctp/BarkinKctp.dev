// Run with: npx tsx scripts/seed-projects.ts
// Make sure MONGODB_URI is set in .env

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

const projects = [
  {
    title: "Azure-AppService-Pipelines",
    description:
      "CI/CD pipeline project using GitHub Actions, GitHub App, Jenkins, Azure OIDC, and Docker for secure deployments to Azure App Service.",
    link: "https://github.com/BarkinKctp/CI-CD-Pipeline-Testing",
    tags: ["Python", "GitHub Actions", "Jenkins", "Azure", "ARM Templates", "Docker"],
    imageUrl: "/projects/CI-CD-test-project.png",
  },
  {
    title: "Terraform AWS IaC",
    description:
      "IaC project deploying and managing a AWS stack (EC2, ALB, RDS, S3) using Terraform with GitHub Actions CI/CD via AWS OIDC.",
    link: "https://github.com/BarkinKctp/Terraform-AWS-IAC",
    tags: ["Terraform", "AWS", "GitHub Actions", "IaC"],
    imageUrl: "/projects/Terraform-AWS-IAC.png",
  },
  {
    title: "Kubernetes Lab",
    description:
      "Kubernetes experimentation lab exploring container orchestration, Helm package management and automated deployments with ArgoCD.",
    link: "https://github.com/BarkinKctp/Kubernetes-Lab",
    tags: ["Kubernetes", "Helm", "Docker", "Container Orchestration", "ArgoCD"],
    imageUrl: "/projects/Kubernetes-Lab.png",
  },
  {
    title: "Ansible Infra Automation",
    description:
      "Infrastructure automation with Ansible, covering configuration management, playbook-driven provisioning, and repeatable environment setup across multiple hosts.",
    link: "https://github.com/BarkinKctp/Ansible-Infra-Automation",
    tags: ["Ansible", "Infrastructure as Code", "Configuration Management", "DevOps", "Automation"],
    imageUrl: "/projects/Ansible-Infra-Automation.png",
  },
];

async function seed() {
  const client = new MongoClient(uri!);
  try {
    await client.connect();
    const db = client.db("portfolio");
    const collection = db.collection("projects");

    // Clear existing projects
    await collection.deleteMany({});

    // Insert seed data
    const result = await collection.insertMany(projects);
    console.log(`Seeded ${result.insertedCount} projects successfully!`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
