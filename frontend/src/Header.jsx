import { Link, useNavigate } from "react-router-dom";
import { Bell, Briefcase, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { apiUrl } from "./api";
import Avatar from "./components/Avatar";

export default function Header() {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [readVersion, setReadVersion] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch(apiUrl("/api/profile/"), {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          localStorage.setItem("username", data.username || "User");
          if (data.profile_pic) {
            localStorage.setItem("profile_pic", data.profile_pic);
          } else {
            localStorage.removeItem("profile_pic");
          }
        }
      })
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(apiUrl("/api/notifications/"), { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((items) => setNotifications(Array.isArray(items) ? items : []))
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    const refresh = () => setReadVersion((value) => value + 1);
    window.addEventListener("notifications-read", refresh);
    return () => window.removeEventListener("notifications-read", refresh);
  }, []);

  const profilePic = profile?.profile_pic || localStorage.getItem("profile_pic");
  const username = profile?.username || localStorage.getItem("username") || "User";
  const hasUnread = notifications.some((item) => !readNotificationKeys().has(notificationKey(item))) && readVersion >= 0;

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 glass border-b border-gray-200/50 shadow-sm backdrop-blur-xl bg-white/70">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">

          {/* LEFT */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-gray-900">
            <Briefcase className="text-gray-900" size={24} /> Hire<span className="text-gray-500 font-light">Track</span>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/streaks")}
                  className="rounded-full bg-orange-50 p-2 text-orange-500 shadow-sm hover:bg-orange-100 transition-colors"
                  aria-label="Open streaks"
                >
                  <Flame size={18} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="relative rounded-full bg-gray-50 p-2 text-gray-600 shadow-sm hover:bg-gray-100 transition-colors"
                  aria-label="Open notifications"
                >
                  <Bell size={18} strokeWidth={1.5} />
                  {hasUnread && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <Avatar src={profilePic} username={username} size="sm" onClick={() => setSidebarOpen(true)} className="cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all" />
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Sign In</button>
                </Link>

                <Link to="/signup">
                  <button className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl shadow-sm hover:bg-gray-800 hover:shadow transition-all hover:-translate-y-0.5">
                    Start for free
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* 🔥 SIDEBAR MUST BE HERE */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />
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
