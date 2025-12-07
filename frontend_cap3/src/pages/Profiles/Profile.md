// frontend/src/pages/Profile.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { chatAPI } from "../../services/api";
import "../styles/theme.css";
import {
  ArrowLeft,
  Mail,
  User,
  Hash,
  Calendar,
  Shield,
  MessageSquare,
  Sun,
  Moon,
  Brush,
  ChevronDown,
  LogOut,
  Settings,
  Edit2,
  Copy,
  Check,
  Loader2,
} from "lucide-react";

// 🌌 Aurora Glow Theme System
const themeColors = {
  light: {
    gradient: "from-purple-500 via-sky-400 to-emerald-400", // aurora
    bg: "bg-white/85",
    text: "text-slate-900",
    textSecondary: "text-slate-600",
    border: "border-violet-200",
    cardBg: "bg-white/70",
    glassBg: "bg-white/40",
  },
  dark: {
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    bg: "bg-slate-900/90",
    text: "text-slate-100",
    textSecondary: "text-slate-300",
    border: "border-slate-700",
    cardBg: "bg-slate-900/70",
    glassBg: "bg-slate-800/40",
  },
  vintage: {
    gradient: "from-indigo-500 via-sky-400 to-teal-300",
    bg: "bg-slate-50/90",
    text: "text-slate-900",
    textSecondary: "text-slate-700",
    border: "border-sky-200",
    cardBg: "bg-sky-50/70",
    glassBg: "bg-sky-50/40",
  },
};

