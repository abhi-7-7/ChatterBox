// // src/pages/Profiles/ActivityCalendar.jsx
// import React, { useMemo } from 'react';
// src/pages/Profile/ActivityCalendar.jsx
import React, { useState, useMemo } from "react";
import { Calendar, Flame, Award } from "lucide-react";

const ActivityCalendar = ({ loginDays = [], currentStreak = 0, currentTheme = {} }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Get calendar data for selected month
  const calendarData = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weeks = [];
    let currentWeek = new Array(7).fill(null);

    // Fill in the days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (startingDayOfWeek + day - 1) % 7;

      if (dayOfWeek === 0 && day !== 1) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }

      currentWeek[dayOfWeek] = day;
    }

    weeks.push(currentWeek);
    return weeks;
  }, [selectedMonth]);

  // Normalize loginDays to date strings for quick lookup
  const loggedSet = useMemo(() => {
    const s = new Set();
    (loginDays || []).forEach((d) => {
      try {
        s.add(new Date(d).toDateString());
      } catch (e) {
        console.error(e);
      }
    });
    return s;
  }, [loginDays]);

  // Check if a day is logged in within selectedMonth
  const isLoggedIn = (day) => {
    if (!day) return false;
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const dateStr = new Date(year, month, day).toDateString();
    return loggedSet.has(dateStr);
  };

  // Check if day is today
  const isToday = (day) => {
    if (!day) return false;
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Navigate months
  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`${currentTheme.cardBg || 'bg-white'} backdrop-blur-xl p-4 md:p-6 rounded-2xl border ${currentTheme.border || 'border-gray-200'} shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`bg-linear-to-br ${currentTheme.gradient || 'from-sky-400 to-cyan-400'} p-2 rounded-lg shadow`}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${currentTheme.text || ''}`}>Activity Calendar</h3>
            <p className={`text-sm ${currentTheme.textSecondary || 'text-gray-500'}`}>Track your login days</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={previousMonth} className={`px-2 py-1 rounded-md ${currentTheme.glassBg || 'bg-gray-50'} border ${currentTheme.border || 'border-gray-200'}`} aria-label="Previous month">‹</button>
          <div className={`text-sm font-semibold ${currentTheme.text || ''}`}>{monthName}</div>
          <button onClick={nextMonth} className={`px-2 py-1 rounded-md ${currentTheme.glassBg || 'bg-gray-50'} border ${currentTheme.border || 'border-gray-200'}`} aria-label="Next month">›</button>
        </div>
      </div>

      {/* Streak / totals */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`${currentTheme.glassBg || 'bg-gray-50'} p-3 rounded-lg border ${currentTheme.border || 'border-gray-200'}`}>
          <div className="text-xs text-muted flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Current Streak</div>
          <div className={`text-2xl font-bold ${currentTheme.text || ''}`}>{currentStreak} <span className="text-sm">days</span></div>
        </div>
        <div className={`${currentTheme.glassBg || 'bg-gray-50'} p-3 rounded-lg border ${currentTheme.border || 'border-gray-200'}`}>
          <div className="text-xs text-muted flex items-center gap-2"><Award className="w-4 h-4 text-purple-500" /> Total Days</div>
          <div className={`text-2xl font-bold ${currentTheme.text || ''}`}>{(loginDays || []).length} <span className="text-sm">days</span></div>
        </div>
      </div>

      {/* Calendar grid */}
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((d) => (
            <div key={d} className={`text-center text-xs font-semibold ${currentTheme.textSecondary || 'text-gray-500'} py-1`}>{d}</div>
          ))}
        </div>

        <div className="space-y-2">
          {calendarData.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-2">
              {week.map((day, di) => {
                const logged = isLoggedIn(day);
                const today = isToday(day);
                return (
                  <div key={di} className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium ${day ? '' : 'invisible'}`}>
                    {day ? (
                      <div className={`w-full h-full flex items-center justify-center rounded-md transition ${logged ? `bg-linear-to-br ${currentTheme.gradient || 'from-sky-400 to-cyan-400'} text-white` : today ? `${currentTheme.glassBg || 'bg-white'} ring-2 ring-purple-300` : `${currentTheme.glassBg || 'bg-white'}`}`}>
                        <span>{day}</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color, rgba(0,0,0,0.06))' }}>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${currentTheme.gradient ? '' : 'bg-cyan-400'}`} style={currentTheme.gradient ? {} : {}} />
          <span className={`text-xs ${currentTheme.textSecondary || 'text-gray-500'}`}>Logged In</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${currentTheme.glassBg || 'bg-white'} ring-2 ring-purple-300`} />
          <span className={`text-xs ${currentTheme.textSecondary || 'text-gray-500'}`}>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${currentTheme.glassBg || 'bg-white'}`} />
          <span className={`text-xs ${currentTheme.textSecondary || 'text-gray-500'}`}>Inactive</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;