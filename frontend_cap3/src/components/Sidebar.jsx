import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatDiamondLogo from "./ChatDiamondLogo";
import { useAuth } from "../utils/AuthContext";

import {
  MessageSquare,
  Settings,
  FileText,
  Users,
  FolderOpen,
  Home,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  theme,
  onRequestLogout,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const goDashboard = () => {
    setActiveTab("dashboard");
    navigate("/dashboard");
  };
  const goChats = () => {
    setActiveTab("chats");
    navigate("/chat");
  };
  const goGroups = () => {
    setActiveTab("groups");
    navigate("/chat");
  };
  const goFiles = () => {
    setActiveTab("files");
    navigate("/files");
  };
  const goSettings = () => {
    setActiveTab("settings");
    navigate("/settings");
  };
  const goProfile = () => {
    setActiveTab("profile");
    navigate("/profile");
  };

  const themeName = theme || "dark";

  // Theme-specific colors
  const themeStyles = {
    light: {
      bg: "bg-gradient-to-b from-gray-100 to-gray-50",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      border: "border-gray-300",
      divider: "border-gray-200",
      cardBg: "bg-white/60",
      cardHover: "hover:bg-white/80",
      activeNav: "bg-gradient-to-r from-blue-500 to-cyan-500",
      logoBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
      profileBg: "bg-white/40 border-gray-200",
      profileHover: "hover:bg-white/60",
      profileAvatar: "from-blue-400 to-cyan-500",
    },
    dark: {
      bg: "bg-gradient-to-b from-slate-800 to-slate-700",
      text: "text-gray-100",
      textSecondary: "text-gray-400",
      border: "border-slate-600",
      divider: "border-slate-600/30",
      cardBg: "bg-slate-700/60",
      cardHover: "hover:bg-slate-700/80",
      activeNav: "bg-gradient-to-r from-blue-500 to-indigo-600",
      logoBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      profileBg: "bg-slate-700/40 border-slate-600",
      profileHover: "hover:bg-slate-700/60",
      profileAvatar: "from-blue-400 to-purple-500",
    },
    vintage: {
      bg: "bg-gradient-to-b from-amber-100 to-amber-50",
      text: "text-amber-900",
      textSecondary: "text-amber-800",
      border: "border-amber-300/60",
      divider: "border-amber-200/40",
      cardBg: "bg-amber-50/70",
      cardHover: "hover:bg-white/50",
      activeNav: "bg-gradient-to-r from-orange-500 to-amber-500",
      logoBg: "bg-gradient-to-br from-orange-500 to-amber-600",
      profileBg: "bg-amber-50/60 border-amber-300/50",
      profileHover: "hover:bg-amber-50/80",
      profileAvatar: "from-orange-400 to-amber-500",
    },
  };

  const currentThemeStyle = themeStyles[themeName];

  return (
    <aside
      className={`
        hidden md:flex flex-col h-full w-56 m-3 mr-0 rounded-2xl overflow-hidden
        ${currentThemeStyle.bg} ${currentThemeStyle.text}
        shadow-lg transition-colors duration-300 border border-white/10
      `}
      style={{ minWidth: '240px' }}
    >
      {/* HEADER - Logo */}
      <div className={`h-20 flex items-center justify-center border-b ${currentThemeStyle.border} px-5`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${currentThemeStyle.logoBg} flex items-center justify-center shadow-md`}>
            <ChatDiamondLogo size={24} />
          </div>
          <span className={`text-base font-700 ${currentThemeStyle.text}`}>ChatApp</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <NavItem
          icon={<Home size={18} />}
          label="Home"
          active={activeTab === "dashboard"}
          onClick={goDashboard}
          themeStyle={currentThemeStyle}
        />
        <NavItem
          icon={<MessageSquare size={18} />}
          label="Chats"
          active={activeTab === "chats"}
          onClick={goChats}
          themeStyle={currentThemeStyle}
        />
        <NavItem
          icon={<Users size={18} />}
          label="Groups"
          active={activeTab === "groups"}
          onClick={goGroups}
          themeStyle={currentThemeStyle}
        />
        <NavItem
          icon={<FolderOpen size={18} />}
          label="Files"
          active={activeTab === "files"}
          onClick={goFiles}
          themeStyle={currentThemeStyle}
        />

        {/* DIVIDER */}
        <div className={`border-t ${currentThemeStyle.divider} my-4`}></div>

        {/* PROMPTS SECTION */}
        <div className="px-1 py-2 space-y-1">
          <NavItem
            icon={<FileText size={18} />}
            label="Prompts"
            active={activeTab === "prompts"}
            onClick={() => {
              setActiveTab("prompts");
            }}
            themeStyle={currentThemeStyle}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={goSettings}
            themeStyle={currentThemeStyle}
          />
        </div>
      </nav>

      {/* PROFILE + QUICK LINKS (sticky bottom) */}
      <div className="mt-auto px-3 pb-4 sticky bottom-3 space-y-3">
        <div className={`border rounded-xl ${currentThemeStyle.profileBg} transition-all duration-200 shadow-sm`}>
          <button
            onClick={goProfile}
            className={`w-full flex items-center gap-3 p-4 rounded-xl 
              ${currentThemeStyle.profileHover} transition-all duration-200`}
          >
            <div className={`w-11 h-11 rounded-lg bg-linear-to-br ${currentThemeStyle.profileAvatar} 
              flex items-center justify-center text-white font-600 shadow-md shrink-0 text-sm`}>
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm font-600 ${currentThemeStyle.text} truncate`}>
                {user?.username || "User"}
              </p>
              <p className={`text-xs font-400 ${currentThemeStyle.textSecondary} truncate`}>
                Product Manager
              </p>
            </div>
          </button>
        </div>

        <div className={`border rounded-xl ${currentThemeStyle.profileBg} px-3 py-2 space-y-1 shadow-sm`}> 
          <NavItem
            icon={<Settings size={18} />}
            label="Account Settings"
            active={false}
            onClick={() => navigate("/settings")}
            themeStyle={currentThemeStyle}
          />
          <NavItem
            icon={<LogOut size={18} />}
            label="Logout"
            active={false}
            onClick={() => {
              if (onRequestLogout) {
                onRequestLogout();
              } else {
                logout?.();
                navigate("/login");
              }
            }}
            themeStyle={currentThemeStyle}
          />
        </div>
      </div>
    </aside>
  );
}

/* ------------ NAVIGATION ITEM ------------ */
function NavItem({ icon, label, active, onClick, themeStyle }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-3 rounded-xl
        transition-all duration-150 font-500 text-sm
        ${
          active
            ? `${themeStyle.activeNav} text-white shadow-sm translate-x-0.5`
            : `${themeStyle.text} opacity-70 hover:opacity-100 ${themeStyle.cardHover} active:scale-[0.98]`
        }
      `}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
