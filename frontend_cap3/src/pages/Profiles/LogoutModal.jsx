import React from "react";
import { LogOut, X } from "lucide-react";

const LogoutModal = ({ open, currentTheme, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`${currentTheme.surface} w-full max-w-md rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border ${currentTheme.border}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-red-50 rounded-xl">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <h3 className={`text-xl font-bold ${currentTheme.text} mb-2`}>
          Log out of your account?
        </h3>
        <p className={`${currentTheme.textSecondary} mb-8`}>
          You will be redirected to the login screen. You can always log back in later.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
