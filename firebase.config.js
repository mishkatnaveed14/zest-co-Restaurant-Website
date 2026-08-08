import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,

} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBm9kCZhDtXJOK148a-8acVIoLBux4w2Pc",
  authDomain: "zestandco-7b360.firebaseapp.com",
  projectId: "zestandco-7b360",
  storageBucket: "zestandco-7b360.firebasestorage.app",
  messagingSenderId: "345032386958",
  appId: "1:345032386958:web:ea3bba37f8d0a8d46a1cdf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//  export
export { 
    auth,
     createUserWithEmailAndPassword
 };
