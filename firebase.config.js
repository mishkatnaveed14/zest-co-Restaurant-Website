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
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import{
  getFirestore, 
    collection, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyBm9kCZhDtXJOK148a-8acVIoLBux4w2Pc",
  authDomain:"zestandco-7b360.firebaseapp.com",
  projectId: "zestandco-7b360",
  storageBucket: "zestandco-7b360.firebasestorage.app",
  messagingSenderId: "345032386958",
  appId: "1:345032386958:web:ea3bba37f8d0a8d46a1cdf",
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
