import { getPlacesFromDb, getBooksFromDb, getMusicFromDb } from "@/lib/about";
import AboutMeClient from "./about-me-client";

export default async function AboutMePage() {
  const [places, books, music] = await Promise.all([
    getPlacesFromDb(),
    getBooksFromDb(),
    getMusicFromDb(),
  ]);

  return <AboutMeClient places={places} books={books} music={music} />;
}
