import React, { useState, useEffect } from "react";
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiCreditCard,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiHash,
  FiGlobe
} from "react-icons/fi";
import useBankStore from "../../Store/useBankStore";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`
        relative bg-white rounded-xl sm:rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden
        transform transition-all duration-300 scale-100
        border border-gray-200/50
      `}>
        {title && (
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <FiCreditCard className="mr-2 sm:mr-3 text-blue-600" size={20} />
              <span className="text-sm sm:text-xl">{title}</span>
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="p-2 hover:bg-white/50 rounded-full transition-colors duration-200"
            >
              <FiX size={18} className="text-gray-500" />
            </button>
          </div>
        )}
        
        <div className={`${title ? "p-3 sm:p-6" : "p-3 sm:p-6"} max-h-[calc(90vh-80px)] overflow-y-auto`}>
          {children}
        </div>
      </div>
    </div>
  );
};

const BankDetailsForm = ({
  darkMode = false,
  accounts = [],
  setError = () => {},
  setSuccess = () => {},
}) => {
  const { addBankAccount, error, clearError } = useBankStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    ibanNumber: "",
    beneficiaryName: "",
    swiftCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Handle errors from store
  useEffect(() => {
    if (error) {
      setError(error);
      clearError();
    }
  }, [error, setError, clearError]);

  const validateForm = () => {
    const errors = {};
    
    if (!bankDetails.bankName.trim()) {
      errors.bankName = "Bank name is required";
    }
    
    if (!bankDetails.beneficiaryName.trim()) {
      errors.beneficiaryName = "Account holder name is required";
    }
    
    if (!bankDetails.ibanNumber.trim()) {
      errors.ibanNumber = "IBAN number is required";
    } else if (bankDetails.ibanNumber.replace(/\s/g, "").length < 15) {
      errors.ibanNumber = "IBAN number appears to be too short";
    }
    
    if (bankDetails.swiftCode.trim() && bankDetails.swiftCode.trim().length < 8) {
      errors.swiftCode = "SWIFT/BIC code must be at least 8 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fix the validation errors below");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        bankName: bankDetails.bankName.trim(),
        accountHolderName: bankDetails.beneficiaryName.trim(),
        iban: bankDetails.ibanNumber.replace(/\s/g, ""),
        bic: bankDetails.swiftCode.trim() || undefined,
      };

      console.log("Submitting bank account:", payload);
      
      const result = await addBankAccount(payload);
      
      if (result) {
        setSuccess("Bank account added successfully!");
        
        setBankDetails({
          bankName: "",
          ibanNumber: "",
          beneficiaryName: "",
          swiftCode: "",
        });
        setValidationErrors({});
        setShowAddModal(false);
        
        console.log("Added bank account:", result);
      }
    } catch (err) {
      console.error("Error adding bank account:", err);
      setError(err.message || "Failed to add bank account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatIban = (iban) => {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (account) => {
    if (account.isVerified) {
      return (
        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
          <FiCheck className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Verified</span>
          <span className="sm:hidden">✓</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <FiX className="w-3 h-3 mr-1" />
        <span className="hidden sm:inline">Pending</span>
        <span className="sm:hidden">⏳</span>
      </span>
    );
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setBankDetails({
      bankName: "",
      ibanNumber: "",
      beneficiaryName: "",
      swiftCode: "",
    });
    setValidationErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Add Bank Account Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={handleModalClose}
        title="Add New Bank Account"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                Bank Name *
              </label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="bankName"
                  value={bankDetails.bankName}
                  onChange={handleInputChange}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base ${
                    validationErrors.bankName ? 'border-red-300' : 'border-gray-200'
                  }`}
                  required
                  placeholder="e.g. Zenith Bank"
                />
              </div>
              {validationErrors.bankName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{validationErrors.bankName}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                IBAN Number *
              </label>
              <div className="relative">
                <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="ibanNumber"
                  value={bankDetails.ibanNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    let formattedValue = "";
                    for (let i = 0; i < value.length; i++) {
                      if (i > 0 && i % 4 === 0) formattedValue += " ";
                      formattedValue += value[i];
                    }
                    e.target.value = formattedValue;
                    handleInputChange(e);
                  }}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono text-sm ${
                    validationErrors.ibanNumber ? 'border-red-300' : 'border-gray-200'
                  }`}
                  required
                  placeholder="DE89 3704 0044 0532 0130 00"
                  maxLength="27"
                />
              </div>
              {validationErrors.ibanNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{validationErrors.ibanNumber}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                Account Holder Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="beneficiaryName"
                  value={bankDetails.beneficiaryName}
                  onChange={handleInputChange}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base ${
                    validationErrors.beneficiaryName ? 'border-red-300' : 'border-gray-200'
                  }`}
                  required
                  placeholder="Edi Mark Ibu"
                />
              </div>
              {validationErrors.beneficiaryName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{validationErrors.beneficiaryName}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                SWIFT/BIC Code
              </label>
              <div className="relative">
                <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="swiftCode"
                  value={bankDetails.swiftCode}
                  onChange={(e) => {
                    e.target.value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    handleInputChange(e);
                  }}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white font-mono text-sm ${
                    validationErrors.swiftCode ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="BARCGB22"
                  maxLength="11"
                />
              </div>
              {validationErrors.swiftCode && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{validationErrors.swiftCode}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Optional - Used for international transfers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-2 border-white border-t-transparent mr-2"></div>
                  <span className="text-sm sm:text-base">Processing...</span>
                </>
              ) : (
                <>
                  <FiPlus className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                  <span className="text-sm sm:text-base">Add Bank Account</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Bank Accounts
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your bank accounts for withdrawals and payments
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto"
        >
          <FiPlus className="mr-2" size={16} />
          <span className="text-sm sm:text-base">Add Account</span>
        </button>
      </div>

      {/* Bank Accounts Grid */}
      {accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {accounts.map((account, index) => (
            <div
              key={account._id || index}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-2 sm:mr-4">
                      <FiCreditCard className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                        {account.bankName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {account.accountHolderName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 sm:gap-2">
                    {getStatusBadge(account)}
                    {account.isDefault && (
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-3 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center mb-2">
                      <FiHash className="text-gray-400 mr-2" size={14} />
                      <span className="text-xs sm:text-sm font-bold text-gray-700">IBAN</span>
                    </div>
                    <p className="font-mono text-sm sm:text-lg font-semibold text-gray-900 break-all">
                      {formatIban(account.iban)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {account.bic && (
                      <div>
                        <div className="flex items-center mb-2">
                          <FiGlobe className="text-gray-400 mr-2" size={12} />
                          <span className="text-xs sm:text-sm font-bold text-gray-700">SWIFT/BIC</span>
                        </div>
                        <p className="font-mono text-xs sm:text-sm font-semibold text-gray-900">
                          {account.bic}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <FiMapPin className="text-gray-400 mr-2" size={12} />
                        <span className="text-xs sm:text-sm font-bold text-gray-700">Currency</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {account.currency?.toUpperCase() || 'N/A'}
                      </p>
                    </div>
                    
                    {account.country && (
                      <div>
                        <div className="flex items-center mb-2">
                          <FiMapPin className="text-gray-400 mr-2" size={12} />
                          <span className="text-xs sm:text-sm font-bold text-gray-700">Country</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                          {account.country}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <FiCalendar className="text-gray-400 mr-2" size={12} />
                        <span className="text-xs sm:text-sm font-bold text-gray-700">Added</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        {formatDate(account.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Uncomment when needed */}
                {/* 
                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100">
                  <button className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                    <FiEdit2 size={18} />
                  </button>
                  <button className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
                    <FiTrash2 size={18} />
                  </button>
                </div>
                */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 sm:py-16">
          <div className="bg-gray-100 rounded-full w-16 sm:w-24 h-16 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FiCreditCard className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            No Bank Accounts Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
            Add your first bank account to start receiving payments and managing your finances.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FiPlus className="mr-2" size={18} />
            Add Your First Bank Account
          </button>
        </div>
      )}
    </div>
  );
};

export default BankDetailsForm;