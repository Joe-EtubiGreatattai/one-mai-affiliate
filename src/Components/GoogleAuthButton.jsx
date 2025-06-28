// src/Components/GoogleAuthButton.jsx
import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../Store/Auth";

const firebaseConfig = {
 apiKey: "AIzaSyCY51lvldbdFmzYUZdHcu2zTRwXYX-ulfM",
  authDomain: "onemai.firebaseapp.com",
  projectId: "onemai",
  storageBucket: "onemai.firebasestorage.app",
  messagingSenderId: "1019371957199",
  appId: "1:1019371957199:web:090ada796482f09c4c80ba",
  measurementId: "G-D5Q20LBNG9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const GoogleAuthButton = ({ buttonText = "Continue with Google" }) => {
  const { login, initiateSignup } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const email = user.email || "no-email@placeholder.com";
      const displayName = user.displayName || "User x";
      const [firstName = "User", lastName = "Last name"] = displayName.split(" ");
      const phoneNumber = user.phoneNumber || "0000000000";

      const payload = {
        email,
        password: user.uid,
        rememberMe: true,
        userType: "normal",
      };

      try {
        await login(payload);
        navigate("/dashboard");
      } catch {
        await initiateSignup({
          email,
          firstName,
          lastName,
          phoneNumber,
          userType: "normal",
        });

        navigate("/otp", {
          state: {
            signupData: {
              email,
              password: user.uid,
              firstName,
              lastName,
              phoneNumber,
              userType: "normal",
            },
          },
        });
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Google login failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-white text-gray-700 font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="w-5 h-5"
      />
      {buttonText}
    </button>
  );
};

export default GoogleAuthButton;
