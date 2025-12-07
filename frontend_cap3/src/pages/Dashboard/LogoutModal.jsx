// src/components/dashboard/LogoutModal.jsx
import React from "react";
import { LogOut } from "lucide-react";

const LogoutModal = ({ open, currentTheme, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-md animate-fade-in">
      <div
        className={`${currentTheme.cardBg} backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-md w-full mx-4 border-4 ${currentTheme.border}`}
      >
        <div className="text-center">
          <div className="mb-8">
            <div className="bg-linear-to-br from-red-400 to-rose-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <LogOut className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>
            Logging Out?
          </h2>
          <p className={`${currentTheme.textSecondary} text-lg mb-10`}>
            Are you sure you want to logout from ChatterBox?
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onCancel}
              className={`flex-1 ${currentTheme.glassBg} backdrop-blur-md hover:bg-white/60 ${currentTheme.text} px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-base border-2 ${currentTheme.border} hover:scale-105 shadow-lg`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-base shadow-2xl hover:scale-105 border-2 border-white/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
