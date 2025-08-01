import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/MAI.png";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiTag,
  FiSettings,
  FiBell,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMessageSquare,
} from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import useAuthStore from "../Store/Auth";

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const userRole = user?.userType || "normal";
  const isAffiliate = userRole === "affiliate";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const profileButtonRef = useRef(null);
  const tabletSidebarRef = useRef(null);
  const desktopSidebarRef = useRef(null);
  const dropdownRef = useRef(null);
  const tabletToggleRef = useRef(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideTablet =
        mobileMenuOpen &&
        tabletSidebarRef.current &&
        !tabletSidebarRef.current.contains(event.target);
      const isToggleButton =
        tabletToggleRef.current &&
        tabletToggleRef.current.contains(event.target);
      if (isOutsideTablet && !isToggleButton) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const NavItem = ({ to, icon, text, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition-colors relative ${
          isActive
            ? "bg-white text-[#3390d5] font-medium dark:bg-gray-700 dark:text-white"
            : "text-gray-600 hover:bg-white dark:text-gray-300 dark:hover:bg-gray-800"
        }`
      }
      end
    >
      {({ isActive }) => (
        <>
          <span className="flex-shrink-0">{icon}</span>
          <span className="ml-3 text-sm">{text}</span>
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3390d5] rounded-r-md"></div>
          )}
        </>
      )}
    </NavLink>
  );

  const BottomTabItem = ({ to, icon, text }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
          isActive
            ? "text-[#3390d5] dark:text-[#3390d5]"
            : "text-gray-500 dark:text-gray-400"
        }`
      }
      end
    >
      {({ isActive }) => (
        <>
          <span className="mb-1">{icon}</span>
          <span className="text-xs font-medium">{text}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Desktop Sidebar - Visible on lg screens and up */}
      <div
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 w-64 shadow-lg border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${
          mobileMenuOpen ? "translate-x-0" : ""
        }`}
        ref={desktopSidebarRef}
      >
        <div className="flex justify-between items-center h-20 p-4 border-b border-gray-200 dark:border-gray-700">
          <img src={Logo} alt="MAI Logo" className="h-12  ml-10" />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <>
            <NavItem to="/dashboard" icon={<FiHome size={20} />} text="Home" />
            <NavItem
              to="/refearals"
              icon={<FiUsers size={20} />}
              text="Referrals"
            />
            <NavItem
              to="/promotional"
              icon={<FiTag size={20} />}
              text="Promotional Resources"
            />
            <NavItem
              to="/profile"
              icon={<IoMdPerson size={20} />}
              text="Profile"
            />
          </>
        </nav>
      </div>

      {/* Tablet Sidebar - Visible on md screens */}
      <div
        className={`hidden md:block lg:hidden fixed inset-y-0 left-0 z-30 w-64 shadow-lg border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
        ref={tabletSidebarRef}
      >
        <div className="flex justify-between items-center h-20 p-4 border-b border-gray-200 dark:border-gray-700">
          <img src={Logo} alt="MAI Logo" className="h-12" />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <>
            <NavItem
              to="/dashboard"
              icon={<FiHome size={20} />}
              text="Home"
              onClick={toggleMobileMenu}
            />
            <NavItem
              to="/refearals"
              icon={<FiUsers size={20} />}
              text="Referrals"
              onClick={toggleMobileMenu}
            />
            <NavItem
              to="/promotional"
              icon={<FiTag size={20} />}
              text="Promotional Resources"
              onClick={toggleMobileMenu}
            />
            <NavItem
              to="/profile"
              icon={<IoMdPerson size={20} />}
              text="Profile"
              onClick={toggleMobileMenu}
            />
          </>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="hidden md:block lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiMenu ref={tabletToggleRef} className="h-5 w-5" />
              </button>
              {/* Mobile Logo */}
              <div className="md:hidden">
                <img src={Logo} alt="MAI Logo" className="h-8" />
              </div>
              <h1 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white hidden md:block">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={handleLanguageChange}
                className="hidden md:block bg-white/10 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white p-1.5 rounded-md text-sm shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="pt">Portuguese</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {/* Support Link - Same style as notifications */}
              <Link to="/support" className="">
                <button className="p-2 cursor-pointer rounded-full text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 relative">
                  <FiMessageSquare className="h-5 w-5" />
                </button>
              </Link>

              {/* Notifications Link */}
              <Link to="/notification" className="">
                <button className="p-2 cursor-pointer rounded-full text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 relative">
                  <FiBell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </Link>

              <div className="relative">
                <div
                  ref={profileButtonRef}
                  onClick={toggleDropdown}
                  className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {user?.image ? (
                    <img
                      src={
                        user.image.startsWith("/uploads/")
                          ? `https://api.joinonemai.com${user.image}`
                          : user.image
                      }
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-blue-100 dark:border-gray-600"
                    />
                  ) : (
                    <FaUserCircle className="h-8 w-8 text-gray-400 dark:text-gray-300" />
                  )}
                </div>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <NavLink
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                    >
                      <FiUser className="mr-3" size={16} />
                      Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut className="mr-3" size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto pt-16 pb-16 md:pb-0 transition-all duration-300 ${
            mobileMenuOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          <div className="p-4 sm:p-10">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation - Only visible on mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex items-center justify-around h-16">
            <BottomTabItem
              to="/dashboard"
              icon={<FiHome size={20} />}
              text="Home"
            />
            <BottomTabItem
              to="/refearals"
              icon={<FiUsers size={20} />}
              text="Referrals"
            />
            <BottomTabItem
              to="/promotional"
              icon={<FiTag size={20} />}
              text="Promotionals"
            />
            <BottomTabItem
              to="/profile"
              icon={<IoMdPerson size={20} />}
              text="Profile"
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;