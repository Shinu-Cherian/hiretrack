import { Star, Bell, Settings, LogOut, Archive, ArrowRight, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiUrl, logoutSession } from "./api";
import Avatar from "./components/Avatar";

export default function Sidebar({ isOpen, onClose, profile }) {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [readVersion, setReadVersion] = useState(0);

  useEffect(() => {
    fetch(apiUrl("/api/notifications/"), {
      credentials: "include",
    })
      .then(res => (res.ok ? res.json() : []))
      .then(data => setNotifications(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    const refresh = () => setReadVersion((value) => value + 1);
    window.addEventListener("notifications-read", refresh);
    return () => window.removeEventListener("notifications-read", refresh);
  }, []);

  const handleLogout = async () => {
    await logoutSession();
    onClose();
    navigate("/");
    window.location.reload();
  };

  const profilePic = profile?.profile_pic || localStorage.getItem("profile_pic");
  const username = profile?.username || localStorage.getItem("username") || "User";
  const hasUnread = notifications.some((item) => !readNotificationKeys().has(notificationKey(item))) && readVersion >= 0;

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#121313] border-l border-white/5 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[-10px_0_30px_rgba(0,0,0,0.5)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-8 h-full flex flex-col justify-between overflow-y-auto">

          <div className="space-y-6">
            {/* PROFILE */}
            <div className="flex items-center gap-4">
              <Avatar src={profilePic} username={username} size="md" className="ring-2 ring-white/5" />
              <div className="min-w-0">
                <h3 className="font-black text-gray-400 truncate text-lg tracking-tight" style={{ textShadow: 'none' }}>
                  {username}
                </h3>
                <p
                  onClick={() => {
                    navigate("/profile");
                    onClose();
                  }}
                  className="text-xs text-[#FF6044] font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors mt-0.5"
                >
                  Profile Settings
                </p>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* MENU */}
            <div className="space-y-3">

              {/* ⭐ STARRED */}
              <div
                onClick={() => {
                  navigate("/starred");
                  onClose();
                }}
                className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer text-gray-400 hover:bg-[#FF6044] hover:text-[#121313] transition-all font-black shadow-lg hover:shadow-[#FF6044]/20"
              >
                <Star size={20} /> Starred
              </div>

              {/* 🔔 NOTIFICATIONS */}
              <div
                onClick={() => {
                  navigate("/notifications", { state: { fromSidebar: true } });
                  onClose();
                }}
                className="group relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer text-gray-400 hover:bg-[#FF6044] hover:text-[#121313] transition-all font-black shadow-lg hover:shadow-[#FF6044]/20"
              >
                <Bell size={20} /> Notifications

                {hasUnread && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#FF6044] rounded-full animate-pulse shadow-[0_0_10px_#FF6044] group-hover:bg-[#121313] group-hover:shadow-none"></span>
                )}
              </div>

              {/* ⚙ SETTINGS */}
              <div
                onClick={() => {
                  navigate("/settings");
                  onClose();
                }}
                className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer text-gray-400 hover:bg-[#FF6044] hover:text-[#121313] transition-all font-black shadow-lg hover:shadow-[#FF6044]/20"
              >
                <Settings size={20} /> Settings
              </div>

              {/* 📦 VAULT */}
              <div
                onClick={() => {
                  navigate("/career-vault");
                  onClose();
                }}
                className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer text-gray-400 hover:bg-[#FF6044] hover:text-[#121313] transition-all font-black shadow-lg hover:shadow-[#FF6044]/20"
              >
                <Archive size={20} /> Career Vault
              </div>

              {/* ✏️ SCRIBBLES */}
              <div
                onClick={() => {
                  navigate("/scribbles");
                  onClose();
                }}
                className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer text-gray-400 hover:bg-[#FF6044] hover:text-[#121313] transition-all font-black shadow-lg hover:shadow-[#FF6044]/20"
              >
                <Edit size={20} /> Scribbles
              </div>

            </div>
          </div>

          <div className="space-y-6 mt-8">
            {/* GEN Z CTA BANNER */}
            {localStorage.getItem("isLoggedIn") === "true" && (
              <div
                onClick={() => {
                  navigate("/developer-card");
                  onClose();
                }}
                className="group relative p-4 bg-[#FF6044]/[0.02] hover:bg-[#FF6044]/[0.06] border border-white/5 hover:border-[#FF6044]/20 rounded-2xl transition-all duration-300 cursor-pointer select-none overflow-hidden"
              >
                {/* Subtle Glow Effect on Hover */}
                <div className="absolute -inset-px bg-gradient-to-r from-[#FF6044]/0 via-[#FF6044]/10 to-[#FF6044]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  {/* Pill Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF6044]/10 border border-[#FF6044]/20 text-[9px] font-mono uppercase tracking-widest text-[#FF6044]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6044] animate-pulse" />
                    Incoming Signal
                  </div>

                  <p className="text-xs font-sans text-gray-400 leading-relaxed font-medium">
                    <span className="text-[#FF6044] font-extrabold">{username}</span>, the developer sent a message to you. Check it out.
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-extrabold text-white group-hover:text-[#FF6044] transition-colors duration-300">
                    Open Transmission 🛰️
                    <ArrowRight size={12} className="text-[#FF6044] group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            )}

            <div className="h-px bg-white/5" />

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-4 p-4 w-full rounded-2xl text-red-500 hover:bg-red-500 hover:text-white font-black transition-all shadow-lg hover:shadow-red-500/20"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> Logout
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

function notificationKey(item) {
  return `${item.type}-${item.id}-${item.date}`;
}

function readNotificationKeys() {
  try {
    return new Set(JSON.parse(localStorage.getItem("clicked_notifications") || "[]"));
  } catch {
    return new Set();
  }
}
