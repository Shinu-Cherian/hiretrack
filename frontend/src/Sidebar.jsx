import { Star, Bell, Settings, LogOut, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiUrl } from "./api";
import Avatar from "./components/Avatar";

export default function Sidebar({ isOpen, onClose, profile }) {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [readVersion, setReadVersion] = useState(0);

  useEffect(() => {
    fetch(apiUrl("/api/notifications/"), {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  useEffect(() => {
    const refresh = () => setReadVersion((value) => value + 1);
    window.addEventListener("notifications-read", refresh);
    return () => window.removeEventListener("notifications-read", refresh);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
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
        <div className="p-8">

          {/* PROFILE */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar src={profilePic} username={username} size="md" className="ring-2 ring-white/5" />
            <div className="min-w-0">
              <h3 className="font-black text-white truncate text-lg tracking-tight">
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

          <div className="h-px bg-white/5 my-8" />

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

          </div>

          <div className="h-px bg-white/5 my-8" />

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 p-4 w-full rounded-2xl text-red-500 hover:bg-red-500 hover:text-white font-black transition-all shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>

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
    return new Set(JSON.parse(localStorage.getItem("read_notifications") || "[]"));
  } catch {
    return new Set();
  }
}
