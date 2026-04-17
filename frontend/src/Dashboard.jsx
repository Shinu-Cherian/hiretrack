import { Briefcase, Clock, XCircle, CheckCircle, Users } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useState, useEffect } from "react";

function Dashboard() {

  const jobData = [
    { name: "Pending", value: 5 },
    { name: "Rejected", value: 3 },
    { name: "Selected", value: 2 },
  ];

  const jobLine = [
    { day: "Mon", value: 2 },
    { day: "Tue", value: 4 },
    { day: "Wed", value: 3 },
    { day: "Thu", value: 5 },
    { day: "Fri", value: 6 },
  ];

  const referralData = [
    { name: "Pending", value: 4 },
    { name: "Replied", value: 2 },
    { name: "No Response", value: 3 },
  ];

  const referralLine = [
    { day: "Mon", value: 1 },
    { day: "Tue", value: 2 },
    { day: "Wed", value: 1 },
    { day: "Thu", value: 3 },
    { day: "Fri", value: 2 },
  ];
  
  const [data, setData] = useState(null);

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/dashboard/", {
    credentials: "include"   // 🔥 THIS LINE IMPORTANT
  })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
}, []);

if (!data) return <h2>Loading...</h2>;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ================= JOBS ================= */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Jobs Analytics</h2>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

          <Card title="Total Jobs"  value={data.total_jobs}icon={<Briefcase />} />
          <Card title="Pending" value={data.total_jobs} icon={<Clock />} />
          <Card title="Rejected" value={data.total_jobs} icon={<XCircle />} />
          <Card title="Selected" value={data.total_jobs} icon={<CheckCircle />} />
         

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          <ChartCard title="Job Status">
            <PieChart width={300} height={300}>
              <Pie data={jobData} dataKey="value">
                {jobData.map((_, i) => (
                  <Cell key={i} fill={["#facc15", "#ef4444", "#22c55e"][i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>

          <ChartCard title="Applications Over Time">
            <LineChart width={400} height={300} data={jobLine}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" />
            </LineChart>
          </ChartCard>

        </div>
      </div>

      {/* JOB INSIGHTS */}
<div className="mt-8 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md">

  <h3 className="text-lg font-semibold mb-4">Job Insights</h3>

  <ul className="space-y-2 text-sm text-gray-700">
    <li>⚠️ High rejection rate — improve resume targeting</li>
    <li>💡 Try applying through multiple platforms</li>
    <li>🚀 Follow up on pending applications</li>
    <li>✅ Good progress — keep applying consistently</li>
  </ul>

</div>

      {/* ================= REFERRALS ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Referral Analytics</h2>
        {/* REFERRAL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">

            <Card title="Total Requests" value={data.total_referrals} icon={<Users />} />
            <Card title="Pending" value={data.total_referrals} icon={<Clock />} />
            <Card title="Replied" value={data.total_referrals} icon={<CheckCircle />} />
            <Card title="No Response" value={data.total_referrals} icon={<XCircle />} />
            <Card title="Success Rate" value={data.total_referrals} icon={<CheckCircle />} />

        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard title="Referral Status">
            <PieChart width={300} height={300}>
              <Pie data={referralData} dataKey="value">
                {referralData.map((_, i) => (
                  <Cell key={i} fill={["#facc15", "#22c55e", "#ef4444"][i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>

          <ChartCard title="Referrals Over Time">
            <LineChart width={400} height={300} data={referralLine}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#10b981" />
            </LineChart>
          </ChartCard>

        </div>
      </div>
      {/* REFERRAL INSIGHTS */}
<div className="mt-8 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md">

  <h3 className="text-lg font-semibold mb-4">Referral Insights</h3>

  <ul className="space-y-2 text-sm text-gray-700">
    <li>⚠️ Many requests have no response — follow up politely</li>
    <li>💡 Personalize referral messages for better response</li>
    <li>🚀 Connect on LinkedIn before asking referrals</li>
    <li>✅ Good network — keep building connections</li>
  </ul>

</div>

    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Card({ title, value, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 flex justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      {icon}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-md">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}

export default Dashboard;