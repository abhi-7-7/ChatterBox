// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { chatAPI } from "../../services/api";
import "../styles/theme.css";
import Footer from "../../components/Footer";


import {
  LogOut,
  Plus,
  MessageSquare,
  Settings,
  User,
  ChevronDown,
  Sun,
  Moon,
  Brush,
  TrendingUp,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [openSidebar, setOpenSidebar] = useState(false);
  const [theme, setTheme] = useState("light");
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await chatAPI.getMyChats();
      const userChats = response?.data?.chats || [];

      setChats(userChats);

      let totalMessages = userChats.reduce(
        (acc, chat) => acc + (chat._count?.messages || 0),
        0
      );

      setStats({
        totalChats: userChats.length,
        totalMessages,
      });
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async () => {
    try {
      const response = await chatAPI.createChat({ name: "New Chat" });
      const newChat = response.data.chat;

      navigate("/chat", {
        state: {
          chatId: newChat.id,
          chatName: newChat.name,
        },
      });
    } catch (error) {
      console.error("Chat creation failed:", error);
    }
  };

  const handleOpenChat = (chat) => {
    navigate("/chat", {
      state: {
        chatId: chat.id,
        chatName: chat.name,
      },
    });
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm("Delete this chat permanently?")) return;

    try {
      await chatAPI.deleteChat(chatId);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Theme handling
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = "var(--color-bg)";
  }, [theme]);

  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "vintage" : "light");

  const themeColors = {
    light: {
      gradient: "from-blue-400 via-cyan-400 to-teal-400",
      bg: "bg-white/80",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      border: "border-blue-200",
      cardBg: "bg-white/60",
      glassBg: "bg-white/40",
    },
    dark: {
      gradient: "from-gray-700 via-gray-800 to-gray-900",
      bg: "bg-gray-800/80",
      text: "text-gray-100",
      textSecondary: "text-gray-300",
      border: "border-gray-700",
      cardBg: "bg-gray-800/60",
      glassBg: "bg-gray-700/40",
    },
    vintage: {
      gradient: "from-orange-400 via-amber-400 to-yellow-400",
      bg: "bg-amber-50/80",
      text: "text-amber-900",
      textSecondary: "text-amber-700",
      border: "border-amber-300",
      cardBg: "bg-amber-50/60",
      glassBg: "bg-amber-100/40",
    },
  };

  const currentTheme = themeColors[theme];
  const daysActive = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt)) / 86400000)
    : 0;

  return (
    <div className="flex h-screen flex-col">

      {/* ---------------- NAV + SIDEBAR SECTION ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden md:flex flex-col w-72 p-6 bg-surface border-r border-subtle shadow-soft">
          <h1 className="text-3xl font-extrabold flex items-center space-x-3 mb-10">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <MessageSquare className="w-8 h-8" />
            </div>
            <span>ChatterBox</span>
          </h1>

          {/* Start New Chat */}
          <button
            onClick={handleStartChat}
            className="btn-primary-600 text-white flex items-center justify-center space-x-2 px-5 py-3 rounded-xl mb-8 shadow-sm"
          >
            <Plus className="w-6 h-6" />
            <span>Start New Chat</span>
          </button>

          {/* Recent Chats List */}
          <div className="flex-1 overflow-y-auto">
            <p className="font-semibold text-lg opacity-90 mb-4">
              Recent Chats
            </p>

            {isLoading ? (
              <div className="p-6 text-center border border-subtle rounded-2xl shadow-soft bg-surface">
                <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin opacity-70" />
                <p className="text-base text-muted font-medium">
                  Loading chats...
                </p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-6 text-center border border-subtle rounded-2xl shadow-soft bg-surface">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted" />
                <p className="font-medium text-base">No chats yet</p>
                <p className="text-sm text-muted">Start one above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.slice(0, 10).map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleOpenChat(chat)}
                    className="group p-3 border border-subtle rounded-xl shadow-sm bg-surface cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold truncate">{chat.name}</p>
                        <p className="text-sm text-muted">
                          {chat._count?.messages || 0} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-muted" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/20 transition"
          >
            <Settings className="w-6 h-6" />
            <span>Settings</span>
          </button>

          {settingsOpen && (
            <div className="mt-3 bg-white/20 p-4 rounded-xl shadow-xl backdrop-blur-md">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center space-x-3 text-red-600 py-2 px-3 hover:bg-red-50 rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col overflow-auto">

          {/* Navbar */}
          <nav
            className={`flex items-center justify-between px-6 py-6 bg-linear-to-r ${currentTheme.gradient} shadow-xl`}
          >
            <h2 className="text-3xl text-white font-bold drop-shadow">
              Welcome back, {user?.username} 👋
            </h2>

            {/* Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-3 bg-white/30 rounded-xl hover:bg-white/50 shadow backdrop-blur-md"
            >
              {theme === "light" && <Sun className="text-white w-6 h-6" />}
              {theme === "dark" && <Moon className="text-white w-6 h-6" />}
              {theme === "vintage" && <Brush className="text-white w-6 h-6" />}
            </button>
          </nav>

          {/* Scrollable dashboard content */}
          <div className="flex-1 p-6 overflow-auto">

            <div className="max-w-6xl mx-auto space-y-8">

              {/* Overview */}
              <div
                className={`${currentTheme.cardBg} p-8 rounded-3xl shadow-xl border ${currentTheme.border}`}
              >
                <h1 className={`text-4xl font-bold ${currentTheme.text}`}>
                  Dashboard Overview
                </h1>
                <p className={`${currentTheme.textSecondary} text-lg`}>
                  Everything is working smoothly 🎉
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Chats */}
                <div className={`${currentTheme.glassBg} p-6 rounded-3xl shadow-lg border ${currentTheme.border}`}>
                  <MessageSquare className="w-8 h-8 mb-3 text-indigo-600" />
                  <p className={`text-3xl font-bold ${currentTheme.text}`}>
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.totalChats}
                  </p>
                  <p className={currentTheme.textSecondary}>Total Chats</p>
                </div>

                {/* Total Messages */}
                <div className={`${currentTheme.glassBg} p-6 rounded-3xl shadow-lg border ${currentTheme.border}`}>
                  <TrendingUp className="w-8 h-8 mb-3 text-indigo-600" />
                  <p className={`text-3xl font-bold ${currentTheme.text}`}>
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : stats.totalMessages}
                  </p>
                  <p className={currentTheme.textSecondary}>Total Messages</p>
                </div>

                {/* Days Active */}
                <div className={`${currentTheme.glassBg} p-6 rounded-3xl shadow-lg border ${currentTheme.border}`}>
                  <Clock className="w-8 h-8 mb-3 text-indigo-600" />
                  <p className={`text-3xl font-bold ${currentTheme.text}`}>{daysActive}</p>
                  <p className={currentTheme.textSecondary}>Days Active</p>
                </div>
              </div>

              {/* Recent Chats Section */}
              <div
                className={`${currentTheme.cardBg} p-8 rounded-3xl border ${currentTheme.border} shadow-xl`}
              >
                <h2 className={`text-3xl font-bold mb-6 ${currentTheme.text}`}>
                  Recent Chats
                </h2>

                {chats.length === 0 ? (
                  <p className={currentTheme.textSecondary}>No chats yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chats.slice(0, 6).map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleOpenChat(chat)}
                        className={`${currentTheme.glassBg} p-5 rounded-2xl shadow-lg border ${currentTheme.border} cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition`}
                      >
                        <h3 className={`font-bold text-lg truncate ${currentTheme.text}`}>
                          {chat.name}
                        </h3>

                        <p className={`${currentTheme.textSecondary} text-sm`}>
                          {chat._count?.messages || 0} messages
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <Footer />

        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="p-10 bg-white rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Log out?</h2>
            <p className="mb-8">Are you sure you want to logout?</p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
