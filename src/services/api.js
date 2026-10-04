// Single entry point for data access. The backend module is loaded lazily, so the
// Firebase SDK is only downloaded when VITE_DATA_SOURCE=firebase.
import { DATA_SOURCE } from "../lib/constants";

let backend;
const load = () =>
  (backend ??= DATA_SOURCE === "firebase" ? import("./firebase/index.js") : import("./demo/index.js"));

const call =
  (name) =>
  async (...args) =>
    (await load())[name](...args);

export const login = call("login");
export const logout = call("logout");
export const getCurrentUser = call("getCurrentUser");
export const signup = call("signup");
export const getUsers = call("getUsers");
export const updateCurrentUser = call("updateCurrentUser");

export const getCabins = call("getCabins");
export const saveCabin = call("saveCabin");
export const deleteCabin = call("deleteCabin");

export const getGuests = call("getGuests");

export const getBookings = call("getBookings");
export const getBooking = call("getBooking");
export const getBookingsAfterDate = call("getBookingsAfterDate");
export const getStaysAfterDate = call("getStaysAfterDate");
export const getTodayActivity = call("getTodayActivity");
export const updateBooking = call("updateBooking");
export const deleteBooking = call("deleteBooking");
export const createBooking = call("createBooking");

export const getSettings = call("getSettings");
export const updateSettings = call("updateSettings");

export const resetData = call("resetData");
