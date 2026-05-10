import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  CheckCircle2, XCircle, Lightbulb, TrendingUp, TrendingDown,
  Minus, ExternalLink, RotateCcw, Search, Award, BookOpen,
  Globe, DollarSign, Calendar, Zap, AlertTriangle, ChevronRight,
  Sparkles, Briefcase
} from "lucide-react";

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

// ── Career Timeline ──────────────────────────────────────────────────────────
function RoadmapTimeline({ months }) {
  if (!months?.length) return null;
  const colors = ["#FF6044", "#7C3AED", "#10b981"];

  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar size={16} className="text-[#FF6044]" />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">Strategic Execution Roadmap</h3>
      </div>
      <div className="relative">
        <div className="absolute left-6 top-4 bottom-4 w-px bg-white/5" />
        <div className="space-y-8">
          {months.map((m, i) => (
            <div key={i} className="relative flex gap-6 pl-0">
              <div
                className="timeline-node flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-[#121313] text-sm z-10 shadow-lg opacity-0"
                style={{ background: colors[i % 3], boxShadow: `0 0 20px ${colors[i % 3]}40` }}
              >
                P{i + 1}
              </div>
              <div className="flex-1 bg-white/3 border border-white/5 rounded-2xl p-5">
                <p className="font-black text-white mb-3" style={{ color: colors[i % 3] }}>{m.focus || m.title}</p>
                <ul className="space-y-2">
                  {(m.tasks || m.milestones || []).map((task, j) => (
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

// ── Elite Insight Cards (Risks & Growth ROI) ──────────────────────────────────
function EliteInsightCard({ title, icon: Icon, items, colorClass, borderClass }) {
  if (!items?.length) return null;
  return (
    <div className={`elite-card rounded-2xl border ${borderClass} bg-[#1a1b1b] p-6 opacity-0`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className={colorClass} />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colorClass.replace("text-", "bg-")}`} />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main Result Dashboard ─────────────────────────────────────────────────────
export default function RoadmapResult({ data, form, onReset }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const tl = gsap.timeline();

    // Top bar reveal
    tl.fromTo(".elite-top-bar", 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );

    // Staggered reveal for all dashboard cards
    tl.fromTo(".elite-card", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    );
    
    // Animate timeline nodes separately
    tl.fromTo(".timeline-node",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.15, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.5"
    );
  }, { scope: containerRef, dependencies: [data] });

  return (
    <div ref={containerRef} className="space-y-6">

      {/* Top Bar */}
      <div className="elite-top-bar flex items-center justify-between flex-wrap gap-3 opacity-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF6044] flex items-center justify-center text-[#121313] shadow-lg shadow-[#FF6044]/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">HireTrack Elite Intelligence</h2>
            <p className="text-[10px] text-[#FF6044] font-black uppercase tracking-[0.2em]">Personalized Strategist Report</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-black hover:bg-white/10 transition-all"
        >
          <RotateCcw size={14} /> New Roadmap
        </button>
      </div>

      {/* Row 1: Insights Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Role Encyclopedia */}
        <div className="elite-card rounded-2xl border border-white/5 bg-[#1a1b1b] p-6 flex flex-col gap-4 opacity-0">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-[#FF6044]" />
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Role Encyclopedia</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            {data.readiness_reason || "Analyzing the fundamentals of this role..."}
          </p>
          <div className="mt-auto pt-4 border-t border-white/5">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Path & Philosophy</span>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="elite-card rounded-2xl border border-white/5 bg-[#1a1b1b] p-6 flex flex-col gap-4 opacity-0">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={16} className="text-[#FF6044]" />
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Market Intelligence</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed font-medium">
            {data.market_demand_reason || "Fetching local market trends..."}
          </p>
          <div className="mt-auto pt-4 border-t border-white/5">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Localized Demand Story</span>
          </div>
        </div>

        {/* Salary Truth Check */}
        <div className="elite-card rounded-2xl border border-white/5 bg-[#1a1b1b] p-6 flex flex-col gap-4 opacity-0">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-[#FF6044]" />
            <h3 className="font-black text-white uppercase tracking-wider text-sm">Salary Reality Check</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-xs text-gray-500 font-black uppercase tracking-tighter">Your Expectation</span>
              <span className="text-sm font-black text-white">{form.salary}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed italic">
              {data.salary_reality?.tip || "Analyzing salary feasibility..."}
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-white/5">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Compensation Strategy</span>
          </div>
        </div>
      </div>

      {/* Row 2: Strategic Risks & Growth ROI (NEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EliteInsightCard 
          title="Strategic Risk Management" 
          icon={AlertTriangle} 
          items={data.career_risks} 
          colorClass="text-rose-500"
          borderClass="border-rose-500/10"
        />
        <EliteInsightCard 
          title="Fastest Growth Strategy" 
          icon={Zap} 
          items={data.growth_strategy} 
          colorClass="text-[#FF6044]"
          borderClass="border-[#FF6044]/10"
        />
      </div>

      {/* Row 3: Skills + Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recommended Skills */}
        <div className="elite-card opacity-0 translate-y-8">
          <Card title="Skill Matrix" icon={Zap}>
            <div className="space-y-5">
              {(data.skill_priorities || []).map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-white">{s.skill}</span>
                    <span className="text-[10px] font-black uppercase text-[#FF6044] tracking-widest">High ROI</span>
                  </div>
                  <ProgressBar value={90 - (i * 5)} color="#FF6044" />
                  {s.why && <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed italic">Reason: {s.why}</p>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Certifications */}
        <div className="elite-card opacity-0 translate-y-8">
          <Card title="Elite Certifications" icon={Award}>
            <div className="space-y-3">
              {(data.certifications || []).map((cert, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-[#FF6044]/20 transition-all">
                  <div className="w-6 h-6 rounded-full bg-[#FF6044] text-[#121313] text-xs font-black flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-300 font-bold leading-relaxed">{cert}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Row 4: Timeline */}
      <div className="elite-card opacity-0 translate-y-8">
        <RoadmapTimeline months={data.three_month_roadmap} />
      </div>

      {/* Row 5: Interview Prep & Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interview Tips */}
        <div className="elite-card opacity-0 translate-y-8">
          <Card title="Hiring Strategy" icon={Briefcase}>
            <ul className="space-y-3">
              {(data.interview_tips || []).map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={15} className="text-emerald-500 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* AI Strategic Insights */}
        <div className="elite-card opacity-0 translate-y-8">
          <Card title="Market Insights" icon={Lightbulb}>
            <div className="space-y-4">
              {(data.ai_insights || []).map((ins, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-xs font-black text-[#FF6044] uppercase tracking-widest mb-1">{ins.headline}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{ins.details}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-600 pb-6">
        AI-generated career guidance · Results based on current market knowledge · Always verify with live job postings
      </p>
    </div>
  );
}
