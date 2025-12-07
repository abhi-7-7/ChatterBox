// src/pages/Profile/ProfileInfoCards.jsx
import React from "react";
import { Mail, Hash, Shield, Calendar, Copy, Check } from "lucide-react";

const ProfileInfoCards = ({
  user,
  copiedField,
  copyToClipboard,
  currentTheme,
  formatDate,
}) => {
  const cards = [
    {
      label: "Email Address",
      value: user?.email || "Not available",
      icon: <Mail className="w-6 h-6 text-white" />,
      field: "email",
      gradient: "from-violet-500 to-sky-400",
      canCopy: true,
    },
    {
      label: "User ID",
      value: user?.id ? `#${user.id}` : "#N/A",
      icon: <Hash className="w-6 h-6 text-white" />,
      field: "id",
      gradient: "from-fuchsia-500 to-purple-500",
      canCopy: true,
    },
    {
      label: "Account Role",
      value: "Premium User",
      icon: <Shield className="w-6 h-6 text-white" />,
      field: "role",
      gradient: "from-emerald-500 to-teal-400",
      canCopy: false,
    },
    {
      label: "Member Since",
      value: formatDate(user?.createdAt),
      icon: <Calendar className="w-6 h-6 text-white" />,
      field: "joined",
      gradient: "from-sky-500 to-cyan-400",
      canCopy: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`bg-linear-to-br ${currentTheme.gradient} p-3 rounded-xl shadow-lg`}>
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`text-xl font-bold ${currentTheme.text}`}>Account Information</h3>
          <p className={`text-sm ${currentTheme.textSecondary}`}>Your profile details</p>
        </div>
      </div>

      <div className="space-y-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`${currentTheme.glassBg} p-4 rounded-xl border ${currentTheme.border} hover:shadow-lg transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className={`p-2.5 rounded-lg shadow-md bg-linear-to-br ${card.gradient} shrink-0`}
              >
                {card.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`${currentTheme.textSecondary} text-xs uppercase tracking-wide mb-0.5`}>
                  {card.label}
                </p>
                <p className={`${currentTheme.text} text-sm font-bold truncate`}>
                  {card.value}
                </p>
              </div>

              {/* Copy Button */}
              {card.canCopy && (
                <button
                  className="p-2 hover:bg-white/20 rounded-lg transition-all shrink-0"
                  onClick={() => copyToClipboard(card.value, card.field)}
                  title="Copy to clipboard"
                >
                  {copiedField === card.field ? (
                    <Check className="text-emerald-500 w-5 h-5" />
                  ) : (
                    <Copy className={`${currentTheme.textSecondary} w-5 h-5 hover:text-current`} />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfoCards;