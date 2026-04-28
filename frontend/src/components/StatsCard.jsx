export default function StatsCard({ title, value, helper, icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    green: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
    slate: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-950">{value}</h3>
          {helper && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
        </div>
        {icon && <div className={`rounded-lg p-3 ${tones[tone] || tones.blue}`}>{icon}</div>}
      </div>
    </div>
  );
}
