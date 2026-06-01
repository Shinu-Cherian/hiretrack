import { useEffect, useState } from "react";
import { Bell, Briefcase, Handshake, Trash2, Settings2, CheckCircle2, Circle } from "lucide-react";
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
  
  // Manage Mode States
  const [isManageMode, setIsManageMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
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
        
        const allKeys = notificationsList.map(item => notificationKey(item));
        const newClicked = [...new Set([...currentClicked, ...allKeys])];
        localStorage.setItem("clicked_notifications", JSON.stringify(newClicked));
        window.dispatchEvent(new Event("notifications-read"));
      })
      .catch(() => setIsDemo(true));
  }, []);

  const openNotification = (notification) => {
    if (isManageMode) return; // Disable navigation in manage mode
    
    const key = notificationKey(notification);
    const saved = localStorage.getItem("clicked_notifications");
    let clicked = [];
    try {
      clicked = JSON.parse(saved || "[]");
    } catch {
      clicked = [];
    }
    const newClicked = [...new Set([...clicked, key])];
    localStorage.setItem("clicked_notifications", JSON.stringify(newClicked));
    setInitialClickedKeys((prev) => [...new Set([...prev, key])]);
    window.dispatchEvent(new Event("notifications-read"));

    const path = notification.type === "referral" ? "/referrals" : "/jobs";
    navigate(`${path}?highlight=${notification.id}`);
  };

  const toggleSelection = (e, notif) => {
    e.stopPropagation();
    const key = notificationKey(notif);
    const newSet = new Set(selected);
    if (newSet.has(key)) newSet.delete(key);
    else newSet.add(key);
    setSelected(newSet);
  };

  const toggleSelectAll = () => {
    if (selected.size === data.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map(n => notificationKey(n))));
    }
  };

  const confirmDelete = async () => {
    const job_ids = [];
    const referral_ids = [];

    data.forEach(n => {
      if (selected.has(notificationKey(n))) {
        if (n.type === "job") job_ids.push(n.id);
        if (n.type === "referral") referral_ids.push(n.id);
      }
    });

    const res = await fetch(apiUrl("/api/notifications/delete/"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_ids, referral_ids }),
    });

    if (res.ok) {
      setData(data.filter(n => !selected.has(notificationKey(n))));
      setSelected(new Set());
      setIsManageMode(false);
      setShowConfirmModal(false);
    } else {
      alert("Failed to delete notifications.");
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white">
      <Header />

      <main className="mx-auto max-w-[1600px] p-6 animate-fade-in-up pb-24">
        <BackButton className="mb-5" isMenu={fromSidebar} />

        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
              <Bell className="text-[#FF6044]" /> Notifications
            </h1>
            <p className="mt-1 text-gray-400">Click a reminder to jump to the matching job or referral.</p>
          </div>
          
          {!isDemo && data.length > 0 && (
            <button
              onClick={() => {
                setIsManageMode(!isManageMode);
                if (isManageMode) setSelected(new Set());
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                isManageMode ? "bg-white/10 text-white hover:bg-white/20" : "bg-[#FF6044] text-[#121313] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF6044]/20"
              }`}
            >
              {isManageMode ? "Cancel" : <><Settings2 size={16} /> Manage Alerts</>}
            </button>
          )}
        </div>

        {!isDemo && data.length > 0 && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
             <div className="saas-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <Bell className="text-white" size={20} />
                </div>
                <div>
                   <div className="text-2xl font-black text-white">{data.length}</div>
                   <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Alerts</div>
                </div>
             </div>
             <div className="saas-card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <Briefcase className="text-[#FF6044]" size={20} />
                </div>
                <div>
                   <div className="text-2xl font-black text-white">{data.filter(n => n.type !== "referral").length}</div>
                   <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Job Follow-ups</div>
                </div>
             </div>
             <div className="saas-card p-4 flex items-center gap-4 col-span-2 md:col-span-1">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                   <Handshake className="text-emerald-400" size={20} />
                </div>
                <div>
                   <div className="text-2xl font-black text-white">{data.filter(n => n.type === "referral").length}</div>
                   <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Referral Updates</div>
                </div>
             </div>
          </div>
        )}

        <div className="saas-card overflow-hidden transition-all duration-300 relative">
          {isManageMode && data.length > 0 && (
            <div className="p-4 border-b border-white/10 bg-[#121313]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
               <button 
                 onClick={toggleSelectAll} 
                 className="flex items-center gap-3 text-sm font-bold text-gray-300 hover:text-white transition"
               >
                 {selected.size === data.length ? (
                    <CheckCircle2 size={20} className="text-[#FF6044]" />
                 ) : (
                    <Circle size={20} className="text-gray-500" />
                 )}
                 {selected.size === data.length ? "Deselect All" : "Select All"}
               </button>
               <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                 {selected.size} Selected
               </div>
            </div>
          )}

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
            <div className="p-10 text-center text-gray-400">No alerts found</div>
          ) : (
            data.map((notification) => {
              const key = notificationKey(notification);
              const isUnread = !initialClickedKeys.includes(key);
              const isSelected = selected.has(key);

              return (
                <div
                  key={key}
                  onClick={(e) => isManageMode ? toggleSelection(e, notification) : openNotification(notification)}
                  className={`flex w-full items-center gap-4 border-b border-white/5 p-4 text-left transition duration-300 last:border-b-0 ${
                    isManageMode ? "cursor-pointer hover:bg-white/5" : "cursor-pointer hover:bg-white/5"
                  } ${isSelected ? "bg-[#FF6044]/5" : ""}`}
                >
                  <div className="flex-1 flex items-center gap-4 min-w-0 pointer-events-none">
                    {isUnread ? (
                      <div className="relative h-12 w-12 shrink-0 rounded-xl p-[1.5px] overflow-hidden shadow-lg shadow-[#FF6044]/15 bg-[#FF6044]/20">
                        <div className="absolute inset-[-200%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_70%,#FF6044_95%,#FF6044_100%)]" />
                        <div className="relative h-full w-full rounded-[10px] bg-[#18110f] flex items-center justify-center text-[#FF6044]">
                          {notification.type === "referral" ? <Handshake size={20} /> : <Briefcase size={20} />}
                        </div>
                      </div>
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-gray-500 opacity-70">
                        {notification.type === "referral" ? <Handshake size={20} /> : <Briefcase size={20} />}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={`block font-bold transition-colors truncate pr-4 ${isUnread ? "text-white" : "text-gray-400"}`}>
                        {notification.message}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">{notification.date}</span>
                    </span>
                  </div>

                  {isManageMode ? (
                     <div className="shrink-0 flex items-center justify-center pl-2">
                       {isSelected ? (
                         <CheckCircle2 size={24} className="text-[#FF6044]" />
                       ) : (
                         <Circle size={24} className="text-gray-600 hover:text-gray-400 transition" />
                       )}
                     </div>
                  ) : (
                    isUnread && <span className="shrink-0 h-2 w-2 rounded-full bg-[#FF6044] shadow-[0_0_10px_#FF6044] mr-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {isManageMode && selected.size > 0 && (
         <div className="fixed bottom-8 left-0 w-full flex justify-center z-50 pointer-events-none">
            <button 
               onClick={() => setShowConfirmModal(true)}
               className="pointer-events-auto animate-fade-in-up flex items-center gap-2 px-6 py-3 bg-[#FF6044] text-[#121313] rounded-full font-black uppercase tracking-widest text-xs brutalist-shadow hover:-translate-y-1 transition-all duration-300"
            >
               <Trash2 size={16} />
               Delete ({selected.size}) Alerts
            </button>
         </div>
      )}

      {showConfirmModal && (
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-[#121313] border border-white/10 p-12 max-w-md w-full text-center space-y-6 brutalist-shadow relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6044]/5 -skew-x-12 translate-x-16 -translate-y-16 pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-[#FF6044]/10 text-[#FF6044] rounded-none mx-auto flex items-center justify-center border border-[#FF6044]/20">
              <Trash2 size={32} />
            </div>

            <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white">Confirm Deletion</h3>

            <p className="text-gray-400 font-light lowercase tracking-tight italic text-lg leading-relaxed">
              "are you sure you want to delete {selected.size} selected {selected.size === 1 ? 'alert' : 'alerts'}? this action is permanent. ⚠️"
            </p>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3.5 border border-white/20 hover:bg-white/10 transition-all font-display uppercase tracking-widest text-sm font-bold text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-3.5 bg-[#FF6044] text-[#121313] hover:bg-white hover:text-black transition-all font-display uppercase tracking-widest text-sm font-black"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthActionModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="Notification Sync Locked"
        message="Real-time alerts for your applications and network are private to each account. Sign in to sync your notifications."
      />
    </div>
  );
}

function notificationKey(item) {
  return `${item.type}-${item.id}-${item.date}`;
}
