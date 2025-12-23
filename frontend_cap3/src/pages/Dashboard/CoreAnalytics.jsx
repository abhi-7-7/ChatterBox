// src/pages/Dashboard/CoreAnalytics.jsx

import React from "react";
import { X } from "lucide-react";
import StatsGrid from "./StatsGrid";

export default function CoreAnalytics({ stats, isLoading, currentTheme, onClose }) {
  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-6 shadow-sm`}>
      {/* Header with Close */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-700 ${currentTheme.text}`}>Core Analytics</h3>
        <button
          onClick={onClose}
          className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors`}
        >
          <X className={`w-5 h-5 ${currentTheme.textSecondary}`} />
        </button>
      </div>

      {/* Compact Stats */}
      <StatsGrid stats={stats} isLoading={isLoading} currentTheme={currentTheme} />
    </div>
  );
}
