// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-tSOlS_cWbpyEQnbcsDrmK02n35yDnBU",
  authDomain: "collaborative-todo-list-7a224.firebaseapp.com",
  projectId: "collaborative-todo-list-7a224",
  storageBucket: "collaborative-todo-list-7a224.appspot.com",
  messagingSenderId: "540725592901",
  appId: "1:540725592901:web:3404508ff71cdc57c0f42c",
  measurementId: "G-JDERWSYELH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Add Firestore here
