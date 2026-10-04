// Firebase backend (Auth + Firestore + Storage). Enable with VITE_DATA_SOURCE=firebase.
// Data volumes for a small hotel are tiny, so collections are read whole and
// filtered/sorted client-side with the same helpers the demo backend uses.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "./client";
import { buildSeed, DEFAULT_SETTINGS } from "../../data/seed";
import { STATUS } from "../../lib/bookings";
import { todayISO } from "../../lib/utils";
import { buildNewBooking, joinBooking, queryBookings, todayActivity } from "../shared";

const readAll = async (name) => {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
};

const nextNumericId = (rows) => rows.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1;

async function uploadImage(file, folder) {
  const name = `${crypto.randomUUID()}-${file.name}`.replaceAll("/", "");
  const imageRef = ref(storage, `${folder}/${name}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

/* ----------------------------- auth ----------------------------- */

async function profileFor(fbUser) {
  if (!fbUser) return null;
  const snap = await getDoc(doc(db, "users", fbUser.uid));
  const profile = snap.exists() ? snap.data() : {};
  return {
    id: fbUser.uid,
    email: fbUser.email,
    fullName: profile.fullName ?? fbUser.displayName ?? "",
    avatar: profile.avatar ?? "",
  };
}

export async function login({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password).catch(() => {
    throw new Error("Wrong email or password.");
  });
  return profileFor(user);
}

export const logout = () => signOut(auth);

export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      resolve(await profileFor(user));
    });
  });
}

// Note: Firebase signs the browser in as the newly created user.
export async function signup({ fullName, email, password }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: fullName });
  await setDoc(doc(db, "users", user.uid), { fullName, email, avatar: "" });
  return profileFor(user);
}

export const getUsers = () => readAll("users");

export async function updateCurrentUser({ fullName, password, avatarFile }) {
  const user = auth.currentUser;
  if (!user) throw new Error("You're not logged in.");
  if (password) await updatePassword(user, password);
  const patch = {};
  if (fullName) patch.fullName = fullName;
  if (avatarFile) patch.avatar = await uploadImage(avatarFile, "avatars");
  await setDoc(doc(db, "users", user.uid), patch, { merge: true });
  return profileFor(user);
}

/* ----------------------------- cabins ----------------------------- */

export const getCabins = () => readAll("cabins");

export async function saveCabin(input, id) {
  const image = input.image instanceof File ? await uploadImage(input.image, "cabin-images") : input.image;
  const cabin = {
    name: input.name,
    maxCapacity: Number(input.maxCapacity),
    regularPrice: Number(input.regularPrice),
    discount: Number(input.discount) || 0,
    description: input.description,
    image,
  };
  const cabinId = id ?? String(nextNumericId(await readAll("cabins")));
  await setDoc(doc(db, "cabins", String(cabinId)), cabin, { merge: true });
  return { id: cabinId, ...cabin };
}

export async function deleteCabin(id) {
  const bookings = await readAll("bookings");
  if (bookings.some((b) => String(b.cabinId) === String(id) && b.status !== STATUS.CHECKED_OUT))
    throw new Error("This cabin has upcoming or active bookings. Cancel those first.");
  await deleteDoc(doc(db, "cabins", String(id)));
}

/* ----------------------------- guests ----------------------------- */

export async function getGuests() {
  return (await readAll("guests")).sort((a, b) => a.fullName.localeCompare(b.fullName));
}

/* ----------------------------- bookings ----------------------------- */

async function joinedBookings() {
  const [bookings, cabins, guests] = await Promise.all([readAll("bookings"), readAll("cabins"), readAll("guests")]);
  return bookings.map((b) => joinBooking({ ...b, id: Number(b.id) || b.id }, cabins, guests));
}

export async function getBookings(params) {
  return queryBookings(await joinedBookings(), params);
}

export async function getBooking(id) {
  const booking = (await joinedBookings()).find((b) => String(b.id) === String(id));
  if (!booking) throw new Error(`Booking #${id} not found.`);
  return booking;
}

export async function getBookingsAfterDate(date) {
  const now = new Date().toISOString();
  return (await joinedBookings()).filter((b) => b.createdAt >= date && b.createdAt <= now);
}

export async function getStaysAfterDate(date) {
  const today = todayISO();
  return (await joinedBookings()).filter((b) => b.startDate >= date && b.startDate <= today);
}

export async function getTodayActivity() {
  return todayActivity(await joinedBookings());
}

export async function updateBooking(id, patch) {
  await updateDoc(doc(db, "bookings", String(id)), patch);
  return getBooking(id);
}

export const deleteBooking = (id) => deleteDoc(doc(db, "bookings", String(id)));

export async function createBooking(input) {
  const [cabins, bookings, guests, settings] = await Promise.all([
    readAll("cabins"),
    readAll("bookings"),
    readAll("guests"),
    getSettings(),
  ]);
  const cabin = cabins.find((c) => String(c.id) === String(input.cabinId));
  const record = buildNewBooking(input, {
    cabin,
    settings,
    cabinBookings: bookings.filter((b) => String(b.cabinId) === String(input.cabinId)),
  });

  let guestId = input.guestId;
  if (input.newGuest) {
    guestId = String(nextNumericId(guests));
    await setDoc(doc(db, "guests", guestId), input.newGuest);
  }
  if (!guestId) throw new Error("Please choose a guest.");

  const id = nextNumericId(bookings);
  const booking = { ...record, cabinId: String(cabin.id), guestId: String(guestId) };
  await setDoc(doc(db, "bookings", String(id)), booking);
  return { id, ...booking };
}

/* ----------------------------- settings ----------------------------- */

export async function getSettings() {
  const snap = await getDoc(doc(db, "settings", "app"));
  return snap.exists() ? { ...DEFAULT_SETTINGS, ...snap.data() } : { ...DEFAULT_SETTINGS };
}

export async function updateSettings(patch) {
  await setDoc(doc(db, "settings", "app"), patch, { merge: true });
  return getSettings();
}

/* ----------------------------- seeding ----------------------------- */

/** Replaces cabins, guests, bookings and settings with fresh sample data. */
export async function resetData() {
  const seed = buildSeed(new Date());
  for (const name of ["bookings", "guests", "cabins"]) {
    const snap = await getDocs(collection(db, name));
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = writeBatch(db);
      snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
  const writes = [
    ...seed.cabins.map((c) => ["cabins", c]),
    ...seed.guests.map((g) => ["guests", g]),
    ...seed.bookings.map((b) => ["bookings", { ...b, cabinId: String(b.cabinId), guestId: String(b.guestId) }]),
  ];
  for (let i = 0; i < writes.length; i += 400) {
    const batch = writeBatch(db);
    writes.slice(i, i + 400).forEach(([name, { id, ...rest }]) => batch.set(doc(db, name, String(id)), rest));
    await batch.commit();
  }
  await setDoc(doc(db, "settings", "app"), seed.settings);
}
