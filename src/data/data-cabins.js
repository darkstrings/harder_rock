import { supabaseUrl } from "../services/supabase";

const imageUrl = `${supabaseUrl}/storage/v1/object/public/cabin-images/`;

export const cabins = [
  {
    name: "The Van Halen Cabin",
    maxCapacity: 5,
    regularPrice: 250,
    discount: 0,
    image: imageUrl + "cabin-001.jpg",
    description: "Van Halen Themed Cabin including decorations inspired by Eddie Van Halen's Frankenstein guitar",
  },
  {
    name: "The Metallica Cabin",
    maxCapacity: 10,
    regularPrice: 350,
    discount: 25,
    image: imageUrl + "cabin-002.jpg",
    description: "Metallica themed cabin with decorations remenisent of 80s metal",
  },
  {
    name: "The Vai Cabin",
    maxCapacity: 4,
    regularPrice: 300,
    discount: 0,
    image: imageUrl + "cabin-003.jpg",
    description: "Steve Vai themed cabin",
  },
  {
    name: "The Satriani Cabin",
    maxCapacity: 4,
    regularPrice: 500,
    discount: 50,
    image: imageUrl + "cabin-004.jpg",
    description: "Fast guitars and space alien decor",
  },
  {
    name: "The Hendrix Cabin",
    maxCapacity: 6,
    regularPrice: 350,
    discount: 0,
    image: imageUrl + "cabin-005.jpg",
    description: "Themed with Jimi Hendrix and late 60s Woodstock decor",
  },
  {
    name: "The Dream Theater Cabin",
    maxCapacity: 6,
    regularPrice: 800,
    discount: 100,
    image: imageUrl + "cabin-006.jpg",
    description: "Themed with progressive metal and hard rock decor",
  },
];
