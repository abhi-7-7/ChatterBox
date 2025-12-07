// src/pages/Profiles/ProfileFooter.jsx
import React from "react";

const ProfileFooter = ({ currentTheme }) => {
  return (
    <footer
      className={`text-center py-5 text-sm ${currentTheme.textSecondary} border-t ${currentTheme.border}`}
    >
      <p className="font-medium">© 2025 ChatterBox — Built with ❤️ by Aarsh</p>
    </footer>
  );
};

export default ProfileFooter;
