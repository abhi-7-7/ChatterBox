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
const DashNavbar = lazyRetry(() => import("./DashNavbar"));
const StatsGrid = lazyRetry(() => import("./StatsGrid"));
const AnalyticsChart = lazyRetry(() => import("./AnalyticsChart"));
const AnalyticsSkeleton = lazyRetry(() => import("./AnalyticsSkeleton"));
const QuickActions = lazyRetry(() => import("./QuickActions"));
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
    groups: 12,
    shared: 57,
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

      // Fetch all chats
      const resChats = await chatAPI.getMyChats();
      const list = resChats.data.chats || [];
      setChats(list);

      // Calculate total messages
      let totalMessages = 0;
      list.forEach((c) => {
        totalMessages += c._count?.messages || 0;
      });

      // Fetch dashboard statistics
      const resStats = await chatAPI.getDashboardStats();
      const analytics = resStats.data || {};

      setStats({
        totalChats: list.length,
        totalMessages,
        groups: analytics.groups || 0,
        shared: analytics.shared || 0,
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
      gradient: "from-sky-400 via-blue-400 to-cyan-400",
      cardBg: "bg-white",
      border: "border-gray-200/80",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      glassBg: "bg-white/70",
      bgMain: "bg-gray-50/80",
    },
    dark: {
      gradient: "from-slate-700 via-slate-800 to-slate-900",
      cardBg: "bg-slate-800/90",
      border: "border-slate-700/60",
      text: "text-gray-50",
      textSecondary: "text-gray-400",
      glassBg: "bg-slate-900/70",
      bgMain: "bg-slate-950/80",
    },
    vintage: {
      gradient: "from-amber-600 via-amber-500 to-orange-500",
      cardBg: "bg-amber-50/95",
      border: "border-amber-200/70",
      text: "text-amber-950",
      textSecondary: "text-amber-800",
      glassBg: "bg-amber-100/60",
      bgMain: "bg-amber-50/60",
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
        className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-xl 
          p-6 shadow-sm flex items-center gap-4 max-w-lg mx-auto`}
      >
        <div className="w-7 h-7 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin" />
        <span className={`${currentTheme.text} text-sm font-500`}>{title}</span>
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

      {/* MAIN AREA - flex layout ensures footer stays at bottom */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

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
        <div className={`flex-1 overflow-y-auto ${currentTheme.bgMain}`}>
          {/* Content container with proper padding hierarchy */}
          <div className="px-8 py-12">
            <div className="max-w-7xl mx-auto flex gap-6">
              
              {/* MAIN CONTENT - 2/3 width */}
              <div className="flex-1 max-w-[calc(100%-344px)] space-y-[5vh] min-h-screen">

                {/* OVERVIEW HEADER */}
                <div
                  className={`${currentTheme.cardBg} border ${currentTheme.border} 
                    p-[2vw] rounded-xl shadow-sm min-h-[12vh]`}
                >
                  <h1 className={`text-[clamp(24px,6vw,36px)] font-700 ${currentTheme.text} leading-[1.2]`}>
                    Overview
                  </h1>
                  <p className={`${currentTheme.textSecondary} text-[clamp(14px,2vw,18px)] font-400 mt-[2vh]`}>
                    Welcome back! Here's what's happening today.
                  </p>
                </div>

                {/* STATS GRID - Instant render (no async) */}
                <Suspense fallback={<Fallback title="Loading Stats..." />}>
                  <SafeComponent fallback={<Fallback title="Stats failed" />}>
                    <StatsGrid
                      stats={stats}
                      isLoading={isLoading}
                      currentTheme={currentTheme}
                      daysActive={daysActive}
                      activeUsers={237}
                    />
                  </SafeComponent>
                </Suspense>

                {/* ANALYTICS - Full width with reserved space to prevent footer jump */}
                <div className="min-h-[60vh] space-y-[2vh]">
                  <Suspense fallback={<AnalyticsSkeleton currentTheme={currentTheme} />}>
                    <SafeComponent fallback={<Fallback title="Analytics failed" />}>
                      <AnalyticsChart
                        data={stats.graph}
                        currentTheme={currentTheme}
                      />
                    </SafeComponent>
                  </Suspense>
                </div>

              </div>

              {/* RIGHT RAIL - Responsive width based on viewport */}
              <div className="w-[clamp(280px,25vw,400px)] flex-shrink-0 space-y-[2vh] min-h-screen">
                
                {/* QUICK ACTIONS - Fixed height */}
                <div className="h-fit">
                  <Suspense fallback={<Fallback title="Loading actions..." />}>
                    <SafeComponent fallback={<Fallback title="Actions failed" />}>
                      <QuickActions
                        currentTheme={currentTheme}
                        onStartChat={() => navigate("/chat")}
                        onNavigateProfile={() => navigate("/profile")}
                      />
                    </SafeComponent>
                  </Suspense>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-gray-200/50 dark:bg-gray-700/50"></div>

                {/* RECENT CHATS - Scrollable with responsive height */}
                <div className="max-h-[calc(100vh-40vh)] overflow-y-auto">
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
                        onDeleteChat={async (id, e) => {
                          e.stopPropagation();
                          if (!window.confirm("Delete this chat?")) return;
                          try {
                            await chatAPI.deleteChat(id);
                            loadDashboard();
                          } catch (err) {
                            console.error("Delete chat error:", err);
                          }
                        }}
                      />
                    </SafeComponent>
                  </Suspense>
                </div>

              </div>

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
    </div>
  );
}
