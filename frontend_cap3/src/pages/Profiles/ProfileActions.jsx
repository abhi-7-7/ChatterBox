import React from "react";
import { MessageSquare, LayoutDashboard } from "lucide-react";

const ProfileActions = ({ currentTheme, onGoDashboard }) => {
  return (
    <section className="grid md:grid-cols-1 gap-10 mb-20 px-4">

      {/* DASHBOARD BUTTON */}
      <button
        onClick={onGoDashboard}
        className={`group relative flex items-center justify-center gap-3 bg-linear-to-br ${currentTheme.gradient} text-white px-10 py-5 rounded-2xl font-bold shadow-2xl hover:scale-105 transition`}
      >
        <LayoutDashboard className="w-7 h-7" />
        <span>Back to Dashboard</span>
      </button>

    </section>
  );
};

export default ProfileActions;
