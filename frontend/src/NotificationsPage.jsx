import { useEffect, useState } from "react";
import { Bell, Briefcase, Handshake } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";

export default function NotificationsPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSidebar = location.state?.fromSidebar || false;

  useEffect(() => {
    fetch(apiUrl("/api/notifications/"), { credentials: "include" })
      .then((res) => res.json())
      .then((items) => {
        const list = Array.isArray(items) ? items : [];
        setData(list);
        const keys = list.map(notificationKey);
        localStorage.setItem("read_notifications", JSON.stringify(keys));
        window.dispatchEvent(new Event("notifications-read"));
      });
  }, []);

  const openNotification = (notification) => {
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
            data.map((notification) => (
              <button
                key={`${notification.type}-${notification.id}`}
                type="button"
                onClick={() => openNotification(notification)}
                className="flex w-full items-center gap-4 border-b border-white/5 p-4 text-left transition hover:bg-white/5 last:border-b-0"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FF6044] text-[#121313]">
                  {notification.type === "referral" ? <Handshake size={19} /> : <Briefcase size={19} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-white">{notification.message}</span>
                  <span className="block text-sm text-gray-400">{notification.date}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function notificationKey(item) {
  return `${item.type}-${item.id}-${item.date}`;
}
