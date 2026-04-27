import { Briefcase, CheckCircle, Clock, Target, TrendingUp, Users, XCircle } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useEffect } from "react";
import Header from "./Header";
import { apiUrl } from "./api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/dashboard/"), {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-8 text-center">Loading dashboard...</div>
      </div>
    );
  }

  const jobStatus = [
    { name: "Applied", value: data.job_status?.applied || 0, color: "#3b82f6" },
    { name: "Pending", value: data.job_status?.pending || 0, color: "#f59e0b" },
    { name: "Rejected", value: data.job_status?.rejected || 0, color: "#ef4444" },
    { name: "Selected", value: data.job_status?.selected || 0, color: "#10b981" },
  ];

  const referralStatus = [
    { name: "Pending", value: data.referral_status?.pending || 0, color: "#f59e0b" },
    { name: "Replied", value: data.referral_status?.replied || 0, color: "#10b981" },
    { name: "No Response", value: data.referral_status?.no_response || 0, color: "#ef4444" },
  ];

  const progress = data.applications_over_time?.length
    ? data.applications_over_time
    : [{ date: "No activity", count: 0 }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Header />

      <main className="max-w-7xl mx-auto p-6 animate-fade-in-up">
        <section className="relative overflow-hidden rounded-2xl bg-gray-950 text-white p-6 md:p-8 shadow-xl">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,#3b82f6,transparent_35%),radial-gradient(circle_at_bottom_left,#10b981,transparent_30%)]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
            <div className="lg:col-span-2">
              <p className="text-blue-200 text-sm uppercase tracking-wider">HireTrack Command Center</p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">Your job search at a glance</h1>
              <p className="text-gray-300 mt-3 max-w-2xl">
                Monitor applications, referral momentum, follow-up pressure, and conversion signals from one focused workspace.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MiniMetric label="Success" value={`${data.success_rate}%`} />
              <MiniMetric label="Reply Rate" value={`${data.reply_rate}%`} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
          <Metric title="Total Jobs" value={data.total_jobs} icon={<Briefcase />} tone="blue" />
          <Metric title="Pending Jobs" value={data.pending_jobs} icon={<Clock />} tone="amber" />
          <Metric title="Selected" value={data.selected_jobs} icon={<CheckCircle />} tone="green" />
          <Metric title="Referrals" value={data.total_referrals} icon={<Users />} tone="violet" />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <ChartPanel title="Applications Over Time" subtitle="Daily application volume" wide>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#2563eb" fill="#bfdbfe" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Job Pipeline" subtitle="Status distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={jobStatus} dataKey="value" innerRadius={62} outerRadius={100} paddingAngle={4}>
                  {jobStatus.map((item) => <Cell key={item.name} fill={item.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartPanel>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-8">
          <ChartPanel title="Referral Health" subtitle="Response quality">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={referralStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {referralStatus.map((item) => <Cell key={item.name} fill={item.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <InsightCard
            icon={<Target />}
            title="Focus Area"
            text={data.pending_jobs > 5 ? "You have many pending applications. Prioritize follow-ups today." : "Your pending queue is manageable. Keep adding high-quality applications."}
          />
          <InsightCard
            icon={<TrendingUp />}
            title="Momentum"
            text={data.reply_rate > 30 ? "Referral replies are trending well. Keep using messages that worked." : "Referral replies are low. Try shorter, more specific outreach."}
          />
        </section>
      </main>
    </div>
  );
}

function Metric({ title, value, icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="bg-white/85 rounded-2xl shadow p-5 hover:-translate-y-1 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>
        <div className={`p-3 rounded-2xl ${tones[tone]}`}>{icon}</div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <p className="text-sm text-gray-300">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, wide = false }) {
  return (
    <div className={`bg-white/85 rounded-2xl shadow p-6 ${wide ? "xl:col-span-2" : ""}`}>
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function InsightCard({ icon, title, text }) {
  return (
    <div className="bg-white/85 rounded-2xl shadow p-6">
      <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-500 mt-2">{text}</p>
    </div>
  );
}
