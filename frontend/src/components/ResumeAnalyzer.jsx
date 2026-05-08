import { useState, useEffect } from "react";
import { FileSearch, CheckCircle2, XCircle, Lightbulb, Cpu, AlertCircle, Loader2 } from "lucide-react";
import { apiUrl } from "../api";

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

// ─── Section Checklist ─────────────────────────────────────────────────────
function SectionChecklist({ sections }) {
  if (!sections || sections.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-5">
        <h3 className="font-black text-white uppercase tracking-wider text-sm mb-4">Structure Analysis</h3>
        <p className="text-xs text-gray-500 italic">No clear sections detected.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-5">
      <h3 className="font-black text-white uppercase tracking-wider text-sm mb-4">Detected Sections</h3>
      <ul className="space-y-2.5">
        {sections.map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            {s.status === "Strong" ? (
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
            ) : s.status === "Average" ? (
              <div className="w-4 h-4 rounded-full border-2 border-amber-500/50 flex-shrink-0" />
            ) : (
              <XCircle size={16} className="text-red-500/50 flex-shrink-0" />
            )}
            <span className={s.status === "Strong" ? "text-gray-300 font-medium" : "text-gray-500 font-light"}>
              {s.name}
            </span>
          </li>
        ))}
      </ul>
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
        <h3 className="font-black text-white uppercase tracking-wider text-sm">Deep Sectional Audit</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {feedback.map((item, i) => (
          <div key={i} className="group p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white uppercase tracking-widest">{item.name || item.section}</span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                item.status === 'Strong' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                item.status === 'Weak' || item.status === 'Average' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                'bg-red-500/10 text-red-500 border border-red-500/20'
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

// ─── Main Component ────────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const [resume, setResume]               = useState("");
  const [file, setFile]                   = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const scanResume = async (event) => {
    event.preventDefault();
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

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-sm text-red-700">
          <AlertCircle size={18} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-8 space-y-6 animate-fade-in-up">

          {/* Warnings */}
          {(result.warnings || []).length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {result.warnings.map((w) => <p key={w}>{w}</p>)}
            </div>
          )}

          {/* AI badge */}
          {result.ai_powered && (
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 w-fit">
              <Cpu size={12} /> AI-Powered Analysis
            </div>
          )}

          {/* Score + sub-scores */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Score ring */}
            <div className="rounded-2xl bg-gray-950 p-6 text-white flex flex-col items-center gap-4">
              <ScoreRing score={result.score} />
              <p className="text-xs text-gray-400 text-center">{result.resume_chars || 0} characters analysed</p>
            </div>

            {/* Sub-score breakdown */}
            <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6 space-y-5">
              <h3 className="font-black text-white uppercase tracking-wider text-sm mb-2">Score Breakdown</h3>
              <SubScoreBar label="Keyword Match"  value={result.keyword_match_score ?? 0} max={50}  color="#FF6044" />
              <SubScoreBar label="Skill Alignment" value={result.skill_match_score   ?? 0} max={30}  color="#7C3AED" />
              <SubScoreBar label="Format Quality"  value={result.format_score        ?? 0} max={10}  color="#10b981" />
              <SubScoreBar label="Impact & Verbs"  value={result.impact_score        ?? 0} max={10}  color="#f59e0b" />
            </div>

            {/* Section checklist */}
            <SectionChecklist sections={result.detected_sections} />
          </div>

          {/* Experience + Title insights */}
          {(result.experience_match || result.title_match) && (
            <div className="grid gap-4 md:grid-cols-2">
              {result.experience_match && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-950/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-400 mb-1">Experience Alignment</p>
                  <p className="text-sm text-slate-300">{result.experience_match}</p>
                </div>
              )}
              {result.title_match && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-950/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-400 mb-1">Role Title Match</p>
                  <p className="text-sm text-slate-300">{result.title_match}</p>
                </div>
              )}
            </div>
          )}

          <SectionAudit feedback={result.detected_sections} />

          {/* Keywords grid */}
          <div className="grid gap-4 md:grid-cols-2">
            <KeywordPanel title="✅ Matched Skills"    words={result.matched_skills   || []} tone="green" />
            <KeywordPanel title="❌ Missing Skills"    words={result.missing_skills   || []} tone="red"   />
            <KeywordPanel title="✅ Matched Keywords"  words={result.matched_keywords || result.matched || []} tone="green" />
            <KeywordPanel title="❌ Missing Keywords"  words={result.missing_keywords || result.missing || []} tone="red"   />
          </div>

          {/* Suggestions */}
          {(result.suggestions || []).length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-[#1a1b1b] p-6">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb size={20} className="text-amber-400" />
                <h3 className="font-black text-white uppercase tracking-wider text-sm">AI Recommendations</h3>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl bg-white/5 border border-white/5 p-4 text-sm text-gray-300 leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400/10 text-amber-400 text-xs font-black flex items-center justify-center mt-0.5 border border-amber-400/20">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
