import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { LuGraduationCap } from "react-icons/lu";
import { FaMicrosoft } from "react-icons/fa";


export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiences = [
  {
    company: "Microsoft",
    title: "Azure App Technical Specialist Intern",
    location: "Istanbul, Turkey",
    description:
      "Supported Azure Cloud and Azure AI solutions and collaborated with engineers on real-world deployments and developer events.",
    icon: React.createElement(CgWorkAlt),
    duration: "Dec 2023 - Feb 2025",
  },
  {
    company: "Microsoft",
    title: "Software Engineer Intern",
    location: "Istanbul, Turkey",
    description:
      "Worked on DevOps workflows using CI/CD, Docker, and PostgreSQL for distributed database tooling in the R&D team.",
    icon: React.createElement(FaMicrosoft),
    duration: "Feb 2025 - Jun 2026",
  },
] as const;

export const projects = [
  {
    title: "CI/CD Pipeline Testing",
    description:
      "A project for experimenting with secure CI/CD workflows using GitHub Actions, Azure OIDC authentication, and automated cloud deployment.",
    link: "https://github.com/BarkinKctp/CI-CD-Pipeline-Testing",
    tags: [
      "Python",
      "GitHub Actions",
      "Jenkins",
      "Azure",
      "ARM Templates",
      "Docker",
    ],
    imageUrl: "/projects/CI-CD-test-project.png"
  },
  {
    title: "Terraform AWS IaC",
    description:
      "IaC project deploying and managing a AWS stack (EC2, ALB, RDS, S3) using Terraform with GitHub Actions CI/CD via AWS OIDC.",
    link: "https://github.com/BarkinKctp/Terraform-AWS-IAC",
    tags: [
      "Terraform",
      "AWS",
      "GitHub Actions",
      "IaC",
    ],
    imageUrl: "/projects/Terraform-AWS-IAC.png"
  },
  {
    title: "Kubernetes Lab",
    description:
      "Kubernetes experimentation lab exploring container orchestration, Helm package management and automated deployments with ArgoCD.",
    link: "https://github.com/BarkinKctp/Kubernetes-Lab",
    tags: [
      "Kubernetes",
      "Helm",
      "Docker",
      "Container Orchestration",
      "ArgoCD",
    ],
    imageUrl: "/projects/Kubernetes-Lab.png"
  },
  /*
  {
      
      title: "Project 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      link: "",
      tags: ["React", "TypeScript"],
      imageUrl: "",
  },
  /*/
] as const;

export const skills = [
  "Azure",
  "AWS",
  "GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "GitHub Actions",
  "Jenkins",
  "GitLab",
  "Linux",
  "Python",
  "C#",
  "C++",
  ".NET",
  "Bash",
  "React",
  "PostgreSQL",
  "MongoDB",
  "Azure AI",
] as const;
