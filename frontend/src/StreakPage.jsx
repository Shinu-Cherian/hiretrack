import { useEffect, useState } from "react";
import { Award, Flame, Info } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans">
      <Header />
      <BadgePopup badge={popupBadge} onClose={() => setPopupBadge(null)} />

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <BackButton />
        <section className="saas-card bg-white p-6 shadow-sm border border-gray-200">
          <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">HireTrack Streaks</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Consistency dashboard</h1>
          <p className="mt-2 text-gray-500">Track daily momentum for applications and referrals.</p>
        </section>

        {!data ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">Loading streaks...</div>
        ) : (
          <>
            <StreakSection
              title="Job Section"
              label="Current job streak"
              count={data.jobs?.streak || 0}
              heatmapTitle="Job submissions"
              heatmap={data.jobs?.heatmap || []}
              badges={data.jobs?.badges || []}
              onExplore={() => setBadgeInfo("job")}
            />

            <StreakSection
              title="Referral Section"
              label="Current referral streak"
              count={data.referrals?.streak || 0}
              heatmapTitle="Referral submissions"
              heatmap={data.referrals?.heatmap || []}
              badges={data.referrals?.badges || []}
              onExplore={() => setBadgeInfo("referral")}
            />
          </>
        )}
      </main>

      {badgeInfo && (
        <Modal title="Badge milestones" onClose={() => setBadgeInfo(null)} maxWidth="max-w-xl">
          <div className="grid gap-3">
            {BADGE_PREVIEW.map((badge) => (
              <div key={badge.days} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold text-gray-950">{badge.days}-day badge</p>
                <p className="mt-1 text-sm text-gray-600">{badge.detail}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function StreakSection({ title, label, count, heatmapTitle, heatmap, badges, onExplore }) {
  return (
    <section className="space-y-4">
      <div className="saas-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">{title}</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950">{label}</h2>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-orange-50 px-6 py-4 text-orange-700">
            <Flame size={42} />
            <div>
              <p className="text-sm font-semibold">Current streak</p>
              <p className="text-4xl font-bold">{count}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-2 font-semibold text-gray-950"><Award size={18} /> Badges</h3>
          {badges.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">{badge}-day badge</span>
              ))}
            </div>
          ) : (
            <button onClick={onExplore} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700">
              <Info size={16} /> No badges till now. Click to explore badges.
            </button>
          )}
        </div>
      </div>

      <Heatmap title={heatmapTitle} data={heatmap} noun="submissions" />
    </section>
  );
}
