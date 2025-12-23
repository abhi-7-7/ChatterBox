// src/pages/Dashboard/Navbar.jsx

import React, { useState } from "react";
import SearchBar from "../../components/SearchBar";
import {
  Sun, Moon, Brush,
  Bell, User, ChevronDown,
  Search, Settings
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
      className={`flex items-center justify-between px-5 py-1.5
        bg-linear-to-r from-sky-500/80 via-cyan-400/70 to-blue-500/80
        shadow-sm border-b border-white/10
        w-full relative z-40 rounded-none`}
      style={{ height: "58px" }}
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
        <div className="max-w-xl w-full">
          <div className="bg-white/10 hover:bg-white/14 border border-white/20 rounded-full px-3 py-1.5 shadow-inner transition-colors">
            <SearchBar placeholder="Search chats, users, files..." />
          </div>
        </div>
      </div>

      {/* RIGHT — THEME + NOTIFICATIONS + PROFILE */}
      <div className="flex items-center gap-3">

        {/* Theme Switch - SECONDARY/TERTIARY */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="bg-white/12 hover:bg-white/20 active:bg-white/30 p-2.5 rounded-lg 
          transition-all duration-150 shadow-sm border border-white/25 hover:border-white/35"
        >
          {theme === "light" && <Sun className="text-white w-5 h-5" />}
          {theme === "dark" && <Moon className="text-white w-5 h-5" />}
          {theme === "vintage" && <Brush className="text-white w-5 h-6" />}
        </button>

        {/* Settings - SECONDARY/TERTIARY */}
        <button
          className="bg-white/12 hover:bg-white/20 active:bg-white/30 p-2.5 rounded-lg transition-all duration-150 shadow-sm border border-white/25 hover:border-white/35"
          onClick={() => onNavigateProfile?.()}
          title="Open settings"
          aria-label="Settings"
        >
          <Settings className="text-white w-5 h-5" />
        </button>

        {/* Notifications - SECONDARY/TERTIARY */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifyOpen(!notifyOpen);
              setProfileOpen(false);
            }}
            title="Notifications"
            className="relative bg-white/16 hover:bg-white/24 active:bg-white/30 p-2.5 rounded-lg transition-all duration-150 shadow-sm border border-white/25 hover:border-white/35"
          >
            <Bell className="text-white w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full"></span>
          </button>

          {notifyOpen && (
            <div
              className="fixed bottom-6 right-6 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg 
              shadow-lg rounded-xl border border-white/20 dark:border-gray-800/50 p-4 z-50 animate-fade-in"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Notifications</p>
                <button
                  onClick={() => setNotifyOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/30 text-gray-700 dark:text-gray-300">
                  💬 New message received
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200/30 dark:border-purple-800/30 text-gray-700 dark:text-gray-300">
                  👀 Someone viewed your profile
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/30 text-gray-700 dark:text-gray-300">
                  🔧 System maintenance scheduled
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">Auto-dismiss in 7s</p>
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
            title="Profile menu"
            className="flex items-center gap-3 bg-white/14 hover:bg-white/22 active:bg-white/30 px-3.5 py-2
            rounded-lg transition-all duration-150 shadow-sm border border-white/25 hover:border-white/35"
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
