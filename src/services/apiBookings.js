import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, startAt, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseClient";
import { getToday } from "../utils/helpers";
import { PAGE_SIZE } from "../utils/Constants";

// Get bookings with optional filter, sort, and pagination
export async function getBookings({ filter, sortBy, page }) {
  let q = collection(db, "bookings");

  const constraints = [];

  // FILTER
  if (filter) {
    const method = filter.method || "==";
    constraints.push(where(filter.field, method, filter.value));
  }

  // SORT
  if (sortBy) {
    constraints.push(orderBy(sortBy.field, sortBy.direction === "asc" ? "asc" : "desc"));
  }

  // PAGINATION
  if (page) {
    constraints.push(limit(PAGE_SIZE));
    constraints.push(startAt((page - 1) * PAGE_SIZE));
  }

  const snapshot = await getDocs(query(q, ...constraints));
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return { data, count: data.length };
}

// Get single booking by ID
export async function getBooking(id) {
  const ref = doc(db, "bookings", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) throw new Error("Booking not found");
  return { id, ...snapshot.data() };
}

// Bookings created after a date
export async function getBookingsAfterDate(date) {
  if (!date || isNaN(Date.parse(date))) {
    console.warn("Invalid date passed to getBookingsAfterDate:", date);
    return [];
  }

  const snapshot = await getDocs(
    query(collection(db, "bookings"), where("created_at", ">=", date), where("created_at", "<=", getToday({ end: true })))
  );
  return snapshot.docs.map((doc) => doc.data());
}


// Stays after a date
export async function getStaysAfterDate(date) {
  const snapshot = await getDocs(query(collection(db, "bookings"), where("startDate", ">=", date), where("startDate", "<=", getToday())));
  return snapshot.docs.map((doc) => doc.data());
}

// Stays with check-in or check-out today
export async function getStaysTodayActivity() {
  const snapshot = await getDocs(collection(db, "bookings"));
  const today = getToday();

  if (!today || isNaN(Date.parse(today))) {
    console.warn("Invalid today date:", today);
    return [];
  }

  const data = snapshot.docs
    .map((doc) => doc.data())
    .filter((stay) => {
      const start = stay.startDate;
      const end = stay.endDate;
      return (stay.status === "unconfirmed" && start === today) || (stay.status === "checked-in" && end === today);
    });

  return data;
}



// Update booking
export async function updateBooking(id, obj) {
  const ref = doc(db, "bookings", id);
  await updateDoc(ref, obj);
  const updated = await getDoc(ref);
  return { id, ...updated.data() };
}

// Delete booking
export async function deleteBooking(id) {
  await deleteDoc(doc(db, "bookings", id));
}
