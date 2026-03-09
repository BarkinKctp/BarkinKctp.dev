import React from "react";
import SectionHeading from "./section-heading";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section>
      <SectionHeading>My Projects</SectionHeading>
      <div>
        {projects.map((project, index) => (
          <React.Fragment key={index}>
            <Project {...project} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

type ProjectProps = (typeof projects)[number];

function Project({ title, description, tags, imageUrl }: ProjectProps) {
  return (
    <section
      className="group bg-gray-100 max-w-[42rem] relative 
    border border-black/15 overflow-hidden sm:pr-8
    relative sm:h-[20rem] mb-3 sm:mb-8 last:mb-0 "
    >
      <div
        className="pt-4 pb-7 px-5 sm:pl-10 sm:pt-10
      sm:pr-2 sm:max-w-1/2 flex flex-col h-full
       group-even:ml-[18rem]"
      >
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-2 leading-relaxed text-gray-700">{description}</p>
        <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
          {tags.map((tags, index) => (
            <li
              className="bg-black/70 px-3 py-1 text-[0.7rem] 
          uppercase tracking-wider text-white rounded-full"
              key={index}
            >
              {tags}
            </li>
          ))}
        </ul>
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="absolute top-8 shadow-2xl
        -right-40 w-[28.25rem] rounded-t-lg
        group-even:right-[initial] group-even:-left-40 "
        />
      )}
    </section>
  );
}
