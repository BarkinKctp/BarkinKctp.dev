import { LinkedIn, Github } from "@/lib/links";

const siteUrl = "https://barkinkocatepe.dev";

/**
 * JSON-LD structured data for the site. Gives crawlers an explicit Person +
 * WebSite entity instead of leaving them to infer it from animated markup.
 */
export default function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Barkin Kocatepe",
        alternateName: "Barkın Kocatepe",
        url: siteUrl,
        image: `${siteUrl}/bg-images/barkin-portrait.jpeg`,
        jobTitle: "Software Engineer",
        description:
          "Software engineer specializing in cloud computing, distributed systems, and DevOps.",
        knowsAbout: [
          "Cloud Computing",
          "Distributed Systems",
          "DevOps",
          "Infrastructure as Code",
          "CI/CD",
          "Kubernetes",
        ],
        worksFor: {
          "@type": "Organization",
          name: "Siemens",
          url: "https://www.siemens.com",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Halic University",
          url: "https://halic.edu.tr",
        },
        sameAs: [LinkedIn, Github, "https://medium.com/@barkinkocatepe12"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Barkin Kocatepe",
        description:
          "Personal portfolio of Barkin Kocatepe — software engineer working in cloud, distributed systems, and DevOps.",
        publisher: { "@id": `${siteUrl}/#person` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
