import { differenceInCalendarDays, parseISO } from "date-fns";

export const STATUS = {
  UNCONFIRMED: "unconfirmed",
  CHECKED_IN: "checked-in",
  CHECKED_OUT: "checked-out",
};

export const STATUS_LABEL = {
  unconfirmed: "Unconfirmed",
  "checked-in": "Checked in",
  "checked-out": "Checked out",
};

export const nightsBetween = (startDate, endDate) =>
  differenceInCalendarDays(parseISO(endDate), parseISO(startDate));

export function calcBookingPrices({ startDate, endDate, cabin, numGuests, hasBreakfast, breakfastPrice }) {
  const numNights = nightsBetween(startDate, endDate);
  const cabinPrice = numNights * (Number(cabin.regularPrice) - Number(cabin.discount || 0));
  const extrasPrice = hasBreakfast ? numNights * Number(breakfastPrice) * Number(numGuests) : 0;
  return { numNights, cabinPrice, extrasPrice, totalPrice: cabinPrice + extrasPrice };
}

/** Status a booking "should" have on a given day (used for seeding). Dates are yyyy-MM-dd. */
export function deriveStatus(startDate, endDate, today) {
  if (endDate < today) return STATUS.CHECKED_OUT;
  if (startDate >= today) return STATUS.UNCONFIRMED;
  return STATUS.CHECKED_IN;
}
