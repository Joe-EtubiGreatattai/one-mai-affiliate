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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Layout from "./Components/Layout";
import DashboardLayout from "./Components/DashboardLayout";
import AffiliateRegistration from "./Components/AffilateUser/AffiliateRegistration";
import ProfilePage from "./Components/profile/ProfilePage";
import TermAndCondition from "./Pages/TermAndCondition";
import Privacy from "./Pages/Privacy";
import Support from "./Pages/Support";

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
  const [isInstallable, triggerInstall] = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    let darkMode = localStorage.getItem("darkMode");
    if (darkMode === "true") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

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

  const closePrompt = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <>
      <Toaster />
      <ToastContainer position="bottom-right" autoClose={5000} />

      <Routes>
        {/* Global public routes (accessible to everyone) */}
        <Route path="/support" element={<Support />} />
        <Route path="/terms" element={<TermAndCondition />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Public route guard */}
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

        {/* Protected route guard */}
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
