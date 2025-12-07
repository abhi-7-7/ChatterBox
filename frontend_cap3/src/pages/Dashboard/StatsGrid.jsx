// src/pages/Dashboard/StatsGrid.jsx

import React from "react";
import { MessageSquare, TrendingUp, Clock, Loader2 } from "lucide-react";

export default function StatsGrid({ stats, isLoading, currentTheme, daysActive }) {
  const items = [
    {
      label: "Total Chats",
      value: stats.totalChats,
      icon: MessageSquare,
      growth: stats.growth.chats,
      color: "blue",
    },
    {
      label: "Messages Sent",
      value: stats.totalMessages,
      icon: TrendingUp,
      growth: stats.growth.messages,
      color: "green",
    },
    {
      label: "Days Active",
      value: daysActive,
      icon: Clock,
      growth: stats.growth.days,
      color: "yellow",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className={`${currentTheme.glassBg} border ${currentTheme.border} 
              p-6 rounded-3xl shadow-xl backdrop-blur-xl transition-all duration-300
              hover:-translate-y-1 hover:shadow-2xl`}
          >
            {/* ICON */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center 
              bg-linear-to-br ${currentTheme.gradient} shadow-lg mb-4`}
            >
              <Icon className="text-white" size={28} />
            </div>

            {/* VALUE */}
            <div className={`text-4xl font-bold ${currentTheme.text}`}>
              {isLoading ? <Loader2 className="animate-spin" /> : item.value}
            </div>

            <div className={`${currentTheme.textSecondary} mt-1 text-sm tracking-wide`}>
              {item.label}
            </div>
          </div>
        );
      })}

    </div>
  );
}
