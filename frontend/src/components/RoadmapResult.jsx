import { useEffect, useState } from "react";
import {
  CheckCircle2, XCircle, Lightbulb, TrendingUp, TrendingDown,
  Minus, ExternalLink, RotateCcw, Search, Award, BookOpen,
  Globe, DollarSign, Calendar, Zap, AlertTriangle, ChevronRight
} from "lucide-react";

// ── Animated Score Ring (reused pattern from ATS Analyzer) ───────────────────
function ReadinessRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (displayed / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#FF6044" : "#ef4444";
  const label = score >= 75 ? "Job Ready" : score >= 50 ? "Almost There" : "Needs Work";

  useEffect(() => {
    let cur = 0;
    const t = setInterval(() => {
      cur += 1;
      setDisplayed(cur);
      if (cur >= score) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
        <circle
          cx="80" cy="80" r={radius} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          style={{ transition: "stroke-dashoffset 0.04s linear" }}
        />
        <text x="80" y="74" textAnchor="middle" fontSize="32" fontWeight="900" fill="white">{displayed}</text>
        <text x="80" y="94" textAnchor="middle" fontSize="13" fontWeight="bold" fill="rgba(255,255,255,0.4)">/ 100</text>
      </svg>
      <span className="text-sm font-black uppercase tracking-widest px-4 py-1.5 rounded-full border" style={{ color, borderColor: `${color}40`, background: `${color}15` }}>
        {label}
      </span>
    </div>
  );
}

// ── Animated Progress Bar ─────────────────────────────────────────────────────
function ProgressBar({ value, max = 100, color = "#FF6044" }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW((value / max) * 100), 150); return () => clearTimeout(t); }, [value, max]);
  return (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, backgroundColor: color }} />
    </div>
  );
}

