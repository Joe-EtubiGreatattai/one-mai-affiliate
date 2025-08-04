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
    currency = "EUR",
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

  // Get the actual referral code to display and copy
  const displayReferralCode = referralCode || "SAVEWITHTIJANI";

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

  const copyReferralCode = async () => {
    try {
      // Use the same code that's displayed to the user
      const codeToCopy = displayReferralCode;
      
      // Check if navigator.clipboard is available (modern browsers)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(codeToCopy);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = codeToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy referral code:', err);
      toast.error("Failed to copy referral code");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6">
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
      <div className="w-full p-4 sm:p-6">
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
        <p className="text-gray-600 dark:text-gray-300">
          Welcome Back, {firstName} {lastName}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Dashboard Card - Now uses full width */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 lg:p-8 rounded-2xl shadow-lg">
        {/* Header with profile completion indicator */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">Account Overview</h2>
            <p className="text-gray-300 text-sm">Profile {profileCompletion}% complete</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {firstName.charAt(0)}{lastName.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Balance and Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Balance Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-gray-300 text-sm font-medium mb-2">
                  Current Balance
                </h3>
                <p className="text-4xl lg:text-5xl font-bold">
                  {balanceVisible ? formatCurrency(balance) : "****"}
                </p>
              </div>
              <button
                onClick={toggleBalanceVisibility}
                className="text-gray-400 hover:text-white transition-colors mt-1 p-2 hover:bg-gray-700 rounded-lg"
                aria-label={balanceVisible ? "Hide balance" : "Show balance"}
              >
                {balanceVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="space-y-4">
            <div>
              <h4 className="text-gray-300 text-sm font-medium mb-1">
                Total Referrals
              </h4>
              <p className="text-2xl font-bold">{totalReferrals}</p>
            </div>
            <div>
              <h4 className="text-gray-300 text-sm font-medium mb-1">
                Active Referrals
              </h4>
              <p className="text-2xl font-bold text-green-400">{activeReferrals}</p>
            </div>
          </div>
        </div>

        {/* Referral Code Section - Full Width */}
        <div className="bg-gray-700/50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-gray-300 text-sm font-medium mb-1">
              Your Referral Code
            </h4>
            <p className="text-lg font-mono font-bold">
              {displayReferralCode}
            </p>
          </div>
          
          <button
            onClick={copyReferralCode}
            disabled={copied}
            className={`flex items-center transition-colors px-4 py-2 rounded-lg text-sm font-medium ${
              copied 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-[#3390d5] hover:bg-[#2980c4]'
            }`}
            aria-label="Copy referral code"
          >
            <FiCopy size={16} className="mr-2" />
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;