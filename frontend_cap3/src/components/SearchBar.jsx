import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search chats, users, files...",
  theme = 'light',
  className = "" 
}) {
  const themeStyles = {
    light: {
      inputBg: 'bg-white',
      border: 'border-slate-200',
      text: 'text-slate-700',
      placeholder: 'placeholder:text-slate-400',
      icon: 'text-slate-400',
      focus: 'focus:ring-blue-500/20 focus:border-blue-500'
    },
    dark: {
      inputBg: 'bg-slate-700/50',
      border: 'border-slate-600/50',
      text: 'text-slate-100',
      placeholder: 'placeholder:text-slate-500',
      icon: 'text-slate-400',
      focus: 'focus:ring-blue-500/20 focus:border-blue-500'
    },
    vintage: {
      inputBg: 'bg-white/90',
      border: 'border-amber-200',
      text: 'text-amber-900',
      placeholder: 'placeholder:text-amber-500',
      icon: 'text-amber-500',
      focus: 'focus:ring-amber-500/20 focus:border-amber-500'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className={`relative w-full max-w-[480px] ${className}`}>
      <Search 
        className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 ${currentTheme.icon}`} 
        size={18} 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full pl-10 pr-4 py-2.5 rounded-xl 
          ${currentTheme.inputBg} ${currentTheme.text} ${currentTheme.placeholder}
          border ${currentTheme.border} ${currentTheme.focus}
          focus:outline-none focus:ring-2 
          transition-all duration-200
          text-sm font-normal
        `}
      />
    </div>
  );
}
