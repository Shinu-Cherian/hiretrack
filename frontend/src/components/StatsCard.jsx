export default function StatsCard({ title, value, helper, icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border border-red-500/20",
    green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    violet: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    slate: "bg-white/5 text-white border border-white/10",
  };

  return (
    <div className="saas-card p-5 hover-3d bg-[#1a1b1b] border-white/5">
      <div className="flex min-h-20 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-white">{value}</h3>
          {helper && <p className="mt-1 text-sm font-bold text-[#FF6044]/80">{helper}</p>}
        </div>
        {icon && <div className={`shrink-0 rounded-xl p-2.5 ${tones[tone] || tones.blue}`}>{icon}</div>}
      </div>
    </div>
  );
}
