// PREMIUM ANIMATED DIAMOND PRISM CHAT LOGO

export default function ChatDiamondLogo({ size = 40 }) {
  return (
    <div
      className="
        transition-all duration-300 
        hover:scale-[1.08] active:scale-[0.95]
        relative
      "
      style={{ width: size, height: size }}
    >
      {/* Glow effect */}
      <div
        className="
          absolute inset-0 rounded-xl blur-xl opacity-0 
          group-hover:opacity-60 transition-all duration-500
          bg-linear-to-br from-cyan-400 via-blue-500 to-indigo-500
        "
      />

      {/* SVG Prism */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="
          drop-shadow-lg relative z-2 
          transition-all duration-500
          group-hover:rotate-3
        "
      >
        {/* Diamond Prism */}
        <path
          d="M24 3L42 16L24 45L6 16L24 3Z"
          fill="url(#logo-gradient)"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2"
        />

        {/* Chat bubble */}
        <path
          d="
            M16 20
            C16 16.7 18.7 14 22 14
            H27
            C30.3 14 33 16.7 33 20
            V23
            C33 26.3 30.3 29 27 29
            H23
            L19 33
            V29
            H18
            C17 29 16 28 16 27
            V20Z
          "
          fill="white"
          opacity="0.92"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="logo-gradient" x1="6" y1="3" x2="42" y2="45">
            <stop offset="0%" stopColor="#4FD1C5" />
            <stop offset="40%" stopColor="#4299E1" />
            <stop offset="100%" stopColor="#3182CE" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
