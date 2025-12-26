import React from 'react';
import { MessageSquare, Users, UsersRound, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ 
  theme, 
  onNewChat, 
  onCreateGroup, 
  onCommunity, 
  onContacts 
}) {
  const navigate = useNavigate();

  const themeStyles = {
    light: {
      card: 'bg-white/70 backdrop-blur-md border border-white/20',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonSecondary: 'bg-white/60 hover:bg-white/80 border border-gray-200 text-gray-700'
    },
    dark: {
      card: 'bg-slate-800/70 backdrop-blur-md border border-white/10',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonSecondary: 'bg-slate-700/60 hover:bg-slate-700/80 border border-slate-600 text-gray-200'
    },
    vintage: {
      card: 'bg-amber-50/70 backdrop-blur-md border border-amber-200/50',
      text: 'text-amber-900',
      textSecondary: 'text-amber-800',
      buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonSecondary: 'bg-white/60 hover:bg-white/80 border border-amber-300 text-amber-900'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  const handleNewChat = () => {
    if (onNewChat) onNewChat();
    else navigate('/chat');
  };

  const handleCreateGroup = () => {
    if (onCreateGroup) onCreateGroup();
    else navigate('/chat');
  };

  const handleCommunity = () => {
    if (onCommunity) onCommunity();
    else navigate('/chat');
  };

  const handleContacts = () => {
    if (onContacts) onContacts();
    else navigate('/chat');
  };

  return (
    <div className={`${currentTheme.card} rounded-xl p-4 shadow-sm`}>
      <h3 className={`${currentTheme.text} text-base font-medium mb-3`}>Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Primary: New Chat */}
        <button
          onClick={handleNewChat}
          className={`${currentTheme.buttonPrimary} p-2.5 rounded-lg transition-all font-medium text-sm flex flex-col items-center gap-1.5`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        {/* Secondary Actions */}
        <button
          onClick={handleCreateGroup}
          className={`${currentTheme.buttonSecondary} p-2.5 rounded-lg transition-all font-medium text-sm flex flex-col items-center gap-1.5`}
        >
          <Users className="w-4 h-4" />
          <span>Group</span>
        </button>

        <button
          onClick={handleCommunity}
          className={`${currentTheme.buttonSecondary} p-2.5 rounded-lg transition-all font-medium text-sm flex flex-col items-center gap-1.5`}
        >
          <UsersRound className="w-4 h-4" />
          <span>Community</span>
        </button>

        <button
          onClick={handleContacts}
          className={`${currentTheme.buttonSecondary} p-2.5 rounded-lg transition-all font-medium text-sm flex flex-col items-center gap-1.5`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Contacts</span>
        </button>
      </div>
    </div>
  );
}
