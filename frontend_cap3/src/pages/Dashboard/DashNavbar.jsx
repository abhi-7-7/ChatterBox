// src/pages/Dashboard/Navbar.jsx

import React, { useState } from "react";
import SearchBar from "../../components/SearchBar";
import {
  Sun, Moon, Brush,
  Bell, User, ChevronDown,
  Search, LogOut
} from "lucide-react";

export default function Navbar({
  user,
  theme,
  toggleTheme,
  currentTheme,
  onToggleSidebar,
  onNavigateProfile
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const avatarLetter = user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav
      className={`flex items-center justify-between 
      px-4 py-3 bg-linear-to-r ${currentTheme.gradient}
      shadow-xl backdrop-blur-xl border-b border-white/20 
      w-full relative z-40`}
      style={{ height: "64px" }}
    >
      {/* LEFT — SIDEBAR + SEARCH */}
      <div className="flex items-center gap-3">

        {/* Mobile sidebar button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden hover:bg-white/20 p-2 rounded-xl transition"
        >
          <Search className="text-white w-6 h-6" />
        </button>

        {/* Search bar */}
       <SearchBar />
      </div>

      {/* RIGHT — THEME + NOTIFICATIONS + PROFILE */}
      <div className="flex items-center gap-4">

        {/* Theme Switch */}
        <button
          onClick={toggleTheme}
          className="bg-white/20 hover:bg-white/30 p-3 rounded-xl 
          transition shadow-lg border border-white/30"
        >
          {theme === "light" && <Sun className="text-white w-6 h-6" />}
          {theme === "dark" && <Moon className="text-white w-6 h-6" />}
          {theme === "vintage" && <Brush className="text-white w-6 h-6" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifyOpen(!notifyOpen);
              setProfileOpen(false);
            }}
            className="relative bg-white/20 hover:bg-white/30 p-3 rounded-xl transition shadow-lg border border-white/30"
          >
            <Bell className="text-white w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full"></span>
          </button>

          {notifyOpen && (
            <div
              className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-xl 
              shadow-2xl rounded-2xl border border-white/50 p-4 z-50 animate-fade-in"
            >
              <p className="font-semibold text-gray-800 mb-2">Notifications</p>

              <div className="space-y-2 text-gray-700">
                <div className="p-3 rounded-xl bg-gray-100">💬 New message received</div>
                <div className="p-3 rounded-xl bg-gray-100">👀 Someone viewed your profile</div>
                <div className="p-3 rounded-xl bg-gray-100">🔧 System maintenance scheduled</div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifyOpen(false);
            }}
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-4 py-2
            rounded-xl transition shadow-lg border border-white/30"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-white/40 flex items-center 
              justify-center text-white font-bold">
              {avatarLetter}
            </div>

            <span className="hidden sm:block text-white font-semibold">
              {user?.username}
            </span>

            <ChevronDown
              className={`w-5 h-5 text-white transition ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* FIXED: Profile dropdown always above everything (z-50) */}
          {profileOpen && (
            <div
              className={`absolute right-0 mt-3 w-72 ${currentTheme.glassBg}
              backdrop-blur-xl shadow-2xl rounded-2xl border ${currentTheme.border}
              z-50 animate-fade-in`}
            >
              {/* Header */}
              <div className={`bg-linear-to-r ${currentTheme.gradient} p-5 text-white`}>
                <p className="font-bold text-lg">{user?.username}</p>
                <p className="text-sm opacity-90">{user?.email}</p>
              </div>

              {/* Menu */}
              <div className="py-2">

                {/* Profile */}
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onNavigateProfile();
                  }}
                  className="flex items-center w-full px-5 py-3 gap-3 text-left
                  hover:bg-white/10 transition text-gray-900"
                >
                  <User size={20} className="text-blue-600" />
                  Your Profile
                </button>

                <hr className="border-t border-white/20 my-8 items-center" />
                
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
