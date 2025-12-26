import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { chatAPI, authAPI } from "../../services/api";

// Components
import Sidebar from "../../components/Sidebar";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileInfoCards from "./ProfileInfoCards";
import ActivityCalendar from "./ActivityCalendar";
import LogoutModal from "./LogoutModal";
import EditProfileModal from "./EditProfileModal";

// Theme & Assets
import { themeColors } from "./theme";
import { avatarColors } from "./avatarColors";
import { LogOut, LayoutGrid } from "lucide-react";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // State
  // eslint-disable-next-line no-unused-vars
  const [theme, setTheme] = useState(localStorage.getItem("chatter-theme") || "light");
  const [showLogout, setShowLogout] = useState(false);
  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [toast, setToast] = useState(null);
  
  // Activity
  const [loginDays, setLoginDays] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Computed
  const currentTheme = themeColors[theme];
  const avatarColor = avatarColors[(user?.id || 0) % avatarColors.length];

  // Effects
  useEffect(() => {
    // 1. Load Activity
    const storedDays = JSON.parse(localStorage.getItem('login-days') || '[]');
    const today = new Date().toDateString();
    if (!storedDays.includes(today)) {
      storedDays.push(today);
      localStorage.setItem('login-days', JSON.stringify(storedDays));
    }
    setLoginDays(storedDays);
    setCurrentStreak(calculateStreak(storedDays));

    // 2. Load Stats
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const res = await chatAPI.getMyChats();
        const fetchedChats = res?.data?.chats || [];
        // setChats(fetchedChats); // Unused state
        setStats({
          totalChats: fetchedChats.length,
          totalMessages: fetchedChats.reduce((acc, chat) => acc + (chat._count?.messages || 0), 0)
        });
      } catch (err) {
        console.error("Failed to load profile stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  // Update Body Theme
  useEffect(() => {
    document.body.className = currentTheme.bg;
  }, [theme, currentTheme]);

  // Helpers
  const calculateStreak = (days) => {
    if (!days.length) return 0;
    const sorted = days.map(d => new Date(d)).sort((a, b) => b - a);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Check if streak is active (logged in today or yesterday)
    const lastLogin = new Date(sorted[0]);
    lastLogin.setHours(0,0,0,0);
    const diff = (today - lastLogin) / (1000 * 60 * 60 * 24);
    if (diff > 1) return 0;

    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = new Date(sorted[i]);
      const next = new Date(sorted[i+1]);
      curr.setHours(0,0,0,0);
      next.setHours(0,0,0,0);
      if ((curr - next) / (1000 * 60 * 60 * 24) === 1) streak++;
      else break;
    }
    return streak;
  };

  const copyToClipboard = (val, field) => {
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className={`flex h-screen overflow-hidden ${currentTheme.bg}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        theme={theme}
        onRequestLogout={() => setShowLogout(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto p-6 md:p-10 lg:p-12">
          
          {/* Top Bar / Breadcrumb (Optional) */}
          <div className="flex items-center justify-between mb-8">
             <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Profile</h2>
             <button 
               onClick={() => navigate('/dashboard')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentTheme.buttonSecondary}`}
             >
               <LayoutGrid className="w-4 h-4" />
               Dashboard
             </button>
          </div>

          {/* Profile Header Banner */}
          <ProfileHeader 
            currentTheme={currentTheme} 
            avatarColor={avatarColor} 
            user={profileData || user} 
            onEdit={() => setShowEditProfile(true)}
          />

          {/* Key Metrics Grid */}
          <ProfileStats 
            stats={stats}
            daysActive={loginDays.length}
            currentStreak={currentStreak}
            isLoading={isLoading}
            currentTheme={currentTheme}
          />

          {/* Info & Activity Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
            {/* Left: Account Details (5 cols) */}
            <div className="lg:col-span-5">
              <ProfileInfoCards 
                user={profileData || user}
                copiedField={copiedField}
                copyToClipboard={copyToClipboard}
                currentTheme={currentTheme}
                formatDate={formatDate}
              />
            </div>

            {/* Right: Calendar (7 cols) */}
            <div className="lg:col-span-7">
              <ActivityCalendar 
                loginDays={loginDays}
                currentStreak={currentStreak}
                currentTheme={currentTheme}
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end pt-8 border-t border-slate-200">
            <button 
              onClick={() => setShowLogout(true)}
              className="flex items-center gap-2 px-6 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

        </div>
      </div>

      {/* Modals */}
      <LogoutModal 
        open={showLogout}
        currentTheme={currentTheme}
        onCancel={() => setShowLogout(false)}
        onConfirm={() => {
          logout();
          navigate("/login");
        }}
      />

      <EditProfileModal
        open={showEditProfile}
        user={profileData || user}
        onClose={() => setShowEditProfile(false)}
        onSave={async (payload) => {
          try {
            const { fullName, username, location, website, avatarUrl } = payload;
            const res = await authAPI.updateMe({ fullName, username, location, website, avatarUrl });
            const updated = res?.data?.user;
            if (updated) {
              setProfileData(updated);
              updateUser(updated);
              setShowEditProfile(false);
              setToast({ type: 'success', message: 'Profile updated successfully' });
              setTimeout(() => setToast(null), 2500);
            }
          } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to update profile';
            setToast({ type: 'error', message: msg });
            setTimeout(() => setToast(null), 2500);
          }
        }}
        onAvatarUpload={async (file) => {
          try {
            const res = await authAPI.uploadAvatar(file);
            const url = res?.data?.avatarUrl;
            if (url) {
              const updated = { ...(profileData || user), avatarUrl: url };
              setProfileData(updated);
              updateUser(updated);
              return url;
            }
            return null;
          } catch (err) {
            const msg = err?.response?.data?.message || 'Avatar upload failed';
            setToast({ type: 'error', message: msg });
            setTimeout(() => setToast(null), 2500);
            return null;
          }
        }}
        onRemoveAvatar={async () => {
          try {
            const res = await authAPI.updateMe({ avatarUrl: null });
            const updated = res?.data?.user;
            if (updated) {
              setProfileData(updated);
              updateUser(updated);
              return true;
            }
            return false;
          } catch (err) {
            const msg = err?.response?.data?.message || 'Failed to remove photo';
            setToast({ type: 'error', message: msg });
            setTimeout(() => setToast(null), 2500);
            return false;
          }
        }}
      />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 shadow-lg ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Profile;
