import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// আপনার ফায়ারবেস কনফিগারেশন এখানে দিন
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCjP81uy-yFQXZ2ROfcMGh12IibIl9dLHk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "campusbondhu-notes.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "campusbondhu-notes",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "campusbondhu-notes.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "808421305376",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:808421305376:web:5bbe5fcdb449c40b5ee045"
};

// Validate config
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

if (!isConfigValid) {
  console.warn("Firebase configuration is missing or invalid. Please set the VITE_FIREBASE_* environment variables in AI Studio Secrets.");
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
