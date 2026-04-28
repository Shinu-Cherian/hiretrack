import { Clock, MailCheck, MessageCircleReply, Percent, Send, Users, XCircle } from "lucide-react";
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
  pending: "#f59e0b",
  replied: "#10b981",
  no_response: "#ef4444",
};

export default function ReferralDashboard({ data }) {
  const stats = data?.stats || {};
  const statusData = toStatusData(stats.status_counts, ["pending", "replied", "no_response"]);
  const timeline = data?.timeline?.length ? data.timeline : [{ date: "No activity", count: 0 }];
  const companies = data?.companies?.length ? data.companies : [{ name: "No data", count: 0 }];
  const insights = buildReferralInsights(stats);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Referral Analytics</p>
        <h2 className="text-2xl font-bold text-gray-950">Outreach performance</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatsCard title="Total Requests" value={stats.total || 0} icon={<Users />} tone="blue" />
        <StatsCard title="Pending" value={stats.pending || 0} icon={<Clock />} tone="amber" />
        <StatsCard title="Replied" value={stats.replied || 0} icon={<MessageCircleReply />} tone="green" />
        <StatsCard title="No Response" value={stats.no_response || 0} icon={<XCircle />} tone="red" />
        <StatsCard title="Response Rate" value={`${stats.response_rate || 0}%`} icon={<Percent />} tone="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title="Referral Timeline" subtitle="Last 30 days grouped by request date" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Referral Status Distribution" subtitle="Pending, replied, and no response">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={102} paddingAngle={4}>
                {statusData.map((item) => <Cell key={item.key} fill={item.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Referral Companies" subtitle="Companies with the most referral requests" className="xl:col-span-3">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <InsightPanel icon={<MailCheck size={20} />} title="Referral Insights" insights={insights} />
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

function buildReferralInsights(stats) {
  const insights = [];
  if ((stats.response_rate || 0) < 25 && (stats.total || 0) >= 3) insights.push("Response rate is low. Send shorter, more specific referral messages with a clear ask.");
  if ((stats.no_response || 0) >= 5) insights.push("Many referrals have no response. Schedule follow-ups and refresh your outreach template.");
  if ((stats.pending || 0) >= 5) insights.push("You have several pending requests. Check in with contacts who have had enough time to reply.");
  if (insights.length === 0) insights.push("Referral activity looks healthy. Keep tracking replies and following up at a steady pace.");
  return insights;
}

function InsightPanel({ icon, title, insights }) {
  return (
    <section className="rounded-xl border border-gray-200/80 bg-white/90 p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-950">{icon}{title}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {insights.map((insight) => (
          <p key={insight} className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">{insight}</p>
        ))}
      </div>
    </section>
  );
}
