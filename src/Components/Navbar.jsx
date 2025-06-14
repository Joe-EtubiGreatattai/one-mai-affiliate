import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { FiBell, FiMenu, FiX, FiHome, FiUsers, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import useAuthStore from "../Store/Auth";
import useNotificationStore from "../Store/getUserNotifications";
import Logo from "../assets/MAI.png";

const Navbar = ({ toggleSidebar }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Get user data from auth store
  const { user, logout, accessToken } = useAuthStore();
  const { notifications = [], fetchNotifications } = useNotificationStore();

  const userName = user?.firstName || "User";
  const userRole = user?.userType || 'normal';
  const isAffiliate = userRole === 'affiliate';

  useEffect(() => {
    if (accessToken) {
      fetchNotifications(accessToken);
    }
  }, [accessToken, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !document.querySelector('.mobile-menu-button')?.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Reset image state when user changes
    setImageError(false);
    setProfileImageUrl(null);
    
    if (user?.image) {
      determineImageUrl(user.image);
    }
  }, [user?.image]);

  const determineImageUrl = async (url) => {
    if (!url) return;

    // If it's already a full URL, use it directly
    if (url.startsWith('http')) {
      setProfileImageUrl(url);
      return;
    }

    const baseUrl = 'https://api.joinonemai.com';
    let finalUrl = url;

    // Convert any /uploads/ to /upload/ to match backend
    if (url.startsWith('/uploads/')) {
      finalUrl = url.replace('/uploads/', '/upload/');
    }
    // Ensure paths starting with /upload/ are used as-is
    else if (!url.startsWith('/upload/') && url.startsWith('/')) {
      finalUrl = `/upload${url}`;
    }

    // Construct full URL
    finalUrl = finalUrl.startsWith('/') ? `${baseUrl}${finalUrl}` : finalUrl;

    // Verify the image exists
    if (await checkImageExists(finalUrl)) {
      setProfileImageUrl(finalUrl);
    } else {
      setImageError(true);
    }
  };

  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate("/signIn");
  };

  const unreadNotificationsCount = Array.isArray(notifications)
    ? notifications.filter(notification => !notification?.read).length
    : 0;

  const NavItem = ({ to, icon, text, onClick }) => (
    <NavLink 
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center p-3 rounded-lg transition-colors ${isActive ? 
          'bg-blue-50 text-blue-600 font-medium' : 
          'text-gray-600 hover:bg-gray-50'}`
      }
      end
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="ml-3 text-sm">{text}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors mobile-menu-button"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Mobile Sidebar */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 z-30 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="w-72 h-full bg-white shadow-lg flex flex-col border-r border-gray-200">
          {/* Mobile Header */}
          <div className="flex justify-between items-center h-20 p-4 border-b border-gray-200">
            <img src={Logo} alt="MAI Logo" className="h-12" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-600"
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {isAffiliate ? (
              <>
                <NavItem to="/dashboard" icon={<FiHome size={20} />} text="Home" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/refearals" icon={<FiUsers size={20} />} text="Referrals" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/notification" icon={<FiBell size={20} />} text="Notifications" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/profile" icon={<IoMdPerson size={20} />} text="Profile" onClick={() => setMobileMenuOpen(false)} />
              </>
            ) : (
              <>
                <NavItem to="/dashboard" icon={<FiHome size={20} />} text="Home" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/group" icon={<FiUsers size={20} />} text="Groups" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/notification" icon={<FiBell size={20} />} text="Notifications" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/profile" icon={<FiUser size={20} />} text="Profile" onClick={() => setMobileMenuOpen(false)} />
              </>
            )}
          </nav>

          {/* Mobile Bottom Section */}
          <div className="p-4 border-t border-gray-200">
            <NavItem to="/settings" icon={<FiSettings size={20} />} text="Settings" onClick={() => setMobileMenuOpen(false)} />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-150 flex items-center"
            >
              <span className="flex-shrink-0"><FiLogOut size={20} /></span>
              <span className="ml-3 text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Navbar */}
      <div className="fixed top-0 left-0 lg:left-[276px] right-0 h-16 flex items-center bg-white text-gray-800 shadow-sm z-40 border-b border-gray-200 px-4 transition-all duration-300">
        {/* Left-aligned Hamburger Button - Hidden on mobile */}
        <button
          className="hidden md:block p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle menu"
          onClick={toggleSidebar}
        >
          <FiMenu size={20} className="text-gray-600" />
        </button>

        {/* Spacer div that pushes right icons to the end */}
        <div className="flex-1"></div>

        {/* Right-aligned Icons */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          <div className="relative">
            <Link to={"/notification"}>
              <button
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 relative"
                aria-label={`Notifications (${unreadNotificationsCount} unread)`}
              >
                <FiBell size={20} className="text-gray-600" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </Link>
          </div>

          <div className="flex items-center relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center focus:outline-none group"
              aria-label="User menu"
            >
              {!imageError && profileImageUrl ? (
                <img
                  src={`https://api.joinonemai.com${user?.image}`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-200 transition-colors duration-200"
                  onError={() => setImageError(true)}
                />
              ) : (
                <FaUserCircle className="h-8 w-8 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" />
              )}
              <span className="ml-2 hidden md:inline text-gray-700 font-medium">{userName}</span>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                </div>
                <NavLink
                  to="/profile"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  <FiUser className="mr-2" size={16} />
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  <FiSettings className="mr-2" size={16} />
                  Settings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                >
                  <FiLogOut className="mr-2" size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;