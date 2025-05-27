import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiCalendar,
  FiMail,
  FiDollarSign,
  FiPlus,
  FiCopy,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";
import useReferralStore from "../Store/useReferralStore";

function Referrals() {
  const {
    referralData,
    fetchMyReferrals,
    fetchReferralCode,
    createReferral,
    loading: storeLoading,
    error: storeError,
  } = useReferralStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setIsRefreshing(true);
      await fetchMyReferrals();
      await fetchReferralCode();
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fetchMyReferrals, fetchReferralCode]);

  useEffect(() => {
    if (referralData?.referrals) {
      if (!searchTerm) {
        setFilteredReferrals(referralData.referrals);
      } else {
        const filtered = referralData.referrals.filter(
          (referral) =>
            referral.user?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            referral.user?.email
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            referral.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReferrals(filtered);
      }
    }
  }, [searchTerm, referralData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateReferral = async () => {
    if (!referralCodeInput.trim()) {
      toast.error("Please enter a referral code");
      return;
    }

    setIsCreating(true);
    const { success, error } = await createReferral(referralCodeInput);
    setIsCreating(false);

    if (success) {
      toast.success("Referral created successfully!");
      setReferralCodeInput("");
      setIsModalOpen(false);
      await loadData();
    } else {
      toast.error(error || "Failed to create referral");
    }
  };

  const copyToClipboard = () => {
    if (referralData?.affiliateStats?.referralCode) {
      navigator.clipboard.writeText(referralData.affiliateStats.referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  if (storeLoading && !isCreating && !isRefreshing) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{storeError}</p>
                <p className="mt-2">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Referral Code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Enter Referral Code</h2>
            <p className="text-gray-600 mb-4">
              Please enter the referral code you'd like to use below.
            </p>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Enter referral code"
              value={referralCodeInput}
              onChange={(e) => setReferralCodeInput(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReferral}
                disabled={isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          My Referrals
        </h1>
        {referralData?.affiliateStats && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="bg-blue-50 p-3 rounded-lg flex-1 sm:flex-none">
              <div className="flex justify-between items-center">
                <p className="text-xs sm:text-sm text-gray-600">My Referral Code:</p>
                <button
                  onClick={loadData}
                  disabled={isRefreshing}
                  className="text-blue-600 hover:text-blue-800"
                  title="Refresh"
                >
                  <FiRefreshCw className={`${isRefreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
              <div className="flex items-center mt-1">
                <span className="font-mono bg-blue-100 px-2 py-1 rounded text-sm">
                  {referralData.affiliateStats.referralCode || "Loading..."}
                </span>
                <button
                  onClick={copyToClipboard}
                  disabled={!referralData.affiliateStats.referralCode}
                  className="ml-2 p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  title="Copy to clipboard"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              <span>Add Referral</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {referralData?.affiliateStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Total Referrals</h3>
            <p className="text-2xl font-bold">
              {referralData.affiliateStats.totalReferrals}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Active Referrals</h3>
            <p className="text-2xl font-bold">
              {referralData.affiliateStats.activeReferrals}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Total Earnings</h3>
            <p className="text-2xl font-bold flex items-center">
              <FiDollarSign className="mr-1" />
              {referralData.affiliateStats.totalBonusEarned || 0}
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Search by name, email, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Referrals Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral) => (
                  <tr key={referral.referralId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {referral.user?.name || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        {referral.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiMail className="mr-1 hidden sm:inline" />
                        {referral.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(referral.user?.joinDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          referral.status === "active"
                            ? "bg-green-100 text-green-800"
                            : referral.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {referral.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {referralData?.referrals?.length > 0
                      ? "No referrals match your search."
                      : "You have no referrals yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Referrals;