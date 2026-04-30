// Run with: npx tsx scripts/seed.ts
// Make sure MONGODB_URI is set in .env

import "dotenv/config";
import { MongoClient } from "mongodb";

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

const experiences = [
  {
    company: "Microsoft",
    title: "Azure App Technical Specialist Intern",
    location: "Istanbul, Turkey",
    description:
      "Supported Azure Cloud and Azure AI solutions and collaborated with engineers on real-world deployments and developer events.",
    duration: "Dec 2023 - Feb 2025",
  },
  {
    company: "Microsoft",
    title: "Software Engineer Intern",
    location: "Istanbul, Turkey",
    description:
      "Worked on DevOps workflows using CI/CD, Docker, and PostgreSQL for distributed database tooling in the R&D team.",
    duration: "Feb 2025 - Jun 2026",
  },
];

const skills = [
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
];

const places = [
  {
    name: "Istanbul, Turkey",
    image: "/photos/photo/Istanbul.jpg",
    description: "Home city — where it all started.",
    order: 0,
  },
  {
    name: "Rome, Italy",
    image: "/photos/photo/rome-colesseum.jpg",
    description: "The Eternal City — history at every corner.",
    order: 1,
  },
];

const books = [
  {
    title: "The Iliad",
    author: "Homer",
    image: "https://covers.openlibrary.org/b/olid/OL46720993M-L.jpg",
    order: 0,
  },
  {
    title: "Odyssey",
    author: "Homer",
    image: "https://covers.openlibrary.org/b/olid/OL45670101M-L.jpg",
    order: 1,
  },
];

const music = [
  {
    title: "Far From Any Road",
    artist: "The Handsome Family",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0243bf72818b91c6803029dbbe",
    spotifyUrl: "https://open.spotify.com/embed/track/3LDkLpuxQlEuEiZmkxpr8S?",
    order: 0,
  },
  {
    title: "Every Breath You Take",
    artist: "The Police",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c8e97cafeb2acb85b21a777e",
    spotifyUrl: "https://open.spotify.com/embed/track/1JSTJqkT5qHq8MDJnJbRE1?",
    order: 1,
  },
];

async function seed() {
  const client = new MongoClient(uri!);
  try {
    await client.connect();
    const db = client.db("portfolio");

    // Seed projects
    const projCollection = db.collection("projects");
    const projCount = await projCollection.countDocuments();
    if (projCount === 0) {
      await projCollection.insertMany(projects);
      console.log(`Inserted ${projects.length} projects`);
    } else {
      console.log(`Projects already has ${projCount} docs, skipping`);
    }

    // Seed experiences
    const expCollection = db.collection("experiences");
    const expCount = await expCollection.countDocuments();
    if (expCount === 0) {
      await expCollection.insertMany(experiences);
      console.log(`Inserted ${experiences.length} experiences`);
    } else {
      console.log(`Experiences already has ${expCount} docs, skipping`);
    }

    // Seed skills
    const skillsCollection = db.collection("skills");
    const skillCount = await skillsCollection.countDocuments();
    if (skillCount === 0) {
      const skillDocs = skills.map((name, index) => ({ name, order: index }));
      await skillsCollection.insertMany(skillDocs);
      console.log(`Inserted ${skills.length} skills`);
    } else {
      console.log(`Skills already has ${skillCount} docs, skipping`);
    }

    // Seed places
    const placesCollection = db.collection("places");
    const placesCount = await placesCollection.countDocuments();
    if (placesCount === 0) {
      await placesCollection.insertMany(places);
      console.log(`Inserted ${places.length} places`);
    } else {
      console.log(`Places already has ${placesCount} docs, skipping`);
    }

    // Seed books
    const booksCollection = db.collection("books");
    const booksCount = await booksCollection.countDocuments();
    if (booksCount === 0) {
      await booksCollection.insertMany(books);
      console.log(`Inserted ${books.length} books`);
    } else {
      console.log(`Books already has ${booksCount} docs, skipping`);
    }

    // Seed music
    const musicCollection = db.collection("music");
    const musicCount = await musicCollection.countDocuments();
    if (musicCount === 0) {
      await musicCollection.insertMany(music);
      console.log(`Inserted ${music.length} music tracks`);
    } else {
      console.log(`Music already has ${musicCount} docs, skipping`);
    }

    console.log("Done!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
