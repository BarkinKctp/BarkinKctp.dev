"use client";

import SectionHeading from "../section-heading";
import { motion } from "framer-motion";
import { FaPlane, FaExternalLinkAlt } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import Link from "next/link";

interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location: string;
  description: string;
  duration: string;
}

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const { ref } = useSectionInView("Experience");

  return (
    <section id="experience" ref={ref} className="experience-flight mb-[7rem] w-full max-w-[58rem] scroll-mt-40 sm:mb-[10rem]">
      <div className="experience-title-wrap">
        <motion.span
          className="experience-plane"
          initial={{ x: "-52vw", y: 75, rotate: -4, opacity: 0 }}
          whileInView={{ x: "52vw", y: [75, 30, -125], rotate: [0, -7, -18], opacity: [0, 1, 1, 0] }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 2.8, ease: [0.22, 0.7, 0.28, 1] }}
          aria-hidden="true"
        ><FaPlane /></motion.span>
        <SectionHeading>Experiences</SectionHeading>
      </div>

      <div className="experience-clouds">
        {experiences.map((item, index) => {
          const comesFromLeft = index % 2 === 0;
          return (
            <motion.article
              key={item.id}
              className={`experience-cloud-card ${comesFromLeft ? "experience-left" : "experience-right"}`}
              initial={{ x: comesFromLeft ? -150 : 150, y: 35, opacity: 0, rotate: comesFromLeft ? -3 : 3 }}
              whileInView={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="card-plane" aria-hidden="true"><FaPlane /></span>
              <p className="flight-date">{item.duration}</p>
              <h3>{item.title}</h3>
              <p className="company-name">{item.company}</p>
              <p className="experience-description">{item.description}</p>
              <p className="experience-location">{item.location}</p>
            </motion.article>
          );
        })}
      </div>

      <Link className="flight-log-link" href="https://www.linkedin.com/in/barkin-kocatepe-6a43922a2/details/experience/" target="_blank" rel="noopener noreferrer">
        View All Experiences <FaExternalLinkAlt />
      </Link>
    </section>
  );
}
