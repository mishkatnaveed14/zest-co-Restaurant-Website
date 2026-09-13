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
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import{
  getFirestore, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  getFirestore, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
};
