import { useEffect, useState } from "react";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import JobDashboard from "./components/JobDashboard";
import ReferralDashboard from "./components/ReferralDashboard";
import StatsCard from "./components/StatsCard";
import { Briefcase, Users } from "lucide-react";
import AuthActionModal from "./components/AuthActionModal";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/api/dashboard/"), { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          setIsDemo(true);
          return null;
        }
        if (!res.ok) throw new Error("Could not load dashboard analytics.");
        return res.json();
      })
      .then((payload) => setData(payload))
      .catch((err) => {
        setIsDemo(true);
        setData(null);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1600px] space-y-6 px-6 py-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <BackButton label="Back" />
          <div className="hidden rounded-full border border-white/10 bg-transparent px-4 py-1.5 text-sm font-medium text-gray-400 shadow-sm sm:block">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Live analytics
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121313] p-1 shadow-2xl">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#FF6044]/10 to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-8 items-center p-6 md:p-8">
            <div className="z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6044] mb-2 drop-shadow-[0_0_10px_rgba(255,96,68,0.5)]">HireTrack Intelligence</p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Dashboard</h1>
              <p className="mt-2 text-base font-light text-gray-400 max-w-lg leading-relaxed">
                {isDemo 
                  ? "A unified preview of the application pipeline. Sign in to sync your personal metrics and networking momentum."
                  : "A unified view of your application pipeline and networking momentum."
                }
              </p>

              {data && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <HeroMetric label="Jobs Tracked" value={data.job_analytics?.stats?.total || 0} />
                  <HeroMetric label="Referrals" value={data.referral_analytics?.stats?.total || 0} />
                  <HeroMetric label="Reply Rate" value={`${data.referral_analytics?.stats?.response_rate || 0}%`} highlight />
                </div>
              )}
            </div>

            {/* 3D Illustration Side */}
            <div className="hidden lg:flex justify-end items-center relative perspective-1000">
               <Dashboard3DHero />
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 font-medium">
            {error}
          </div>
        )}

        {!data && !error && !isDemo && (
          <div className="rounded-2xl border border-white/5 bg-[#121313] p-12 text-center text-gray-400 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-white/5 border-t-[#FF6044] rounded-full animate-spin"></div>
            <p>Aggregating analytics data...</p>
          </div>
        )}

        {isDemo && !data && (
          <div className="rounded-2xl border border-white/5 bg-[#121313] p-16 text-center shadow-2xl flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <Briefcase className="text-[#FF6044]" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-3">Connect Your Workspace</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Real-time analytics, interview tracking, and referral momentum stats are private to each account. Sign in to start your journey.
            </p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-10 py-4 bg-[#FF6044] text-[#121313] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#ff4d2e] transition-all hover:-translate-y-1"
            >
              Start Your Analytics
            </button>
          </div>
        )}

        {data && (
          <div className="space-y-8 animate-fade-in-up delay-100">
            <section>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#FF6044]">Recent Activity</p>
              <div className="grid gap-4 md:grid-cols-2">
                <StatsCard
                  title="Total Applications"
                  value={data.weekly?.applications || 0}
                  helper="Last 7 days"
                  icon={<Briefcase />}
                  tone="blue"
                />
                <StatsCard
                  title="Total Referrals"
                  value={data.weekly?.referrals || 0}
                  helper="Last 7 days"
                  icon={<Users />}
                  tone="green"
                />
              </div>
            </section>

            <JobDashboard data={data.job_analytics} />
            <ReferralDashboard data={data.referral_analytics} />
          </div>
        )}
      </main>

      <AuthActionModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="Secure Data Only"
        message="Analytics syncing and historical tracking are locked to secure accounts. Sign in to start your journey."
      />
    </div>
  );
}

function HeroMetric({ label, value, highlight = false }) {
  return (
    <div className={`hover-3d min-w-[120px] rounded-xl border px-4 py-3 transition-all ${highlight ? 'bg-[#FF6044] border-[#FF6044] text-white shadow-lg shadow-[#FF6044]/20' : 'bg-transparent border-white/5 shadow-sm'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? 'text-white/80' : 'text-gray-400'}`}>{label}</p>
      <p className={`mt-0.5 text-2xl font-black ${highlight ? 'text-white' : 'text-[#FF6044]'}`}>{value}</p>
    </div>
  );
}

function Dashboard3DHero() {
  return (
    <div className="isometric-container w-full max-w-[320px] opacity-90">
      <div className="bg-transparent rounded-xl border border-white/5 p-4 isometric-card w-full h-[220px] flex flex-col shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded bg-[#FF6044]"></div>
             <div className="text-[10px] font-bold text-white uppercase tracking-tighter">Live Monitor</div>
          </div>
          <div className="w-12 h-1.5 bg-white/5 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#FF6044]/10 rounded-lg p-2">
            <div className="w-full h-1 bg-[#FF6044]/20 rounded-full mb-1"></div>
            <div className="w-2/3 h-1 bg-[#FF6044]/10 rounded-full"></div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="w-full h-1 bg-white/10 rounded-full mb-1"></div>
            <div className="w-2/3 h-1 bg-white/5 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 bg-[#121313] rounded-lg flex items-end p-2 gap-1.5">
           {[30, 60, 45, 90, 65, 40, 75].map((h, i) => (
             <div key={i} className="flex-1 bg-white/10 rounded-t-sm" style={{ height: `${h}%` }} />
           ))}
        </div>
      </div>

      <div className="absolute -right-6 top-10 w-32 bg-gray-900 rounded-xl p-3 isometric-card-layer-1 shadow-2xl">
        <div className="w-full h-1 bg-gray-700 rounded-full mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="text-[10px] font-bold text-white tracking-widest uppercase">Syncing</div>
        </div>
      </div>

      <div className="absolute -left-6 bottom-10 w-28 bg-transparent border border-white/5 rounded-xl p-3 isometric-card-layer-2 shadow-xl flex flex-col gap-1.5">
         <div className="w-full h-1 bg-white/5 rounded-full"></div>
         <div className="w-4/5 h-1 bg-white/5 rounded-full"></div>
         <div className="w-1/2 h-1 bg-[#FF6044] rounded-full mt-1"></div>
      </div>
    </div>
  );
}
