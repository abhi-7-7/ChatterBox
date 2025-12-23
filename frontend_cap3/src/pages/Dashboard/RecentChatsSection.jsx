// src/pages/Dashboard/RecentChatsSection.jsx
import React from "react";
import { MessageSquare, Plus, Trash2, ArrowRight, Users, Circle } from "lucide-react";

const RecentChatsSection = ({
  chats,
  isLoading,
  currentTheme,
  onStartChat,
  onOpenChat,
  onDeleteChat,
}) => {
  if (isLoading) return null;

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to get avatar color
  const getAvatarColor = (index) => {
    const colors = [
      "from-pink-400 to-pink-600",
      "from-red-400 to-red-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-yellow-400 to-yellow-600",
    ];
    return colors[index % colors.length];
  };

  const formatTime = (value) => {
    if (!value) return "Recently";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Recently";
    return parsed.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (chats.length === 0) {
    return (
      <div
        className={`${currentTheme.cardBg} rounded-3xl p-10 shadow-xl text-center hover:shadow-2xl transition-all duration-300 border ${currentTheme.border}`}
      >
        <div
          className={`bg-linear-to-br ${currentTheme.gradient} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl`}
        >
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        <h2 className={`text-3xl font-bold ${currentTheme.text} mb-3`}>
          Recent Chats
        </h2>
        <p className={`${currentTheme.textSecondary} text-lg mb-6`}>
          No recent chats yet. Start one!
        </p>
        <button
          onClick={onStartChat}
          className={`group relative inline-flex items-center space-x-2 bg-linear-to-r ${currentTheme.gradient} text-white px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 font-bold shadow-2xl text-lg overflow-hidden border border-white/30`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <Plus className="w-6 h-6 relative z-10" />
          <span className="relative z-10">Start Chatting</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${currentTheme.cardBg} rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-all duration-200 border ${currentTheme.border}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className={`text-xs uppercase tracking-[0.15em] font-600 ${currentTheme.textSecondary} opacity-60`}>Recents</p>
            <h2 className={`text-base font-700 ${currentTheme.text}`}>
              Recent Chats
            </h2>
          </div>
        </div>
        <button
          onClick={onStartChat}
          className="text-sm font-600 text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {chats.slice(0, 4).map((chat, idx) => {
          const lastMessage = chat.messages?.[0];
          const time = formatTime(lastMessage?.createdAt || chat.updatedAt);
          const isOnline = chat.isOnline ?? chat.status === "online";

          return (
            <div
              key={chat.id}
              onClick={() => onOpenChat(chat)}
              className={`group flex items-center gap-4 p-4 rounded-xl
                ${currentTheme.glassBg} hover:bg-white/90 dark:hover:bg-gray-700/90
                transition-all duration-150 cursor-pointer border border-transparent
                hover:border-gray-200/50 dark:hover:border-gray-600/50 active:scale-[0.98]
                relative overflow-hidden`}
            >
              {/* Hover chevron indicator */}
              <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <ArrowRight className="w-4 h-4 text-blue-500/60" />
              </div>
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className={`w-11 h-11 rounded-lg bg-linear-to-br ${getAvatarColor(
                    idx
                  )} 
                    flex items-center justify-center text-white font-600 shadow-md text-sm`}
                >
                  {getInitials(chat.title)}
                </div>
                <Circle
                  className={`w-3 h-3 absolute bottom-0 right-0 border border-white ${
                    isOnline ? "text-green-500" : "text-slate-300"
                  }`}
                  fill="currentColor"
                />
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between mb-0.5">
                  <h3
                    className={`${currentTheme.text} font-600 text-sm truncate group-hover:text-blue-600 transition-colors`}
                  >
                    {chat.title}
                  </h3>
                  <span
                    className={`${currentTheme.textSecondary} text-xs shrink-0 ml-2 font-400 opacity-70`}
                  >
                    {time}
                  </span>
                </div>
                <p
                  className={`${currentTheme.textSecondary} text-xs truncate opacity-60 group-hover:opacity-80 transition-opacity`}
                >
                  {lastMessage?.content || (
                    <span className="italic opacity-50">No messages yet</span>
                  )}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => onDeleteChat?.(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 
                  rounded-lg transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Go to Chat Page Button - PRIMARY ACTION */}
      <button
        onClick={onStartChat}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white 
          py-2.5 rounded-xl font-600 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12)] active:shadow-[0_1px_2px_rgba(0,0,0,0.08)]
          transition-all duration-150 flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Go To Chat Page
      </button>
    </div>
  );
};

export default RecentChatsSection;
