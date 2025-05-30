import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/MAI.png";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
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
  const profileButtonRef = useRef(null);
  const tabletSidebarRef = useRef(null);
  const desktopSidebarRef = useRef(null);
  const dropdownRef = useRef(null);
  const tabletToggleRef = useRef(null);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

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

  const NavItem = ({ to, icon, text, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition-colors relative ${
          isActive
            ? "bg-blue-50 text-blue-600 font-medium dark:bg-gray-700 dark:text-white"
            : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
        }`
      }
      end
    >
      {({ isActive }) => (
        <>
          <span className="flex-shrink-0">{icon}</span>
          <span className="ml-3 text-sm">{text}</span>
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
          )}
        </>
      )}
    </NavLink>
  );

  // Mobile Bottom Tab Item Component
  const BottomTabItem = ({ to, icon, text }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        }`
      }
      end
    >
      {({ isActive }) => (
        <>
          <span className="mb-1">{icon}</span>
          <span className="text-xs font-medium">{text}</span>
          {isActive && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-t-full"></div>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar - Visible on lg screens and up */}
      <div
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 w-64 shadow-lg border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${
          mobileMenuOpen ? "translate-x-0" : ""
        }`}
        ref={desktopSidebarRef}
      >
        <div className="flex justify-between items-center h-20 p-4 border-b border-gray-200 dark:border-gray-700">
          <img src={Logo} alt="MAI Logo" className="h-12" />
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
              to="/notification"
              icon={<FiBell size={20} />}
              text="Notifications"
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
              to="/notification"
              icon={<FiBell size={20} />}
              text="Notifications"
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
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <FiSearch className="h-5 w-5" />
              </button>
              <Link to="/notification" className="hidden md:block">
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
              to="/notification"
              icon={<FiBell size={20} />}
              text="Notifications"
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