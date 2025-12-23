// src/pages/Dashboard/WeeklyEngagement.jsx

import React, { useState } from "react";
import { X } from "lucide-react";

export default function WeeklyEngagement({ currentTheme, onClose }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const values = [15, 20, 18, 28, 25, 32, 35];
  const maxValue = Math.max(...values);

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-700 ${currentTheme.text}`}>Weekly Engagement</h3>
        <button
          onClick={onClose}
          className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors`}
        >
          <X className={`w-5 h-5 ${currentTheme.textSecondary}`} />
        </button>
      </div>

      {/* Chart Container */}
      <div className="h-64 flex items-end justify-around gap-2">
        {values.map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            {/* Bar */}
            <div className="w-full h-full flex items-end justify-center">
              <div
                className="w-6 bg-linear-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-cyan-500 cursor-pointer"
                style={{ height: `${(val / maxValue) * 100}%` }}
              ></div>
            </div>
            {/* Day label */}
            <span className={`text-xs font-500 ${currentTheme.textSecondary}`}>{days[i]}</span>
          </div>
        ))}
      </div>

      {/* Trend line placeholder */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <span className={`text-sm ${currentTheme.textSecondary}`}>Predicted Trend</span>
        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
        </svg>
      </div>

      {/* Insight text */}
      <div className={`mt-4 text-xs ${currentTheme.textSecondary}`}>
        AI Layer Predicted Trend suggests a 13% spike next week.
        <button className={`ml-2 font-600 text-blue-600 dark:text-blue-400`}>
          Full report ↗
        </button>
      </div>
    </div>
  );
}
