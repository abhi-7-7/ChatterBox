// src/components/Navbar.jsx
import React, { useState } from "react";
import { LogOut, Moon, Sun, Brush, User, ChevronDown, Settings } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onToggleSidebar, theme, onToggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openProfile, setOpenProfile] = useState(false);

  // Determine current theme if not passed as prop
  const [currentTheme, setCurrentTheme] = useState(
    theme || localStorage.getItem("chatter-theme") || "light"
  );

  const handleThemeToggle = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      const nextTheme =
        currentTheme === "light"
          ? "dark"
          : currentTheme === "dark"
          ? "vintage"
          : "light";
      setCurrentTheme(nextTheme);
      localStorage.setItem("chatter-theme", nextTheme);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isProfilePage = location.pathname === "/profile";

  // Get page title based on route
  const getPageTitle = () => {
    if (isProfilePage) return "Your Profile";
    if (location.pathname === "/dashboard") return "Dashboard";
    return "ChatterBox";
  };

  const getPageSubtitle = () => {
    if (isProfilePage) return "View and manage your account";
    if (location.pathname === "/dashboard")
      return `Welcome back, ${user?.username || user?.email || "User"} 👋`;
    return "Start chatting now";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-linear-to-r from-purple-500 via-sky-400 to-emerald-400 shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left Section - Mobile Menu + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Page Title */}
          <div>
            <h2 className="text-white text-lg md:text-2xl font-bold">
              {getPageTitle()}
            </h2>
            <p className="text-xs md:text-sm text-white/90 hidden sm:block">
              {getPageSubtitle()}
            </p>
          </div>
        </div>

        {/* Right Section - Theme Toggle + Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Theme Toggle Button */}
          <button
            onClick={handleThemeToggle}
            className="text-white hover:bg-white/20 p-2 md:p-3 rounded-xl transition-all hover:scale-110"
            title="Toggle Theme"
          >
            {(theme || currentTheme) === "light" && <Sun className="w-5 h-5 md:w-6 md:h-6" />}
            {(theme || currentTheme) === "dark" && <Moon className="w-5 h-5 md:w-6 md:h-6" />}
            {(theme || currentTheme) === "vintage" && <Brush className="w-5 h-5 md:w-6 md:h-6" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-2 md:gap-3 text-white hover:bg-white/20 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/50">
                <User className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="hidden sm:block font-medium">
                {user?.username || user?.email?.split("@")[0] || "User"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {openProfile && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenProfile(false)}
                />

                {/* Dropdown Content */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200">
                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-200 bg-linear-to-r from-purple-50 to-sky-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-sky-400 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.username || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpenProfile(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-5 h-5 mr-3 text-purple-500" />
                      <span className="font-medium">View Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setOpenProfile(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-5 h-5 mr-3 text-sky-500" />
                      <span className="font-medium">Dashboard</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenProfile(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;