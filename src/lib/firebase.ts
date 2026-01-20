import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, onValue, DatabaseReference } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD50ACzA16hyAcX_g05_baUUWd3PIUDn84",
  authDomain: "casamento-404a3.firebaseapp.com",
  databaseURL: "https://casamento-404a3-default-rtdb.firebaseio.com",
  projectId: "casamento-404a3",
  storageBucket: "casamento-404a3.firebasestorage.app",
  messagingSenderId: "665596777998",
  appId: "1:665596777998:web:1a3b5ed173ca53149d0e5f",
  measurementId: "G-ZR00V0SF4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, set, onValue };
export type { DatabaseReference };
