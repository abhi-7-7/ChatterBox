// src/components/dashboard/MobileSidebar.jsx
import React from "react";
import { MessageSquare, Plus } from "lucide-react";

const MobileSidebar = ({
  open,
  setOpen,
  chats,
  currentTheme,
  onStartChat,
  onOpenChat,
}) => {
  if (!open) return null;

  return (
    <div
      className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-md animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className={`absolute left-0 top-0 h-full w-72 bg-linear-to-b ${currentTheme.gradient} p-6 text-white shadow-2xl transform transition-transform duration-300 backdrop-blur-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-3xl font-extrabold mb-10 flex items-center space-x-3 drop-shadow-lg">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <MessageSquare className="w-8 h-8" />
          </div>
          <span>ChatterBox</span>
        </h1>

        <button
          onClick={onStartChat}
          className="flex items-center justify-center space-x-2 bg-white/30 hover:bg-white/50 px-5 py-4 rounded-2xl mb-10 transition-all shadow-lg w-full font-semibold text-base backdrop-blur-md border border-white/30"
        >
          <Plus className="w-6 h-6" />
          <span>Start New Chat</span>
        </button>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 shadow-lg">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-70" />
              <p className="text-base opacity-95 mb-1 font-medium">
                No chats yet
              </p>
              <p className="text-sm opacity-80">
                Start a conversation above
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.slice(0, 10).map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setOpen(false);
                    onOpenChat(chat);
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg cursor-pointer transition-all"
                >
                  <p className="font-semibold text-base truncate">
                    {chat.name}
                  </p>
                  <p className="text-sm opacity-80 mt-1">
                    {chat._count?.messages || 0} messages
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
