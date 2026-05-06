import { useEffect, useState } from "react";
import { Bell, Briefcase, Handshake } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";

export default function NotificationsPage() {
  const [data, setData] = useState([]);
  const [clickedKeys, setClickedKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSidebar = location.state?.fromSidebar || false;

  useEffect(() => {
    // Load clicked notifications from localStorage
    const saved = localStorage.getItem("clicked_notifications");
    if (saved) setClickedKeys(JSON.parse(saved));

    fetch(apiUrl("/api/notifications/"), { credentials: "include" })
      .then((res) => res.json())
      .then((items) => {
        setData(Array.isArray(items) ? items : []);
      });
  }, []);

  const openNotification = (notification) => {
    const key = notificationKey(notification);
    
    // Mark as clicked locally
    const newClicked = [...new Set([...clickedKeys, key])];
    setClickedKeys(newClicked);
    localStorage.setItem("clicked_notifications", JSON.stringify(newClicked));
    
    // Optional: dispatch event if other components need to know
    window.dispatchEvent(new Event("notifications-read"));

    const path = notification.type === "referral" ? "/referrals" : "/jobs";
    navigate(`${path}?highlight=${notification.id}`);
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white">
      <Header />

      <main className="mx-auto max-w-[1600px] p-6 animate-fade-in-up">
        <BackButton className="mb-5" isMenu={fromSidebar} />

        <div className="mb-6">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
            <Bell className="text-[#FF6044]" /> Notifications
          </h1>
          <p className="mt-1 text-gray-400">Click a reminder to jump to the matching job or referral.</p>
        </div>

        <div className="saas-card overflow-hidden">
          {data.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No notifications</div>
          ) : (
            data.map((notification) => {
              const key = notificationKey(notification);
              const isUnread = !clickedKeys.includes(key);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => openNotification(notification)}
                  className="flex w-full items-center gap-4 border-b border-white/5 p-4 text-left transition hover:bg-white/5 last:border-b-0"
                >
                  <span 
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6044] text-[#121313] shadow-lg transition-all ${
                      isUnread ? "border-beam-active shadow-[#FF6044]/20" : "opacity-80"
                    }`}
                  >
                    {notification.type === "referral" ? <Handshake size={20} /> : <Briefcase size={20} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block font-bold transition-colors ${isUnread ? "text-white" : "text-gray-400"}`}>
                      {notification.message}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">{notification.date}</span>
                  </span>
                  {isUnread && (
                    <span className="h-2 w-2 rounded-full bg-[#FF6044] shadow-[0_0_10px_#FF6044]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

function notificationKey(item) {
  return `${item.type}-${item.id}-${item.date}`;
}
