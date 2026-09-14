// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfGPlgUuzJgDa4kNVV1ksjRZwfhFMXW9I",
  authDomain: "zest-and-co.firebaseapp.com",
  projectId: "zest-and-co",
  storageBucket: "zest-and-co.firebasestorage.app",
  messagingSenderId: "6345256410",
  appId: "1:6345256410:web:c53faff8f8051dfeb9a4e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
const auth = getAuth(app);
// Initialize Cloud Firestore
const db = getFirestore(app);
