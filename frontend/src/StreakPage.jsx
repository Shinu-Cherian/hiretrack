import { useEffect, useState } from "react";
import { Award, Flame, Info, ArrowRight } from "lucide-react";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import BadgePopup from "./components/BadgePopup";
import Heatmap from "./components/Heatmap";
import Modal from "./components/Modal";

const BADGE_PREVIEW = [
  { days: 30, detail: "Stay active for 30 continuous days." },
  { days: 50, detail: "Continue your streak for 50 continuous days." },
  { days: 100, detail: "Reach a 100-day consistency milestone." },
];

export default function StreakPage() {
  const [data, setData] = useState(null);
  const [popupBadge, setPopupBadge] = useState(null);
  const [badgeInfo, setBadgeInfo] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/streaks/"), { credentials: "include" })
      .then((res) => res.json())
      .then((payload) => setData(payload));
  }, []);

  useEffect(() => {
    if (!data) return;
    const latest = [...(data.jobs?.badges || []), ...(data.referrals?.badges || [])].sort((a, b) => a - b).at(-1);
    if (!latest) return;
    const key = `streak_badge_seen_${latest}`;
    if (!localStorage.getItem(key)) {
      const timer = window.setTimeout(() => setPopupBadge(latest), 100);
      localStorage.setItem(key, "true");
      return () => window.clearTimeout(timer);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans pb-12">
      <Header />
      <BadgePopup badge={popupBadge} onClose={() => setPopupBadge(null)} />

      <main className="mx-auto max-w-[1600px] space-y-8 p-6 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            Real-time consistency tracking
          </div>
        </div>

        <section className="saas-card bg-white p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-50/50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">HireTrack Performance</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight">Consistency dashboard</h1>
            <p className="mt-3 text-lg text-gray-500 font-light max-w-2xl">
              Success is the sum of small efforts repeated day in and day out. Monitor your daily momentum and keep the flame alive.
            </p>
          </div>
        </section>

        {!data ? (
          <div className="saas-card p-20 text-center text-gray-500 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="font-medium">Syncing your momentum data...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <StreakSection
              title="Job Applications"
              label="Application Streak"
              count={data.jobs?.streak || 0}
              heatmapTitle="Application Activity"
              heatmap={data.jobs?.heatmap || []}
              badges={data.jobs?.badges || []}
              onExplore={() => setBadgeInfo("job")}
              color="orange"
            />

            <StreakSection
              title="Network Referrals"
              label="Referral Streak"
              count={data.referrals?.streak || 0}
              heatmapTitle="Referral Activity"
              heatmap={data.referrals?.heatmap || []}
              badges={data.referrals?.badges || []}
              onExplore={() => setBadgeInfo("referral")}
              color="blue"
            />
          </div>
        )}
      </main>

      {badgeInfo && (
        <Modal title="Badge milestones" onClose={() => setBadgeInfo(null)} maxWidth="max-w-xl">
          <div className="grid gap-3 p-2">
            <p className="text-sm text-gray-500 mb-2">Maintain consistency to unlock these exclusive badges.</p>
            {BADGE_PREVIEW.map((badge) => (
              <div key={badge.days} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-all hover:shadow-md">
                <div className="w-12 h-12 rounded-full bg-white shadow-inner flex items-center justify-center border border-gray-200">
                  <Flame size={24} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-950">{badge.days}-day milestone</p>
                  <p className="text-sm text-gray-600 font-light">{badge.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function StreakSection({ title, label, count, heatmapTitle, heatmap, badges, onExplore, color }) {
  const isOrange = color === "orange";
  const bgClass = isOrange ? "bg-orange-50" : "bg-blue-50";
  const textClass = isOrange ? "text-orange-700" : "text-blue-700";
  const accentClass = isOrange ? "text-orange-600" : "text-blue-600";
  const borderClass = isOrange ? "border-orange-100" : "border-blue-100";

  return (
    <section className="space-y-6">
      <div className="saas-card overflow-hidden group">
        <div className={`h-2 w-full ${isOrange ? 'bg-orange-500' : 'bg-blue-500'}`} />
        <div className="p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${accentClass}`}>{title}</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-950 tracking-tight">{label}</h2>
              <p className="text-sm text-gray-500 mt-1">Consistency is key to results.</p>
            </div>
            
            <div className={`flex items-center gap-5 rounded-2xl ${bgClass} px-8 py-6 ${textClass} border ${borderClass} transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-lg`}>
              <Flame size={48} className={count > 0 ? "animate-pulse" : "opacity-30"} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Current streak</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-5xl font-black">{count}</p>
                  <p className="text-sm font-bold uppercase">Days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 font-bold text-gray-950 text-sm uppercase tracking-wider">
                <Award size={18} className={accentClass} /> 
                Achievements
              </h3>
              {badges.length > 0 && <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">{badges.length} Unlocked</span>}
            </div>
            
            {badges.length ? (
              <div className="flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <div key={badge} className={`group/badge relative flex items-center gap-2 rounded-xl ${bgClass} border ${borderClass} px-4 py-2 text-sm font-bold ${textClass} hover:shadow-md transition-all`}>
                    <Flame size={14} />
                    {badge} Days
                  </div>
                ))}
              </div>
            ) : (
              <button 
                onClick={onExplore} 
                className="w-full flex items-center justify-between rounded-xl border border-dashed border-gray-200 p-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all group/btn"
              >
                <div className="flex items-center gap-3">
                  <Info size={18} className="opacity-50" />
                  <span>Explore milestones & badges</span>
                </div>
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="saas-card overflow-hidden">
        <Heatmap title={heatmapTitle} data={heatmap} noun="submissions" />
      </div>
    </section>
  );
}


