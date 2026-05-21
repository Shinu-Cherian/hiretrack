import { useEffect, useState } from "react";
import { Bell, Briefcase, Handshake } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";
import AuthActionModal from "./components/AuthActionModal";

export default function NotificationsPage() {
  const [data, setData] = useState([]);
  const [initialClickedKeys, setInitialClickedKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSidebar = location.state?.fromSidebar || false;
  const [isDemo, setIsDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Load clicked notifications from localStorage at the start of the page session
    const saved = localStorage.getItem("clicked_notifications");
    let currentClicked = [];
    if (saved) {
      try {
        currentClicked = JSON.parse(saved);
      } catch (e) {
        currentClicked = [];
      }
    }
    setInitialClickedKeys(currentClicked);

    // Check auth
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      setIsDemo(true);
      return;
    }

    fetch(apiUrl("/api/notifications/"), { credentials: "include" })
      .then((res) => res.json())
      .then((items) => {
        const notificationsList = Array.isArray(items) ? items : [];
        setData(notificationsList);
        
        // Automatically mark all loaded notifications as clicked/read in localStorage
        const allKeys = notificationsList.map(item => notificationKey(item));
        const newClicked = [...new Set([...currentClicked, ...allKeys])];
        localStorage.setItem("clicked_notifications", JSON.stringify(newClicked));
        
        // Dispatch notifications-read event so Header updates immediately
        window.dispatchEvent(new Event("notifications-read"));
      })
      .catch(() => setIsDemo(true));
  }, []);

  const openNotification = (notification) => {
    const key = notificationKey(notification);
    
    // Mark as clicked locally
    const saved = localStorage.getItem("clicked_notifications");
    let clicked = [];
    try {
      clicked = JSON.parse(saved || "[]");
    } catch {
      clicked = [];
    }
    const newClicked = [...new Set([...clicked, key])];
    localStorage.setItem("clicked_notifications", JSON.stringify(newClicked));
    
    // Visually turn off its unread state instantly in the UI
    setInitialClickedKeys((prev) => [...new Set([...prev, key])]);
    
    // Dispatch event
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
          {isDemo ? (
            <div className="p-16 text-center flex flex-col items-center max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <Bell className="text-[#FF6044]" size={32} />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Stay Alerted</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Notifications keep you on top of application follow-ups, interview reminders, and referral updates. Sign in to start receiving your alerts.
              </p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-10 py-4 bg-[#FF6044] text-[#121313] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#ff4d2e] transition-all hover:-translate-y-1"
              >
                Enable Notifications
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No notifications</div>
          ) : (
            data.map((notification) => {
              const key = notificationKey(notification);
              const isUnread = !initialClickedKeys.includes(key);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => openNotification(notification)}
                  className="flex w-full items-center gap-4 border-b border-white/5 p-4 text-left transition hover:bg-white/5 last:border-b-0"
                >
                  <span 
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isUnread 
                        ? "bg-[#1f1513] text-[#FF6044] border-beam-active shadow-lg shadow-[#FF6044]/15 border border-[#FF6044]/30" 
                        : "bg-white/5 border border-white/5 text-gray-500 opacity-70"
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

        <AuthActionModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          title="Notification Sync Locked"
          message="Real-time alerts for your applications and network are private to each account. Sign in to sync your notifications."
        />
      </main>
    </div>
  );
}

function notificationKey(item) {
  return `${item.type}-${item.id}-${item.date}`;
}
