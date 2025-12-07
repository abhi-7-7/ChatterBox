import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`
        hidden md:flex items-center
        h-10 px-4 rounded-xl
        border backdrop-blur-xl
        transition-all duration-300 ease-out

        ${focused
          ? "w-80 bg-white/25 border-white/60 shadow-[0_0_16px_rgba(255,255,255,0.4)]"
          : "w-48 bg-white/15 border-white/20 hover:bg-white/20"
        }
      `}
      style={{ minWidth: "190px" }} // prevents collapsing in navbar
    >
      <Search
        className={`w-5 h-5 transition-all duration-300 ${
          focused ? "text-white" : "text-white/70"
        }`}
      />

      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        type="text"
        placeholder="Search… (⌘K)"
        className={`
          ml-2 w-full bg-transparent outline-none text-sm
          transition-all duration-300

          ${focused 
            ? "text-white placeholder-white/80" 
            : "text-white/70 placeholder-white/40"
          }
        `}
      />
    </div>
  );
}
