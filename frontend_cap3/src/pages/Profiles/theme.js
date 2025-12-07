// src/pages/Profile/theme.js
export const themeColors = {
  light: {
    // Gradients
    gradient: "from-purple-500 via-sky-400 to-emerald-400",
    
    // Backgrounds
    bg: "bg-[#f6f8fb]",
    surface: "bg-white",
    cardBg: "bg-white/80",
    glassBg: "bg-white/60",
    
    // Text
    text: "text-[#1f2933]",
    textSecondary: "text-[#6b7280]",
    
    // Borders
    border: "border-[#e6e9ef]",
    
    // Accent colors
    primary: "#4a90e2",
    primaryHover: "#3b7fc9",
    secondary: "#7aa2b8",
    
    // Bubble colors (for chat if needed)
    bubbleUser: "#d9e9ff",
    bubbleBot: "#f0f2f5",
  },
  
  dark: {
    // Gradients - darker, more muted tones
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    
    // Backgrounds
    bg: "bg-[#0f1720]",
    surface: "bg-[#0b1220]",
    cardBg: "bg-[#0b1220]/90",
    glassBg: "bg-slate-800/60",
    
    // Text
    text: "text-[#e6eef8]",
    textSecondary: "text-[#9aa4b2]",
    
    // Borders
    border: "border-[#1f2933]",
    
    // Accent colors
    primary: "#60a5fa",
    primaryHover: "#4f8ee6",
    secondary: "#5eead4",
    
    // Bubble colors
    bubbleUser: "#15354a",
    bubbleBot: "#0e1620",
  },
  
  vintage: {
    // Gradients - warm, vintage tones
    gradient: "from-amber-500 via-orange-400 to-yellow-400",
    
    // Backgrounds
    bg: "bg-[#fbf7f2]",
    surface: "bg-[#fffaf6]",
    cardBg: "bg-[#fffaf6]/90",
    glassBg: "bg-amber-50/60",
    
    // Text
    text: "text-[#2b2a28]",
    textSecondary: "text-[#807560]",
    
    // Borders
    border: "border-[#efe7dd]",
    
    // Accent colors
    primary: "#d6a76b",
    primaryHover: "#c59257",
    secondary: "#bfa286",
    
    // Bubble colors
    bubbleUser: "#fff1e6",
    bubbleBot: "#f7f3ef",
  },
};

// Export individual theme getter if needed
export const getTheme = (themeName) => {
  return themeColors[themeName] || themeColors.light;
};