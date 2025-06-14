import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useRegisterSW } from "virtual:pwa-register/react";
import usePWAInstall from "./Components/usePWAInstall";
import useAuthStore from "./Store/Auth";
// Pages
import SignIn from "./Pages/SignIn";
import OtpVerification from "./Pages/OtpVerification";
import CreatePin from "./Pages/CreatePin";
import ResetPassword from "./Pages/ResetPassword";
import CheckYourMail from "./Pages/CheckYourMail";
import CreateNewPassword from "./Pages/CreateNewPassword";
import HomePage from "./Pages/HomePage";
import Referrals from "./Pages/Referals";
import NotificationPage from "./Pages/NotificationPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Layout from "./Components/Layout";
import DashboardLayout from "./Components/DashboardLayout";
import AffiliateRegistration from "./Components/AffilateUser/AffiliateRegistration";
import ProfilePage from "./Components/profile/ProfilePage";
// Auth Protected Route Component
const ProtectedRoute = () => {
  const { user } = useAuthStore();
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

// Auth Public Route Component
const PublicRoute = () => {
  const { user } = useAuthStore();
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

function App() {
  // PWA Installation Prompt
  const [isInstallable, triggerInstall] = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let darkMode = localStorage.getItem("darkMode");
    if (darkMode == "true") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Service Worker Update Handling
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log("Service Worker registered:", swUrl);
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });

  useEffect(() => {
    if (!isInstallable) return;
    const timer = setTimeout(() => setShowBanner(true), 5000);
    return () => clearTimeout(timer);
  }, [isInstallable]);

  // Close offline ready/update notifications
  const closePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <>
      <Toaster />
      <ToastContainer position="bottom-right" autoClose={5000} />

      {/* PWA Install Banner - Updated to top with less height */}
      {/* {showBanner && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-2 z-50 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-sm">
              <h3 className="font-bold text-base">Install Our App</h3>
              <p className="text-xs">
                Get the best experience by installing to your home screen
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBanner(false)}
                className="px-3 py-1 bg-white text-blue-600 rounded text-sm"
              >
                Later
              </button>
              <button
                onClick={triggerInstall}
                className="px-3 py-1 bg-white text-blue-600 rounded font-bold text-sm"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Service Worker Update Notification - Also updated to top */}
    

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/create-pin" element={<CreatePin />} />
          <Route path="/check-mail" element={<CheckYourMail />} />
          <Route path="/change-password" element={<CreateNewPassword />} />
          <Route
            path="/affilator-create-account"
            element={<AffiliateRegistration />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/refearals" element={<Referrals />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notification" element={<NotificationPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
