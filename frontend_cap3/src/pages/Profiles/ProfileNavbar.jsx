// src/pages/Profiles/ProfileNavbar.jsx
import React from "react";
import { User, Sun, Moon, Brush, ChevronDown } from "lucide-react";

const ProfileNavbar = ({
  theme,
  toggleTheme,
  user,
  profileOpen,
  setProfileOpen,
  currentTheme,
  navigateDashboard,
}) => {
  return (
    <nav
      className={`flex items-center justify-between px-6 py-6 bg-linear-to-r ${currentTheme.gradient} shadow-xl`}
    >
      <div>
        <h2 className="text-3xl text-white font-bold">Your Profile</h2>
        <p className="text-white/90 mt-1">View and manage your account</p>
      </div>

      <div className="flex items-center gap-4">
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="bg-white/20 p-4 rounded-2xl hover:bg-white/30"
        >
          {theme === "light" && <Sun className="text-white" />}
          {theme === "dark" && <Moon className="text-white" />}
          {theme === "vintage" && <Brush className="text-white" />}
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-2xl"
          >
            <User className="text-white" />
            <span className="text-white">{user?.username || user?.email || 'Profile'}</span>
            <ChevronDown
              className={`text-white transition ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div
              className={`absolute right-0 mt-4 w-72 rounded-2xl overflow-hidden shadow-xl ${currentTheme.bg}`}
            >
              <button
                onClick={navigateDashboard}
                className="flex items-center gap-3 p-4 hover:bg-white/10"
              >
                <User className="text-black" />
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProfileNavbar;
