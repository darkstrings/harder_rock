import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebaseClient";

// Get all cabins
export default async function getCabins() {
  const snapshot = await getDocs(collection(db, "cabins"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Create or edit a cabin
export async function createEditCabin(newCabin, id) {
  let imagePath = newCabin.image;

  // Upload image if it's a File object
  if (newCabin.image instanceof File) {
    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", "");
    const imageRef = ref(storage, `cabin-images/${imageName}`);
    await uploadBytes(imageRef, newCabin.image);
    imagePath = await getDownloadURL(imageRef);
  }

  const cabinData = { ...newCabin, image: imagePath };

  if (!id) {
    const newDocRef = doc(collection(db, "cabins"));
    await setDoc(newDocRef, cabinData);
    return { id: newDocRef.id, ...cabinData };
  } else {
    const cabinRef = doc(db, "cabins", id);
    await updateDoc(cabinRef, cabinData);
    return { id, ...cabinData };
  }
}

// Delete a cabin
export async function deleteCabin(id) {
  await deleteDoc(doc(db, "cabins", id));
}
