/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCotIgcu52R_22O6XTVNFOfVM_2G_MBe_Y",
  authDomain: "madinatul-ulum-madrasa.firebaseapp.com",
  projectId: "madinatul-ulum-madrasa",
  storageBucket: "madinatul-ulum-madrasa.firebasestorage.app",
  messagingSenderId: "494787845880",
  appId: "1:494787845880:web:6d0083f7e3f5fc21de250d",
  measurementId: "G-05NXDRYD74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
export const storage = getStorage(app);
export const db = getFirestore(app);
export default auth
