"use client";

import SectionHeading from "@/components/section-heading";
import Link from "next/link";
import Image from "next/image";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaBook, FaMusic, FaUser } from "react-icons/fa";

const placesVisited = [
  {
    name: "Istanbul, Turkey",
    image: "/photos/istanbul.jpg",
    description: "Home city — where it all started.",
  },
  // Add more places here
];

const favoriteBooks = [
  {
    title: "Book Title",
    author: "Author Name",
    image: "/photos/book1.jpg",
  },
  // Add more books here
];

const favoriteMusic = [
  {
    title: "Song / Album Title",
    artist: "Artist Name",
    image: "/photos/album1.jpg",
  },
  // Add more music here
];

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
        className="leading-8 text-gray-700 mb-12 text-center max-w-[40rem] -mt-4"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        A little more about who I am beyond code —{" "}
        <span className="font-bold">places I&apos;ve explored</span>,{" "}
        <span className="font-bold">books I love</span>, and the{" "}
        <span className="font-bold">music</span> that keeps me going.
      </motion.p>

      {/* About Me Bio */}
      <motion.div
        className="bg-white border border-black/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <FaUser className="text-emerald-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">Who I Am</h2>
        </div>
        <p className="leading-8 text-gray-700 border-l-4 border-emerald-400 pl-4">
          I am a <span className="font-bold">Software Engineering student</span>{" "}
          at <span className="font-bold">Halic University</span> with a strong
          interest in <span className="underline">Cloud Computing</span>,{" "}
          <span className="underline">DevOps</span>,{" "}
          <span className="underline">Distributed Systems</span>, and{" "}
          <span className="underline">Artificial Intelligence</span>. I enjoy
          building practical projects that combine software development with
          automation and modern infrastructure.
        </p>
        <p className="leading-8 text-gray-700 mt-4 border-l-4 border-sky-400 pl-4">
          Outside of technology, I enjoy{" "}
          <span className="font-bold">listening to music</span>,{" "}
          <span className="font-bold">reading books</span>,{" "}
          <span className="font-bold">watching movies</span>, and{" "}
          <span className="font-bold">gaming</span>. I&apos;m also passionate
          about <span className="font-bold">learning new languages</span> and{" "}
          <span className="font-bold">
            exploring new places around the world
          </span>
          . I&apos;m currently learning{" "}
          <span className="font-bold">French</span> and playing the{" "}
          <span className="font-bold">piano</span>.
        </p>
      </motion.div>

      {/* Places Visited */}
      <motion.div
        className="bg-white border border-black/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaMapMarkerAlt className="text-teal-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            Places I&apos;ve Visited
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {placesVisited.map((place, index) => (
            <motion.div
              key={index}
              className="group rounded-lg overflow-hidden border border-black/10 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative h-[10rem] bg-gray-100 overflow-hidden">
                <Image
                  src={place.image}
                  alt={place.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{place.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {place.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Favorite Books */}
      <motion.div
        className="bg-white border border-black/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaBook className="text-emerald-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">Favorite Books</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteBooks.map((book, index) => (
            <motion.div
              key={index}
              className="group flex gap-4 p-4 rounded-lg border border-black/10 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative w-[5rem] h-[7rem] shrink-0 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{book.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Favorite Music */}
      <motion.div
        className="bg-white border border-black/15 rounded-lg p-8 sm:p-10 max-w-[65rem] w-full mb-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaMusic className="text-green-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-800">Favorite Music</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMusic.map((track, index) => (
            <motion.div
              key={index}
              className="group flex gap-4 p-4 rounded-lg border border-black/10 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative w-[5rem] h-[5rem] shrink-0 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={track.image}
                  alt={track.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{track.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{track.artist}</p>
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
          className="group bg-gray-900 text-white px-8 py-3
            flex items-center gap-3 rounded-full outline-none
            focus:outline-none focus:scale-105 hover:scale-105
            hover:bg-gray-950 active:scale-110 transition
            font-semibold"
        >
          <BsArrowLeft className="opacity-70 group-hover:-translate-x-1 transition" />
          Back to Home
        </Link>
      </motion.div>
    </motion.main>
  );
}
