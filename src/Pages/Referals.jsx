import React, { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiCalendar,
  FiMail,
  FiDollarSign,
  FiPlus,
  FiCopy,
  FiRefreshCw,
  FiDownload,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import useReferralStore from "../Store/useReferralStore";
import {QRCodeSVG} from 'qrcode.react';

// Enhanced Modal Component
const Modal = ({ isOpen, onClose, children, size = "md", title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal content with enhanced styling */}
      <div className={`
        relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full
        transform transition-all duration-300 scale-100
        border border-gray-200/50
      `}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <FiX size={20} className="text-gray-500" />
            </button>
          </div>
        )}
        
        <div className={title ? "p-6" : "p-6"}>
          {children}
        </div>
      </div>
    </div>
  );
};

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
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const qrRef = useRef(null);

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

  const downloadQRCode = () => {
    if (!qrRef.current || !referralData?.affiliateStats?.referralCode) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a canvas to convert SVG to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = function() {
      // Set canvas size
      canvas.width = 300;
      canvas.height = 300;
      
      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob and download
      canvas.toBlob(function(blob) {
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `referral-qr-${referralData.affiliateStats.referralCode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        toast.success("QR code downloaded successfully!");
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  // Generate referral URL (you may need to adjust this based on your app's URL structure)
  const getReferralUrl = () => {
    if (!referralData?.affiliateStats?.referralCode) return "";
    return `${window.location.origin}/register?ref=${referralData.affiliateStats.referralCode}`;
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
      {/* Enhanced Referral Code Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Enter Referral Code"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please enter the referral code you'd like to use below.
          </p>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter referral code"
            value={referralCodeInput}
            onChange={(e) => setReferralCodeInput(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateReferral}
              disabled={isCreating}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isCreating ? "Processing..." : "Submit"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Enhanced QR Code Modal */}
      <Modal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)}
        title="Referral QR Code"
        size="lg"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Enhanced QR Code with better styling */}
          <div 
            ref={qrRef}
            className="p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl shadow-inner"
          >
            <QRCodeSVG 
              value={getReferralUrl()}
              size={220}
              level="H" // Higher error correction for better scanning
              includeMargin={true}
              fgColor="#1f2937" // Dark gray for better contrast
              bgColor="#ffffff"
              imageSettings={{
                src: "", // You can add a logo here if needed
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
          
          <div className="text-center space-y-3 w-full">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Referral Code:</p>
              <p className="font-mono bg-white px-4 py-2 rounded-lg text-lg font-semibold border border-gray-200">
                {referralData?.affiliateStats?.referralCode}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs font-medium text-blue-700 mb-2">Referral URL:</p>
              <p className="text-xs bg-white px-3 py-2 rounded-lg break-all border border-blue-200 font-mono">
                {getReferralUrl()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3 w-full">
            <button
              onClick={() => {
                navigator.clipboard.writeText(getReferralUrl());
                toast.success("Referral URL copied to clipboard!");
              }}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <FiCopy className="mr-2" size={16} />
              Copy URL
            </button>
            <button
              onClick={downloadQRCode}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <FiDownload className="mr-2" size={16} />
              Download
            </button>
          </div>
        </div>
      </Modal>

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
                <button
                  onClick={() => setIsQRModalOpen(true)}
                  disabled={!referralData.affiliateStats.referralCode}
                  className="ml-2 p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  title="View QR Code"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm6 0h2v2h-2V5zm4 0h2v2h-2V5zm-2 4h2v2h-2V9zm4-4h2v8h-2V5zm-4 6h2v2h-2v-2zm0 4h2v8h-2v-8zm-6-2H3v8h8v-8zm-2 6H5v-4h4v4zm4-4h2v2h-2v-2zm2 4h2v2h-2v-2zm-2 2h2v2h-2v-2z"/>
                  </svg>
                </button>
              </div>
            </div>
            {/* Fixed Add Referral button with reduced padding */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-3 bg-blue-600 h-12 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <FiPlus className="mr-1.5" size={16} />
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