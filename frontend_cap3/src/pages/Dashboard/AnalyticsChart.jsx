// src/pages/Dashboard/AnalyticsChart.jsx

import React, { useState } from "react";
import { TrendingUp, Users } from "lucide-react";

export default function AnalyticsChart({ data, currentTheme }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const days = data?.days?.length ? data.days : ["M", "T", "W", "T", "F", "S", "S"];
  const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const fallbackMessages = [250, 320, 280, 450, 380, 420, 520];
  const fallbackUsers = [180, 240, 220, 380, 320, 350, 420];
  const fallbackBars = [320, 280, 500, 380, 420, 340, 280];

  const normalize = (arr, fallback) => {
    if (Array.isArray(arr) && arr.length) return arr;
    return fallback.slice(0, days.length);
  };

  const percentChange = (arr) => {
    if (!arr?.length) return 0;
    const first = arr[0] || 1;
    const last = arr[arr.length - 1] ?? first;
    if (first === 0) return last ? 100 : 0;
    return ((last - first) / first) * 100;
  };

  const messageData = normalize(data?.messages, fallbackMessages);
  const userData = normalize(data?.users, fallbackUsers);
  const barData = normalize(data?.bars, fallbackBars);

  const messageChange = percentChange(messageData);
  const userChange = percentChange(userData);

  const maxMessage = Math.max(...messageData, 0);
  const maxUser = Math.max(...userData, 0);
  const maxBar = Math.max(...barData, 0);
  const maxValue = Math.max(maxMessage, maxUser, maxBar, 1);
  
  const scale = (value) => (value / maxValue) * 100;
  
  return (
    <div className={`${currentTheme.cardBg} border ${currentTheme.border} p-8 rounded-2xl shadow-sm`}>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className={`text-xs uppercase tracking-[0.2em] font-600 ${currentTheme.textSecondary}`}>Weekly Activity</p>
            <h2 className={`text-xl font-700 ${currentTheme.text}`}>Analytics</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-lg transition-colors" title="Previous week">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="p-2 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-lg transition-colors" title="Next week">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
            <div className="w-9 h-9 rounded-lg bg-blue-200 dark:bg-blue-700 text-blue-600 dark:text-blue-200 flex items-center justify-center shrink-0"><TrendingUp className="w-5 h-5" /></div>
            <div>
              <p className={`text-xs font-500 ${currentTheme.textSecondary}`}>Messages</p>
              <p className={`text-sm font-700 ${messageChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{messageChange >= 0 ? "+" : ""}{messageChange.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/50">
            <div className="w-9 h-9 rounded-lg bg-teal-200 dark:bg-teal-700 text-teal-600 dark:text-teal-200 flex items-center justify-center shrink-0"><Users className="w-5 h-5" /></div>
            <div>
              <p className={`text-xs font-500 ${currentTheme.textSecondary}`}>Active Users</p>
              <p className={`text-sm font-700 ${userChange >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{userChange >= 0 ? "+" : ""}{userChange.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs flex-wrap ml-auto">
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span className={currentTheme.textSecondary}>Messages</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-teal-500 rounded-full"></div><span className={currentTheme.textSecondary}>Active Users</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-200 dark:bg-slate-600 rounded-sm border border-slate-300/80 dark:border-slate-700"></div><span className={currentTheme.textSecondary}>Activity</span></div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className={`mb-6 p-4 rounded-lg ${currentTheme.glassBg} border ${currentTheme.border} border-l-4 border-l-blue-500 bg-blue-50/40 dark:bg-blue-950/30`}>
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">📊</span>
            <div className="flex-1">
              <p className={`text-sm font-700 ${currentTheme.text} mb-2`}>Weekly Insight</p>
              <ul className={`text-sm ${currentTheme.textSecondary} space-y-1 list-none`}>
                <li>• Activity peaks mid-week</li>
                <li>• Messages increased {messageChange > 0 ? "📈" : "📉"}</li>
                <li>• User engagement {userChange > 0 ? "trending up" : "stable"}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative h-72">
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 pr-4">
            <span>800</span><span>600</span><span>400</span><span>200</span><span>0</span>
          </div>
          
          <div className="ml-12 h-full relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (<div key={i} className="border-t border-gray-200/25 dark:border-gray-700/25"></div>))}
            </div>
            
            <div className="absolute inset-0 flex items-end justify-around gap-1">
              {days.map((day, index) => {
                const messageHeight = scale(messageData[index]);
                const userHeight = scale(userData[index]);
                const barHeight = scale(barData[index]);
                const isHovered = hoveredDay === index;
                
                return (
                  <div key={index} className="flex-1 relative h-full flex flex-col justify-end items-center group" onMouseEnter={() => setHoveredDay(index)} onMouseLeave={() => setHoveredDay(null)}>
                    {isHovered && (
                      <div className={`absolute -top-24 left-1/2 transform -translate-x-1/2 ${currentTheme.cardBg} border ${currentTheme.border} px-4 py-3 rounded-lg shadow-xl z-10 w-32`}>
                        <p className={`text-sm font-semibold ${currentTheme.text}`}>{fullDays[index]}</p>
                        <p className="text-xs text-blue-500 mt-1">Messages: {messageData[index]}</p>
                        <p className="text-xs text-teal-500">Active Users: {userData[index]}</p>
                        <p className="text-xs text-slate-500">Activity: {barData[index]}</p>
                      </div>
                    )}
                    {isHovered && (<div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-px bg-blue-400/40"></div>)}
                    <div className={`w-full rounded-t-md transition-all shadow-sm ${isHovered ? "bg-linear-to-t from-slate-300 to-blue-200 opacity-100 ring-2 ring-blue-300" : hoveredDay !== null ? "bg-linear-to-t from-slate-300 to-blue-200 opacity-25" : "bg-linear-to-t from-slate-300 to-blue-200 opacity-50 hover:opacity-70"}`} style={{ height: `${barHeight}%` }}></div>
                    <div className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-all ${isHovered ? "bg-blue-600 scale-110" : "bg-blue-500"}`} style={{ bottom: `${messageHeight}%` }}></div>
                    <div className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-all ${isHovered ? "bg-teal-600 scale-110" : "bg-teal-500"}`} style={{ bottom: `${userHeight}%` }}></div>
                    <span className={`text-xs ${currentTheme.textSecondary} mt-2`}>{day}</span>
                  </div>
                );
              })}
            </div>
            
            <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
              <polyline points={messageData.map((val, i) => {const x = (i / (days.length - 1)) * 100; const y = 100 - scale(val); return `${x}%,${y}%`;}).join(' ')} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }} />
              <polyline points={userData.map((val, i) => {const x = (i / (days.length - 1)) * 100; const y = 100 - scale(val); return `${x}%,${y}%`;}).join(' ')} fill="none" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(20, 184, 166, 0.3))' }} />
            </svg>
          </div>
        </div>

        <div className={`mt-6 flex flex-wrap gap-6 pt-4 border-t ${currentTheme.border}`}>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div><span className={`text-xs font-500 ${currentTheme.textSecondary}`}>Messages</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500 shadow-sm"></div><span className={`text-xs font-500 ${currentTheme.textSecondary}`}>Users</span></div>
          <div className={`ml-auto text-xs ${currentTheme.textMuted}`}>Last 7 days</div>
        </div>
      </div>
    </div>
  );
}
