import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
<<<<<<< HEAD
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
=======
import{
  getFirestore, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
>>>>>>> 14a21fe26338d6e8fb158df9ded9853ce3a82b19
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfGPlgUuzJgDa4kNVV1ksjRZwfhFMXW9I",
  authDomain: "zest-and-co.firebaseapp.com",
  projectId: "zest-and-co",
  storageBucket: "zest-and-co.firebasestorage.app",
  messagingSenderId: "6345256410",
  appId: "1:6345256410:web:c53faff8f8051dfeb9a4e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//  export
export {
  auth,
  db,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
<<<<<<< HEAD
  onAuthStateChanged,
=======
  getFirestore, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
>>>>>>> 14a21fe26338d6e8fb158df9ded9853ce3a82b19
};
