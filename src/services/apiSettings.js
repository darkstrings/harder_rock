import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseClient";

// Firestore: settings are stored in a single document with ID "app"
export async function getSettings() {
  const settingsRef = doc(db, "settings", "app");
  const snapshot = await getDoc(settingsRef);

  if (!snapshot.exists()) {
    throw new Error("Settings could not be loaded");
  }

  return snapshot.data();
}

// newSetting is an object like { theme: "dark" }
export async function updateSetting(newSetting) {
  const settingsRef = doc(db, "settings", "app");

  try {
    await updateDoc(settingsRef, newSetting);
    const updated = await getDoc(settingsRef);
    return updated.data();
  } catch (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
}
