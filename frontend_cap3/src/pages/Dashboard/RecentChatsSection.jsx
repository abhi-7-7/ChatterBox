import React from 'react';
import { MessageSquare, ArrowRight, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecentChatsSection({ chats, theme, isLoading, onViewAll }) {
  const navigate = useNavigate();

  const themeStyles = {
    light: {
      card: 'bg-white/70 backdrop-blur-md border border-white/20',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      hover: 'hover:bg-gray-50/50',
      link: 'text-gray-500 hover:text-gray-700',
      statusOnline: 'bg-green-500',
      statusAway: 'bg-yellow-500',
      statusOffline: 'bg-gray-400',
      statusDue: 'bg-red-500',
      closeButton: 'text-gray-400 hover:text-gray-600'
    },
    dark: {
      card: 'bg-slate-800/70 backdrop-blur-md border border-white/10',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      hover: 'hover:bg-slate-700/30',
      link: 'text-gray-500 hover:text-gray-300',
      statusOnline: 'bg-green-500',
      statusAway: 'bg-yellow-500',
      statusOffline: 'bg-gray-500',
      statusDue: 'bg-red-500',
      closeButton: 'text-gray-500 hover:text-gray-300'
    },
    vintage: {
      card: 'bg-amber-50/70 backdrop-blur-md border border-amber-200/50',
      text: 'text-amber-900',
      textSecondary: 'text-amber-800',
      textMuted: 'text-amber-600',
      hover: 'hover:bg-amber-100/30',
      link: 'text-amber-600 hover:text-amber-800',
      statusOnline: 'bg-green-500',
      statusAway: 'bg-yellow-500',
      statusOffline: 'bg-gray-400',
      statusDue: 'bg-red-500',
      closeButton: 'text-amber-600 hover:text-amber-800'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  // Format chat data from API
  const formatChatData = (chat) => {
    if (!chat) return null;
    
    const lastMessage = chat.messages?.[0];
    let status = 'offline';
    let lastMessageText = 'No messages yet';
    let messagePreview = 'Start a conversation...';
    
    if (lastMessage) {
      const msgTime = new Date(lastMessage.createdAt);
      const now = new Date();
      const diffMs = now - msgTime;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      // Extract message preview
      messagePreview = lastMessage.text?.substring(0, 45) || 'Message';
      if (lastMessage.text?.length > 45) messagePreview += '...';
      
      if (diffHours >= 24) {
        lastMessageText = `${Math.floor(diffHours / 24)}d ago`;
        status = 'offline';
      } else if (diffHours > 0) {
        lastMessageText = `${diffHours}h ago`;
        if (diffHours >= 4) {
          status = 'due';
        } else {
          status = 'away';
        }
      } else if (diffMinutes > 0) {
        lastMessageText = `${diffMinutes}m ago`;
        status = 'online';
      } else {
        lastMessageText = 'Just now';
        status = 'online';
      }
    }
    
    return {
      id: chat.id,
      title: chat.title || 'Untitled Chat',
      lastMessage: lastMessageText,
      messagePreview,
      status: status,
      chat: chat
    };
  };

  const displayChats = chats.length > 0 
    ? chats.map(formatChatData).filter(Boolean)
    : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'due':
        return currentTheme.statusDue;
      case 'online':
        return currentTheme.statusOnline;
      case 'away':
        return currentTheme.statusAway;
      default:
        return currentTheme.statusOffline;
    }
  };

  if (isLoading) {
    return (
      <div className={`${currentTheme.card} rounded-2xl p-6 shadow-lg`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.card} rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`${currentTheme.text} text-xl font-semibold leading-tight`}>Communication Hub</h3>
            <p className={`${currentTheme.textSecondary} text-xs leading-relaxed`}>Recent conversations</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className={`flex items-center gap-1 ${currentTheme.link} text-sm font-medium hover:gap-2 transition-all`}
        >
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Recent Chats */}
      <div className="space-y-3.5">
        {displayChats.length > 0 ? (
          displayChats.map((chatData, index) => (
            <div
              key={chatData.id || index}
              onClick={() => navigate('/chat', { state: { chatId: chatData.chat?.id } })}
              className={`flex items-start gap-4 p-4 rounded-xl border ${currentTheme.border} ${currentTheme.hover} cursor-pointer transition-all hover:shadow-md group`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {chatData.title.charAt(0).toUpperCase()}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${getStatusColor(chatData.status)} rounded-full border-2 border-white shadow-sm flex items-center justify-center`}>
                  <Circle className="w-2 h-2 fill-current" />
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-0.5 space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <div className={`${currentTheme.text} font-semibold text-base truncate pr-2`}>
                    {chatData.title}
                  </div>
                  <div className={`${currentTheme.textMuted} text-xs flex-shrink-0 opacity-60`}>
                    {chatData.lastMessage}
                  </div>
                </div>
                <div className={`${currentTheme.textSecondary} text-sm truncate opacity-80 leading-relaxed`}>
                  {chatData.messagePreview}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`${currentTheme.textMuted} text-sm text-center py-12 opacity-60`}>
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No recent chats</p>
            <p className="text-xs mt-1">Start a conversation to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
