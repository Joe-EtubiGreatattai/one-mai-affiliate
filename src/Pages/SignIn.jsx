import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useAuthStore from "../Store/Auth";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import GoogleAuthButton from "../Components/GoogleAuthButton";

import Image1 from "../assets/0.png";
import Image2 from "../assets/1.png";
import Image3 from "../assets/2.png";
import Image4 from "../assets/1.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);

  const {
    login,
    verifyPin,
    loading,
    error: authError,
    clearError,
    user,
    tempUser,
  } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate, clearError]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handlePinChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await verifyPin(pin.join(""));
    } catch (error) {
      console.error("PIN verification error:", error);
      setError(error.message || "PIN verification failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({
        email,
        password,
        rememberMe,
        userType: "affiliate",
      });

      if (response?.requiresPinVerification) {
        setShowPinModal(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Optional: Call your backend API to log in or create the user
      console.log("Google user:", user);

      // Redirect or set user state
      navigate("/dashboard");
    } catch (err) {
      console.error("Google sign-in failed", err);
      setError("Google sign-in failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Verify Your Identity
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div className="flex justify-center space-x-4">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    inputMode="numeric"
                    maxLength="1"
                    value={pin[index]}
                    onChange={(e) => handlePinChange(e, index)}
                    className="w-16 h-16 text-center text-2xl border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading || pin.some((digit) => !digit)}
                className={`w-full py-3 px-4 text-white font-medium rounded-md ${loading ? "bg-[#3390d5]" : "bg-[#3390d5] hover:bg-[#2570b5]"
                  }`}
              >
                {loading ? "Verifying..." : "Verify PIN"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sign In Form */}
      <div className="w-full md:w-1/2 sm:bg-white flex flex-col items-center justify-center px-4 py-14 sm:p-6 lg:p-8 min-h-screen">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-left sm:text-center">
            <h2 className="text-2xl max-sm:text-start sm:text-3xl font-semibold sm:font-bold text-gray-900 mb-1 sm:mb-2">
              Sign In
            </h2>
            <p className="text-base sm:text-lg max-sm:text-start max-sm:text-sm text-gray-500">
              Welcome Back We've Missed You!
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/reset-password" className="text-sm text-[#3390d5]">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#3390d5] text-white font-medium rounded-md hover:bg-[#2570b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* 🔵 Google Sign-in */}
            <GoogleAuthButton buttonText="Sign in with Google" />
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/affilator-create-account" className="font-medium text-[#3390d5]">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Carousel with Same Dimensions as Signup Form */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-14 sm:p-6 lg:p-8">
          <div className="w-full max-w-md h-full">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              showArrows={false}
              interval={5000}
              transitionTime={800}
              swipeable
              emulateTouch
              className="h-full"
            >
              {[Image1, Image2, Image3, Image4].map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-fit rounded-lg"
                    style={{ 
                      width: '100%',
                      height: 'auto',
                      maxHeight: '70vh',
                      aspectRatio: '4/3'
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;