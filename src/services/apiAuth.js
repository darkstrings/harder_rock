import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseClient";

// Signup: create user and store profile in Firestore
export async function signup({ fullName, email, password }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    fullName,
    email,
    avatar: "",
  });

  return { user };
}

// Login
export async function login({ email, password }) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Get current user
export async function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user || null);
    });
  });
}

// Logout
export async function logout() {
  await signOut(auth);
}

// Update user profile
export async function updateCurrentUser({ password, fullName, avatar }) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  // 1. Update password
  if (password) await updatePassword(user, password);

  // 2. Update Firestore profile
  const userRef = doc(db, "users", user.uid);
  const updateData = {};
  if (fullName) updateData.fullName = fullName;
  if (avatar) updateData.avatar = avatar;

  await updateDoc(userRef, updateData);

  return { user };
}
