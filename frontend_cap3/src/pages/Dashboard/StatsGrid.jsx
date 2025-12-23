// src/pages/Dashboard/StatsGrid.jsx - Compact inline metrics for Core Analytics header

import React from "react";
import { TrendingUp, Users, UsersRound, Loader2 } from "lucide-react";

export default function StatsGrid({ stats, isLoading, currentTheme, activeUsers = 237 }) {
  const items = [
    {
      label: "Total Messages",
      value: stats.totalMessages || 2431,
      delta: "+15% vs last 7 days",
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Active Users",
      value: activeUsers || 239,
      delta: "+8% vs last 7 days",
      icon: Users,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Groups",
      value: stats.groups || 12,
      delta: "Keep Predicted Trend",
      icon: UsersRound,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-6">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <div key={i} className="flex flex-col gap-2">
              {/* Label */}
              <div className={`text-xs font-500 ${currentTheme.textSecondary}`}>
                {item.label}
              </div>

              {/* Value + Icon */}
              <div className="flex items-baseline gap-2">
                <div className={`text-2xl font-700 ${currentTheme.text}`}>
                  {isLoading ? (
                    <div className="h-7 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  ) : (
                    item.value.toLocaleString()
                  )}
                </div>
                <Icon className={`${item.color} w-5 h-5`} strokeWidth={2.5} />
              </div>

              {/* Delta/Helper text */}
              <div className={`text-xs ${currentTheme.textSecondary} font-400`}>
                {item.delta}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
