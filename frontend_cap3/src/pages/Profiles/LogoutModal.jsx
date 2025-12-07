// src/pages/Profile/LogoutModal.jsx
import React from "react";
import { LogOut } from "lucide-react";

const LogoutModal = ({ open, onCancel, onConfirm, currentTheme }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div
        className={`${currentTheme.cardBg} rounded-3xl shadow-2xl p-10 border-2 ${currentTheme.border}`}
      >
        <div className="text-center">
          <div className="bg-red-500 p-5 w-20 h-20 mx-auto rounded-full mb-6">
            <LogOut className="w-10 h-10 text-white" />
          </div>

          <h2 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>
            Logging Out?
          </h2>
          <p className={`${currentTheme.textSecondary} text-lg mb-8`}>
            Are you sure you want to logout from ChatterBox?
          </p>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className={`flex-1 p-4 rounded-2xl ${currentTheme.glassBg} border ${currentTheme.border} ${currentTheme.text}`}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 p-4 rounded-2xl bg-linear-to-r from-red-500 to-orange-500 text-white shadow-xl"
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
