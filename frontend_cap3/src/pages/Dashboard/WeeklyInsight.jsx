import React, { useMemo } from 'react';
import { X, Check, TrendingUp } from 'lucide-react';

export default function WeeklyInsight({ theme, onClose, insights = [], stats = {} }) {
  const themeStyles = {
    light: {
      card: 'bg-white/70 backdrop-blur-md border border-white/20',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      insightBg: 'bg-gray-50/50 border-gray-200/50'
    },
    dark: {
      card: 'bg-slate-800/70 backdrop-blur-md border border-white/10',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      insightBg: 'bg-slate-700/30 border-slate-600/30'
    },
    vintage: {
      card: 'bg-amber-50/70 backdrop-blur-md border border-amber-200/50',
      text: 'text-amber-900',
      textSecondary: 'text-amber-800',
      textMuted: 'text-amber-700',
      insightBg: 'bg-amber-100/30 border-amber-200/30'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  // Use provided insights or generate default ones
  const displayInsights = useMemo(() => {
    if (insights && insights.length > 0) {
      return insights.slice(0, 2);
    }
    return ['Messages increased', 'Engagement trending up'];
  }, [insights]);

  // Calculate spike percentage based on stats
  const spikePercentage = useMemo(() => {
    if (stats.messageGrowth) {
      return Math.round(stats.messageGrowth * 1.3);
    }
    return 5;
  }, [stats]);

  return (
    <div className={`${currentTheme.card} rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] relative w-full h-full flex flex-col gap-3`}>
      {onClose && (
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${currentTheme.textMuted} hover:${currentTheme.text} transition-colors`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <h3 className={`${currentTheme.text} text-lg font-semibold leading-tight`}>Weekly Insight</h3>
      </div>
      
      {/* Compact Insights List - Decision-oriented copy */}
      <div className="space-y-3 mb-2 flex-grow leading-relaxed">
        {displayInsights.map((insight, index) => {
          // Convert to short format
          const shortInsight = insight
            .replace('Messages increased', 'Messages up')
            .replace('Engagement trending up', 'Engagement rising')
            .replace('Activity peaks mid-week', 'Mid-week peak');
          return (
            <div key={index} className={`flex items-center gap-2 ${currentTheme.text} text-sm`}>
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="leading-relaxed">{shortInsight}</span>
            </div>
          );
        })}
      </div>

      {/* AI Prediction - Compact, matches chart purple */}
      <div className={`${currentTheme.textSecondary} text-sm pt-4 mt-1 border-t ${currentTheme.insightBg} leading-relaxed`}>
        <span>AI predicts </span>
        <span className={`font-medium text-purple-600 ${currentTheme.text}`}>+{spikePercentage}%</span>
        <span> activity next week</span>
      </div>
    </div>
  );
}
