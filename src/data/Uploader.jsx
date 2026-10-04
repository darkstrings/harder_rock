import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import { subtractDates } from "../utils/helpers";
import Button from "../ui/Button";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

import { collection, deleteDoc, doc, getDocs, setDoc, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebaseClient";

console.log(cabins, guests, bookings);

// 🔥 DELETE
async function deleteCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  const deletions = snapshot.docs.map((docSnap) => deleteDoc(doc(db, name, docSnap.id)));
  await Promise.all(deletions);
}

async function deleteGuests() {
  await deleteCollection("guests");
}

async function deleteCabins() {
  await deleteCollection("cabins");
}

async function deleteBookings() {
  await deleteCollection("bookings");
}

// ✅ CREATE
async function createGuests() {
  const inserts = guests.map((guest) => {
    const id = crypto.randomUUID();
    return setDoc(doc(db, "guests", id), guest);
  });
  await Promise.all(inserts);
}

async function createCabins() {
  const inserts = cabins.map((cabin) => {
    const id = crypto.randomUUID();
    return setDoc(doc(db, "cabins", id), cabin);
  });
  await Promise.all(inserts);
}

async function createBookings() {
  const guestSnap = await getDocs(query(collection(db, "guests"), orderBy("id")));
  const cabinSnap = await getDocs(query(collection(db, "cabins"), orderBy("id")));

  const allGuestIds = guestSnap.docs.map((doc) => doc.id);
  const allCabinIds = cabinSnap.docs.map((doc) => doc.id);

  const finalBookings = bookings.map((booking) => {
    const cabin = cabins.at(booking.cabinId - 1);
    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast ? numNights * 15 * booking.numGuests : 0;
    const totalPrice = cabinPrice + extrasPrice;

    let status;
    if (isPast(new Date(booking.endDate)) && !isToday(new Date(booking.endDate))) status = "checked-out";
    if (isFuture(new Date(booking.startDate)) || isToday(new Date(booking.startDate))) status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) || isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = "checked-in";

    return {
      ...booking,
      numNights,
      cabinPrice,
      extrasPrice,
      totalPrice,
      guestId: allGuestIds.at(booking.guestId - 1),
      cabinId: allCabinIds.at(booking.cabinId - 1),
      status,
    };
  });

  const inserts = finalBookings.map((booking) => {
    const id = crypto.randomUUID();
    return setDoc(doc(db, "bookings", id), booking);
  });

  await Promise.all(inserts);
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    await createGuests();
    await createCabins();
    await createBookings();
    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
