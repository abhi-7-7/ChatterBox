// src/pages/Dashboard/AIInsightEngine.jsx

import React from "react";
import { UsersRound, Search, MoreVertical } from "lucide-react";

export default function AIInsightEngine({ currentTheme }) {
  const actions = [
    { icon: UsersRound, label: "Create Group" },
    { icon: Search, label: "Manage Contacts" },
  ];

  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} rounded-2xl p-6 shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-700 ${currentTheme.text}`}>AI Insight Engine</h3>
        <button className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded`}>
          <MoreVertical className={`w-5 h-5 ${currentTheme.textSecondary}`} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-500 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
