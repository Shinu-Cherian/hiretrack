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
      <header className="sticky top-0 z-50 glass">
        <div className="flex justify-between items-center p-4">

          {/* LEFT */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Briefcase /> HireTrack
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Avatar src={profilePic} username={username} size="sm" onClick={() => setSidebarOpen(true)} />
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="relative rounded-full bg-blue-50 p-2 text-blue-600 shadow-sm hover:bg-blue-100"
                  aria-label="Open notifications"
                >
                  <Bell size={18} />
                  {hasUnread && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/streaks")}
                  className="rounded-full bg-orange-50 p-2 text-orange-600 shadow-sm hover:bg-orange-100"
                  aria-label="Open streaks"
                >
                  <Flame size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 text-sm">Login</button>
                </Link>

                <Link to="/signup">
                  <button className="px-4 py-2 bg-black text-white rounded">
                    Sign up
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
