import React, { useState } from 'react';
import SearchBar from '../../components/SearchBar';

export default function DashNavbar({ theme }) {
  const [searchQuery, setSearchQuery] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const themeStyles = {
    light: {
      bg: 'bg-white/40 backdrop-blur-sm',
      text: 'text-slate-800',
      textSecondary: 'text-slate-500',
      statusBg: 'bg-emerald-50',
      statusText: 'text-emerald-700',
      statusDot: 'bg-emerald-500',
      divider: 'border-slate-200/60'
    },
    dark: {
      bg: 'bg-slate-800/40 backdrop-blur-sm',
      text: 'text-slate-100',
      textSecondary: 'text-slate-400',
      statusBg: 'bg-emerald-500/10',
      statusText: 'text-emerald-400',
      statusDot: 'bg-emerald-500',
      divider: 'border-slate-700/60'
    },
    vintage: {
      bg: 'bg-amber-50/40 backdrop-blur-sm',
      text: 'text-amber-900',
      textSecondary: 'text-amber-700',
      statusBg: 'bg-emerald-50',
      statusText: 'text-emerald-700',
      statusDot: 'bg-emerald-500',
      divider: 'border-amber-200/60'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className={`${currentTheme.bg} border-b ${currentTheme.divider}`}>
      <div className="px-10 py-8 flex items-center justify-between gap-12">
        {/* Left: Date + Title */}
        <div className="flex flex-col gap-2">
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${currentTheme.textSecondary} leading-relaxed`}>
            {currentDate}
          </p>
          <div className="flex items-baseline gap-2">
            <h1 className={`text-3xl font-bold ${currentTheme.text} leading-tight`}>
            Overview
            </h1>
            <span className={`${currentTheme.textSecondary} text-sm font-medium`}>Growth Metrics</span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 flex justify-center max-w-2xl">
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            theme={theme}
            placeholder="Search chats, users, files..."
          />
        </div>

        {/* Right: Status Chip */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentTheme.statusBg}`}>
          <div className={`w-2 h-2 rounded-full ${currentTheme.statusDot} animate-pulse`}></div>
          <span className={`text-xs font-semibold ${currentTheme.statusText}`}>
            AI Engine Online
          </span>
        </div>
      </div>
    </div>
  );
}

