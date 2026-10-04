import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../services/firebaseClient";

// Utility to fetch image URL from Firebase Storage
export async function getCabinImage(filename) {
  const imageRef = ref(storage, `cabin-images/${filename}`);
  return await getDownloadURL(imageRef);
}

// Cabin data with image filenames
export const cabins = [
  {
    name: "The Van Halen Cabin",
    maxCapacity: 5,
    regularPrice: 250,
    discount: 0,
    image: "cabin-001.jpg",
    description: "Van Halen themed cabin including decorations inspired by Eddie Van Halen's Frankenstein guitar",
  },
  {
    name: "The Metallica Cabin",
    maxCapacity: 10,
    regularPrice: 350,
    discount: 25,
    image: "cabin-002.jpg",
    description: "Metallica themed cabin with decorations reminiscent of 80s metal",
  },
  {
    name: "The Vai Cabin",
    maxCapacity: 4,
    regularPrice: 300,
    discount: 0,
    image: "cabin-003.jpg",
    description: "Steve Vai themed cabin",
  },
  {
    name: "The Satriani Cabin",
    maxCapacity: 4,
    regularPrice: 500,
    discount: 50,
    image: "cabin-004.jpg",
    description: "Fast guitars and space alien decor",
  },
  {
    name: "The Hendrix Cabin",
    maxCapacity: 6,
    regularPrice: 350,
    discount: 0,
    image: "cabin-005.jpg",
    description: "Themed with Jimi Hendrix and late 60s Woodstock decor",
  },
  {
    name: "The Dream Theater Cabin",
    maxCapacity: 6,
    regularPrice: 800,
    discount: 100,
    image: "cabin-006.jpg",
    description: "Themed with progressive metal and hard rock decor",
  },
];
