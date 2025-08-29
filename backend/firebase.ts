import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1GA4qtJ3M2DvQO82ENqmeUzqrO3hC_j4",
  authDomain: "uzuri-de01c.firebaseapp.com",
  projectId: "uzuri-de01c",
  storageBucket: "uzuri-de01c.appspot.com", // ⚠️ fixed this (was .app instead of .app**spot**.com)
  messagingSenderId: "1065164418935",
  appId: "1:1065164418935:web:831edb00d85ccc4f07fb72",
  measurementId: "G-Y56W6H22SW",
};

// Only initialize once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ Web SDKs only — works in Expo Go
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
