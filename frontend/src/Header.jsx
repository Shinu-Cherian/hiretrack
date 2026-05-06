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
    const openSidebar = () => setSidebarOpen(true);
    
    window.addEventListener("notifications-read", refresh);
    window.addEventListener("open-sidebar", openSidebar);
    
    return () => {
      window.removeEventListener("notifications-read", refresh);
      window.removeEventListener("open-sidebar", openSidebar);
    };
  }, []);

  const profilePic = profile?.profile_pic || localStorage.getItem("profile_pic");
  const username = profile?.username || localStorage.getItem("username") || "User";
  const hasUnread = notifications.some((item) => !readNotificationKeys().has(notificationKey(item))) && readVersion >= 0;

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 glass border-b border-white/5 shadow-sm backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 py-4 max-w-[1600px] mx-auto">

          {/* LEFT */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white">
            <Briefcase className="text-[#FF6044]" size={24} /> Hire<span className="text-gray-400 font-light">Track</span>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/streaks")}
                  className="rounded-full bg-[#FF6044] p-2 text-[#121313] shadow-lg shadow-[#FF6044]/20 hover:scale-110 transition-all active:scale-95"
                  aria-label="Open streaks"
                >
                  <Flame size={18} strokeWidth={2.5} fill="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="relative rounded-full bg-[#FF6044] p-2 text-[#121313] shadow-lg shadow-[#FF6044]/20 hover:scale-110 transition-all active:scale-95"
                  aria-label="Open notifications"
                >
                  <Bell size={18} strokeWidth={2.5} fill="currentColor" />
                  {hasUnread && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#121313] bg-white animate-pulse" />}
                </button>
                <div className="w-px h-6 bg-white/10 mx-1"></div>
                <Avatar src={profilePic} username={username} size="sm" onClick={() => setSidebarOpen(true)} className="cursor-pointer hover:ring-2 hover:ring-[#FF6044]/50 transition-all" />
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-5 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">Sign In</button>
                </Link>

                <Link to="/signup">
                  <button className="px-5 py-2.5 bg-[#FF6044] text-[#121313] text-sm font-black uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF6044]/20 hover:bg-[#ff4d2e] hover:shadow-[#FF6044]/40 transition-all hover:-translate-y-0.5 active:scale-95">
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
    return new Set(JSON.parse(localStorage.getItem("clicked_notifications") || "[]"));
  } catch {
    return new Set();
  }
}
