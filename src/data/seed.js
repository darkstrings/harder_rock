import { addDays, format } from "date-fns";
import { cabins as cabinSeed } from "./cabins";
import { guests as guestSeed } from "./guests";
import { bookings as bookingSeed } from "./bookings";
import { calcBookingPrices, deriveStatus } from "../lib/bookings";

export const DEFAULT_SETTINGS = {
  minBookingLength: 1,
  maxBookingLength: 30,
  maxGuestsPerBooking: 10,
  breakfastPrice: 15,
};

export const DEMO_USER = {
  email: "demo@harderrock.hotel",
  password: "rocknroll",
  fullName: "Riley Riff",
  avatar: "asset:user1",
};

const day = (today, n) => format(addDays(today, n), "yyyy-MM-dd");

// Small deterministic PRNG so every seed produces the same "history".
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a full, normalized dataset relative to `today`.
 * Ids are sequential numbers so bookings read nicely ("Booking #12").
 */
export function buildSeed(today = new Date()) {
  const rand = mulberry32(1987);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const int = (min, max) => min + Math.floor(rand() * (max - min + 1));

  const cabins = cabinSeed.map((c, i) => ({ id: i + 1, ...c }));
  const guests = guestSeed.map((g, i) => ({ id: i + 1, ...g }));
  const settings = { ...DEFAULT_SETTINGS };

  // 1) the hand-written bookings
  const raw = bookingSeed.map((b) => ({
    cabinId: b.cabin,
    guestId: b.guest,
    start: b.start,
    end: b.end,
    created: b.created,
    numGuests: b.numGuests,
    hasBreakfast: b.hasBreakfast,
    isPaid: b.isPaid,
    observations: b.observations ?? "",
  }));

  // 2) generated history so charts have something to show for 30 / 90 days
  const overlaps = (cabinId, s, e) =>
    raw.some((b) => b.cabinId === cabinId && s < b.end && e > b.start);

  for (const cabin of cabins) {
    let cursor = -100 + int(0, 5);
    while (cursor < 45) {
      const nights = pick([1, 2, 2, 3, 3, 4, 5, 6, 7, 9, 12]);
      const s = cursor;
      const e = cursor + nights;
      if (!overlaps(cabin.id, s, e) && !(s <= 0 && e >= 0 && rand() < 0.5)) {
        const lead = s - int(2, 40);
        raw.push({
          cabinId: cabin.id,
          guestId: int(1, guests.length),
          start: s,
          end: e,
          created: lead <= 0 ? lead : -int(0, 21),
          numGuests: int(1, cabin.maxCapacity),
          hasBreakfast: rand() < 0.55,
          isPaid: s < 0 ? true : rand() < 0.4,
          observations: "",
        });
      }
      cursor = e + int(0, 6);
    }
  }

  const todayStr = day(today, 0);
  const bookings = raw
    .sort((a, b) => a.created - b.created || a.start - b.start)
    .map((b, i) => {
      const cabin = cabins.find((c) => c.id === b.cabinId);
      const startDate = day(today, b.start);
      const endDate = day(today, b.end);
      const createdAt = addDays(today, b.created);
      createdAt.setHours(int(8, 21), int(0, 59), 0, 0);
      // Never "in the future": bookings made today are stamped earlier today.
      if (createdAt > today) createdAt.setTime(today.getTime() - int(5, 240) * 60_000);
      const prices = calcBookingPrices({
        startDate,
        endDate,
        cabin,
        numGuests: b.numGuests,
        hasBreakfast: b.hasBreakfast,
        breakfastPrice: settings.breakfastPrice,
      });
      return {
        id: i + 1,
        createdAt: createdAt.toISOString(),
        startDate,
        endDate,
        cabinId: b.cabinId,
        guestId: b.guestId,
        numGuests: b.numGuests,
        hasBreakfast: b.hasBreakfast,
        isPaid: b.isPaid,
        observations: b.observations,
        ...prices,
        status: deriveStatus(startDate, endDate, todayStr),
      };
    });

  return { cabins, guests, bookings, settings, seededOn: todayStr };
}
