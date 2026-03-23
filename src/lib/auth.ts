import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

export type { User };

let currentUser: User | null = null;

// Listen to auth state
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

export function getCurrentUser(): User | null {
  return currentUser || auth.currentUser;
}

export function isAuthenticated(): boolean {
  return !!(currentUser || auth.currentUser);
}

export function getCurrentUserId(): string | null {
  const user = getCurrentUser();
  return user?.uid || null;
}

export async function registerUser(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
