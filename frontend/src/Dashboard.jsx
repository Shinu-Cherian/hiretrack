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
    <div className="min-h-screen bg-[#f5f7fb]">
      <Header />

      <main className="w-full space-y-5 px-4 py-5 animate-fade-in-up sm:px-6 lg:px-8 2xl:px-10">
        <div className="flex items-center justify-between">
          <BackButton />
          <div className="hidden rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-500 shadow-sm sm:block">
            Live analytics
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-900 bg-gray-950 px-5 py-5 text-white shadow-lg md:px-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">HireTrack Analytics</p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">Dashboard</h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-300">
                Application health, referral response quality, channels, companies, and follow-up pressure from live Django API data.
              </p>
            </div>
            {data && (
              <div className="grid grid-cols-3 gap-2 text-right">
                <HeroMetric label="Jobs" value={data.job_analytics?.stats?.total || 0} />
                <HeroMetric label="Referrals" value={data.referral_analytics?.stats?.total || 0} />
                <HeroMetric label="Reply" value={`${data.referral_analytics?.stats?.response_rate || 0}%`} />
              </div>
            )}
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!data && !error && (
          <div className="rounded-xl border border-gray-200 bg-white/90 p-10 text-center text-gray-500 shadow-sm">
            Loading analytics...
          </div>
        )}

        {data && (
          <div className="space-y-5">
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">This Week</p>
              <div className="grid gap-3 md:grid-cols-2">
                <StatsCard title="Total Applications" value={data.weekly?.applications || 0} helper="Last 7 days" icon={<Briefcase />} tone="blue" />
                <StatsCard title="Total Referrals" value={data.weekly?.referrals || 0} helper="Last 7 days" icon={<Users />} tone="green" />
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

function HeroMetric({ label, value }) {
  return (
    <div className="min-w-24 rounded-lg border border-white/10 bg-white/10 px-4 py-3">
      <p className="text-xs text-gray-300">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
