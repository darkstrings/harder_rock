// Logic shared by the demo and Firebase backends so both behave identically.
import { PAGE_SIZE } from "../lib/constants";
import { calcBookingPrices, nightsBetween, STATUS } from "../lib/bookings";
import { todayISO } from "../lib/utils";

export function joinBooking(booking, cabins, guests) {
  return {
    ...booking,
    cabin: cabins.find((c) => String(c.id) === String(booking.cabinId)) ?? { name: "Deleted cabin" },
    guest: guests.find((g) => String(g.id) === String(booking.guestId)) ?? { fullName: "Unknown guest" },
  };
}

/** Filter, search, sort and paginate an array of joined bookings. */
export function queryBookings(all, { status, search, sortBy = "startDate-desc", page = 1 } = {}) {
  let rows = all;
  if (status && status !== "all") rows = rows.filter((b) => b.status === status);

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (b) =>
        b.guest.fullName?.toLowerCase().includes(q) ||
        b.guest.email?.toLowerCase().includes(q) ||
        b.cabin.name?.toLowerCase().includes(q) ||
        String(b.id) === q.replace("#", ""),
    );
  }

  const [field, direction] = sortBy.split("-");
  const dir = direction === "asc" ? 1 : -1;
  rows = rows.toSorted((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  const count = rows.length;
  const from = (page - 1) * PAGE_SIZE;
  return { data: rows.slice(from, from + PAGE_SIZE), count };
}

export function todayActivity(joined) {
  const today = todayISO();
  return joined
    .filter(
      (b) =>
        (b.status === STATUS.UNCONFIRMED && b.startDate === today) ||
        (b.status === STATUS.CHECKED_IN && b.endDate === today),
    )
    .sort((a, b) => a.status.localeCompare(b.status));
}

/** Validates a new booking and returns the full record (without id). Throws with a readable message. */
export function buildNewBooking(input, { cabin, settings, cabinBookings }) {
  const { startDate, endDate } = input;
  const numGuests = Number(input.numGuests);
  if (!cabin) throw new Error("Please choose a cabin.");
  if (!startDate || !endDate) throw new Error("Please choose check-in and check-out dates.");

  const nights = nightsBetween(startDate, endDate);
  if (nights < 1) throw new Error("Check-out must be after check-in.");
  if (startDate < todayISO()) throw new Error("Check-in can't be in the past.");
  if (nights < settings.minBookingLength) throw new Error(`Minimum stay is ${settings.minBookingLength} nights.`);
  if (nights > settings.maxBookingLength) throw new Error(`Maximum stay is ${settings.maxBookingLength} nights.`);
  if (numGuests < 1) throw new Error("At least one guest is required.");
  if (numGuests > cabin.maxCapacity) throw new Error(`${cabin.name} sleeps at most ${cabin.maxCapacity}.`);
  if (numGuests > settings.maxGuestsPerBooking)
    throw new Error(`Bookings are limited to ${settings.maxGuestsPerBooking} guests.`);

  const clash = cabinBookings.find(
    (b) => b.status !== STATUS.CHECKED_OUT && startDate < b.endDate && endDate > b.startDate,
  );
  if (clash) throw new Error(`${cabin.name} is already booked ${clash.startDate} → ${clash.endDate}.`);

  const prices = calcBookingPrices({
    startDate,
    endDate,
    cabin,
    numGuests,
    hasBreakfast: Boolean(input.hasBreakfast),
    breakfastPrice: settings.breakfastPrice,
  });

  return {
    createdAt: new Date().toISOString(),
    startDate,
    endDate,
    cabinId: cabin.id,
    numGuests,
    hasBreakfast: Boolean(input.hasBreakfast),
    isPaid: Boolean(input.isPaid),
    observations: input.observations?.trim() ?? "",
    status: STATUS.UNCONFIRMED,
    ...prices,
  };
}
