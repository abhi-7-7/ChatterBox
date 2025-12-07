// src/components/dashboard/RecentChatsSection.jsx
import React from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

const RecentChatsSection = ({
  chats,
  isLoading,
  currentTheme,
  onStartChat,
  onOpenChat,
  onDeleteChat,
}) => {
  if (isLoading) return null; // stats card already shows loading

  if (chats.length === 0) {
    return (
      <div
        className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-10 shadow-xl text-center hover:shadow-2xl transition-all duration-300 border ${currentTheme.border}`}
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
      className={`${currentTheme.cardBg} backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border ${currentTheme.border}`}
    >
      <h2
        className={`text-3xl font-bold ${currentTheme.text} mb-6 flex items-center justify-between`}
      >
        <span>Recent Chats</span>
        <button
          onClick={onStartChat}
          className={`bg-linear-to-r ${currentTheme.gradient} text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:scale-105 transition-all border border-white/30 flex items-center space-x-2`}
        >
          <Plus className="w-4 h-4" />
          <span>New</span>
        </button>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chats.slice(0, 6).map((chat) => (
          <div
            key={chat.id}
            onClick={() => onOpenChat(chat)}
            className={`group ${currentTheme.glassBg} backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border ${currentTheme.border}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`bg-linear-to-br ${currentTheme.gradient} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={(e) => onDeleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <h3
              className={`${currentTheme.text} font-bold text-lg mb-2 truncate`}
            >
              {chat.name}
            </h3>
            <p className={`${currentTheme.textSecondary} text-sm`}>
              {chat._count?.messages || 0} messages
            </p>
            <p className={`${currentTheme.textSecondary} text-xs mt-2`}>
              {new Date(chat.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentChatsSection;
