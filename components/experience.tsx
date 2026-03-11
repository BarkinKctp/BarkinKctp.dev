"use client";

import React from "react";
import SectionHeading from "./section-heading";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaCode } from "react-icons/fa";
import { experiences } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";

export default function Experience() {
  const { ref } = useSectionInView("Experience");

  return (
    <section
      id="experience"
      ref={ref}
      className="scroll-mt-40 mb-[7rem] sm:mb-[10rem]"
    >
      <SectionHeading>My Experience</SectionHeading>
      <VerticalTimeline lineColor="">
        {experiences.map((item, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              className="[&_.vertical-timeline-element-content]:transition-all! 
              [&_.vertical-timeline-element-content]:duration-300! [&_.vertical-timeline-element-content:hover]:-translate-y-1! 
              [&_.vertical-timeline-element-content:hover]:bg-gray-200! [&_.vertical-timeline-element-content:hover]:border-black/20!
               [&_.vertical-timeline-element-content:hover]:shadow-[0_12px_24px_rgba(2,6,23,0.08)]! [&_.vertical-timeline-element-date]:transition-colors! [&_.vertical-timeline-element-date]:duration-300! [&_.vertical-timeline-element-date:hover]:text-cyan-600!"
              iconClassName="transition-all! duration-300! hover:scale-110! hover:border-cyan-400! hover:shadow-[0_0_0_6px_rgba(34,211,238,0.2)]!"
              dateClassName="text-slate-900! hover:text-cyan-600!"
              contentStyle={{
                background: "#f3f4f6",
                boxShadow: "none",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                textAlign: "left",
                padding: "1.3rem 2rem",
              }}
              contentArrowStyle={{
                borderRight: "0.4rem solid #9ca3af",
              }}
              date={item.duration}
              icon={item.icon}
              iconStyle={{
                background: "white",
                fontSize: "1.5rem",
                border: "0.15rem solid white",
                boxShadow: "0 10px 20px rgba(2, 6, 23, 0.08)",
              }}
            >
              <h3 className="font-bold capitalize text-gray-700 transition-colors duration-300 hover:text-cyan-600">
                {item.title}
              </h3>

              <p className="mt-1! font-normal! text-gray-700">
                {item.description}
              </p>
              <p className="mt-0! font-semibold italic text-gray-700 transition-colors duration-300 hover:text-cyan-600">
                {item.location}
              </p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
        <VerticalTimelineElement
          icon={<FaCode />}
          iconClassName="transition-all! duration-300! hover:scale-110! hover:border-cyan-400! hover:shadow-[0_0_0_6px_rgba(34,211,238,0.2)]!"
          date=""
          contentStyle={{
            display: "none",
          }}
          contentArrowStyle={{
            display: "none",
          }}
          iconStyle={{
            background: "white",
            fontSize: "1.5rem",
            border: "0.15rem solid white",
            boxShadow: "0 10px 20px rgba(2, 6, 23, 0.08)",
          }}
        />
      </VerticalTimeline>
    </section>
  );
}
