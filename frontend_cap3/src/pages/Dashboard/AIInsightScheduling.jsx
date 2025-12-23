// src/pages/Dashboard/AIInsightScheduling.jsx

import React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function AIInsightScheduling({ currentTheme }) {
  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-6 shadow-sm`}>
      {/* Header */}
      <h3 className={`text-lg font-700 ${currentTheme.text} mb-6`}>AI Insight Scheduling</h3>

      {/* Alert Card */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 mb-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-600 text-amber-950 dark:text-amber-50 mb-1">AI Reminder</h4>
            <p className={`text-sm ${currentTheme.textSecondary} mb-3`}>
              You haven't replied to Abh in 4h
            </p>

            {/* Checklist */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-amber-950 dark:text-amber-50">Messages increased</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-amber-950 dark:text-amber-50">Engagement trending up</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-500 hover:bg-teal-600 transition-colors">
                🔄 Quick Reply
              </button>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                ✕ Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Dismiss
        </button>
        <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          Summarize Thread
        </button>
      </div>
    </div>
  );
}
