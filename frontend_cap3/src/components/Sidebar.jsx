import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ChatDiamondLogo from "./ChatDiamondLogo";
import { chatAPI, participantAPI } from "../services/api";
import { useAuth } from "../utils/AuthContext";

import {
  MessageSquare,
  User,
  Settings,
  LogOut,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  Search,
  Sparkles,
  Code2,
  Palette,
  CheckSquare,
  Clock,
  Archive,
} from "lucide-react";

export default function Sidebar({
  chats = [],
  currentTheme,
  theme,
  onOpenChat,
  onDeleteChat,
  onRequestLogout,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [pinned, setPinned] = useState([]);
  const [search] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [orderedChats, setOrderedChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  const goChats = () => navigate("/chat");
  const goProfile = () => navigate("/profile");
  const goSettings = () => navigate("/settings");

  const themeName = theme;

  // Sync internal order when chats change
  useEffect(() => {
    setOrderedChats(chats);
  }, [chats]);

  /* ----------------- SIMPLE FUZZY MATCH ----------------- */
  const fuzzyMatch = (text, query) => {
    if (!query.trim()) return true;
    const s = (text || "").toLowerCase();
    const q = query.toLowerCase();

    // simple subsequence fuzzy
    let idx = 0;
    for (const ch of q) {
      idx = s.indexOf(ch, idx);
      if (idx === -1) return false;
      idx++;
    }
    return true;
  };

  /* ----------------- FILTERED + ORDERED CHATS ----------------- */
  const visibleChats = useMemo(() => {
    if (!search.trim()) return orderedChats;
    return orderedChats.filter((c) =>
      fuzzyMatch(c.title || c.name || "untitled", search)
    );
  }, [orderedChats, search]);

  /* ----------------- BASIC CATEGORIZATION ----------------- */
  const isToday = (chat) => {
    if (!chat.updatedAt) return false;
    const d = new Date(chat.updatedAt);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const pinnedChats = visibleChats.filter((c) => pinned.includes(c.id));
  const todayChats = visibleChats.filter((c) => !pinned.includes(c.id) && isToday(c) && !c.archived);
  const previousChats = visibleChats.filter((c) => !pinned.includes(c.id) && !isToday(c) && !c.archived);
  const archivedChats = visibleChats.filter((c) => c.archived);

  // AI-ish sections
  const recentChats = useMemo(() => {
    return [...visibleChats]
      .filter((c) => !c.archived)
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 4);
  }, [visibleChats]);

  const suggestedChats = useMemo(() => {
    return [...visibleChats]
      .filter((c) => !c.archived)
      .sort((a, b) => (a._count?.messages || 0) - (b._count?.messages || 0))
      .slice(0, 4);
  }, [visibleChats]);

  /* ----------------- DRAG & DROP REORDER ----------------- */
  const handleReorder = (dragId, hoverId) => {
    if (!dragId || !hoverId || dragId === hoverId) return;
    setOrderedChats((prev) => {
      const arr = [...prev];
      const fromIndex = arr.findIndex((c) => c.id === dragId);
      const toIndex = arr.findIndex((c) => c.id === hoverId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
  };

  const togglePin = (id) => {
    setPinned((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  /* ----------------- COLLAPSIBLE GROUP STATE ----------------- */
  const [openGroups, setOpenGroups] = useState({
    pinned: false,
    today: false,
    previous: false,
    archived: false,
    recent: false,
    suggested: false,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch chats if none are provided (helps on reload or standalone usage)
  useEffect(() => {
    const shouldFetch = !chats || chats.length === 0;
    if (!shouldFetch) return;

    let active = true;
    const load = async () => {
      try {
        setLoadingChats(true);
        const res = await chatAPI.getMyChats();
        const list = res?.data?.chats || [];
        if (active) setOrderedChats(list);
      } catch (err) {
        console.error("Sidebar chat fetch failed:", err);
      } finally {
        if (active) setLoadingChats(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [chats]);

  const handleOpenChat = (chat) => {
    if (onOpenChat) {
      onOpenChat(chat);
      return;
    }
    if (!chat?.id) return;
    navigate("/chat", { state: { chatId: chat.id, chatName: chat.title } });
  };

  const handleDeleteChat = async (id, e) => {
    if (onDeleteChat) {
      onDeleteChat(id, e);
      return;
    }
    if (e?.stopPropagation) e.stopPropagation();
    if (!id) return;
    if (!window.confirm("Delete or leave this chat? If not the owner, you will leave it.")) return;
    try {
      await chatAPI.deleteChat(id);
      setOrderedChats((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      // If deletion is not permitted (e.g., not owner), fall back to leaving the chat
      if (user?.id) {
        try {
          await participantAPI.removeSelf(id, user.id);
          setOrderedChats((prev) => prev.filter((c) => c.id !== id));
          return;
        } catch (innerErr) {
          console.error("Sidebar leave chat failed:", innerErr);
        }
      }
      console.error("Sidebar delete chat failed:", err);
    }
  };

  return (
    <aside
      className={`
        hidden md:flex flex-col h-full relative
        border-r ${currentTheme.border}
        backdrop-blur-2xl shadow-xl transition-all duration-300
        ${currentTheme.cardBg}
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* HEADER */}
      <div
        className={`
          h-20 flex items-center justify-center border-b ${currentTheme.border}
          bg-linear-to-r ${currentTheme.gradient} text-white shadow-md
        `}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="
              w-14 h-14 rounded-2xl flex items-center justify-center
              bg-white/20 border border-white/40 shadow-xl backdrop-blur-md
            ">
              <ChatDiamondLogo size={38} />
            </div>
            <span className="text-2xl font-extrabold tracking-wide">
              ChatterBox
            </span>
          </div>
        ) : (
          <div className="
            w-14 h-14 rounded-2xl flex items-center justify-center
            bg-white/20 border border-white/40 shadow-xl backdrop-blur-md
          ">
            <ChatDiamondLogo size={38} />
          </div>
        )}
      </div>

      {/* THEME-REACTIVE COLLAPSE BUTTON */}
      <PremiumToggleButton
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        themeName={themeName}
      />

      {/* NAVIGATION */}
      <nav className="flex flex-col px-4 pt-4 space-y-2">
        <SidebarItem
          icon={<MessageSquare />}
          label="Chats"
          collapsed={collapsed}
          currentTheme={currentTheme}
          onClick={goChats}
          active
        />
        <SidebarItem
          icon={<User />}
          label="Profile"
          collapsed={collapsed}
          currentTheme={currentTheme}
          onClick={goProfile}
        />
        <SidebarItem
          icon={<Settings />}
          label="Settings"
          collapsed={collapsed}
          currentTheme={currentTheme}
          onClick={goSettings}
        />
      </nav>
      
      <div className={`border-t my-2 ${currentTheme.border}`} />

      {/* SCROLLABLE CHATS AREA */}
      <div className="flex-1 overflow-auto pb-4 space-y-1">
        {/* AI SMART: RECENT */}
        {!collapsed && !search.trim() && recentChats.length > 0 && (
          <>
            <CategoryHeader
              label="Recent"
              icon={<Clock size={14} />}
              open={openGroups.recent}
              onToggle={() => toggleGroup("recent")}
              currentTheme={currentTheme}
            />
            {openGroups.recent && (
              <ChatSection
                chats={recentChats}
                collapsed={collapsed}
                currentTheme={currentTheme}
                onOpenChat={handleOpenChat}
                onDeleteChat={handleDeleteChat}
                togglePin={togglePin}
                pinned={pinned}
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                onReorder={handleReorder}
              />
            )}
          </>
        )}

        {/* AI SMART: SUGGESTED */}
        {!collapsed && !search.trim() && suggestedChats.length > 0 && (
          <>
            <CategoryHeader
              label="Suggested"
              icon={<Sparkles size={14} />}
              open={openGroups.suggested}
              onToggle={() => toggleGroup("suggested")}
              currentTheme={currentTheme}
            />
            {openGroups.suggested && (
              <ChatSection
                chats={suggestedChats}
                collapsed={collapsed}
                currentTheme={currentTheme}
                onOpenChat={handleOpenChat}
                onDeleteChat={handleDeleteChat}
                togglePin={togglePin}
                pinned={pinned}
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                onReorder={handleReorder}
              />
            )}
          </>
        )}

        {/* PINNED */}
        {!collapsed && pinnedChats.length > 0 && (
          <>
            <CategoryHeader
              label="Pinned"
              icon={<Pin size={14} />}
              open={openGroups.pinned}
              onToggle={() => toggleGroup("pinned")}
              currentTheme={currentTheme}
            />
            {openGroups.pinned && (
              <ChatSection
                chats={pinnedChats}
                collapsed={collapsed}
                currentTheme={currentTheme}
                onOpenChat={handleOpenChat}
                onDeleteChat={handleDeleteChat}
                togglePin={togglePin}
                pinned={pinned}
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                onReorder={handleReorder}
              />
            )}
          </>
        )}

        {/* TODAY */}
        {!collapsed && todayChats.length > 0 && (
          <>
            <CategoryHeader
              label="Today"
              icon={<Clock size={14} />}
              open={openGroups.today}
              onToggle={() => toggleGroup("today")}
              currentTheme={currentTheme}
            />
            {openGroups.today && (
              <ChatSection
                chats={todayChats}
                collapsed={collapsed}
                currentTheme={currentTheme}
                onOpenChat={handleOpenChat}
                onDeleteChat={handleDeleteChat}
                togglePin={togglePin}
                pinned={pinned}
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                onReorder={handleReorder}
              />
            )}
          </>
        )}

        {/* PREVIOUS */}
        {!collapsed && previousChats.length > 0 && (
          <>
            <CategoryHeader
              label="Previous"
              icon={<MessageSquare size={14} />}
              open={openGroups.previous}
              onToggle={() => toggleGroup("previous")}
              currentTheme={currentTheme}
            />
            {openGroups.previous && (
              <ChatSection
                chats={previousChats}
                collapsed={collapsed}
                currentTheme={currentTheme}
                onOpenChat={handleOpenChat}
                onDeleteChat={handleDeleteChat}
                togglePin={togglePin}
                pinned={pinned}
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                onReorder={handleReorder}
              />
            )}
          </>
        )}

        {/* ARCHIVED */}
        {!collapsed && archivedChats.length > 0 && (
          <>
            <CategoryHeader
              label="Archived"
              icon={<Archive size={14} />}
              open={openGroups.archived}
              onToggle={() => toggleGroup("archived")}
              currentTheme={currentTheme}
            />
            {openGroups.archived && (
              <ChatSection
                chats={archivedChats}
                collapsed={collapsed}
                currentTheme={currentTheme}
                onOpenChat={handleOpenChat}
                onDeleteChat={handleDeleteChat}
                togglePin={togglePin}
                pinned={pinned}
                draggingId={draggingId}
                setDraggingId={setDraggingId}
                onReorder={handleReorder}
              />
            )}
          </>
        )}

        {/* Collapsed mode: just show all */}
        {collapsed && (
          <ChatSection
            chats={visibleChats}
            collapsed={collapsed}
            currentTheme={currentTheme}
            onOpenChat={handleOpenChat}
            onDeleteChat={handleDeleteChat}
            togglePin={togglePin}
            pinned={pinned}
            draggingId={draggingId}
            setDraggingId={setDraggingId}
            onReorder={handleReorder}
          />
        )}

        {/* No chats fallback */}
        {visibleChats.length === 0 && !collapsed && (
          <p className={`text-center mt-4 text-sm ${currentTheme.textSecondary}`}>
            {loadingChats ? "Loading chats..." : "No chats found."}
          </p>
        )}
      </div>

      {/* FOOTER */}
      <div
        className={`p-4 border-t ${currentTheme.border} flex flex-col items-center`}
      >
        {!collapsed ? (
          <button
            onClick={onRequestLogout}
            className="
              w-full px-4 py-3 rounded-xl text-red-500 bg-red-500/10 
              hover:bg-red-500/20 font-semibold flex items-center justify-center gap-3
            "
          >
            <LogOut size={20} />
            Logout
          </button>
        ) : (
          <button
            className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30"
            onClick={onRequestLogout}
          >
            <LogOut size={22} className="text-red-400" />
          </button>
        )}
      </div>
    </aside>
  );
}

/* ------------ THEME-REACTIVE PREMIUM TOGGLE BUTTON ------------ */
function PremiumToggleButton({ collapsed, setCollapsed, themeName }) {
  return (
    <button
      onClick={() => setCollapsed((prev) => !prev)}
      className={`
        absolute -right-4 top-1/2 -translate-y-1/2
        rounded-full p-3 shadow-2xl z-50 backdrop-blur-xl border
        transition-all duration-300 hover:scale-[1.12] active:scale-[0.95]

        ${
          themeName === "light" &&
          "bg-linear-to-br from-sky-400 via-cyan-400 to-blue-500 border-blue-400 \
           hover:from-cyan-300 hover:via-sky-300 hover:to-blue-400 \
           hover:shadow-[0_0_20px_rgba(56,189,248,0.9)]"
        }
        ${
          themeName === "dark" &&
          "bg-linear-to-br from-indigo-500 via-blue-600 to-blue-700 border-indigo-500 \
           hover:from-blue-500 hover:via-sky-400 hover:to-cyan-400 \
           hover:shadow-[0_0_20px_rgba(96,165,250,1)]"
        }
        ${
          themeName === "vintage" &&
          "bg-linear-to-br from-teal-400 via-cyan-400 to-sky-400 border-teal-500 \
           hover:from-cyan-300 hover:via-teal-300 hover:to-sky-300 \
           hover:shadow-[0_0_20px_rgba(45,212,191,1)]"
        }
      `}
    >
      {collapsed ? (
        <ChevronRight size={22} className="text-white drop-shadow-md" />
      ) : (
        <ChevronLeft size={22} className="text-white drop-shadow-md" />
      )}
    </button>
  );
}

/* ------------ CATEGORY HEADER (COLLAPSIBLE) ------------ */
function CategoryHeader({ label, icon, open, onToggle, currentTheme }) {
  return (
    <button
      onClick={onToggle}
      className={`
        w-full flex items-center justify-between px-5 py-2
        text-xs font-semibold uppercase tracking-wide
        ${currentTheme.textSecondary}
      `}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-[10px]">
        {open ? "Hide" : "Show"}
      </span>
    </button>
  );
}

/* ------------ CHAT SECTION (LIST) ------------ */
function ChatSection({
  chats,
  collapsed,
  currentTheme,
  onOpenChat,
  onDeleteChat,
  togglePin,
  pinned,
  draggingId,
  setDraggingId,
  onReorder,
}) {
  return (
    <div className="px-2 space-y-2">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          collapsed={collapsed}
          currentTheme={currentTheme}
          onOpenChat={onOpenChat}
          onDeleteChat={onDeleteChat}
          togglePin={togglePin}
          pinned={pinned}
          draggingId={draggingId}
          setDraggingId={setDraggingId}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
}

/* ------------ DYNAMIC CHAT ICON ------------ */
function getChatIcon(chat, className) {
  const title = (chat.title || "").toLowerCase();

  if (title.includes("code") || title.includes("bug") || title.includes("dev"))
    return <Code2 className={className} size={18} />;
  if (title.includes("design") || title.includes("ui") || title.includes("ux"))
    return <Palette className={className} size={18} />;
  if (title.includes("task") || title.includes("todo") || title.includes("list"))
    return <CheckSquare className={className} size={18} />;
  if (title.includes("ai") || title.includes("gpt") || title.includes("chatgpt"))
    return <Sparkles className={className} size={18} />;

  return <MessageSquare className={className} size={18} />;
}

/* ------------ CHAT ITEM (DRAG + PIN + HOVER SPOTLIGHT) ------------ */
function ChatItem({
  chat,
  collapsed,
  currentTheme,
  onOpenChat,
  onDeleteChat,
  togglePin,
  pinned,
  draggingId,
  setDraggingId,
  onReorder,
}) {
  const isPinned = pinned.includes(chat.id);
  const unreadCount = chat.unreadCount || 0;

  const handleDragStart = () => {
    setDraggingId(chat.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggingId && draggingId !== chat.id) {
      onReorder(draggingId, chat.id);
    }
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleOpen = () => {
    if (onOpenChat) onOpenChat(chat);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDrop={handleDragEnd}
      onClick={handleOpen}
      className={`
        group relative flex items-center justify-between px-4 py-3 cursor-pointer
        rounded-xl border ${currentTheme.border} ${currentTheme.glassBg}
        hover:shadow-xl hover:-translate-y-0.5 transition-all
        ${draggingId === chat.id ? "ring-2 ring-sky-400" : ""}
      `}
    >
      {/* Spotlight hover background */}
      <div
        className="
          absolute inset-0 rounded-xl pointer-events-none
          bg-linear-to-br from-white/10 via-white/5 to-transparent
          opacity-0 group-hover:opacity-100 group-hover:scale-[1.02]
          transition-all duration-300
        "
      />

      {/* Left side: icon + title */}
      <div className="relative z-10 flex items-center gap-3 overflow-hidden">
        {getChatIcon(chat, currentTheme.text)}
        {!collapsed && (
          <span className={`truncate text-sm ${currentTheme.text}`}>
            {chat.title || "Untitled Chat"}
          </span>
        )}
      </div>

      {/* Right side: badges + actions */}
      {!collapsed && (
        <div className="relative z-10 flex items-center gap-2">
          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500 text-white font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {/* Pin + delete (on hover) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePin(chat.id);
              }}
            >
              {isPinned ? (
                <PinOff size={16} className="text-yellow-600" />
              ) : (
                <Pin size={16} className="text-gray-400 hover:text-gray-600" />
              )}
            </button>

            <button
              onClick={(e) => onDeleteChat && onDeleteChat(chat.id, e)}
              className="ml-1"
            >
              <Trash2 size={18} className="text-red-500 hover:text-red-700" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed unread dot */}
      {collapsed && unreadCount > 0 && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
      )}
    </div>
  );
}

/* ------------ NAV ITEM (WITH SPOTLIGHT) ------------ */
function SidebarItem({ icon, label, collapsed, currentTheme, active, onClick }) {
  return (
    <div
      className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer select-none
        ${currentTheme.glassBg} border ${currentTheme.border} ${currentTheme.text}
        hover:shadow-lg hover:-translate-y-1 transition-all
        ${collapsed ? "justify-center" : ""}
        ${active ? "ring-2 ring-cyan-400 shadow-xl" : ""}
      `}
      onClick={onClick}
    >
      {/* Spotlight */}
      <div
        className="
          absolute inset-0 rounded-xl pointer-events-none
          bg-linear-to-br from-white/15 via-white/5 to-transparent
          opacity-0 group-hover:opacity-100 group-hover:scale-[1.03]
          transition-all duration-300
        "
      />
      <div className="relative z-10 flex items-center gap-3">
        {icon}
        {!collapsed && <span className="font-medium text-sm">{label}</span>}
      </div>
    </div>
  );
}
