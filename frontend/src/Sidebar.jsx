import { Star, Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Sidebar({ isOpen, onClose }) {

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/notifications/")
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    onClose();
    navigate("/");
    window.location.reload();
  };

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
              src="/default-avatar.png"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">
                {localStorage.getItem("username") || "User"}
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
            <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
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