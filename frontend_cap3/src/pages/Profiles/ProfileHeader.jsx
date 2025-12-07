// src/pages/Profile/ProfileHeader.jsx
import React from "react";
import { User, Check } from "lucide-react";

const ProfileHeader = ({ currentTheme, avatarColor, user }) => {
  return (
    <div className="relative">
      <div
        className={`bg-linear-to-br ${currentTheme.gradient} h-32 md:h-40 flex items-center justify-center`}
      />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-20 md:-bottom-16 z-10">
        <div className="relative">
          <div
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-linear-to-br ${avatarColor} flex items-center justify-center border-4 border-white shadow-2xl`}
          >
            <User className="text-white w-16 h-16 md:w-20 md:h-20" />
          </div>

          <div className="absolute bottom-0 right-0 bg-emerald-500 p-2 md:p-2.5 rounded-full border-4  border-green-500 shadow-lg">
            <Check className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-white font-bold text-lg">{user?.username || user?.email || 'Profile'}</p>
          {user?.email && <p className="text-white/80 text-sm mt-1">{user.email}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;