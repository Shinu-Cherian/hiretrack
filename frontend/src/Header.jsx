import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, Briefcase, Flame, PlusCircle, Kanban, UserPlus, 
  Users, ClipboardCheck, FileEdit, Route, LayoutGrid, 
  Menu, X, LayoutDashboard 
} from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { apiUrl, getAuthStatus } from "./api";
import Avatar from "./components/Avatar";
import HireTrackLogo from "./components/HireTrackLogo";
import AuthActionModal from "./components/AuthActionModal";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(() => {
    const username = localStorage.getItem("username");
    const profile_pic = localStorage.getItem("profile_pic");
    return username ? { authenticated: true, username, profile_pic } : null;
  });
  const [notifications, setNotifications] = useState([]);
  const [readVersion, setReadVersion] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    let alive = true;
    getAuthStatus()
      .then((status) => {
        if (!alive) return;
        setIsLoggedIn(Boolean(status?.authenticated));
        setProfile(status?.authenticated ? status : null);
      })
      .catch(() => {
        if (!alive) return;
        setIsLoggedIn(false);
        setProfile(null);
      });
    return () => { alive = false; };
  }, []);

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
    
    // Hide header on scroll logic
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("notifications-read", refresh);
      window.removeEventListener("open-sidebar", openSidebar);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const profilePic = profile?.profile_pic || localStorage.getItem("profile_pic");
  const username = profile?.username || localStorage.getItem("username") || "User";
  const hasUnread = notifications.some((item) => !readNotificationKeys().has(notificationKey(item))) && readVersion >= 0;

  const scrollHomeToTop = (event) => {
    if (location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navItems = [
    { title: 'Add Job', to: '/add-job', icon: <PlusCircle size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'Job Pipeline', to: '/jobs', icon: <Kanban size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'Add Referral', to: '/add-referral', icon: <UserPlus size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'View Referrals', to: '/referrals', icon: <Users size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'ATS Analyzer', to: '/resume-analyzer', icon: <ClipboardCheck size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'Cover Letter', to: '/cover-letter', icon: <FileEdit size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'Career Roadmap', to: '/career-roadmap', icon: <Route size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'Live Workspace', to: '/dashboard', icon: <LayoutGrid size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'Streaks', to: '/streaks', icon: <Flame size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> },
    { title: 'Notifications', to: '/notifications', icon: <Bell size={22} className="text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,96,68,0.8)]" /> }
  ];

  const handleNavItemClick = (item, e) => {
    if (item.requiresAuth && !isLoggedIn) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-white/5 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link
          to="/"
          onClick={scrollHomeToTop}
          className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white group shrink-0"
        >
          <HireTrackLogo 
            className="text-[#FF6044] transition-transform group-hover:scale-110 group-hover:rotate-3" 
            size={24} 
          /> 
          <span className="hidden sm:inline text-white font-display">
            Hire
            <span className="text-white/60 font-light ml-0.5">Track</span>
          </span>
        </Link>
        
        {/* Feature Icons Dock */}
        <div className="hidden md:flex flex-1 items-center justify-start lg:justify-center overflow-visible mx-4 lg:mx-8">
          <div className="flex items-center gap-4 lg:gap-6 shrink-0 px-2 py-1 overflow-visible">
            {navItems.map((item, idx) => (
              <Link 
                key={idx} 
                to={item.to} 
                className="relative group cursor-pointer p-1 transition-colors shrink-0"
              >
                {item.icon}
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-5 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-[-5px] transition-all duration-200 pointer-events-none bg-[#080909] border border-primary/70 text-primary text-sm px-5 py-2 rounded-xl whitespace-nowrap z-[9999] font-display uppercase tracking-[0.14em] font-bold">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {isLoggedIn ? (
            <Avatar 
              src={profilePic} 
              username={username} 
              size="sm" 
              onClick={() => setSidebarOpen(true)} 
              className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all shadow-[0_0_15px_rgba(255,96,68,0.3)]" 
            />
          ) : (
            <>
              <Link to="/login" className="hidden md:block font-display text-lg text-white lowercase tracking-widest hover:text-primary">Log In</Link>
              <Link to="/signup" className="bg-primary text-surface font-display font-bold px-4 py-2 text-sm md:px-6 md:text-base uppercase tracking-tight hover:bg-white transition-all transform hover:scale-105 brutalist-shadow">
                Sign Up
              </Link>
            </>
          )}
          <button className="md:hidden text-white ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed top-[68px] left-0 right-0 z-40 border-b border-white/10 bg-surface/95 px-6 py-5 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 font-display text-lg uppercase tracking-widest">
            {isLoggedIn ? (
              <>
                <div 
                  className="flex items-center gap-3 cursor-pointer group pb-4 border-b border-white/5"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setSidebarOpen(true);
                  }}
                >
                  <Avatar 
                    src={profilePic} 
                    username={username} 
                    size="sm" 
                  />
                  <span className="text-primary font-bold group-hover:text-white transition-colors">Workspace</span>
                </div>
                  <Link 
                    key={idx} 
                    to={item.to} 
                    className="flex items-center gap-4 text-white/60 hover:text-primary transition-colors py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="opacity-70 scale-90">{item.icon}</span>
                    <span className="text-sm">{item.title}</span>
                  </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                <Link to="/signup" className="text-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                <div className="h-px bg-white/5 my-2" />
                <Link to="/manifesto" className="text-sm text-white/40 hover:text-white" onClick={() => setIsMenuOpen(false)}>The Manifesto</Link>
                <Link to="/roadmap" className="text-sm text-white/40 hover:text-white" onClick={() => setIsMenuOpen(false)}>Roadmap</Link>
              </>
            )}
          </div>
        </div>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        profile={profile}
      />
      
      {/* Spacer to prevent content overlap */}
      <div className="h-[68px] md:h-[76px]" />

      <AuthActionModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="Command Restricted"
        message="Creating entries in the Career Engine requires an active session. Please log in to your secure workspace."
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

