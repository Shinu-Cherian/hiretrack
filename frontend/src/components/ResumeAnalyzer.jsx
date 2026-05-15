import { useState, useEffect } from "react";
import { FileSearch, CheckCircle2, XCircle, Lightbulb, Cpu, AlertCircle, Loader2, Activity, AlertTriangle, Zap, Target, Database, BarChart3, Search, Upload, FileCheck } from "lucide-react";
import { apiUrl, getAuthStatus } from "../api";
import AuthActionModal from "./AuthActionModal";

// ─── Animated Loading Screen ───────────────────────────────────────────────
const STEPS = [
  "Parsing resume structure...",
  "Extracting technical skills...",
  "Analysing job requirements...",
  "Mapping keyword alignment...",
  "Scoring section quality...",
  "Evaluating impact metrics...",
  "Generating AI report...",
];

function LoadingScreen() {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
      setProgress((p) => Math.min(p + 100 / STEPS.length, 96));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#1a1b1b] p-8">
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing brain icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6044] flex items-center justify-center shadow-lg shadow-[#FF6044]/30 animate-pulse">
            <Cpu size={32} className="text-white" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border-2 border-[#FF6044] animate-ping opacity-20" />
        </div>

        <div className="text-center">
          <h3 className="font-bold text-white text-lg">AI ATS Engine Running</h3>
          <p className="text-sm text-[#FF6044] font-bold mt-1 animate-pulse">{STEPS[stepIdx]}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6044] to-[#ff8c7a] rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Analyzing</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step pills */}
        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {STEPS.map((step, i) => (
            <span
              key={step}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-500 ${
                i < stepIdx
                  ? "bg-[#FF6044] text-[#121313]"
                  : i === stepIdx
                  ? "bg-[#FF6044]/10 text-[#FF6044] border border-[#FF6044]/30"
                  : "bg-white/5 text-gray-500 border border-white/5"
              }`}
            >
              {i < stepIdx ? "✓ " : ""}{step.replace("...", "")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Score Ring ────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (displayed / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#FF6044" : "#ef4444";

  useEffect(() => {
    let cur = 0;
    const t = setInterval(() => {
      cur += 1;
      setDisplayed(cur);
      if (cur >= score) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
        <text x="70" y="66" textAnchor="middle" fontSize="26" fontWeight="900" fill="white">{displayed}</text>
        <text x="70" y="82" textAnchor="middle" fontSize="12" fontWeight="bold" fill="rgba(255,255,255,0.4)">/ 100</text>
      </svg>
      <span className="text-sm font-black uppercase tracking-wider" style={{ color }}>
        {score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Needs Work"}
      </span>
    </div>
  );
}

// ─── Sub Score Bar ─────────────────────────────────────────────────────────
function SubScoreBar({ label, value, max, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW((value / max) * 100), 100); }, [value, max]);
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tight mb-1.5">
        <span>{label}</span>
        <span className="tabular-nums text-white">{value} / {max}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          style={{ width: `${w}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Score Summary Card ─────────────────────────────────────────────────────
function ScoreSummary({ summary, assessment }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#FF6044]/10 flex items-center justify-center border border-[#FF6044]/20">
          <Activity size={20} className="text-[#FF6044]" />
        </div>
        <div>
          <h3 className="font-black text-white uppercase tracking-wider text-sm">ATS Market Readiness</h3>
          <p className="text-xs text-gray-500">Recruiter & Machine Analysis</p>
        </div>
      </div>
      <p className="text-lg text-gray-200 font-medium leading-relaxed mb-4">{summary}</p>
      <div className="p-4 rounded-xl bg-white/5 border border-white/5 italic text-sm text-gray-400">
        "{assessment}"
      </div>
    </div>
  );
}

// ─── ATS Risk Factors ─────────────────────────────────────────────────────
function ATSRiskRadar({ risks }) {
  if (!risks || risks.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle size={20} className="text-amber-500" />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">ATS Risk Radar</h3>
      </div>
      <div className="space-y-4">
        {risks.map((risk, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
              risk.severity === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
              risk.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />
            <div>
              <p className="text-sm font-black text-white uppercase tracking-wide mb-1">{risk.issue}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{risk.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Improvement Roadmap ─────────────────────────────────────────────────────
function ImprovementRoadmap({ plan }) {
  if (!plan || plan.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} className="text-[#7C3AED]" />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">Strategic Improvement Plan</h3>
      </div>
      <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
        {plan.map((item, i) => (
          <div key={i} className="relative pl-8">
            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-black ${
              item.priority === 'high' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 
              'bg-white/10 border-white/20 text-white'
            }`}>
              {i + 1}
            </div>
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all">
              <p className="text-xs font-black text-white uppercase tracking-widest mb-1">{item.problem}</p>
              <p className="text-sm text-gray-400 mb-3">{item.recommendation}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                <Target size={12} /> Expected Impact: {item.expected_impact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Checklist ─────────────────────────────────────────────────────
function SectionChecklist({ sections }) {
  if (!sections || sections.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
      <h3 className="font-black text-white uppercase tracking-wider text-sm mb-6">Structural Integrity</h3>
      <div className="grid gap-3">
        {sections.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
            <div className="flex items-center gap-3">
              {s.status === "strong" ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500/50" />}
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">{s.name}</span>
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase">{s.score}/10</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Audit Panel ─────────────────────────────────────────────────────
function SectionAudit({ feedback }) {
  if (!feedback || feedback.length === 0) return null;
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileSearch size={20} className="text-[#FF6044]" />
        <h3 className="font-black text-white uppercase tracking-wider text-sm">Deep Content Audit</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {feedback.map((item, i) => (
          <div key={i} className="group p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white uppercase tracking-widest">{item.name || item.section}</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                item.status === 'strong' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{item.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Keyword Panel ─────────────────────────────────────────────────────────
function KeywordPanel({ title, words, tone }) {
  const cls = tone === "green"
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : "bg-red-500/10 text-red-400 border-red-500/20";
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-5">
      <h3 className="font-black text-white uppercase tracking-wider text-sm mb-4">{title}
        <span className="ml-2 text-xs font-bold text-gray-500 tracking-normal opacity-50">({words.length})</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {words.length
          ? words.map((w) => (
              <span key={w} className={`rounded-lg border px-3 py-1 text-xs font-bold ${cls}`}>{w}</span>
            ))
          : <span className="text-sm text-gray-500 italic">No matches found</span>}
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [resume, setResume]               = useState("");
  const [file, setFile]                   = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const scanResume = async (event) => {
    event.preventDefault();

    // Check auth
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const body = new FormData();
    body.append("resume", resume);
    body.append("job_description", jobDescription);
    if (file) body.append("resume_file", file);

    try {
      const res = await fetch(apiUrl("/api/resume-analyze/"), {
        method: "POST",
        credentials: "include",
        body,
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Analysis failed. Please check your connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="saas-card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[#FF6044]/10 p-3 text-[#FF6044]">
          <FileSearch size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white">ATS Resume Analyzer</h2>
          <p className="text-sm text-gray-400">
            AI-powered analysis — like Jobscan but inside HireTrack.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={scanResume} className="grid gap-4 lg:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold text-gray-400">Resume Text</span>
          <textarea
            className="form-input min-h-40 resize-y"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste resume text here..."
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-gray-400">Job Description</span>
          <textarea
            required
            className="form-input min-h-40 resize-y"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
          />
        </label>
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-bold text-gray-400">Or Upload Resume</span>
          <input
            className="form-input"
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <button
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#FF6044] px-8 py-3.5 font-black text-[#121313] shadow-lg shadow-[#FF6044]/20 hover:bg-[#ff4d2e] hover:shadow-[#FF6044]/40 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analysing...
            </span>
          ) : (
            <><FileSearch size={18} /> Analyse with AI</>
          )}
        </button>
      </form>

      {/* Animated loading */}
      {loading && <LoadingScreen />}

      {/* Error Feedback */}
      {error && (
        <div className="mb-12 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black text-center uppercase tracking-widest animate-shake">
          {error}
        </div>
      )}

      {/* Results Section */}
      {result && !loading && (
        <div className="space-y-12 animate-fade-in-up pb-24">
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Primary Analysis Module */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl bg-gray-950 p-10 text-white flex flex-col items-center justify-center border border-white/5 shadow-2xl">
                  <ScoreRing score={result.score} />
                  <p className="mt-8 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">{result.resume_chars || 0} characters scanned</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-[#1a1b1b] p-10 shadow-xl">
                  <h3 className="font-black text-white uppercase tracking-wider text-xs mb-10 opacity-50">Match Matrix</h3>
                  <div className="space-y-8">
                    <SubScoreBar label="Keywords" value={result.keyword_match_score} max={50} color="#FF6044" />
                    <SubScoreBar label="Skills"   value={result.skill_match_score}   max={30} color="#7C3AED" />
                    <SubScoreBar label="Format"   value={result.format_score}        max={10} color="#10b981" />
                    <SubScoreBar label="Impact"   value={result.impact_score}        max={10} color="#f59e0b" />
                  </div>
                </div>
              </div>

              <ScoreSummary summary={result.score_summary} assessment={result.final_assessment} />
            </div>

            {/* Sidebar Modules */}
            <div className="space-y-8">
              <SectionChecklist sections={result.detected_sections} />
              <ATSRiskRadar risks={result.ats_risk_factors} />
            </div>
          </div>

          {/* Alignment Intelligence Grid */}
          <div className="grid gap-8 md:grid-cols-2">
             <div className="rounded-3xl border border-white/5 bg-[#1a1b1b] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Database size={20} className="text-emerald-500" />
                  </div>
                  <h3 className="font-black text-white uppercase tracking-wider text-sm">Technical Stack Alignment</h3>
                </div>
                <div className="space-y-8">
                  <KeywordPanel title="✅ Matched Stack" words={result.matched_skills} tone="green" />
                  <KeywordPanel title="❌ Critical Gaps" words={result.critical_missing_skills} tone="red" />
                  <KeywordPanel title="⚠️ Secondary Skills" words={result.missing_skills} tone="amber" />
                </div>
             </div>

             <div className="rounded-3xl border border-white/5 bg-[#1a1b1b] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <BarChart3 size={20} className="text-indigo-500" />
                  </div>
                  <h3 className="font-black text-white uppercase tracking-wider text-sm">Hiring Context</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Seniority Alignment</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">{result.experience_analysis?.seniority_match}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Role Title Fit</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">{result.experience_analysis?.title_alignment}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Technical Depth</p>
                    <p className="text-sm text-gray-300 leading-relaxed font-medium">{result.experience_analysis?.technical_depth}</p>
                  </div>
                </div>
             </div>
          </div>

          {/* Expert Audit Module */}
          <SectionAudit feedback={result.detected_sections} />
          
          {/* Actionable Strategy Section */}
          <div className="grid gap-8 md:grid-cols-2">
            <ImprovementRoadmap plan={result.improvement_plan} />
            <div className="space-y-8">
              <div className="rounded-3xl border border-white/5 bg-[#1a1b1b] p-8 h-fit shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <Search size={20} className="text-[#FF6044]" />
                  <h3 className="font-black text-white uppercase tracking-wider text-sm">Keyword Optimization Tips</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {result.keyword_optimization?.map((tip, i) => (
                    <span key={i} className="text-[11px] font-bold text-gray-400 bg-white/5 border border-white/5 px-4 py-2 rounded-xl hover:bg-white/10 transition-all cursor-default">{tip}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/5 bg-[#1a1b1b] p-8 h-fit shadow-xl border-l-4 border-l-emerald-500/50">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                  <h3 className="font-black text-white uppercase tracking-wider text-sm">Hiring Strengths</h3>
                </div>
                <div className="space-y-3">
                  {result.top_strengths?.map((s, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm text-gray-300 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 transition-all hover:bg-emerald-500/10">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      <AuthActionModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="AI Engine Restricted"
        message="Running the deep ATS scan requires a secure workspace to protect your career data. Log in to run your scan."
      />
    </section>
  );
}
