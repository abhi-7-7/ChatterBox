import React from 'react';
import { MessageSquare, Sparkles, Clock, CheckCircle2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIInsightScheduling({ theme, aiReminder }) {
  const navigate = useNavigate();
  const themeStyles = {
    light: {
      card: 'bg-white/70 backdrop-blur-md border border-white/20',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      reminderBg: 'bg-yellow-50/80 border-yellow-200',
      buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonText: 'text-gray-600 hover:text-gray-800',
      summaryBg: 'bg-green-50/50 border-green-200/50'
    },
    dark: {
      card: 'bg-slate-800/70 backdrop-blur-md border border-white/10',
      text: 'text-gray-100',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      reminderBg: 'bg-yellow-900/20 border-yellow-500/30',
      buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonText: 'text-gray-400 hover:text-gray-200',
      summaryBg: 'bg-green-900/20 border-green-500/30'
    },
    vintage: {
      card: 'bg-amber-50/70 backdrop-blur-md border border-amber-200/50',
      text: 'text-amber-900',
      textSecondary: 'text-amber-800',
      textMuted: 'text-amber-700',
      reminderBg: 'bg-yellow-50 border-yellow-200',
      buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonText: 'text-amber-700 hover:text-amber-900',
      summaryBg: 'bg-green-50/50 border-green-200/50'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className={`${currentTheme.card} rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] relative`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className={`${currentTheme.text} text-xl font-bold`}>AI Insight Scheduling</h3>
          <p className={`${currentTheme.textSecondary} text-xs leading-relaxed`}>Smart recommendations</p>
        </div>
      </div>

      {/* AI Reminder - if exists */}
      {aiReminder && (
        <div className={`${currentTheme.reminderBg} border rounded-xl p-4 mb-5`}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className={`${currentTheme.text} font-semibold text-sm mb-1`}>AI Reminder</div>
              <div className={`${currentTheme.textSecondary} text-sm mb-3`}>
                You haven't replied to <span className="font-medium">{aiReminder.chatTitle}</span> in <span className="font-semibold">{aiReminder.hoursAgo}h</span>
              </div>
              <button 
                onClick={() => navigate('/chat')}
                className={`w-full px-4 py-2.5 rounded-lg ${currentTheme.buttonPrimary} transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
              >
                <Send className="w-4 h-4" />
                Quick Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Action Plan */}
      <div className="space-y-4">
        <div className={`${currentTheme.textSecondary} text-xs font-semibold uppercase tracking-wider mb-3`}>
          Suggested Action Plan
        </div>
        
        <div className="space-y-3">
          <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${currentTheme.border} ${currentTheme.hover} transition-all`}>
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-xs">1</span>
            </div>
            <div className="flex-1">
              <div className={`${currentTheme.text} text-sm font-medium mb-0.5`}>Draft FAQ for billing issues</div>
              <div className={`${currentTheme.textMuted} text-xs opacity-75 leading-relaxed`}>Help customers find answers faster</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>

          <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${currentTheme.border} ${currentTheme.hover} transition-all`}>
            <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-bold text-xs">2</span>
            </div>
            <div className="flex-1">
              <div className={`${currentTheme.text} text-sm font-medium mb-0.5`}>Schedule support team sync</div>
              <div className={`${currentTheme.textMuted} text-xs opacity-75 leading-relaxed`}>Align on new feature rollout</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>

          <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${currentTheme.border} ${currentTheme.hover} transition-all`}>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 font-bold text-xs">3</span>
            </div>
            <div className="flex-1">
              <div className={`${currentTheme.text} text-sm font-medium mb-0.5`}>Announce support line availability</div>
              <div className={`${currentTheme.textMuted} text-xs opacity-75 leading-relaxed`}>Update team on extended hours</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-5">
        <button className={`flex-1 px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.buttonText} text-sm font-medium hover:bg-gray-50/50 transition-all`}>
          Create Report
        </button>
        <button className={`flex-1 px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.buttonText} text-sm font-medium hover:bg-gray-50/50 transition-all`}>
          Summarize
        </button>
      </div>
    </div>
  );
}
