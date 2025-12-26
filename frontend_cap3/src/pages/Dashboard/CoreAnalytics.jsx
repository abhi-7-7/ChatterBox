import React from 'react';
import { TrendingUp, TrendingDown, Users2, MessageCircle, Clock, AtSign, Calendar } from 'lucide-react';

export default function CoreAnalytics({ stats, theme, isLoading }) {
  const themeStyles = {
    light: {
      card: 'bg-white/80 backdrop-blur-md border border-white/20',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      border: 'border-gray-200',
      closeButton: 'text-gray-400 hover:text-gray-600',
      cardBg: 'bg-white/40'
    },
    dark: {
      card: 'bg-slate-700/80 backdrop-blur-md border border-white/10',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      border: 'border-slate-600',
      closeButton: 'text-gray-500 hover:text-gray-300',
      cardBg: 'bg-slate-600/40'
    },
    vintage: {
      card: 'bg-amber-100/80 backdrop-blur-md border border-amber-200/50',
      text: 'text-amber-900',
      textSecondary: 'text-amber-700',
      textMuted: 'text-amber-600',
      border: 'border-amber-300',
      closeButton: 'text-amber-600 hover:text-amber-800',
      cardBg: 'bg-amber-50/40'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  if (isLoading) {
    return (
      <div className={`${currentTheme.card} rounded-2xl p-6 shadow-lg shadow-black/5`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/2 mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const analytics = [
    {
      label: 'Total Messages',
      value: (stats?.totalMessages || 0).toLocaleString(),
      change: `${stats?.messageGrowth >= 0 ? '+' : ''}${stats?.messageGrowth || 0}%`,
      subtitle: 'vs last 7 days',
      trend: stats?.messageGrowth >= 0 ? 'up' : 'down',
      icon: <MessageCircle className="w-5 h-5" />,
      iconBg: 'bg-blue-500',
      gradient: 'from-blue-500/10 to-blue-500/5'
    },
    {
      label: 'Active Users',
      value: (stats?.activeUsers || 0).toLocaleString(),
      change: `${stats?.userGrowth >= 0 ? '+' : ''}${stats?.userGrowth || 0}%`,
      subtitle: 'unique participants',
      trend: stats?.userGrowth >= 0 ? 'up' : 'down',
      icon: <Users2 className="w-5 h-5" />,
      iconBg: 'bg-cyan-500',
      gradient: 'from-cyan-500/10 to-cyan-500/5'
    },
    {
      label: 'Total Chats',
      value: (stats?.totalChats || 0).toLocaleString(),
      change: `${stats?.userGrowth >= 0 ? '+' : ''}${stats?.userGrowth || 0}%`,
      subtitle: 'open conversations',
      trend: stats?.userGrowth >= 0 ? 'up' : 'down',
      icon: <AtSign className="w-5 h-5" />,
      iconBg: 'bg-purple-500',
      gradient: 'from-purple-500/10 to-purple-500/5'
    },
    {
      label: 'Groups',
      value: (stats?.groups || 0).toLocaleString(),
      change: 'Last 7 days',
      subtitle: null,
      trend: 'stable',
      icon: <Calendar className="w-5 h-5" />,
      iconBg: 'bg-emerald-500',
      gradient: 'from-emerald-500/10 to-emerald-500/5'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with subtitle */}
      <div>
        <h2 className={`${currentTheme.text} text-2xl font-bold mb-2 leading-tight`}>Growth Metrics</h2>
        <p className={`${currentTheme.textSecondary} text-sm leading-relaxed`}>
          Real-time analytics and engagement trends
        </p>
      </div>

      {/* Analytics Grid - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analytics.map((item, index) => (
          <div 
            key={index} 
            className={`${currentTheme.card} rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 relative overflow-hidden group min-h-[170px]`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.iconBg} text-white mb-4 shadow-lg`}>
                {item.icon}
              </div>
              
              {/* Label */}
              <div className={`${currentTheme.textMuted} text-sm font-semibold mb-3 uppercase tracking-wide`}>
                {item.label}
              </div>
              
              {/* Value */}
              <div className={`${currentTheme.text} text-4xl font-extrabold mb-4 tracking-tight`}>
                {item.value}
              </div>
              
              {/* Trend */}
              <div className="flex items-center gap-3 text-sm">
                {item.trend === 'up' && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.change}</span>
                  </div>
                )}
                {item.trend === 'down' && (
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-semibold">{item.change}</span>
                  </div>
                )}
                {item.trend === 'stable' && (
                  <span className={`${currentTheme.textMuted} text-sm font-medium`}>{item.change}</span>
                )}
                {item.subtitle && (
                  <span className={`${currentTheme.textMuted} text-xs opacity-70`}>{item.subtitle}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
