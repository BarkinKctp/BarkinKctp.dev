import React from "react";

type SectionHeadingProps = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2
      className="text-3xl font-medium mb-10 capitalize text-center
     text-gray-700 hover:text-cyan-600 transition"
    >
      {children}
    </h2>
  );
}
