import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ← Add this line

const firebaseConfig = {
  apiKey: "AIzaSyBQlkNepsR5wZtu1ZQsRDhKXSbPU6k8lCs",
  authDomain: "harderrock-d5b97.firebaseapp.com",
  projectId: "harderrock-d5b97",
  storageBucket: "harderrock-d5b97.firebasestorage.app",
  messagingSenderId: "165067626365",
  appId: "1:165067626365:web:00c0308c6e0a1c35e85e14",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ← Add this line too
