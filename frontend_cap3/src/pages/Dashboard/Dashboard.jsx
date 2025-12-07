// src/pages/Dashboard/Dashboard.jsx

import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { chatAPI, participantAPI } from "../../services/api";

import "../../styles/theme.css";

import Footer from "../../components/Footer";
import SafeComponent from "../../components/SafeComponent";
import lazyRetry from "../../utils/lazyRetry";
import Sidebar from "../../components/Sidebar";

// Lazy Components
// const Sidebar = lazyRetry(() => import("../../components/Sidebar"));
const DashNavbar = lazyRetry(() => import("./DashNavbar"));
const StatsGrid = lazyRetry(() => import("./StatsGrid"));
const RecentChatsSection = lazyRetry(() => import("./RecentChatsSection"));
const MobileSidebar = lazyRetry(() => import("./MobileSidebar"));
const LogoutModal = lazyRetry(() => import("./LogoutModal"));

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState("light");
  const [chats, setChats] = useState([]);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    growth: { chats: 0, messages: 0, days: 0 },
    graph: { chats: [], messages: [], days: [] },
  });
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);

      const resChats = await chatAPI.getMyChats();
      const list = resChats.data.chats || [];
      setChats(list);

      let totalMessages = 0;
      list.forEach((c) => {
        totalMessages += c._count?.messages || 0;
      });

      const resStats = await chatAPI.getDashboardStats?.();
      const analytics = resStats?.data || {};

      setStats({
        totalChats: list.length,
        totalMessages,
        growth: analytics.growth || { chats: 0, messages: 0, days: 0 },
        graph: analytics.graph || { chats: [], messages: [], days: [] },
      });
    } catch (e) {
      console.error("Dashboard load error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Theme Handling
  const toggleTheme = () =>
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "vintage" : "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Theme Tokens
  const themeColors = {
    light: {
      gradient: "from-blue-400 via-cyan-400 to-teal-400",
      cardBg: "bg-white/60",
      border: "border-blue-200",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      glassBg: "bg-white/40",
    },
    dark: {
      gradient: "from-gray-700 via-gray-800 to-gray-900",
      cardBg: "bg-gray-800/60",
      border: "border-gray-700",
      text: "text-gray-100",
      textSecondary: "text-gray-300",
      glassBg: "bg-gray-900/40",
    },
    vintage: {
      gradient: "from-orange-400 via-amber-400 to-yellow-400",
      cardBg: "bg-amber-100/60",
      border: "border-amber-300",
      text: "text-amber-900",
      textSecondary: "text-amber-700",
      glassBg: "bg-amber-100/40",
    },
  };

  const currentTheme = themeColors[theme];

  const daysActive = user?.createdAt
    ? Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))
    : 0;

  // Quick Loader Card
  const Fallback = ({ title }) => (
    <div className="p-4">
      <div
        className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl 
          p-6 shadow-lg flex items-center gap-4 max-w-lg mx-auto`}
      >
        <div className="w-7 h-7 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin" />
        <span className={currentTheme.text}>{title}</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Suspense fallback={<Fallback title="Loading sidebar..." />}>
        <SafeComponent fallback={<Fallback title="Sidebar failed" />}>
          <Sidebar
            chats={chats}
            currentTheme={currentTheme}
            onStartChat={() => navigate("/chat")}

            onOpenChat={(chat) =>
              navigate("/chat", { state: { chatId: chat.id, chatName: chat.title } })
            }
            onDeleteChat={async (id, e) => {
              e.stopPropagation();
              if (!window.confirm("Delete or leave this chat? If you are not the owner, you will leave it.")) return;
              try {
                await chatAPI.deleteChat(id);
                loadDashboard();
              } catch (err) {
                // If not owner, leave the chat instead
                if (user?.id) {
                  try {
                    await participantAPI.removeSelf(id, user.id);
                    loadDashboard();
                    return;
                  } catch (innerErr) {
                    console.error("Dashboard leave chat failed:", innerErr);
                  }
                }
                console.error("Dashboard delete chat failed:", err);
              }
            }}
            onRequestLogout={() => setShowLogoutConfirm(true)}
          />
        </SafeComponent>
      </Suspense>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* NAVBAR */}
        <Suspense fallback={<Fallback title="Loading navbar..." />}>
          <SafeComponent fallback={<Fallback title="Navbar failed" />}>
            <DashNavbar
              user={user}
              theme={theme}
              toggleTheme={toggleTheme}
              currentTheme={currentTheme}
              onNavigateProfile={() => navigate("/profile")}
              onToggleSidebar={() => setOpenSidebar(true)}
            />
          </SafeComponent>
        </Suspense>

        {/* CONTENT SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-8 pr-10">
          <div className="w-full space-y-10">

            {/* OVERVIEW CARD */}
            <div
              className={`${currentTheme.cardBg} border ${currentTheme.border} 
                p-8 rounded-3xl shadow-xl w-full backdrop-blur-xl`}
            >
              <h1 className={`text-4xl font-extrabold ${currentTheme.text}`}>
                Dashboard Overview
              </h1>
              <p className={`${currentTheme.textSecondary} mt-2 text-lg`}>
                A quick summary of your activity.
              </p>
            </div>

            {/* STATS GRID */}
            <Suspense fallback={<Fallback title="Loading Stats..." />}>
              <SafeComponent fallback={<Fallback title="Stats failed" />}>
                <StatsGrid
                  stats={stats}
                  isLoading={isLoading}
                  currentTheme={currentTheme}
                  daysActive={daysActive}
                />
              </SafeComponent>
            </Suspense>

            {/* RECENT CHATS */}
            <Suspense fallback={<Fallback title="Loading chats..." />}>
              <SafeComponent fallback={<Fallback title="Chat list failed" />}>
                <RecentChatsSection
                  chats={chats}
                  isLoading={isLoading}
                  currentTheme={currentTheme}
                  onStartChat={() => navigate("/chat")}
                  onOpenChat={(chat) =>
                    navigate("/chat", {
                      state: { chatId: chat.id, chatName: chat.title },
                    })
                  }
                />
              </SafeComponent>
            </Suspense>

          </div>
        </div>

        <Footer />
      </div>

      {/* MOBILE SIDEBAR */}
      <Suspense fallback={<Fallback title="Loading mobile sidebar..." />}>
        <MobileSidebar
          open={openSidebar}
          setOpen={setOpenSidebar}
          chats={chats}
          currentTheme={currentTheme}
          onStartChat={() => navigate("/chat")}
          onOpenChat={(chat) =>
            navigate("/chat", { state: { chatId: chat.id, chatName: chat.title } })
          }
        />
      </Suspense>

      {/* LOGOUT MODAL */}
      <Suspense fallback={<Fallback title="Loading modal..." />}>
        <LogoutModal
          open={showLogoutConfirm}
          currentTheme={currentTheme}
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            logout();
            navigate("/login");
          }}
        />
      </Suspense>
    </div>
  );
}
