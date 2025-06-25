// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlS8gEJxEFBxmI0SYNFxB5cgvKeaVaABY",
  authDomain: "rateo-5cbe3.firebaseapp.com",
  projectId: "rateo-5cbe3",
  storageBucket: "rateo-5cbe3.firebasestorage.app",
  messagingSenderId: "266011731651",
  appId: "1:266011731651:web:88463a005ccc178b30e476",
  measurementId: "G-P5TJP4KK8P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
