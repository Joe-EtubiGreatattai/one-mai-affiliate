import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import GoogleAuthButton from "../../Components/GoogleAuthButton";

import Img1 from "../../assets/0.png";
import Img2 from "../../assets/1.png";
import Img3 from "../../assets/2.png";

import useAuthStore from "../../Store/Auth";

function AffiliateRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
    userType: "affiliate",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { initiateSignup, loading, error: authError, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (authError) clearError();
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone }));
    if (authError) clearError();
    if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) errors.email = "Please enter a valid email";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (!formData.agreed) errors.agreed = "You must agree to the terms";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const isValid = validateForm();

  // If not valid and checkbox is unticked, show an alert
  if (!isValid) {
    if (!formData.agreed) {
      alert('Please tick the checkbox to agree to the Terms and Conditions and Privacy Policy before signing up.');
      const checkbox = document.getElementById('agreed');
      if (checkbox) checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    const fullPhone = `${selectedCountry.dialCode}${formData.phone}`;

    await initiateSignup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: fullPhone,
      password: formData.password,
      userType: 'affiliate',
    });

    navigate('/otp', {
      state: {
        signupData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: fullPhone,
          password: formData.password,
          userType: 'affiliate',
        },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left - Form */}
      <div className="flex-1 w-full md:w-1/2 p-6 sm:p-10 xl:p-16 flex flex-col justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-[#2E2E2E] mb-2">Become an affiliate</h2>
          <p className="text-sm text-[#9A9A9A] mb-6">
            Please provide us with your basic details below so that we can get to know you better.
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-1">First Name*</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formErrors.firstName ? "border-red-500" : "border-[#EAEAEA]"
                  }`}
                  placeholder="John"
                />
                {formErrors.firstName && <p className="text-sm text-red-600">{formErrors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-1">Last Name*</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formErrors.lastName ? "border-red-500" : "border-[#EAEAEA]"
                  }`}
                  placeholder="Doe"
                />
                {formErrors.lastName && <p className="text-sm text-red-600">{formErrors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-1">Email*</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.email ? "border-red-500" : "border-[#EAEAEA]"
                }`}
                placeholder="your@email.com"
              />
              {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-1">Phone Number*</label>
              <div
                className={`border p-1.5 rounded-md ${
                  formErrors.phone ? "border-red-500" : "border-[#EAEAEA]"
                }`}
              >
                <PhoneInput
                  international
                  defaultCountry="PT"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputClassName="w-full px-3 py-2"
                />
              </div>
              {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-1">Password*</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.password ? "border-red-500" : "border-[#EAEAEA]"
                }`}
                placeholder="••••••••"
              />
              {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-1">Confirm Password*</label>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  formErrors.confirmPassword ? "border-red-500" : "border-[#EAEAEA]"
                }`}
                placeholder="••••••••"
              />
              {formErrors.confirmPassword && <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>}
            </div>

            <div className="flex items-start">
              <input
                id="agreed"
                name="agreed"
                type="checkbox"
                checked={formData.agreed}
                onChange={handleChange}
                className="h-4 w-4 text-[#3390D5] focus:ring-[#3390D5] border-[#EAEAEA] rounded"
              />
              <label htmlFor="agreed" className="ml-2 text-sm text-[#2E2E2E]">
                I agree to the{" "}
                <a href="/terms" className="text-[#3390D5]">Terms and Conditions</a> and{" "}
                <a href="/privacy" className="text-[#3390D5]">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#3390D5] text-white font-medium rounded-md hover:bg-[#2570b5] transition"
            >
              {loading ? "Creating Account..." : "Join OneMAIX"}
            </button>
             {/* 🔵 Google Sign-in */}
              <GoogleAuthButton buttonText="Sign up with Google" />
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already an affiliate?{" "}
              <Link to="/signin" className="font-medium text-[#3390d5]">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Image Carousel with Same Dimensions as Form */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="min-h-screen w-full p-6 sm:p-10 xl:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              showArrows={false}
              interval={5000}
              transitionTime={800}
              swipeable
              emulateTouch
              className="h-full"
            >
              {[Img1, Img2, Img3].map((img, idx) => (
                <div key={idx} className="relative">
                  <img 
                    src={img} 
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
}

export default AffiliateRegistration;