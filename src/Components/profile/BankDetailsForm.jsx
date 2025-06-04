import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import useBankStore from "../../Store/useBankStore";

const BankDetailsForm = ({
  darkMode = false,
  accounts = [],
  setError = () => {},
  setSuccess = () => {},
}) => {
  const { addBankAccount, error, clearError } = useBankStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    ibanNumber: "",
    beneficiaryName: "",
    swiftCode: "",
  });

  // Show add form if no accounts exist
  useEffect(() => {
    if (Array.isArray(accounts) && accounts.length === 0) {
      setShowAddForm(true);
      setBankDetails({
        bankName: "",
        ibanNumber: "",
        beneficiaryName: "",
        swiftCode: "",
      });
    }
  }, [accounts]);

  // Handle errors from store
  useEffect(() => {
    if (error) {
      setError(error);
      clearError();
    }
  }, [error, setError, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bankName: bankDetails.bankName.trim(),
        accountHolderName: bankDetails.beneficiaryName.trim(),
        iban: bankDetails.ibanNumber.replace(/\s/g, ""), // Remove spaces for API
        bic: bankDetails.swiftCode.trim(),
      };

      if (!payload.bankName || !payload.accountHolderName || !payload.iban) {
        setError("Bank name, account holder name and IBAN are required");
        return;
      }

      const result = await addBankAccount(payload);
      setSuccess("Bank account added successfully!");
      
      // Clear form and hide it after successful submission
      setBankDetails({
        bankName: "",
        ibanNumber: "",
        beneficiaryName: "",
        swiftCode: "",
      });
      setShowAddForm(false);
      
      console.log("Added bank account:", result);
    } catch (err) {
      // Error handled by store
      console.error("Error adding bank account:", err);
    }
  };

  const formatIban = (iban) => {
    // Add spaces every 4 characters for display
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
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FiCheck className="w-3 h-3 mr-1" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <FiX className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Existing Accounts List */}
      {accounts && accounts.length > 0 && (
        <div className={`rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg md:text-xl font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                Bank Accounts ({accounts.length})
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  darkMode 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FiPlus className="w-4 h-4 mr-2 inline" />
                Add New Account
              </button>
            </div>

            <div className="space-y-4">
              {accounts.map((account, index) => (
                <div
                  key={account._id || index}
                  className={`p-4 rounded-lg border transition-colors ${
                    darkMode 
                      ? "border-gray-600 bg-gray-700 hover:bg-gray-650" 
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                          {account.bankName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(account)}
                          {account.isDefault && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Account Holder:
                          </span>
                          <p className={darkMode ? "text-white" : "text-gray-800"}>
                            {account.accountHolderName}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            IBAN:
                          </span>
                          <p className={`font-mono ${darkMode ? "text-white" : "text-gray-800"}`}>
                            {formatIban(account.iban)}
                          </p>
                        </div>
                        
                        {account.bic && (
                          <div>
                            <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                              SWIFT/BIC:
                            </span>
                            <p className={`font-mono ${darkMode ? "text-white" : "text-gray-800"}`}>
                              {account.bic}
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Currency:
                          </span>
                          <p className={darkMode ? "text-white" : "text-gray-800"}>
                            {account.currency?.toUpperCase() || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Country:
                          </span>
                          <p className={darkMode ? "text-white" : "text-gray-800"}>
                            {account.country || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Added:
                          </span>
                          <p className={darkMode ? "text-white" : "text-gray-800"}>
                            {formatDate(account.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons - commented out for now since no delete/edit functionality specified */}
                  {/* 
                  <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button className="p-2 text-gray-500 hover:text-blue-600 transition">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Account Form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className={`p-4 md:p-6 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-lg md:text-xl font-medium ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Add New Bank Account
            </h3>
            {accounts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`p-2 rounded-md transition ${
                  darkMode 
                    ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label
                className={`block mb-2 text-sm md:text-base font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Bank Name*
              </label>
              <input
                type="text"
                name="bankName"
                value={bankDetails.bankName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 md:px-4 md:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
                placeholder="e.g. Zenith Bank"
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm md:text-base font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                IBAN Number*
              </label>
              <input
                type="text"
                name="ibanNumber"
                value={bankDetails.ibanNumber}
                onChange={(e) => {
                  // Format IBAN with spaces for better readability
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
                className={`w-full px-3 py-2 md:px-4 md:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
                placeholder="DE89 3704 0044 0532 0130 00"
                pattern="[A-Z]{2}\d{2} ?\d{4} ?\d{4} ?\d{4} ?\d{4} ?[\d]{0,2}"
                maxLength="27"
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm md:text-base font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Account Holder Name*
              </label>
              <input
                type="text"
                name="beneficiaryName"
                value={bankDetails.beneficiaryName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 md:px-4 md:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
                placeholder="Edi Mark Ibu"
              />
            </div>

            <div>
              <label
                className={`block mb-2 text-sm md:text-base font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                SWIFT/BIC Code
              </label>
              <input
                type="text"
                name="swiftCode"
                value={bankDetails.swiftCode}
                onChange={(e) => {
                  // Auto-uppercase and format SWIFT/BIC code
                  e.target.value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "");
                  handleInputChange(e);
                }}
                className={`w-full px-3 py-2 md:px-4 md:py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                placeholder="BARCGB22"
                pattern="[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?"
                maxLength="11"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className={`flex-1 py-2 md:py-3 px-4 rounded-md ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                darkMode ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"
              } transition`}
            >
              <FiPlus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              <span>Add Bank Account</span>
            </button>
            
            {accounts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`px-6 py-2 md:py-3 rounded-md border font-medium transition ${
                  darkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Empty State */}
      {(!accounts || accounts.length === 0) && !showAddForm && (
        <div
          className={`p-8 rounded-lg text-center ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            No bank accounts found. Add your first bank account to get started.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
          >
            <FiPlus className="mr-2 h-4 w-4 inline" />
            Add Bank Account
          </button>
        </div>
      )}
    </div>
  );
};

export default BankDetailsForm;