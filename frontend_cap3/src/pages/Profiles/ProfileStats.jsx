import React from "react";
import { MessageSquare, Send, Calendar, Flame, ArrowUpRight } from "lucide-react";

const ProfileStats = ({ stats, daysActive, currentStreak, isLoading, currentTheme }) => {
  const statItems = [
    {
      label: "Active Chats",
      value: stats.totalChats,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-50/50",
      trend: "+12%",
    },
    {
      label: "Messages Sent",
      value: stats.totalMessages,
      icon: Send,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50/50",
      trend: "+5.2%",
    },
    {
      label: "Days Active",
      value: daysActive,
      icon: Calendar,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50/50",
      trend: "Level 4",
    },
    {
      label: "Current Streak",
      value: `${currentStreak} Days`,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-50/50",
      trend: "On Fire!",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <div
            key={index}
            className={`
              group relative flex flex-col justify-between h-full
              ${currentTheme.surface} 
              p-7 rounded-[20px] 
              border ${currentTheme.border}
              shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)]
              transition-all duration-300 ease-out hover:-translate-y-1
            `}
          >
            <div className="flex items-start justify-between mb-8">
              {/* Icon with soft background */}
              <div className={`
                p-3.5 rounded-2xl transition-colors 
                ${item.bgColor}
              `}>
                <Icon 
                  className={`w-7 h-7 ${item.color}`} 
                  strokeWidth={2} 
                />
              </div>

              {/* Trend Badge */}
              <div className="
                flex items-center gap-1 px-2.5 py-1 rounded-full border
                bg-slate-50 border-slate-100 text-slate-500
              ">
                {item.trend.includes('+') && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                <span className="text-[11px] font-bold tracking-wide">
                  {item.trend}
                </span>
              </div>
            </div>
            
            <div className="relative">
              {/* Value */}
              <h3 className={`text-[32px] leading-none font-bold tracking-tight ${currentTheme.text} mb-2`}>
                {isLoading ? (
                   <span className="animate-pulse bg-slate-100 text-transparent rounded">...</span>
                ) : (
                   item.value
                )}
              </h3>
              
              {/* Label */}
              <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
                {item.label}
              </p>
            </div>
          </div>
        );
      })} 
    </div>
  );
};

export default ProfileStats;
