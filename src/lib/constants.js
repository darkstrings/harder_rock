export const PAGE_SIZE = 10;
export const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE === "firebase" ? "firebase" : "demo";
export const IS_DEMO = DATA_SOURCE === "demo";
