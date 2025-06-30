// lib/firebase.ts
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Replace the below config with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC1GA4qtJ3M2DvQO82ENqmeUzqrO3hC_j4",
  authDomain: "uzuri-de01c.firebaseapp.com",
  projectId: "uzuri-de01c",
  storageBucket: "uzuri-de01c.firebasestorage.app",
  messagingSenderId: "1065164418935",
  appId: "1:1065164418935:web:831edb00d85ccc4f07fb72",
  measurementId: "G-Y56W6H22SW",
};

// Prevent re-initialization on hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firebase services

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
