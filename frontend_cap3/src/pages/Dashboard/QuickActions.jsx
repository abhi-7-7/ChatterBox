// src/pages/Dashboard/QuickActions.jsx

import React from "react";
import { MessageSquare, Users, Award, UserPlus, Grid } from "lucide-react";

export default function QuickActions({ currentTheme, onStartChat }) {
  const actions = [
    {
      id: "chat",
      label: "New Chat",
      icon: MessageSquare,
      color: "from-blue-600 to-sky-500",
      isPrimary: true,
      onClick: onStartChat,
    },
    {
      id: "group",
      label: "New Group",
      icon: Users,
      color: "from-teal-500 to-cyan-500",
      isPrimary: false,
      onClick: () => alert("Group creation coming soon!"),
    },
    {
      id: "community",
      label: "Community",
      icon: Award,
      color: "from-emerald-500 to-lime-500",
      isPrimary: false,
      onClick: () => alert("Community features coming soon!"),
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: Grid,
      color: "from-indigo-500 to-purple-500",
      isPrimary: false,
      onClick: () => alert("Contact management coming soon!"),
    },
  ];

  return (
    <div
      className={`${currentTheme.cardBg} border ${currentTheme.border} 
        p-5 rounded-xl shadow-sm h-fit`}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className={`text-xs uppercase tracking-[0.15em] font-600 ${currentTheme.textSecondary} opacity-60`}>Quick Actions</p>
          <h2 className={`text-base font-600 ${currentTheme.text}`}>Jump back in</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`group relative px-3 py-2.5 rounded-lg 
                transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 overflow-hidden 
                flex flex-col items-center justify-center gap-1.5 font-500 text-xs
                ${
                  action.isPrimary
                    ? `bg-linear-to-r ${action.color} text-white shadow-md hover:shadow-lg hover:opacity-95`
                    : `border-2 ${currentTheme.text} bg-transparent hover:bg-linear-to-r hover:${action.color} 
                       hover:text-white hover:border-transparent shadow-sm hover:shadow-md`
                }`}
            >
              <div className={`absolute inset-0 ${action.isPrimary ? "bg-white/5" : "bg-white/0"} 
                opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className={`relative z-10 w-6 h-6 rounded-lg 
                ${action.isPrimary ? "bg-white/20" : "bg-transparent"} flex items-center justify-center shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${action.isPrimary ? "text-white" : ""}`} strokeWidth={2.5} />
              </div>
              <span className="relative z-10 truncate text-center leading-tight">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
