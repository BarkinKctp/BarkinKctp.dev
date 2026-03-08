import React from "react";




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
        name: "Skills",
        hash: "#skills",
    },
    {
        name: "Experience",
        hash: "#experience",
    },
    {
        name: "Contact",
        hash: "#contact",
    },
] as const;

export const experiences = [
    {
        company: "Microsoft",
        title: "Azure App Technical Specialist  Intern",
        location: "Istanbul, Turkey",
        description: "As an Azure App Technical Specialist Intern at Microsoft, I proviided \
        techical support etc",
        icon: "",
        duration: "2024 - 2025.02",
    },
    {
        company: "Microsoft",
        title: "Software Engineer Intern",
        location: "Istanbul, Turkey",
        description: "As a Software Engineer Intern at Microsoft, I developed a tool to automate the \
        process etc",
        icon: "",
        duration: "2025.02 - 2026.06",
    },
] as const;

export const projects = [
    {
        name: "Project 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link: "",
        tags: ["Next.js", "Tailwind CSS"],
        imageUrl: "",
    },
    {
        name: "Project 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link: "",
        tags: ["React", "TypeScript"],
        imageUrl: "",
    },
] as const;

export const skills = [
    "Azure",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Python",
    "PostgreSQL",
    "AWS",
    "GCP",
    "Linux",
    "Git",
    "CI/CD",
    "Cloud Computing",
    "Distributed Systems",
    "DevOps",
    "Javascript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",

] as const;
