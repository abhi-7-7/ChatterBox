// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { chatAPI, participantAPI } from "../../services/api";

// Import Sidebar from components
import Sidebar from "../../components/Sidebar";

// Theme + Avatar
import { themeColors } from "./theme";
import { avatarColors } from "./avatarColors";

// Profile Components
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileInfoCards from "./ProfileInfoCards";
import ProfileActions from "./ProfileActions";
import ActivityCalendar from "./ActivityCalendar";
import LogoutModal from "./LogoutModal";

// Import icons
import { Sun, Moon, Brush, User, ChevronDown, Settings as SettingsIcon } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("chatter-theme") || "light");
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0 });
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);

  // Activity tracking
  const [loginDays, setLoginDays] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  const currentTheme = themeColors[theme];
  const avatarColor = avatarColors[(user?.id || 0) % avatarColors.length];

  // Fetch chats and stats
  useEffect(() => {
    const loadActivityData = () => {
      // Get stored login days from localStorage
      const storedDays = JSON.parse(localStorage.getItem('login-days') || '[]');
      const today = new Date().toDateString();
      // Add today if not already logged
      if (!storedDays.includes(today)) {
        storedDays.push(today);
        localStorage.setItem('login-days', JSON.stringify(storedDays));
      }
      setLoginDays(storedDays);
      // Calculate streak
      const streak = calculateStreak(storedDays);
      setCurrentStreak(streak);
    };

    const load = async () => {
      setIsLoading(true);
      try {
        const res = await chatAPI.getMyChats();
        const fetchedChats = res?.data?.chats || [];
        setChats(fetchedChats);

        setStats({
          totalChats: fetchedChats.length,
          totalMessages: fetchedChats.reduce(
            (sum, chat) => sum + (chat._count?.messages || 0),
            0
          )
        });

        // Load activity data (login days)
        loadActivityData();
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // (removed unused loadActivityData)

  // Calculate login streak
  const calculateStreak = (days) => {
    if (days.length === 0) return 0;
    
    const sortedDays = days
      .map(d => new Date(d))
      .sort((a, b) => b - a);
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if last login was today or yesterday
    const lastLogin = new Date(sortedDays[0]);
    lastLogin.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 1; // Streak broken
    
    // Count consecutive days
    for (let i = 1; i < sortedDays.length; i++) {
      const current = new Date(sortedDays[i]);
      const previous = new Date(sortedDays[i - 1]);
      current.setHours(0, 0, 0, 0);
      previous.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((previous - current) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Apply theme to body background
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("chatter-theme", theme);
    
    const bgColors = {
      light: '#f6f8fb',
      dark: '#0f1720',
      vintage: '#fbf7f2'
    };
    document.body.style.backgroundColor = bgColors[theme];
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "vintage" : "light"
    );

  const copyToClipboard = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    const dt = typeof d === 'string' ? new Date(d) : d;
    if (!(dt instanceof Date) || isNaN(dt.getTime())) {
      return "N/A";
    }
    return dt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysActive = loginDays.length;

  const handleOpenChat = (chat) => {
    navigate("/chat", { state: { chatId: chat.id, chatName: chat.title } });
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (window.confirm("Delete or leave this chat? If not owner, you will leave it.")) {
      try {
        await chatAPI.deleteChat(chatId);
        setChats((prev) => prev.filter((c) => c.id !== chatId));
        setStats((prev) => ({
          totalChats: prev.totalChats - 1,
          totalMessages: prev.totalMessages
        }));
      } catch (error) {
        if (user?.id) {
          try {
            await participantAPI.removeSelf(chatId, user.id);
            setChats((prev) => prev.filter((c) => c.id !== chatId));
            setStats((prev) => ({
              totalChats: Math.max(prev.totalChats - 1, 0),
              totalMessages: prev.totalMessages
            }));
            return;
          } catch (innerErr) {
            console.error("Error leaving chat:", innerErr);
          }
        }
        console.error("Error deleting chat:", error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`flex h-screen overflow-hidden ${currentTheme.bg}`}>
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentTheme={currentTheme}
        theme={theme}
        onOpenChat={handleOpenChat}
        onDeleteChat={handleDeleteChat}
        onRequestLogout={() => setShowLogout(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav
          className={`flex items-center justify-between px-6 py-5 bg-linear-to-br ${currentTheme.gradient} shadow-xl`}
        >
          <div>
            <h2 className="text-3xl text-white font-bold">Your Profile</h2>
            <p className="text-white/90 mt-1">View and manage your account</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="bg-white/20 p-4 rounded-2xl hover:bg-white/30 transition-all backdrop-blur-sm hover:scale-105"
              title="Toggle Theme"
            >
              {theme === "light" && <Sun className="text-white w-6 h-6" />}
              {theme === "dark" && <Moon className="text-white w-6 h-6" />}
              {theme === "vintage" && <Brush className="text-white w-6 h-6" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 bg-white/20 px-5 py-3 rounded-2xl hover:bg-white/30 transition-all backdrop-blur-sm"
              >
                <User className="text-white w-6 h-6" />
                <span className="text-white font-medium">
                  {user?.username || user?.email?.split("@")[0] || "Abhi"}
                </span>
                <ChevronDown
                  className={`text-white w-5 h-5 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div
                    className={`absolute right-0 mt-4 w-72 rounded-2xl overflow-hidden shadow-2xl z-20 ${currentTheme.surface} border ${currentTheme.border}`}
                  >
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setProfileOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full p-4 hover:bg-black/5 transition ${currentTheme.text}`}
                    >
                      <SettingsIcon className="w-5 h-5" />
                      <span className="font-medium">Back to Dashboard</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>

        <div className={`flex-1 ${currentTheme.bg} overflow-y-auto`}>
          <div className="relative">
            <ProfileHeader currentTheme={currentTheme} avatarColor={avatarColor} user={user} />
          </div>

          {/* Main Content - All data below avatar */}
          <div className="max-w-8xl mx-20px pt-20 md:pt-24 pb-8 px-10 md:px-10 lg:px-12 mt-[30px]">
            
            {/* Stats Section */}
            <ProfileStats
              stats={stats}
              isLoading={isLoading}
              daysActive={daysActive}
              currentStreak={currentStreak}
              currentTheme={currentTheme}
            />

            {/* Info Cards + Activity Calendar in 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-8 pt-[15px]">
              {/* Left: Info Cards */}
              <div>
                <ProfileInfoCards
                  user={user}
                  copiedField={copiedField}
                  copyToClipboard={copyToClipboard}
                  currentTheme={currentTheme}
                  formatDate={formatDate}
                />
              </div>

              {/* Right: Activity Calendar */}
              <div>
                <ActivityCalendar
                  loginDays={loginDays}
                  currentStreak={currentStreak}
                  currentTheme={currentTheme}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <ProfileActions
              currentTheme={currentTheme}
              onGoDashboard={() => navigate("/dashboard")}
            />
          </div>
        </div>

        {/* Logout Modal */}
        <LogoutModal
          open={showLogout}
          currentTheme={currentTheme}
          onCancel={() => setShowLogout(false)}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
};

export default Profile;