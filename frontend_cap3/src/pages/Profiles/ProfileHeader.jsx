import React from "react";
import { CheckCircle2, MapPin, Edit3, Globe, Briefcase } from "lucide-react";

const ProfileHeader = ({ currentTheme, avatarColor, user, onEdit }) => {
  return (
    <div className={`relative mb-12 rounded-[24px] overflow-hidden ${currentTheme.surface} border ${currentTheme.border} shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] group`}>
      
      {/* Premium Banner */}
      <div className="relative h-36 w-full overflow-hidden">
        {/* Main Gradient - Smoother Blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        
        {/* Refined Texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10" />
      </div>
      
      {/* Profile Content */}
      <div className="px-8 pb-6">
        <div className="relative flex flex-col sm:flex-row items-end gap-6 -mt-14 mb-4">
          
          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className={`
              w-32 h-32 rounded-full 
              bg-gradient-to-br ${avatarColor} 
              p-1 ring-[6px] ring-white shadow-2xl shadow-indigo-500/20
              flex items-center justify-center
            `}>
               <span className="text-5xl text-white font-bold drop-shadow-md">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
               </span>
            </div>
            
            {/* Verified Badge - Overlapping */}
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm ring-2 ring-white text-emerald-500">
              <CheckCircle2 className="w-5 h-5 fill-emerald-50" />
            </div>
          </div>

          {/* Identity Block */}
          <div className="flex-1 pb-1">
             <div className="flex items-center gap-3 mb-1.5">
               <h1 className="text-[32px] font-bold tracking-tight text-slate-900 leading-none">
                 {user?.fullName || user?.username || "Abhi"}
               </h1>
               
               {/* Elegant Role Badge */}
               <span className="
                 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full 
                 text-[11px] font-bold uppercase tracking-wider 
                 bg-slate-50 text-slate-500 border border-slate-200
               ">
                 <Briefcase className="w-3 h-3 text-slate-400" />
                 Product Manager
               </span>
             </div>
             
             {/* Secondary Metadata Row */}
             <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
               <span className="text-slate-500">{user?.email || "abhi@chatapp.com"}</span>
               
               <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>San Francisco, CA</span>
               </div>
               
               <div className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                  <Globe className="w-3.5 h-3.5" />
                  <span>chatterbox.com</span>
               </div>
             </div>
          </div>

          {/* Action Button - Top Right Aligned on Desktop */}
          <div className="hidden sm:block pb-3">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md"
              aria-label="Edit profile"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-[0_2px_6px_rgba(59,130,246,0.18)]">
                <Edit3 className="w-4 h-4" />
              </span>
              <span className="tracking-tight">Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
