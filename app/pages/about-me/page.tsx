"use client";

import SectionHeading from "@/components/section-heading";
import Link from "next/link";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBook, FaMusic, FaUser } from "react-icons/fa";
import { placesVisited, favoriteBooks, favoriteMusic } from "@/lib/about-me";

export default function AboutMePage() {
  return (
    <motion.main
      className="flex flex-col items-center px-[1rem] pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeading>About Me</SectionHeading>
      </motion.div>

      <motion.p
        className="leading-8 text-gray-800 dark:text-slate-300 mb-12 text-center max-w-[40rem] -mt-4"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        A little more about me beyond code — the{" "}
        <span className="font-bold">places I’ve explored</span>,{" "}
        <span className="font-bold">books that stuck with me</span>, and the{" "}
        <span className="font-bold">music</span> that I listen to.
      </motion.p>

      {/* About Me Bio */}
      <motion.div
        className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-3 mb-4 group cursor-default">
          <FaUser className="text-emerald-500 text-xl group-hover:scale-110 transition duration-300" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 group-hover:text-emerald-600 transition duration-300">
            Who I Am
          </h2>
        </div>
        <p className="leading-8 text-gray-700 dark:text-slate-300 border-l-4 border-emerald-400 hover:border-emerald-600 pl-4 transition-colors duration-300">
          I'm currently a{" "}
          <span className="font-bold">
            Third Year Software Engineering student
          </span>{" "}
          at <span className="font-bold">Halic University</span>.
          <br /> Most of my time goes into learning how systems are built and
          how different technologies work together.
          <br />I am especially interested in{" "}
          <span className="underline">Cloud Computing</span>,{" "}
          <span className="underline">DevOps</span>,{" "}
          <span className="underline">Distributed Systems</span>, and{" "}
          <span className="underline">Artificial Intelligence</span>.
          <br />I enjoy working on projects where I can experiment, solve
          problems, and gradually turn ideas into something real.
        </p>

        <p
          className="leading-8 text-gray-700 dark:text-slate-300 mt-4 border-l-4 border-sky-400
         hover:border-sky-600 pl-4 transition-colors duration-300"
        >
          Outside of technology, I enjoy{" "}
          <span className="font-bold">listening to music</span>,{" "}
          <span className="font-bold">reading books</span>,{" "}
          <span className="font-bold">watching movies</span>, and{" "}
          <span className="font-bold">gaming</span>.
          <br />
          I'm also passionate about{" "}
          <span className="font-bold">learning new languages</span> and{" "}
          <span className="font-bold">
            exploring new places around the world
          </span>
          . <br />
          I'm currently learning <span className="font-bold">French</span> and
          practicing the <span className="font-bold">piano</span>.
        </p>
      </motion.div>

      {/* Places Visited */}
      <motion.div
        className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6 group cursor-default">
          <FaMapMarkerAlt className="text-teal-500 text-xl group-hover:scale-110 transition duration-300" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 group-hover:text-teal-600 transition duration-300">
            Places I&apos;ve Visited
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {placesVisited.map((place, index) => (
            <motion.div
              key={index}
              className="group rounded-lg overflow-hidden border-2 border-black/60 dark:border-white/20 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative h-[7rem] sm:h-[9rem] lg:h-[10rem] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-slate-100">
                  {place.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  {place.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Favorite Books */}
      <motion.div
        className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6 group cursor-default">
          <FaBook className="text-emerald-600 text-xl group-hover:scale-110 transition duration-300" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 group-hover:text-emerald-600 transition duration-300">
            Books I&apos;ve Read
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {favoriteBooks.map((book, index) => (
            <motion.div
              key={index}
              className="group rounded-lg overflow-hidden border-2 border-black/60 dark:border-white/20 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative h-[6rem] sm:h-[7rem] lg:h-[8rem] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                  className="object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-slate-100">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                  {book.author}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Favorite Music */}
      <motion.div
        className="bg-white dark:bg-slate-900 border-2 border-black/60 dark:border-white/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6 group cursor-default">
          <FaMusic className="text-green-500 text-xl group-hover:scale-110 transition duration-300" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 group-hover:text-green-600 transition duration-300">
            Favorite Music
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {favoriteMusic.map((track, index) => (
            <motion.div
              key={index}
              className="group rounded-lg overflow-hidden border-2 border-black/60 dark:border-white/20 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative h-[6rem] sm:h-[7rem] lg:h-[8rem] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={track.cover}
                  alt={track.title}
                  fill
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-800 dark:text-slate-100">
                  {track.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                  {track.artist}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Back button */}
      <motion.div
        className="flex justify-center mt-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/#about"
          className="group bg-gray-900 dark:bg-cyan-600 text-white px-7
            py-3 flex items-center gap-2
            rounded-full outline-none focus:outline-none
            focus:scale-105 hover:scale-105 hover:bg-gray-950 dark:hover:bg-cyan-500
            active:scale-110 transition"
        >
          <BsArrowLeft className="opacity-70 group-hover:-translate-x-1 transition" />
          Back to Home
        </Link>
      </motion.div>
    </motion.main>
  );
}
