import React, { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import useAuthStore from "../Store/Auth";
import useWalletStore from "../Store/useWalletStore";
import useReferralStore from "../Store/useReferralStore";
import useBankStore from "../Store/useBankStore";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function DashBoard({ welcomeOnly = undefined }) {
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Store hooks
  const { user } = useAuthStore();
  const {
    balance,
    currency = "USD",
    initializeWallet,
    error: walletError,
  } = useWalletStore();
  const { referralData, fetchMyReferrals } = useReferralStore();

  const { bankDetails, fetchBankDetails } = useBankStore();

  // Derived values from referral data
  const referralStats = referralData?.affiliateStats || {};
  const referralCode = referralStats?.referralCode || "";
  const totalReferrals = referralStats?.totalReferrals || 0;
  const activeReferrals = referralStats?.activeReferrals || 0;

  // User details
  const userRole = user?.userType || "user";
  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";
  const profileCompletion = bankDetails?.data ? 100 : 75;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        await Promise.all([
          initializeWallet(),
          fetchMyReferrals(),
          fetchBankDetails(),
        ]);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      loadData();
    }
  }, [
    user?._id,
    location.key,
    initializeWallet,
    fetchMyReferrals,
    fetchBankDetails,
  ]);

  useEffect(() => {
    if (walletError) {
      toast.error(walletError);
    }
  }, [walletError]);

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="bg-gray-200 rounded-lg p-6 mb-6 h-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          Error: {error}. Please refresh the page or contact support.
        </div>
      </div>
    );
  }

  if (welcomeOnly) {
    return (
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white text-gray-800 mb-1">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome Back, {firstName} {lastName}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Dashboard Card */}
      <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-lg">
        {/* Current Balance Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">
              Current Balance
            </h3>
            <p className="text-4xl font-bold">
              {balanceVisible ? formatCurrency(balance) : "****"}
            </p>
          </div>
          <button
            onClick={toggleBalanceVisibility}
            className="text-gray-400 hover:text-white transition-colors mt-1"
            aria-label={balanceVisible ? "Hide balance" : "Show balance"}
          >
            {balanceVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Bottom Section - Referrals and Code */}
        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-gray-300 text-sm font-medium mb-1">
              Total Referrals
            </h4>
            <p className="text-2xl font-bold">{totalReferrals}</p>
          </div>
          
          <div className="text-right">
            <div className="text-gray-300 text-sm font-medium mb-2">
              {referralCode || "SAVEWITHTIJANI"}
            </div>
            <button
              onClick={copyReferralCode}
              className="flex items-center text-gray-300 hover:text-white transition-colors text-sm"
              aria-label="Copy referral code"
            >
              <FiCopy size={16} className="mr-2" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;