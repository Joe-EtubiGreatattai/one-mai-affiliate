// src/Pages/OtpVerification.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import useAuthStore from "../Store/Auth";

import Image1 from "../assets/0.png";
import Image2 from "../assets/1.png";
import Image3 from "../assets/2.png";
import Image4 from "../assets/1.png";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 digits
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    verifyOtp,      // wrapper you added in the store (or map to verifySignup)
    resendOtp,
    loading,
    error: authError,
    clearError,
    user,
  } = useAuthStore();

  // signup data carried from previous screen
  const signupData = location.state?.signupData;

  useEffect(() => {
    clearError();
    // if you auto-log users in *before* PIN creation, this would push them to dashboard.
    // If you want to force PIN flow, avoid setting `user` until after PIN is created.
    if (user) {
      // Optional: comment this out if you prefer forcing PIN creation first.
      // navigate("/dashboard");
    }

    if (!signupData) {
      navigate("/affilator-create-account");
    }
  }, [user, navigate, clearError, signupData]);

  useEffect(() => {
    if (authError) setError(authError);
  }, [authError]);

  // countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return;
    if (isNaN(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();

    if (error) setError("");
    if (authError) clearError();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const digits = pastedData.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 4; i++) newOtp[i] = digits[i];
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 3);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setError("Please enter the complete 4-digit code");
      return;
    }

    try {
      // Resolve = success
      await verifyOtp({
        email: signupData.email,
        otp: otpCode,
        signupData,
      });

      // Go to Create PIN page, pass the email (and any other needed data)
      navigate("/create-pin", {
        replace: true,
        state: { email: signupData.email },
      });
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err?.message || "Invalid verification code. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0 || isResending) return;
    setIsResending(true);
    setError("");

    try {
      await resendOtp(signupData.email);
      setTimeLeft(120);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err?.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.length > 2
        ? username[0] +
          "*".repeat(username.length - 2) +
          username[username.length - 1]
        : username;
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: OTP form */}
      <div className="w-full md:w-1/2 sm:bg-white flex flex-col items-center justify-center px-4 py-14 sm:p-6 lg:p-8 min-h-screen">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-left sm:text-center">
            <h2 className="text-2xl max-sm:text-start sm:text-3xl font-semibold sm:font-bold text-gray-900 mb-1 sm:mb-2">
              Verify Your Account
            </h2>
            <p className="text-base sm:text-lg max-sm:text-start max-sm:text-sm text-gray-500 mb-2">
              We've sent a 4-digit verification code to
            </p>
            <p className="text-sm font-medium text-gray-700">
              {signupData?.email ? maskEmail(signupData.email) : "your email"}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus={index === 0}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.some((d) => !d)}
              className={`w-full py-3 px-4 text-white font-medium rounded-md transition-colors ${
                loading || otp.some((d) => !d)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3390d5] hover:bg-[#2570b5]"
              }`}
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </form>

          <div className="text-center space-y-2">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-600">
                Resend code in {formatTime(timeLeft)}
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-[#3390d5] hover:text-[#2570b5] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend verification code"}
              </button>
            )}

            <div className="pt-2">
              <p className="text-sm text-gray-600">
                Wrong email?{" "}
                <Link
                  to="/affilator-create-account"
                  className="font-medium text-[#3390d5] hover:text-[#2570b5]"
                >
                  Go back
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Carousel */}
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
                      width: "100%",
                      height: "auto",
                      maxHeight: "70vh",
                      aspectRatio: "4/3",
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

export default OTPVerification;
