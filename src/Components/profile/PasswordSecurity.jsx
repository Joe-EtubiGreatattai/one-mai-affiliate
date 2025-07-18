import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuthStore from "../../Store/Auth";
import { toast } from "react-hot-toast";

const PasswordSecurity = ({ updateProfile, darkMode, setError, setSuccess }) => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const { toggleTwoFactor, user } = useAuthStore();

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setError(error.message || "Failed to update password");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleToggleTwoFactor = async () => {
    setTwoFactorLoading(true);
    try {
      await toggleTwoFactor();
      toast.success(
        user?.twoFactor 
          ? "Two-factor authentication disabled successfully" 
          : "Two-factor authentication enabled successfully"
      );
    } catch (error) {
      toast.error(error.message || "Failed to toggle two-factor authentication");
    } finally {
      setTwoFactorLoading(false);
    }
  };

  console.log("user from profile form", user);

  return (
    <div className="min-h-screen">
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center px-4 sm:px-0 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Password & Security
      </h2>
      
      <div className="max-w-md sm:max-w-lg mx-auto space-y-4 sm:space-y-6 md:space-y-8 px-4 sm:px-0">
        {/* Change Password Card */}
        <div className={`p-4 sm:p-6 md:p-8 rounded-none sm:rounded-lg shadow-none sm:shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`font-semibold mb-4 text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Change Password
          </h3>
          
          <form onSubmit={updatePassword}>
            <div className="space-y-4 sm:space-y-6">
              {/* Current Password */}
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    }`}
                    required
                    autoComplete="current-password"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation`}
                    onClick={() => togglePasswordVisibility('current')}
                    aria-label={showPassword.current ? "Hide password" : "Show password"}
                  >
                    {showPassword.current ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* New Password */}
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    }`}
                    required
                    minLength="8"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation`}
                    onClick={() => togglePasswordVisibility('new')}
                    aria-label={showPassword.new ? "Hide password" : "Show password"}
                  >
                    {showPassword.new ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Password must be at least 8 characters
                </p>
              </div>
              
              {/* Confirm New Password */}
              <div>
                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-3 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    }`}
                    required
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                      darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation`}
                    onClick={() => togglePasswordVisibility('confirm')}
                    aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                  >
                    {showPassword.confirm ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit"
                className={`w-full py-3 px-4 text-base rounded-lg font-medium transition flex items-center justify-center ${
                  darkMode 
                    ? 'bg-[#3390d5] hover:bg-[#2980c4] text-white' 
                    : 'bg-[#3390d5] hover:bg-[#2980c4] text-white'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''} touch-manipulation`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className={`p-4 sm:p-6 md:p-8 rounded-none sm:rounded-lg shadow-none sm:shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`font-semibold mb-4 text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Two-Factor Authentication
          </h3>
          
          <div className="flex flex-col space-y-4">
            <div className="flex-1">
              <p className={`font-medium text-base ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                {user?.twoFactor ? "Two-Factor Authentication is enabled" : "Two-Factor Authentication"}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.twoFactor 
                  ? "Extra security is enabled for your account" 
                  : "Add extra security to your account"}
              </p>
            </div>
            
            <button 
              onClick={handleToggleTwoFactor}
              disabled={twoFactorLoading}
              className={`w-full py-3 px-4 rounded-lg text-base font-medium transition flex items-center justify-center ${
                darkMode 
                  ? user?.twoFactor 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  : user?.twoFactor 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                twoFactorLoading ? 'opacity-70 cursor-not-allowed' : ''
              } touch-manipulation`}
            >
              {twoFactorLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {user?.twoFactor ? 'Disabling...' : 'Enabling...'}
                </>
              ) : (
                user?.twoFactor ? 'Disable 2FA' : 'Enable 2FA'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSecurity;