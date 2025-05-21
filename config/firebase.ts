// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB4kDSk58Agnpi2AlaZyW3vFBmb2CX7nI",
  authDomain: "myexpense-3bbdf.firebaseapp.com",
  projectId: "myexpense-3bbdf",
  storageBucket: "myexpense-3bbdf.firebasestorage.app",
  messagingSenderId: "302189435620",
  appId: "1:302189435620:web:7c3646a1bce17528012af1",
  measurementId: "G-5KXJ52LLGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore
export const firestore = getFirestore(app);