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
    "CI/CD",
    "Azure",
    "ARM Templates",
    "Docker",
],
  imageUrl: "/CI-CD-test-project.png"
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
  "Python",
  "C#",
  ".NET",
  "Bash",
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "PostgreSQL",
  "Git",
  "Linux",
  "GitHub Actions",
  "CI/CD",
  "Azure AI",
] as const;
