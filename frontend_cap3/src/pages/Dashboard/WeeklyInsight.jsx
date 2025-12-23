// src/pages/Dashboard/WeeklyInsight.jsx

import React from "react";
import { X } from "lucide-react";

export default function WeeklyInsight({ currentTheme, onClose }) {
  const insights = [
    "Activity peaks mid-week",
    "Messages increased",
    "Engagement trending up",
  ];

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">💡</div>
          <h3 className={`text-lg font-700 ${currentTheme.text}`}>Weekly Insight</h3>
        </div>
        <button
          onClick={onClose}
          className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors`}
        >
          <X className={`w-5 h-5 ${currentTheme.textSecondary}`} />
        </button>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="text-emerald-600 dark:text-emerald-400 mt-1">✓</div>
            <span className={`text-sm ${currentTheme.text}`}>{insight}</span>
          </div>
        ))}
      </div>

      {/* Footer text */}
      <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs ${currentTheme.textSecondary}`}>
        AI Layer Predicted Trend suggests a 10% spike next week.
      </div>
    </div>
  );
}
