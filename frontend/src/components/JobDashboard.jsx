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
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Jobs Analytics</p>
        <h2 className="text-2xl font-bold text-gray-950">Application performance</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatsCard title="Total Applied" value={stats.total || 0} icon={<Briefcase />} tone="blue" />
        <StatsCard title="Pending" value={stats.pending || 0} icon={<Clock />} tone="amber" />
        <StatsCard title="Rejected" value={stats.rejected || 0} icon={<ShieldX />} tone="red" />
        <StatsCard title="Selected" value={stats.selected || 0} icon={<CheckCircle />} tone="green" />
        <StatsCard title="Acceptance Rate" value={`${stats.acceptance_rate || 0}%`} icon={<Percent />} tone="green" />
        <StatsCard title="Rejection Rate" value={`${stats.rejection_rate || 0}%`} icon={<Percent />} tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Application Timeline" subtitle="Last 30 days grouped by application date">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Job Status Distribution" subtitle="Applied, pending, rejected, and selected">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={64} outerRadius={105} paddingAngle={4}>
                {statusData.map((item) => <Cell key={item.key} fill={item.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Companies Applied" subtitle="Companies with the most applications">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Application Platforms" subtitle="Where applications are coming from">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platforms}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <InsightPanel icon={<Send size={20} />} title="Job Insights" insights={insights} />
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
    <section className="rounded-xl border border-gray-200/80 bg-white/90 p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950">{icon}{title}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {insights.map((insight) => (
          <p key={insight} className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">{insight}</p>
        ))}
      </div>
    </section>
  );
}