// ── Market Demand Badge ───────────────────────────────────────────────────────
function DemandBadge({ demand }) {
  const cfg = {
    High: { color: "#10b981", bg: "bg-emerald-500/10 border-emerald-500/20", icon: TrendingUp },
    Medium: { color: "#f59e0b", bg: "bg-amber-500/10 border-amber-500/20", icon: Minus },
    Low: { color: "#ef4444", bg: "bg-red-500/10 border-red-500/20", icon: TrendingDown },
  };
  const c = cfg[demand] || cfg.Medium;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${c.bg}`} style={{ color: c.color }}>
      <Icon size={12} /> {demand} Demand
    </span>
  );
}

// ── Section Card Wrapper ──────────────────────────────────────────────────────
function Card({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-[#1a1b1b] p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <Icon size={16} className="text-[#FF6044]" />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── 3-Month Timeline ──────────────────────────────────────────────────────────
function RoadmapTimeline({ months }) {
  if (!months?.length) return null;
  const colors = ["#FF6044", "#7C3AED", "#10b981"];

  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={16} className="text-[#FF6044]" />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">3-Month Career Roadmap</h3>
      </div>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-white/5" />
        <div className="space-y-8">
          {months.map((m, i) => (
            <div key={i} className="relative flex gap-6 pl-0">
              {/* Node */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-[#121313] text-sm z-10 shadow-lg"
                style={{ background: colors[i], boxShadow: `0 0 20px ${colors[i]}40` }}
              >
                M{i + 1}
              </div>
              {/* Content */}
              <div className="flex-1 bg-white/3 border border-white/5 rounded-2xl p-5">
                <p className="font-black text-white mb-3" style={{ color: colors[i] }}>{m.focus || m.title}</p>
                <ul className="space-y-2">
                  {(m.tasks || []).map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <ChevronRight size={14} className="text-[#FF6044] mt-0.5 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Google Search Cards ───────────────────────────────────────────────────────
function GoogleSearchCards({ searches }) {
  if (!searches?.length) return null;
  return (
    <Card title="Explore Further" icon={Search}>
      <p className="text-xs text-gray-500 mb-4">Click any card to search Google for live, current resources.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {searches.map((item, i) => {
          const query = item.query || item;
          const label = item.label || query;
          const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-[#FF6044]/30 hover:bg-[#FF6044]/5 transition-all group"
            >
              {/* Google G icon */}
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate group-hover:text-[#FF6044] transition-colors">{label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 truncate">{query}</p>
              </div>
              <ExternalLink size={12} className="text-gray-600 group-hover:text-[#FF6044] flex-shrink-0 transition-colors" />
            </a>
          );
        })}
      </div>
    </Card>
  );
}

// ── Main Result Dashboard ─────────────────────────────────────────────────────
export default function RoadmapResult({ data, form, onReset }) {
  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Your Career Roadmap</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {form.target_role} · {form.country} · {form.salary}
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-black hover:bg-white/10 transition-all"
        >
          <RotateCcw size={14} /> New Roadmap
        </button>
      </div>

      {/* Row 1: Score + Demand + Salary Reality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Readiness Score */}
        <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6 flex flex-col items-center gap-4">
          <h3 className="font-black text-white uppercase tracking-wider text-sm self-start">Career Readiness</h3>
          <ReadinessRing score={data.readiness_score ?? 60} />
          {data.readiness_reason && (
            <p className="text-xs text-gray-400 text-center leading-relaxed">{data.readiness_reason}</p>
          )}
        </div>

        {/* Market Demand */}
        <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#FF6044]" />
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Market Demand</h3>
          </div>
          <DemandBadge demand={data.market_demand ?? "Medium"} />
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">{data.market_demand_reason}</p>

          {/* Sub indicators */}
          {data.demand_indicators && (
            <div className="mt-5 space-y-3">
              {data.demand_indicators.map((ind, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                    <span>{ind.label}</span><span className="text-white">{ind.value}%</span>
                  </div>
                  <ProgressBar value={ind.value} color={["#FF6044", "#7C3AED", "#10b981"][i % 3]} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Salary Reality */}
        <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={16} className="text-[#FF6044]" />
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Salary Reality Check</h3>
          </div>
          {data.salary_reality ? (
            <>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-gray-400 font-medium">Your Expectation</span>
                  <span className="text-sm font-black text-white">{data.salary_reality.user_expectation || form.salary}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs text-gray-400 font-medium">Market Fresher Avg</span>
                  <span className="text-sm font-black text-[#FF6044]">{data.salary_reality.market_fresher_avg}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-gray-400 font-medium">Verdict</span>
                  <span className="text-xs font-black px-3 py-1 rounded-lg bg-[#FF6044]/10 text-[#FF6044] border border-[#FF6044]/20">
                    {data.salary_reality.verdict}
                  </span>
                </div>
              </div>
              {data.salary_reality.tip && (
                <p className="text-xs text-gray-400 leading-relaxed italic border-t border-white/5 pt-3">
                  💡 {data.salary_reality.tip}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-sm">No salary data available.</p>
          )}
        </div>
      </div>

      {/* Row 2: Skills + Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recommended Skills */}
        <Card title="Recommended Skills" icon={Zap}>
          {(data.skill_priorities || []).length > 0 ? (
            <div className="space-y-4">
              {data.skill_priorities.map((s, i) => {
                const priority = s.priority?.toLowerCase();
                const pColor = priority === "high" ? "#FF6044" : priority === "medium" ? "#f59e0b" : "#6b7280";
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black text-white">{s.skill}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ color: pColor, background: `${pColor}20`, border: `1px solid ${pColor}40` }}>
                        {s.priority}
                      </span>
                    </div>
                    <ProgressBar value={priority === "high" ? 90 : priority === "medium" ? 60 : 35} color={pColor} />
                    {s.why && <p className="text-[11px] text-gray-500 mt-1">{s.why}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(data.recommended_skills || []).map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] text-xs font-black">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Certifications */}
        <Card title="Recommended Certifications" icon={Award}>
          <div className="space-y-3">
            {(data.certifications || []).map((cert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="w-6 h-6 rounded-full bg-[#FF6044] text-[#121313] text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-sm text-gray-300 font-medium leading-relaxed">{cert}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: 3-Month Timeline */}
      <RoadmapTimeline months={data.three_month_roadmap} />

      {/* Row 4: AI Insights + Interview Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* AI Insight Cards */}
        {(data.ai_insights || []).length > 0 && (
          <Card title="AI Insights" icon={Lightbulb}>
            <div className="space-y-3">
              {data.ai_insights.map((ins, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#FF6044]/5 border border-[#FF6044]/15">
                  <p className="text-xs font-black text-[#FF6044] uppercase tracking-wider mb-1">{ins.headline}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{ins.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Interview Tips */}
        {(data.interview_tips || []).length > 0 && (
          <Card title="Interview Preparation Tips" icon={AlertTriangle}>
            <ul className="space-y-3">
              {data.interview_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Row 5: Google Search Cards */}
      <GoogleSearchCards searches={data.google_searches} />

      {/* Footer note */}
      <p className="text-center text-xs text-gray-600 pb-6">
        AI-generated career guidance · Results based on current market knowledge · Always verify with live job postings
      </p>
    </div>
  );
}
