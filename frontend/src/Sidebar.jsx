import { Star, Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE, apiUrl } from "./api";

export default function Sidebar({ isOpen, onClose, profile }) {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(apiUrl("/api/notifications/"), {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    onClose();
    navigate("/");
    window.location.reload();
  };

  const profilePic = profile?.profile_pic || localStorage.getItem("profile_pic");
  const username = profile?.username || localStorage.getItem("username") || "User";

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5">

          {/* PROFILE */}

          <div className="flex items-center gap-3 mb-6">
            <img
              src={profilePic ? `${API_BASE}${profilePic}` : "/default-avatar.png"}
              className="w-10 h-10 rounded-full object-cover border"
              alt="Profile"
            />
            <div>
              <h3 className="font-semibold">
                {username}
              </h3>
              <p
  onClick={() => {
    navigate("/profile");
    onClose();
  }}
  className="text-sm text-gray-500 cursor-pointer hover:underline"
>
  View Profile
</p>
            </div>
          </div>

          <hr className="mb-4" />

          {/* MENU */}
          <div className="space-y-2">

            {/* ⭐ STARRED */}
            <div
              onClick={() => {
                navigate("/starred");
                onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <Star size={18} /> Starred
            </div>

            {/* 🔔 NOTIFICATIONS */}
            <div
              onClick={() => {
                navigate("/notifications");
                onClose();
              }}
              className="relative flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <Bell size={18} /> Notifications

              {notifications.length > 0 && (
                <span className="absolute right-2 top-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>

            {/* ⚙ SETTINGS */}
            <div
              onClick={() => {
                navigate("/settings");
                onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            >
              <Settings size={18} /> Settings
            </div>

          </div>

          <hr className="my-4" />

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 w-full rounded-lg hover:bg-red-100 text-red-600 transition"
          >
            <LogOut size={18} /> Logout
          </button>

        </div>
      </div>
    </>
  );
}
