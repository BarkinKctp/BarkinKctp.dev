import type { Metadata } from "next";
import { getPlacesFromDb, getBooksFromDb, getMusicFromDb } from "@/lib/about";
import AboutMeClient from "./about-me-client";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "More about Barkin Kocatepe — places I've been, books I've read, and music I listen to.",
  alternates: { canonical: "/pages/about-me" },
  openGraph: {
    title: "About Me | Barkin Kocatepe",
    description:
      "More about Barkin Kocatepe — places I've been, books I've read, and music I listen to.",
    url: "https://barkinkocatepe.dev/pages/about-me",
  },
};

export default async function AboutMePage() {
  const [places, books, music] = await Promise.all([
    getPlacesFromDb(),
    getBooksFromDb(),
    getMusicFromDb(),
  ]);

  return <AboutMeClient places={places} books={books} music={music} />;
}
