import { useEffect, useState } from "react";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import JobDashboard from "./components/JobDashboard";
import ReferralDashboard from "./components/ReferralDashboard";
import StatsCard from "./components/StatsCard";
import { Briefcase, Users } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/dashboard/"), { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load dashboard analytics.");
        return res.json();
      })
      .then((payload) => setData(payload))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern">
      <Header />

      <main className="mx-auto w-full max-w-[1600px] space-y-6 px-6 py-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <BackButton label="Back" />
          <div className="hidden rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm sm:block">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Live analytics
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden saas-card">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-orange-50/20 to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-8 items-center p-6 md:p-8">
            <div className="z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-2">HireTrack Intelligence</p>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Dashboard</h1>
              <p className="mt-2 text-base font-light text-gray-500 max-w-lg leading-relaxed">
                A unified view of your application pipeline and networking momentum.
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
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 font-medium">
            {error}
          </div>
        )}

        {!data && !error && (
          <div className="saas-card p-12 text-center text-gray-500 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
            <p>Aggregating analytics data...</p>
          </div>
        )}

        {data && (
          <div className="space-y-8 animate-fade-in-up delay-100">
            <section>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Recent Activity</p>
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
    </div>
  );
}

function HeroMetric({ label, value, highlight = false }) {
  return (
    <div className={`hover-3d min-w-[120px] rounded-xl border px-4 py-3 transition-all ${highlight ? 'bg-gray-950 border-gray-900 text-white shadow-lg' : 'bg-white border-gray-100 shadow-sm'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${highlight ? 'text-gray-400' : 'text-gray-400'}`}>{label}</p>
      <p className={`mt-0.5 text-2xl font-black ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function Dashboard3DHero() {
  return (
    <div className="isometric-container w-full max-w-[320px] opacity-90">
      <div className="bg-white rounded-xl border border-gray-100 p-4 isometric-card w-full h-[220px] flex flex-col shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded bg-blue-600"></div>
             <div className="text-[10px] font-bold text-gray-800 uppercase tracking-tighter">Live Monitor</div>
          </div>
          <div className="w-12 h-1.5 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="w-full h-1 bg-blue-200 rounded-full mb-1"></div>
            <div className="w-2/3 h-1 bg-blue-100 rounded-full"></div>
          </div>
          <div className="bg-orange-50 rounded-lg p-2">
            <div className="w-full h-1 bg-orange-200 rounded-full mb-1"></div>
            <div className="w-2/3 h-1 bg-orange-100 rounded-full"></div>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 rounded-lg flex items-end p-2 gap-1.5">
           {[30, 60, 45, 90, 65, 40, 75].map((h, i) => (
             <div key={i} className="flex-1 bg-gray-200 rounded-t-sm" style={{ height: `${h}%` }} />
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

      <div className="absolute -left-6 bottom-10 w-28 bg-white border border-gray-100 rounded-xl p-3 isometric-card-layer-2 shadow-xl flex flex-col gap-1.5">
         <div className="w-full h-1 bg-gray-100 rounded-full"></div>
         <div className="w-4/5 h-1 bg-gray-100 rounded-full"></div>
         <div className="w-1/2 h-1 bg-blue-500 rounded-full mt-1"></div>
      </div>
    </div>
  );
}
