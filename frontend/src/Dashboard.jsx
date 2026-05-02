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

      <main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8 animate-fade-in-up">
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="hidden rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm sm:block">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Live analytics
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden saas-card">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-gray-100 to-transparent pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div className="z-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">HireTrack Analytics</p>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Dashboard</h1>
              <p className="mt-4 text-lg font-light text-gray-500 max-w-xl">
                Monitor your application pipeline, referral response rates, and daily follow-up pressure in one unified workspace.
              </p>

              {data && (
                <div className="mt-8 flex flex-wrap gap-4">
                  <HeroMetric label="Jobs Tracked" value={data.job_analytics?.stats?.total || 0} />
                  <HeroMetric label="Referrals" value={data.referral_analytics?.stats?.total || 0} />
                  <HeroMetric label="Reply Rate" value={`${data.referral_analytics?.stats?.response_rate || 0}%`} highlight />
                </div>
              )}
            </div>

            {/* 3D Illustration Side */}
            <div className="hidden lg:flex justify-end items-center relative perspective-1000">
               <img 
                 src="/dashboard_illustration.png" 
                 alt="Analytics 3D" 
                 className="w-full max-w-[350px] object-contain drop-shadow-xl animate-fade-in-up delay-200"
               />
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Activity This Week</p>
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
    <div className={`hover-3d min-w-32 rounded-xl border px-5 py-4 ${highlight ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
      <p className={`text-xs font-medium uppercase tracking-wider ${highlight ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <p className={`mt-1 text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
