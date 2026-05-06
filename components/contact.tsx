"use client";

import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { saveContact } from "@/actions/saveContact";
import SubmitButton from "./submit-btn";
import toast from "react-hot-toast";

export default function Contact() {
  const { ref } = useSectionInView("Contact");

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-10 sm:mb-16 w-[min(100%,38rem)] text-center scroll-mt-40"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <SectionHeading>Contact Me</SectionHeading>

      <p className="text-gray-700 dark:text-slate-300 -mt-6">
        Please contact me directly at{" "}
        <a
          className="underline"
          href="mailto:barkinkocatepe12@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          barkinkocatepe12@gmail.com
        </a>{" "}
        or through this form.
      </p>

      <form
        className="mt-10 flex flex-col"
        action={async (formData) => {
          const { data, error } = await saveContact(formData);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success("Message sent successfully!");
        }}
      >
        <input
          className="h-14 px-4 rounded-lg border border-black/60 dark:border-white/20 bg-white dark:bg-slate-900
          text-gray-900 dark:text-slate-100 shadow-sm hover:shadow-md focus:shadow-md focus:border-gray-600 dark:focus:border-cyan-500 focus:outline-none
          transition-all"
          name="senderEmail"
          type="email"
          required
          maxLength={500}
          placeholder="Your email"
        />
        <textarea
          className="h-52 my-3 rounded-lg border border-black/60 dark:border-white/20 bg-white dark:bg-slate-900
          text-gray-900 dark:text-slate-100 shadow-sm p-4 hover:shadow-md focus:shadow-md focus:border-gray-600 dark:focus:border-cyan-500 focus:outline-none
          transition-all"
          name="message"
          placeholder="Your message"
          required
          maxLength={5000}
        />
        <SubmitButton />
      </form>
    </motion.section>
  );
}
