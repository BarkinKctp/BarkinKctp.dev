export const placesVisited = [
  {
    name: "Istanbul, Turkey",
    image: "/photos/photo/Istanbul.jpg",
    description: "Home city — where it all started.",
  },
  {
    name: "Rome, Italy",
    image: "/photos/photo/rome-colesseum.jpg",
    description: "The Eternal City — history at every corner.",
  },/*
  {
    
    name: "Rhodes Island, Greece",
    image: "/photos/photo/Rhodes-Island.jpg",
    description: "A beautiful island with rich history and stunning beaches.",
  },*/
] as const;

export const favoriteBooks = [
  {
    title: "The Iliad",
    author: "Homer",
    image: "https://covers.openlibrary.org/b/olid/OL46720993M-L.jpg",
  },
  {
    title: "Odyssey",
    author: "Homer",
    image: "https://covers.openlibrary.org/b/olid/OL45670101M-L.jpg",
  },
] as const;

export const favoriteMusic = [
  {
    title: "Far From Any Road",
    artist: "The Handsome Family",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0243bf72818b91c6803029dbbe",
    spotifyUrl: "https://open.spotify.com/embed/track/3LDkLpuxQlEuEiZmkxpr8S?",
  },    
  {
    title: "Every Breath You Take",
    artist: "The Police",
    cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c8e97cafeb2acb85b21a777e",
    spotifyUrl: "https://open.spotify.com/embed/track/1JSTJqkT5qHq8MDJnJbRE1?",
  },
] as const;
// https://open.spotify.com/oembed?url=https://open.spotify.com/track/TRACK_ID to get embed url
