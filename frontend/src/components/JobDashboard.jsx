import { Briefcase, CheckCircle, Clock, Percent, Send, ShieldX } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";
import StatsCard from "./StatsCard";

const STATUS_COLORS = {
  applied: "#2563eb",
  pending: "#f59e0b",
  rejected: "#ef4444",
  selected: "#10b981",
};

export default function JobDashboard({ data }) {
  const stats = data?.stats || {};
  const statusData = toStatusData(stats.status_counts, ["applied", "pending", "rejected", "selected"]);
  const timeline = data?.timeline?.length ? data.timeline : [{ date: "No activity", count: 0 }];
  const companies = data?.companies?.length ? data.companies : [{ name: "No data", count: 0 }];
  const platforms = data?.platforms?.length ? data.platforms : [{ name: "No platform", count: 0 }];
  const insights = buildJobInsights(stats);

  return (
    <section className="saas-card p-6">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Jobs Analytics</p>
          <h2 className="text-xl font-bold text-gray-950">Application performance</h2>
        </div>
        <p className="text-sm text-gray-500">Pipeline, channels, and company concentration</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatsCard title="Total Applied" value={stats.total || 0} icon={<Briefcase />} tone="blue" />
        <StatsCard title="Pending" value={stats.pending || 0} icon={<Clock />} tone="amber" />
        <StatsCard title="Rejected" value={stats.rejected || 0} icon={<ShieldX />} tone="red" />
        <StatsCard title="Selected" value={stats.selected || 0} icon={<CheckCircle />} tone="green" />
        <StatsCard title="Acceptance Rate" value={`${stats.acceptance_rate || 0}%`} icon={<Percent />} tone="green" />
        <StatsCard title="Rejection Rate" value={`${stats.rejection_rate || 0}%`} icon={<Percent />} tone="red" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartCard title="Application Timeline" subtitle="Last 30 days" className="xl:col-span-5">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Job Status" subtitle="Distribution" className="xl:col-span-3">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={4}>
                {statusData.map((item) => <Cell key={item.key} fill={item.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Companies" subtitle="Most applications" className="xl:col-span-4">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={companies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Application Platforms" subtitle="Source mix" className="xl:col-span-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platforms}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <InsightPanel icon={<Send size={18} />} title="Job Insights" insights={insights} />
      </div>
    </section>
  );
}

function toStatusData(counts = {}, keys) {
  return keys.map((key) => ({
    key,
    name: key.replace("_", " "),
    value: counts[key] || 0,
    color: STATUS_COLORS[key],
  }));
}

function buildJobInsights(stats) {
  const insights = [];
  if ((stats.rejection_rate || 0) >= 40) insights.push("High rejection rate detected. Review resume alignment and tailor applications by role.");
  if ((stats.acceptance_rate || 0) < 10 && (stats.total || 0) >= 5) insights.push("Selection rate is low. Tighten targeting toward roles that match your strongest experience.");
  if ((stats.pending || 0) >= 5) insights.push("Several applications are pending. Prioritize follow-ups for older applications.");
  if (insights.length === 0) insights.push("Your application funnel looks balanced. Keep applying consistently and tracking follow-ups.");
  return insights;
}

function InsightPanel({ icon, title, insights }) {
  return (
    <section className="saas-card p-5 hover-3d xl:col-span-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-gray-950">{icon}{title}</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {insights.map((insight) => (
          <p key={insight} className="rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-900">{insight}</p>
        ))}
      </div>
    </section>
  );
}
