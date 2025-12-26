import React from "react";
import { Mail, Hash, Calendar, Copy, Check } from "lucide-react";

const ProfileInfoCards = ({
  user,
  copiedField,
  copyToClipboard,
  currentTheme,
  formatDate,
}) => {
  const infoItems = [
    {
      label: "Email Address",
      value: user?.email || "Not available",
      icon: Mail,
      field: "email",
      canCopy: true,
    },
    {
      label: "User ID",
      value: user?.id ? `USR-${user.id}` : "N/A",
      icon: Hash,
      field: "id",
      canCopy: true,
    },
    {
      label: "Member Since",
      value: formatDate(user?.createdAt),
      icon: Calendar,
      field: "joined",
    },
  ];

  return (
    <div className={`${currentTheme.surface} rounded-[20px] border ${currentTheme.border} shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] h-full flex flex-col p-8`}>
      {/* Header */}
      <div className="mb-8">
         <h3 className={`text-lg font-bold tracking-tight ${currentTheme.text}`}>Account Summary</h3>
         <p className="text-xs font-medium text-slate-400 mt-1">Personal details and account status</p>
      </div>
      
      {/* Content List */}
      <div className="flex-1 flex flex-col gap-6">
        {infoItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group flex items-start gap-5"
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              
              {/* Data */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {item.label}
                  </p>
                  
                  {item.canCopy && (
                    <button
                      onClick={() => copyToClipboard(item.value, item.field)}
                      className="text-slate-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy"
                    >
                      {copiedField === item.field ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                   )}
                </div>
                
                <p className={`text-base font-bold ${currentTheme.text} truncate`}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileInfoCards;
