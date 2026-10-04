// Demo backend: a tiny in-browser "database" persisted to localStorage.
// It mirrors the Firebase backend's API so the UI doesn't know the difference.
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { buildSeed, DEMO_USER } from "../../data/seed";
import { fileToDataUrl } from "../../lib/images";
import { STATUS } from "../../lib/bookings";
import { sleep, todayISO } from "../../lib/utils";
import { buildNewBooking, joinBooking, queryBookings, todayActivity } from "../shared";

const KEY = "harder-rock:demo:v2";
const SESSION_KEY = "harder-rock:demo:session";

let db = null;

function freshDb() {
  return {
    ...buildSeed(new Date()),
    users: [{ id: 1, ...DEMO_USER }],
  };
}

/** Keeps the sample data "current": shifts every date forward by the days since it was seeded. */
function shiftToToday(data) {
  const delta = differenceInCalendarDays(new Date(), parseISO(data.seededOn));
  if (delta <= 0) return data;
  const shift = (d) => format(addDays(parseISO(d), delta), "yyyy-MM-dd");
  return {
    ...data,
    seededOn: todayISO(),
    bookings: data.bookings.map((b) => ({
      ...b,
      startDate: shift(b.startDate),
      endDate: shift(b.endDate),
      createdAt: addDays(parseISO(b.createdAt), delta).toISOString(),
    })),
  };
}

function load() {
  if (db) return db;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    db = saved?.bookings ? shiftToToday(saved) : freshDb();
  } catch {
    db = freshDb();
  }
  persist();
  return db;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    // Storage full or blocked: keep working in memory for this session.
  }
}

// Simulated network latency so loading states are visible and realistic.
const latency = () => sleep(150 + Math.random() * 200);
const nextId = (rows) => rows.reduce((max, r) => Math.max(max, Number(r.id)), 0) + 1;
const clone = (v) => structuredClone(v);
const publicUser = ({ password: _password, ...u }) => u;

/* ----------------------------- auth ----------------------------- */

export async function login({ email, password }) {
  await latency();
  const user = load().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) throw new Error("Wrong email or password.");
  localStorage.setItem(SESSION_KEY, String(user.id));
  return publicUser(user);
}

export async function logout() {
  await latency();
  localStorage.removeItem(SESSION_KEY);
}

export async function getCurrentUser() {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = load().users.find((u) => String(u.id) === id);
  return user ? publicUser(user) : null;
}

export async function signup({ fullName, email, password }) {
  await latency();
  const data = load();
  if (data.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    throw new Error("A user with that email already exists.");
  const user = { id: nextId(data.users), fullName, email, password, avatar: "" };
  data.users.push(user);
  persist();
  return publicUser(user);
}

export async function getUsers() {
  await latency();
  return load().users.map(publicUser);
}

export async function updateCurrentUser({ fullName, password, avatarFile }) {
  await latency();
  const id = localStorage.getItem(SESSION_KEY);
  const user = load().users.find((u) => String(u.id) === id);
  if (!user) throw new Error("You're not logged in.");
  if (fullName) user.fullName = fullName;
  if (password) user.password = password;
  if (avatarFile) user.avatar = await fileToDataUrl(avatarFile, 256);
  persist();
  return publicUser(user);
}

/* ----------------------------- cabins ----------------------------- */

export async function getCabins() {
  await latency();
  return clone(load().cabins);
}

export async function saveCabin(input, id) {
  await latency();
  const data = load();
  const image = input.image instanceof File ? await fileToDataUrl(input.image) : input.image;
  const cabin = {
    name: input.name,
    maxCapacity: Number(input.maxCapacity),
    regularPrice: Number(input.regularPrice),
    discount: Number(input.discount) || 0,
    description: input.description,
    image,
  };
  if (id) {
    const idx = data.cabins.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw new Error("Cabin not found.");
    data.cabins[idx] = { ...data.cabins[idx], ...cabin };
    persist();
    return clone(data.cabins[idx]);
  }
  const created = { id: nextId(data.cabins), ...cabin };
  data.cabins.push(created);
  persist();
  return clone(created);
}

export async function deleteCabin(id) {
  await latency();
  const data = load();
  if (data.bookings.some((b) => String(b.cabinId) === String(id) && b.status !== STATUS.CHECKED_OUT))
    throw new Error("This cabin has upcoming or active bookings. Cancel those first.");
  data.cabins = data.cabins.filter((c) => String(c.id) !== String(id));
  persist();
}

/* ----------------------------- guests ----------------------------- */

export async function getGuests() {
  await latency();
  return clone(load().guests).sort((a, b) => a.fullName.localeCompare(b.fullName));
}

/* ----------------------------- bookings ----------------------------- */

const joinedBookings = () => {
  const { bookings, cabins, guests } = load();
  return bookings.map((b) => joinBooking(b, cabins, guests));
};

export async function getBookings(params) {
  await latency();
  return clone(queryBookings(joinedBookings(), params));
}

export async function getBooking(id) {
  await latency();
  const booking = joinedBookings().find((b) => String(b.id) === String(id));
  if (!booking) throw new Error(`Booking #${id} not found.`);
  return clone(booking);
}

/** Bookings created on or after `date` (ISO). */
export async function getBookingsAfterDate(date) {
  await latency();
  return clone(joinedBookings().filter((b) => b.createdAt >= date && b.createdAt <= new Date().toISOString()));
}

/** Stays that started on or after `date` (yyyy-MM-dd) and up to today. */
export async function getStaysAfterDate(date) {
  await latency();
  const today = todayISO();
  return clone(joinedBookings().filter((b) => b.startDate >= date && b.startDate <= today));
}

export async function getTodayActivity() {
  await latency();
  return clone(todayActivity(joinedBookings()));
}

export async function updateBooking(id, patch) {
  await latency();
  const data = load();
  const booking = data.bookings.find((b) => String(b.id) === String(id));
  if (!booking) throw new Error(`Booking #${id} not found.`);
  Object.assign(booking, patch);
  persist();
  return clone(joinBooking(booking, data.cabins, data.guests));
}

export async function deleteBooking(id) {
  await latency();
  const data = load();
  data.bookings = data.bookings.filter((b) => String(b.id) !== String(id));
  persist();
}

export async function createBooking(input) {
  await latency();
  const data = load();
  const cabin = data.cabins.find((c) => String(c.id) === String(input.cabinId));
  const record = buildNewBooking(input, {
    cabin,
    settings: data.settings,
    cabinBookings: data.bookings.filter((b) => String(b.cabinId) === String(input.cabinId)),
  });

  let guestId = input.guestId;
  if (input.newGuest) {
    const guest = { id: nextId(data.guests), ...input.newGuest };
    data.guests.push(guest);
    guestId = guest.id;
  }
  if (!data.guests.some((g) => String(g.id) === String(guestId))) throw new Error("Please choose a guest.");

  const booking = { id: nextId(data.bookings), ...record, guestId: Number(guestId) };
  data.bookings.push(booking);
  persist();
  return clone(booking);
}

/* ----------------------------- settings ----------------------------- */

export async function getSettings() {
  await latency();
  return clone(load().settings);
}

export async function updateSettings(patch) {
  await latency();
  const data = load();
  data.settings = { ...data.settings, ...patch };
  persist();
  return clone(data.settings);
}

/* ----------------------------- demo tools ----------------------------- */

export async function resetData() {
  await latency();
  const users = load().users;
  db = { ...freshDb(), users };
  persist();
}
