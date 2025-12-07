// src/pages/Profile/ProfileStats.jsx
import React from "react";
import { MessageSquare, Mail, Calendar, Flame, Loader2 } from "lucide-react";

const ProfileStats = ({ stats, daysActive, currentStreak, isLoading, currentTheme }) => {
   const cards = [
  {
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    value: stats.totalChats,
    label: "Active Chats",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Mail className="w-8 h-8 text-white" />,
    value: stats.totalMessages,
    label: "Messages Sent",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <Calendar className="w-8 h-8 text-white" />,
    value: daysActive,
    label: "Days Active",
    gradient: "from-emerald-500 to-teal-500",
  },
];


  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mt-[30px]">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`${currentTheme.cardBg} backdrop-blur-xl p-6 rounded-2xl text-center shadow-xl border ${currentTheme.border} hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden`}
        >
          {/* Gradient background effect */}
          {card.isStreak && currentStreak >= 7 && (
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-yellow-500/10 animate-pulse" />
          )}

          <div className="relative z-10">
            <div
              className={`bg-linear-to-br ${card.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
            >
              {card.icon}
            </div>

            <p className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-2`}>
              {isLoading ? (
                <Loader2 className="animate-spin w-10 h-10 mx-auto" />
              ) : (
                <>
                  {card.value}
                  {card.isStreak && currentStreak >= 3 && (
                    <span className="ml-2 text-2xl">🔥</span>
                  )}
                </>
              )}
            </p>

            <p className={`${currentTheme.textSecondary} text-xs uppercase tracking-wide font-semibold`}>
              {card.label}
            </p>

            {/* Streak milestone badge */}
            {card.isStreak && currentStreak >= 7 && (
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-linear-to-r from-orange-500 to-yellow-500 text-white text-xs font-bold">
                <Flame className="w-3 h-3" />
                On Fire!
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProfileStats;