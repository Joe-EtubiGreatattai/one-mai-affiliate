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
  FiGlobe,
  FiCopy
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className={`
        relative bg-white rounded-none sm:rounded-2xl sm:shadow-2xl ${sizeClasses[size]} w-full max-h-[100vh] sm:max-h-[90vh] overflow-hidden
        transform transition-all duration-300 scale-100
        sm:border sm:border-gray-200/50
      `}>
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
              <FiCreditCard className="mr-2 sm:mr-3 text-[#3390d5]" size={20} />
              <span className="text-lg sm:text-xl">{title}</span>
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
        
        <div className={`${title ? "p-4 sm:p-6" : "p-4 sm:p-6"} max-h-[calc(100vh-80px)] sm:max-h-[calc(90vh-80px)] overflow-y-auto`}>
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
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
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
    <div className="w-full sm:max-w-6xl sm:mx-auto p-0 sm:p-4 space-y-4 sm:space-y-6">
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
              <label className="block text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                Bank Name *
              </label>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="bankName"
                  value={bankDetails.bankName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white focus:bg-white ${
                    validationErrors.bankName ? 'border-red-300' : 'border-gray-200'
                  }`}
                  required
                  placeholder="e.g. Zenith Bank"
                />
              </div>
              {validationErrors.bankName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.bankName}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2 sm:mb-3">
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
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white focus:bg-white font-mono text-sm ${
                    validationErrors.ibanNumber ? 'border-red-300' : 'border-gray-200'
                  }`}
                  required
                  placeholder="DE89 3704 0044 0532 0130 00"
                  maxLength="27"
                />
              </div>
              {validationErrors.ibanNumber && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.ibanNumber}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2 sm:mb-3">
                Account Holder Name *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="beneficiaryName"
                  value={bankDetails.beneficiaryName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white focus:bg-white ${
                    validationErrors.beneficiaryName ? 'border-red-300' : 'border-gray-200'
                  }`}
                  required
                  placeholder="Edi Mark Ibu"
                />
              </div>
              {validationErrors.beneficiaryName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.beneficiaryName}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-2 sm:mb-3">
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
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white focus:bg-white font-mono text-sm ${
                    validationErrors.swiftCode ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="BARCGB22"
                  maxLength="11"
                />
              </div>
              {validationErrors.swiftCode && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.swiftCode}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Optional - Used for international transfers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiPlus className="mr-2 h-4 w-4" />
                  <span>Add Bank Account</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-white font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 p-4 sm:p-0">
        <div>
          <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Bank Accounts
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your bank accounts for withdrawals and payments
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center px-6 py-3 bg-[#3390d5] text-white rounded-lg sm:rounded-xl hover:bg-[#2e7ab3] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl w-full sm:w-auto"
          style={{ background: "#3390d5" }}
        >
          <FiPlus className="mr-2" size={16} />
          <span>Add Account</span>
        </button>
      </div>

      {/* Bank Accounts Grid */}
      {accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:gap-6 px-4 sm:px-0">
          {accounts.map((account) => (
            <div
              key={account._id}
              className="w-full max-w-sm sm:max-w-md mx-auto rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-[#0f1e41] to-[#1b3265] text-white font-mono relative overflow-hidden sm:shadow-lg"
            >
              {/* Top */}
              <div className="flex items-center mb-6 sm:mb-8">
                {/* Chip */}
                <div className="w-8 h-6 sm:w-10 sm:h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-sm mr-2"></div>
                {/* Contactless icon */}
                <div className="flex space-x-0.5">
                  <div className="w-1 h-2 rounded-sm bg-white opacity-50"></div>
                  <div className="w-1 h-3 rounded-sm bg-white opacity-50"></div>
                  <div className="w-1 h-4 rounded-sm bg-white opacity-50"></div>
                </div>
              </div>

              {/* IBAN - copyable */}
              <div className="text-lg sm:text-2xl tracking-wide sm:tracking-widest font-semibold mb-3 flex items-center gap-2">
                <span className="break-all sm:break-normal">{formatIban(account.iban)}</span>
                <button 
                  onClick={() => handleCopy(account.iban, account._id)} 
                  className="text-white hover:text-blue-300 transition-colors flex-shrink-0"
                >
                  {copiedId === account._id ? <FiCheck size={16} /> : <FiCopy size={16} />}
                </button>
              </div>

              {/* Account Holder */}
              <div className="uppercase text-xs text-slate-300">Cardholder</div>
              <div className="text-sm mb-3 break-words">{account.accountHolderName}</div>

              {/* Bank Name */}
              <div className="uppercase text-xs text-slate-300">Bank</div>
              <div className="text-sm mb-4 sm:mb-6 break-words">{account.bankName}</div>

              {/* SWIFT & Country */}
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                <div>
                  <div className="uppercase text-xs">SWIFT</div>
                  <div className="text-sm break-words">{account.bic || "N/A"}</div>
                </div>
                <div>
                  <div className="uppercase text-xs">Country</div>
                  <div className="text-sm">{account.country || "N/A"}</div>
                </div>
              </div>

              {/* Currency and status */}
              <div className="flex justify-between items-center mt-4 sm:mt-6 text-xs">
                <span className="uppercase">Eur</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    account.isVerified
                      ? "bg-green-600 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {account.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 sm:py-16 px-4 sm:px-0">
          <div className="bg-gray-100 rounded-full w-16 sm:w-24 h-16 sm:h-24 flex items-center justify-center mx-auto mb-6">
            <FiCreditCard className="text-gray-400" size={28} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            No Bank Accounts Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-md mx-auto">
            Add your first bank account to start receiving payments and managing your finances.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#3390d5] text-white rounded-lg sm:rounded-xl hover:bg-[#2e7ab3] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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