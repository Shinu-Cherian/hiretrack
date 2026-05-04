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
    <section className="saas-card p-6">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#FF6044]">Referral Analytics</p>
          <h2 className="text-xl font-extrabold text-white">Outreach performance</h2>
        </div>
        <p className="text-sm text-gray-400">Requests, replies, and company response patterns</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <StatsCard title="Total Requests" value={stats.total || 0} icon={<Users />} tone="blue" />
        <StatsCard title="Pending" value={stats.pending || 0} icon={<Clock />} tone="amber" />
        <StatsCard title="Replied" value={stats.replied || 0} icon={<MessageCircleReply />} tone="green" />
        <StatsCard title="No Response" value={stats.no_response || 0} icon={<XCircle />} tone="red" />
        <StatsCard title="Response Rate" value={`${stats.response_rate || 0}%`} icon={<Percent />} tone="green" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartCard title="Referral Timeline" subtitle="Last 30 days" className="xl:col-span-5">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121313', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#FF6044' }}
              />
              <Line type="monotone" dataKey="count" stroke="#FF6044" strokeWidth={3} dot={{ r: 4, fill: '#FF6044', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Referral Status" subtitle="Distribution" className="xl:col-span-3">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={4}>
                {statusData.map((item) => <Cell key={item.key} fill={item.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Referral Companies" subtitle="Most requests" className="xl:col-span-4">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={companies}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#121313', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Bar dataKey="count" fill="#FF6044" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <InsightPanel icon={<MailCheck size={18} />} title="Referral Insights" insights={insights} />
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
    <section className="saas-card p-5 hover-3d xl:col-span-12 border-white/5 bg-[#121313]">
      <h3 className="flex items-center gap-2 text-base font-extrabold text-[#FF6044]">{icon}{title}</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {insights.map((insight) => (
          <p key={insight} className="rounded-lg bg-white/5 p-3 text-sm leading-6 text-gray-300 border border-white/5">{insight}</p>
        ))}
      </div>
    </section>
  );
}
