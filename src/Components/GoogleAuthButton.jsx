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

console.log("🔥 Firebase config initialized:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("🔥 Firebase app and auth initialized successfully");

const GoogleAuthButton = ({ buttonText = "Continue with Google" }) => {
  const { login, initiateSignup } = useAuthStore();
  const navigate = useNavigate();

  console.log("🎯 GoogleAuthButton component rendered with buttonText:", buttonText);

  const handleGoogleLogin = async () => {
    console.log("🚀 Google login process started");
    
    const provider = new GoogleAuthProvider();
    console.log("📋 GoogleAuthProvider created");

    try {
      console.log("⏳ Attempting signInWithPopup...");
      const result = await signInWithPopup(auth, provider);
      console.log("✅ Google signInWithPopup successful:", {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified,
        photoURL: result.user.photoURL
      });

      const user = result.user;

      const email = user.email || "no-email@placeholder.com";
      const displayName = user.displayName || "User x";
      const [firstName = "User", lastName = "Last name"] = displayName.split(" ");
      const phoneNumber = user.phoneNumber || "0000000000";

      console.log("📝 User data extracted:", {
        email,
        displayName,
        firstName,
        lastName,
        phoneNumber,
        uid: user.uid
      });

      const payload = {
        email,
        password: user.uid,
        rememberMe: true,
        userType: "normal",
      };

      console.log("📦 Login payload prepared:", {
        email: payload.email,
        passwordLength: payload.password.length,
        rememberMe: payload.rememberMe,
        userType: payload.userType
      });

      try {
        console.log("🔐 Attempting login with existing user...");
        await login(payload);
        console.log("✅ Login successful! Navigating to dashboard...");
        navigate("/dashboard");
      } catch (loginError) {
        console.log("❌ Login failed, user might not exist. Error:", loginError);
        console.log("🔄 Attempting to initiate signup...");
        
        const signupData = {
          email,
          firstName,
          lastName,
          phoneNumber,
          userType: "normal",
        };

        console.log("📝 Signup data prepared:", signupData);

        try {
          await initiateSignup(signupData);
          console.log("✅ Signup initiation successful! Navigating to OTP...");
          
          const navigationState = {
            signupData: {
              email,
              password: user.uid,
              firstName,
              lastName,
              phoneNumber,
              userType: "normal",
            },
          };

          console.log("🧭 Navigation state for OTP:", navigationState);

          navigate("/otp", {
            state: navigationState,
          });
        } catch (signupError) {
          console.error("❌ Signup initiation failed:", signupError);
          toast.error("Failed to create account. Please try again.");
        }
      }
    } catch (err) {
      console.error("💥 Google sign-in error occurred:");
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      console.error("Full error object:", err);
      
      // Log specific Firebase Auth errors
      if (err.code) {
        switch (err.code) {
          case 'auth/popup-closed-by-user':
            console.log("🚫 User closed the popup before completing sign-in");
            toast.error("Sign-in cancelled. Please try again.");
            break;
          case 'auth/popup-blocked':
            console.log("🚫 Popup was blocked by browser");
            toast.error("Popup blocked. Please allow popups and try again.");
            break;
          case 'auth/cancelled-popup-request':
            console.log("🚫 Popup request was cancelled");
            break;
          case 'auth/network-request-failed':
            console.log("🌐 Network error occurred");
            toast.error("Network error. Please check your connection.");
            break;
          default:
            console.log("❓ Unknown Firebase Auth error:", err.code);
            toast.error("Google login failed. Try again.");
        }
      } else {
        toast.error("Google login failed. Try again.");
      }
    }
  };

  console.log("🎨 Rendering GoogleAuthButton component");

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