// Avatar gradient presets (still aurora-ish)
const avatarColors = [
  "from-purple-500 via-sky-400 to-emerald-400",
  "from-fuchsia-500 via-purple-500 to-sky-400",
  "from-sky-500 via-cyan-400 to-emerald-400",
  "from-indigo-500 via-sky-500 to-teal-400",
  "from-violet-500 via-sky-400 to-teal-300",
  "from-emerald-500 via-teal-400 to-sky-400",
];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Persist theme in localStorage
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("chatterbox-theme") || "light";
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const currentTheme = themeColors[theme];
  const avatarColor = avatarColors[(user?.id || 0) % avatarColors.length];

  // Apply theme & persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = "var(--color-bg)";
    localStorage.setItem("chatterbox-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "vintage" : "light"
    );
  };

  // Fetch stats once
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await chatAPI.getMyChats();
        const userChats = response?.data?.chats || [];

        const totalMessages = userChats.reduce(
          (sum, chat) => sum + (chat._count?.messages || 0),
          0
        );

        setStats({
          totalChats: userChats.length,
          totalMessages,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const copyToClipboard = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text.toString());
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysActive = user?.createdAt
    ? Math.floor(
        (Date.now() - new Date(user.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div
      className="flex h-screen transition-all duration-500"
      onClick={() => {
        setProfileOpen(false);
        setSettingsOpen(false);
      }}
    >
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-72 p-6 text-base shadow-soft transition-all duration-500 bg-surface border-r border-subtle">
        <h1 className="text-3xl font-extrabold flex items-center space-x-3 mb-10 animate-fade-in drop-shadow-lg">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <span>ChatterBox</span>
        </h1>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/dashboard");
          }}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl mb-8 transition-all duration-300 font-semibold btn-primary-600 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="font-semibold text-lg opacity-90 mb-4">
            Profile Menu
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-lg">
            <p className="text-base opacity-95 mb-2 font-medium">
              Viewing Profile
            </p>
            <p className="text-sm opacity-80">
              Manage your account details and settings
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-white/20 pt-4 relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSettingsOpen((prev) => !prev);
            }}
            className="flex items-center space-x-3 opacity-90 hover:opacity-100 hover:bg-white/10 p-3 rounded-xl transition-all duration-300 w-full text-base backdrop-blur-sm"
          >
            <Settings className="w-6 h-6" />
            <span>Settings</span>
          </button>

          {settingsOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-3 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl py-4 px-5 animate-fade-in border border-white/40"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setSettingsOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="flex w-full items-center space-x-3 px-4 py-3 hover:bg-white/20 text-white text-base transition-colors duration-200 font-medium rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <nav
          className={`flex items-center justify-between px-6 py-6 bg-linear-to-r ${currentTheme.gradient} shadow-xl backdrop-blur-xl border-b border-white/20`}
        >
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl text-white font-bold drop-shadow-lg flex items-center space-x-2">
              <span>Your Profile</span>
            </h2>
            <p className="text-sm md:text-base text-white/95 mt-1">
              View and manage your account information
            </p>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            {/* THEME SWITCH */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className="bg-white/20 hover:bg-white/30 hover:scale-110 px-4 py-4 rounded-2xl transition-all duration-300 shadow-lg backdrop-blur-md border border-white/30"
              title="Change Theme"
            >
              {theme === "light" && (
                <Sun className="w-6 h-6 text-white animate-spin-slow" />
              )}
              {theme === "dark" && <Moon className="w-6 h-6 text-white" />}
              {theme === "vintage" && <Brush className="w-6 h-6 text-white" />}
            </button>

            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((prev) => !prev);
                  setSettingsOpen(false);
                }}
                className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 hover:scale-105 px-5 py-3 rounded-2xl transition-all duration-300 shadow-lg backdrop-blur-md border border-white/30"
              >
                <User className="w-6 h-6 text-white" />
                <span className="hidden sm:block text-white font-semibold text-base">
                  {user?.username}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div
                  className={`absolute right-0 mt-4 w-72 ${currentTheme.bg} backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden z-50 animate-fade-in border ${currentTheme.border}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Gradient Header */}
                  <div
                    className={`bg-linear-to-r ${currentTheme.gradient} p-5 text-white`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-lg">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg truncate drop-shadow">
                          {user?.username}
                        </p>
                        <p className="text-xs opacity-95 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-3">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/dashboard");
                      }}
                      className={`flex w-full items-center space-x-4 px-5 py-4 hover:bg-linear-to-r hover:from-violet-50 hover:to-sky-50 ${currentTheme.text} hover:text-violet-700 text-base transition-all duration-300 font-medium group`}
                    >
                      <div className="p-2 rounded-xl bg-violet-100 group-hover:bg-violet-200 transition-colors shadow-sm">
                        <ArrowLeft className="w-5 h-5 text-violet-700" />
                      </div>
                      <span>Back to Dashboard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-auto">
          {/* Header Section with Avatar */}
          <div
            className={`bg-linear-to-r ${currentTheme.gradient} h-56 relative flex items-center justify-center shadow-xl`}
          >
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-10">
              <div className="relative">
                <div
                  className={`w-32 h-32 rounded-full bg-linear-to-br ${avatarColor} border-4 border-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform duration-300`}
                >
                  <User className="w-14 h-14 text-white drop-shadow-md" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white rounded-full p-2 shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="max-w-7xl mx-auto px-6 pt-28 pb-10">
            {/* Name & Edit Button */}
            <div className="text-center mb-20 relative pt-10">
              <h1
                className={`text-4xl md:text-5xl font-extrabold ${currentTheme.text} mb-3 drop-shadow-sm`}
              >
                {user?.username}
              </h1>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <p className={`${currentTheme.textSecondary} text-lg font-medium`}>
                  ChatterBox User
                </p>
                <div
                  className={`inline-flex items-center space-x-2 bg-linear-to-r ${currentTheme.gradient} text-white px-4 py-1 rounded-full shadow-lg text-sm font-semibold`}
                >
                  <span>Verified</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className={`inline-flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 ${
                  isEditing
                    ? `${currentTheme.cardBg} ${currentTheme.text} backdrop-blur-md border ${currentTheme.border}`
                    : `bg-linear-to-r ${currentTheme.gradient} text-white border border-white/40`
                }`}
              >
                <Edit2 className="w-5 h-5" />
                <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
              </button>
            </div>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 px-4">
              {/* Chats */}
              <div
                className={`${currentTheme.cardBg} backdrop-blur-xl p-8 rounded-3xl text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border ${currentTheme.border} group`}
              >
                <div
                  className={`bg-linear-to-br ${currentTheme.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <p className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
                  {isLoadingStats ? (
                    <Loader2 className="w-10 h-10 animate-spin inline" />
                  ) : (
                    stats.totalChats
                  )}
                </p>
                <p
                  className={`${currentTheme.textSecondary} text-sm font-medium uppercase tracking-wide`}
                >
                  Active Chats
                </p>
              </div>

              {/* Messages */}
              <div
                className={`${currentTheme.cardBg} backdrop-blur-xl p-8 rounded-3xl text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border ${currentTheme.border} group`}
              >
                <div
                  className={`bg-linear-to-br ${currentTheme.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <p className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
                  {isLoadingStats ? (
                    <Loader2 className="w-10 h-10 animate-spin inline" />
                  ) : (
                    stats.totalMessages
                  )}
                </p>
                <p
                  className={`${currentTheme.textSecondary} text-sm font-medium uppercase tracking-wide`}
                >
                  Messages Sent
                </p>
              </div>

              {/* Days Active */}
              <div
                className={`${currentTheme.cardBg} backdrop-blur-xl p-8 rounded-3xl text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border ${currentTheme.border} group`}
              >
                <div
                  className={`bg-linear-to-br ${currentTheme.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <p className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
                  {daysActive}
                </p>
                <p
                  className={`${currentTheme.textSecondary} text-sm font-medium uppercase tracking-wide`}
                >
                  Days Active
                </p>
              </div>
            </section>

            {/* User Information Cards */}
            <section className="grid md:grid-cols-2 gap-10 mb-20 px-4">
              {/* Email */}
              <div
                className={`${currentTheme.glassBg} backdrop-blur-xl p-6 rounded-3xl border ${currentTheme.border} hover:border-violet-400 hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className="flex items-center space-x-5">
                  <div className="bg-linear-to-br from-violet-500 to-sky-400 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`${currentTheme.textSecondary} text-sm font-semibold uppercase tracking-wide mb-1`}
                    >
                      Email Address
                    </p>
                    <p
                      className={`${currentTheme.text} font-bold text-lg truncate`}
                    >
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(user?.email, "email")}
                    className="p-3 hover:bg-violet-50 rounded-xl transition-all duration-200 shadow-sm"
                    title="Copy email"
                  >
                    {copiedField === "email" ? (
                      <Check className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Copy className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* User ID */}
              <div
                className={`${currentTheme.glassBg} backdrop-blur-xl p-6 rounded-3xl border ${currentTheme.border} hover:border-fuchsia-400 hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className="flex items-center space-x-5">
                  <div className="bg-linear-to-br from-fuchsia-500 to-violet-500 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Hash className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`${currentTheme.textSecondary} text-sm font-semibold uppercase tracking-wide mb-1`}
                    >
                      User ID
                    </p>
                    <p className={`${currentTheme.text} font-bold text-lg`}>
                      #{user?.id}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(user?.id?.toString(), "userid")
                    }
                    className="p-3 hover:bg-fuchsia-50 rounded-xl transition-all duration-200 shadow-sm"
                    title="Copy user ID"
                  >
                    {copiedField === "userid" ? (
                      <Check className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Copy className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div
                className={`${currentTheme.glassBg} backdrop-blur-xl p-6 rounded-3xl border ${currentTheme.border} hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className="flex items-center space-x-5">
                  <div className="bg-linear-to-br from-emerald-500 to-teal-400 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`${currentTheme.textSecondary} text-sm font-semibold uppercase tracking-wide mb-1`}
                    >
                      Account Role
                    </p>
                    <p className={`${currentTheme.text} font-bold text-lg`}>
                      Premium User
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-400 text-white rounded-full text-xs font-bold shadow-lg">
                    Active
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div
                className={`${currentTheme.glassBg} backdrop-blur-xl p-6 rounded-3xl border ${currentTheme.border} hover:border-sky-400 hover:shadow-2xl transition-all duration-300 group`}
              >
                <div className="flex items-center space-x-5">
                  <div className="bg-linear-to-br from-sky-500 to-cyan-400 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`${currentTheme.textSecondary} text-sm font-semibold uppercase tracking-wide mb-1`}
                    >
                      Member Since
                    </p>
                    <p className={`${currentTheme.text} font-bold text-lg`}>
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <section className="grid md:grid-cols-2 gap-10 mb-20 px-4">
              <button
                onClick={() => navigate("/dashboard")}
                className={`group relative flex items-center justify-center space-x-3 bg-linear-to-r ${currentTheme.gradient} text-white px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-2xl text-lg overflow-hidden border border-white/40`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300" />
                <MessageSquare className="w-7 h-7 relative z-10" />
                <span className="relative z-10">Go to Chats</span>
              </button>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="group relative flex items-center justify-center space-x-3 bg-linear-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-600 hover:via-red-600 hover:to-orange-600 text-white px-10 py-5 rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-2xl text-lg overflow-hidden border border-white/40"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300" />
                <LogOut className="w-7 h-7 relative z-10" />
                <span className="relative z-10">Logout Account</span>
              </button>
            </section>

            {/* Premium Badge */}
            <div className="text-center mb-14">
              <div
                className={`inline-flex items-center space-x-3 bg-linear-to-r ${currentTheme.gradient} text-white px-10 py-4 rounded-full shadow-2xl animate-pulse text-lg font-bold border border-white/40`}
              >
                <span>Verified Premium User</span>
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer
          className={`text-center py-5 text-sm ${currentTheme.textSecondary} ${currentTheme.border} border-t backdrop-blur-sm`}
        >
          <p className="font-medium">
            © 2025 ChatterBox — Built with ❤️ by Aarsh
          </p>
        </footer>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-md animate-fade-in">
          <div
            className={`${currentTheme.cardBg} backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 border-2 ${currentTheme.border}`}
          >
            <div className="text-center">
              <div className="mb-8">
                <div className="bg-linear-to-br from-rose-500 to-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <LogOut className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.text} mb-4`}>
                Logging Out?
              </h2>
              <p className={`${currentTheme.textSecondary} text-lg mb-10`}>
                Are you sure you want to logout from ChatterBox?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`flex-1 ${currentTheme.glassBg} backdrop-blur-md hover:bg-white/60 ${currentTheme.text} px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-base border ${currentTheme.border} hover:scale-105 shadow-lg`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-linear-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-600 hover:via-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-base shadow-2xl hover:scale-105 border border-white/40"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;







 Profile.jsx
    ProfileSidebar.jsx
    ProfileNavbar.jsx
    ProfileHeader.jsx
    ProfileStats.jsx
    ProfileInfoCards.jsx
    ProfileActions.jsx
    ProfileFooter.jsx
    LogoutModal.jsx
    theme.js
    avatarColors.js