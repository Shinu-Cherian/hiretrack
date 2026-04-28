import { useEffect, useState } from "react";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import JobDashboard from "./components/JobDashboard";
import ReferralDashboard from "./components/ReferralDashboard";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Header />

      <main className="mx-auto max-w-7xl space-y-8 p-6 animate-fade-in-up">
        <BackButton />

        <section className="rounded-xl bg-gray-950 p-6 text-white shadow-xl md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">HireTrack Analytics</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Production dashboard</h1>
          <p className="mt-3 max-w-3xl text-gray-300">
            Track application health, referral response quality, channel performance, and follow-up pressure using live data from your Django API.
          </p>
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
          <>
            <JobDashboard data={data.job_analytics} />
            <ReferralDashboard data={data.referral_analytics} />
          </>
        )}
      </main>
    </div>
  );
}
