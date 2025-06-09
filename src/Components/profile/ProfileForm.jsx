import React, { useState, useEffect, useRef } from "react";
import { 
  FiUpload, 
  FiEdit3, 
  FiSave, 
  FiX, 
  FiUser, 
  FiPhone, 
  FiMail,
  FiCamera,
  FiCheck
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const ProfileForm = ({
  user,
  updateProfile,
  darkMode,
  setError,
  setSuccess,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [avatar, setAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });

      // Reset image states when user changes
      setImageError(false);
      setAvatar("");

      if (user.image) {
        determineImageUrl(user.image);
      }
    }
  }, [user]);

  // Reset file input when selection is cleared
  useEffect(() => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedFile]);

  const determineImageUrl = async (url) => {
    if (!url) return;

    // If it's already a full URL, test it directly
    if (url.startsWith("http")) {
      const isValid = await testImageUrl(url);
      if (isValid) {
        setAvatar(url);
        return;
      } else {
        setImageError(true);
        return;
      }
    }

    // Build possible URLs
    const baseUrl = "https://api.joinonemai.com";
    const possibleUrls = [];

    if (url.startsWith("/")) {
      // Handle both /upload and /uploads prefixes
      if (url.startsWith("/uploads/")) {
        possibleUrls.push(`${baseUrl}${url}`);
        possibleUrls.push(`${baseUrl}${url.replace("/uploads/", "/upload/")}`);
      } else if (url.startsWith("/upload/")) {
        possibleUrls.push(`${baseUrl}${url}`);
        possibleUrls.push(`${baseUrl}${url.replace("/upload/", "/uploads/")}`);
      } else {
        // If path starts with / but not with upload(s), try both
        possibleUrls.push(`${baseUrl}/uploads${url}`);
        possibleUrls.push(`${baseUrl}/upload${url}`);
      }
    } else {
      // If it doesn't start with /, try adding different prefixes
      possibleUrls.push(`${baseUrl}/uploads/${url}`);
      possibleUrls.push(`${baseUrl}/upload/${url}`);
      possibleUrls.push(`${baseUrl}/${url}`);
    }

    // Test URLs sequentially
    for (const testUrl of possibleUrls) {
      const isValid = await testImageUrl(testUrl);
      if (isValid) {
        setAvatar(testUrl);
        return;
      }
    }

    // If none worked, mark as error to show fallback
    setImageError(true);
  };

  const testImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      
      // Set a timeout to avoid hanging on slow requests
      const timeoutId = setTimeout(() => {
        resolve(false);
      }, 5000);
      
      img.addEventListener('load', () => clearTimeout(timeoutId));
      img.addEventListener('error', () => clearTimeout(timeoutId));
      
      img.src = url;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    setImageError(false);

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Please select an image file (JPG, JPEG, PNG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFileError("Image must be less than 2MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setFileError("");
    setImageError(false);
    
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
      
      if (user.image) {
        determineImageUrl(user.image);
      } else {
        setAvatar("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName.trim());
      data.append("lastName", formData.lastName.trim());
      data.append("phoneNumber", formData.phoneNumber.trim());

      if (selectedFile) {
        data.append("profileImage", selectedFile);
      }

      await updateProfile(data);
      setSuccess("Profile updated successfully!");
      setSelectedFile(null);
      setIsEditing(false);
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const ProfileAvatar = ({ size = "large", showEditOverlay = false }) => (
    <div className={`relative group ${showEditOverlay ? 'cursor-pointer' : ''}`} 
         onClick={showEditOverlay ? () => fileInputRef.current?.click() : undefined}>
      {!imageError && avatar ? (
        <img
          src={avatar}
          alt="Profile"
          className={`${
            size === "large" ? "h-24 w-24 sm:h-32 sm:w-32" : "h-16 w-16 sm:h-24 sm:w-24"
          } rounded-full object-cover border-4 ${
            darkMode ? "border-gray-600" : "border-white"
          } shadow-xl transition-transform duration-300 ${
            showEditOverlay ? "group-hover:scale-105" : ""
          }`}
          onError={() => setImageError(true)}
        />
      ) : (
        <FaUserCircle className={`${
          size === "large" ? "h-24 w-24 sm:h-32 sm:w-32" : "h-16 w-16 sm:h-24 sm:w-24"
        } ${darkMode ? "text-gray-400" : "text-gray-300"} shadow-lg`} />
      )}
      
      {showEditOverlay && (
        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FiCamera className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
      )}
    </div>
  );

  if (!isEditing) {
    // Profile View Mode
    return (
      <div className="w-full">
        {/* Header Card */}
        <div className={`${
          darkMode 
            ? "bg-gray-800 border-b border-gray-700" 
            : "bg-white border-b border-gray-200"
        } px-4 py-6 sm:px-6 sm:py-8`}>
          
          <div className="text-center">
            {/* Profile Avatar */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <ProfileAvatar size="large" />
            </div>
            
            {/* User Name */}
            <h1 className={`text-xl sm:text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              {formData.firstName} {formData.lastName}
            </h1>
            
            {/* User Email */}
            <p className={`text-sm sm:text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } mb-4 sm:mb-6`}>
              {user?.email}
            </p>
            
            {/* Edit Button */}
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg font-medium text-sm sm:text-base shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              <FiEdit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Details Cards */}
        <div className="space-y-1 sm:space-y-6 sm:p-6">
          {/* Personal Information Card */}
          <div className={`${
            darkMode 
              ? "bg-gray-800 border-b border-gray-700" 
              : "bg-white border-b border-gray-200"
          } px-4 py-4 sm:rounded-lg sm:shadow-lg sm:border`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              <FiUser className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              Personal Information
            </h2>
            
            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
              {/* First Name */}
              <div className="space-y-1 sm:space-y-2">
                <label className={`text-xs sm:text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  First Name
                </label>
                <p className={`text-sm sm:text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {formData.firstName || "Not provided"}
                </p>
              </div>
              
              {/* Last Name */}
              <div className="space-y-1 sm:space-y-2">
                <label className={`text-xs sm:text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  Last Name
                </label>
                <p className={`text-sm sm:text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {formData.lastName || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className={`${
            darkMode 
              ? "bg-gray-800" 
              : "bg-white"
          } px-4 py-4 sm:rounded-lg sm:shadow-lg sm:border ${
            darkMode ? "sm:border-gray-700" : "sm:border-gray-200"
          }`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              <FiPhone className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              Contact Information
            </h2>
            
            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
              {/* Email */}
              <div className="space-y-1 sm:space-y-2">
                <label className={`text-xs sm:text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } flex items-center`}>
                  <FiMail className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Email Address
                </label>
                <p className={`text-sm sm:text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {user?.email || "Not provided"}
                </p>
              </div>
              
              {/* Phone */}
              <div className="space-y-1 sm:space-y-2">
                <label className={`text-xs sm:text-sm font-medium ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } flex items-center`}>
                  <FiPhone className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Phone Number
                </label>
                <p className={`text-sm sm:text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  {formData.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode Form
  return (
    <div className="w-full">
      {/* Edit Header */}
      <div className={`${
        darkMode 
          ? "bg-gray-800 border-b border-gray-700" 
          : "bg-white border-b border-gray-200"
      } px-4 py-4 sm:px-6 sm:py-6`}>
        <div className="flex items-center justify-between">
          <h1 className={`text-lg sm:text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}>
            Edit Profile
          </h1>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? "hover:bg-gray-700 text-gray-400 hover:text-white" 
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        
        <p className={`text-xs sm:text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Update your personal information and profile picture
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-1 sm:space-y-8 sm:p-6">
        {/* Profile Picture Section */}
        <div className={`${
          darkMode 
            ? "bg-gray-800 border-b border-gray-700" 
            : "bg-white border-b border-gray-200"
        } px-4 py-4 sm:rounded-lg sm:shadow-lg sm:border`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-4 sm:mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}>
            Profile Picture
          </h2>
          
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <ProfileAvatar showEditOverlay={true} />
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <FiUpload className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Change Photo
              </button>
              
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
                ref={fileInputRef}
                key={selectedFile ? "file-selected" : "file-empty"}
              />
              
              <p className={`mt-2 text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                JPG, JPEG or PNG. Max size 2MB.
              </p>
              
              {fileError && (
                <p className="mt-2 text-xs sm:text-sm text-red-500">{fileError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className={`${
          darkMode 
            ? "bg-gray-800 border-b border-gray-700" 
            : "bg-white border-b border-gray-200"
        } px-4 py-4 sm:rounded-lg sm:shadow-lg sm:border`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-4 sm:mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}>
            Personal Information
          </h2>
          
          <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
            {/* First Name */}
            <div>
              <label className={`block mb-1 sm:mb-2 text-xs sm:text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter your first name"
                required
                minLength="2"
                maxLength="50"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className={`block mb-1 sm:mb-2 text-xs sm:text-sm font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter your last name"
                required
                minLength="2"
                maxLength="50"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className={`${
          darkMode 
            ? "bg-gray-800" 
            : "bg-white"
        } px-4 py-4 sm:rounded-lg sm:shadow-lg sm:border ${
          darkMode ? "sm:border-gray-700" : "sm:border-gray-200"
        }`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-4 sm:mb-6 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}>
            Contact Information
          </h2>
          
          {/* Phone Number */}
          <div>
            <label className={`block mb-1 sm:mb-2 text-xs sm:text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="Enter your phone number"
              pattern="^[\d\s\+\-\(\)]{10,15}$"
              title="10-15 digits with optional + - () symbols"
              required
            />
            <p className={`mt-1 sm:mt-2 text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              Format: 123-456-7890 or +1 (123) 456-7890
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sm:gap-4 px-4 py-4 sm:px-0 sm:py-0">
          <button
            type="button"
            onClick={handleCancel}
            className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            }`}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base text-white transition-all transform ${
              loading 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:scale-105 shadow-lg hover:shadow-xl"
            } bg-blue-600 hover:bg-blue-700 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-xs sm:text-base">Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="mr-1 sm:mr-2 h-4 w-4" />
                Save
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;