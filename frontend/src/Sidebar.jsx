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
        className={`fixed top-0 right-0 h-full w-72 glass z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6">

          {/* PROFILE */}

          <div className="flex items-center gap-3 mb-6">
            <Avatar src={profilePic} username={username} />
            <div>
              <h3 className="font-bold text-gray-900">
                {username}
              </h3>
              <p
                onClick={() => {
                  navigate("/profile");
                  onClose();
                }}
                className="text-sm text-gray-500 font-light cursor-pointer hover:text-gray-900 hover:underline transition-colors"
              >
                View Profile
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-200/50 my-6" />

          {/* MENU */}
          <div className="space-y-2">

            {/* ⭐ STARRED */}
            <div
              onClick={() => {
                navigate("/starred");
                onClose();
              }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/60 hover:shadow-sm text-gray-600 hover:text-gray-900 transition-all font-medium"
            >
              <Star size={18} strokeWidth={1.5} /> Starred
            </div>

            {/* 🔔 NOTIFICATIONS */}
            <div
              onClick={() => {
                navigate("/notifications", { state: { fromSidebar: true } });
                onClose();
              }}
              className="relative flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/60 hover:shadow-sm text-gray-600 hover:text-gray-900 transition-all font-medium"
            >
              <Bell size={18} strokeWidth={1.5} /> Notifications

              {hasUnread && (
                <span className="absolute right-3 top-3.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>

            {/* ⚙ SETTINGS */}
            <div
              onClick={() => {
                navigate("/settings");
                onClose();
              }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/60 hover:shadow-sm text-gray-600 hover:text-gray-900 transition-all font-medium"
            >
              <Settings size={18} strokeWidth={1.5} /> Settings
            </div>

            <div
              onClick={() => {
                navigate("/career-vault");
                onClose();
              }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/60 hover:shadow-sm text-gray-600 hover:text-gray-900 transition-all font-medium"
            >
              <Archive size={18} strokeWidth={1.5} /> Career Vault
            </div>

          </div>

          <div className="h-px bg-gray-200/50 my-6" />

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-50 hover:shadow-sm text-red-500 font-medium transition-all"
          >
            <LogOut size={18} strokeWidth={1.5} /> Logout
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
