import { useEffect, useState, useRef } from "react";
import { Map, Sparkles, Loader2, GraduationCap, Briefcase, Globe, DollarSign, BookOpen, Star, ChevronRight } from "lucide-react";
import Header from "./Header";
import BackButton from "./components/BackButton";
import { apiUrl } from "./api";
import RoadmapResult from "./components/RoadmapResult";

// ── Loading Screen (same style as ATS Analyzer) ──────────────────────────────
const STEPS = [
  "Analysing your profile...",
  "Scanning global job market...",
  "Calculating readiness score...",
  "Building career timeline...",
  "Identifying skill gaps...",
  "Generating AI insights...",
  "Preparing your roadmap...",
];

function LoadingScreen() {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setStepIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
      setProgress((p) => Math.min(p + 100 / STEPS.length, 94));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-[#1a1b1b] p-10">
      <div className="flex flex-col items-center gap-6">
        {/* Pulsing icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#FF6044] flex items-center justify-center shadow-lg shadow-[#FF6044]/30 animate-pulse">
            <Map size={36} className="text-white" />
          </div>
          <div className="absolute -inset-2 rounded-3xl border-2 border-[#FF6044] animate-ping opacity-20" />
        </div>

        <div className="text-center">
          <h3 className="font-black text-white text-xl">AI Career Engine Running</h3>
          <p className="text-sm text-[#FF6044] font-bold mt-2 animate-pulse">{STEPS[stepIdx]}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6044] to-[#ff8c7a] rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Processing</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Step pills */}
        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
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

// ── Custom Dropdown for Career Stage ──────────────────────────────────────────
function CareerStageSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const options = [
    "Student", "Fresher", "Working Professional", "Career Switcher", "Experienced Professional"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`form-input flex items-center justify-between text-left ${isOpen ? "border-[#FF6044] ring-4 ring-[#FF6044]/15" : ""}`}
      >
        <span className={value ? "text-white" : "text-gray-500"}>
          {value || "Select your stage..."}
        </span>
        <ChevronRight size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-90 text-[#FF6044]" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-xl bg-[#1a1b1b] border border-white/10 shadow-2xl z-50 animate-fade-in origin-top">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                value === opt 
                  ? "bg-[#FF6044] text-[#121313]" 
                  : "text-gray-400 hover:bg-[#FF6044]/10 hover:text-[#FF6044]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Form Field Component ──────────────────────────────────────────────────────
function FormField({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase tracking-wider mb-2">
        <Icon size={14} className="text-[#FF6044]" />
        {label}
      </span>
      {children}
    </label>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CareerRoadmapPage() {
  const [form, setForm] = useState({
    field: "",
    degree: "",
    cgpa: "",
    career_stage: "",
    target_role: "",
    country: "",
    salary: "",
    additional_info: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.career_stage) {
      setError("Please select your current Career Stage.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/career-roadmap/"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError("AI analysis failed. Please check your connection and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121313] font-sans text-white">
      <Header />

      <main className="max-w-[1200px] mx-auto px-6 py-8 animate-fade-in-up">
        <BackButton className="mb-6" isMenu={false} />

        {/* Page Header */}
        <div className="mb-10 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6044]/10 border border-[#FF6044]/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,96,68,0.15)]">
            <Map size={26} className="text-[#FF6044]" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Career Roadmap</h1>
            <p className="text-gray-400 mt-1 text-lg font-medium">
              AI-powered personalized career guidance based on your profile and target market.
            </p>
          </div>
        </div>

        {/* Form Card */}
        {!result && (
          <div className="saas-card p-8">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
              <Sparkles size={18} className="text-[#FF6044]" />
              <h2 className="font-black text-white text-lg">Personalize Your Roadmap</h2>
              <span className="ml-auto text-xs text-gray-500 font-medium">Please fill the details</span>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <FormField label="Current Career Stage" icon={Star}>
                <CareerStageSelect
                  value={form.career_stage}
                  onChange={(val) => update("career_stage", val)}
                />
              </FormField>

              <FormField label="Field / Domain" icon={BookOpen}>
                <input
                  className="form-input"
                  placeholder="e.g. CS, Nursing, MBA..."
                  value={form.field}
                  onChange={(e) => update("field", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Degree Studied" icon={GraduationCap}>
                <input
                  className="form-input"
                  placeholder="e.g. B.Tech, BCA, MBA..."
                  value={form.degree}
                  onChange={(e) => update("degree", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Overall CGPA / Percentage" icon={Star}>
                <input
                  className="form-input"
                  placeholder="e.g. 7.8 / 10 or 78%"
                  value={form.cgpa}
                  onChange={(e) => update("cgpa", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Preferred Job Position" icon={Briefcase}>
                <input
                  className="form-input"
                  placeholder="e.g. Data Analyst, Software Engineer..."
                  value={form.target_role}
                  onChange={(e) => update("target_role", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Preferred Country / City" icon={Globe}>
                <input
                  className="form-input"
                  placeholder="e.g. India, Germany, Canada..."
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Expected Salary" icon={DollarSign}>
                <input
                  className="form-input"
                  placeholder="e.g. ₹8 LPA, $70k/year..."
                  value={form.salary}
                  onChange={(e) => update("salary", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Additional Context (Optional)" icon={Sparkles}>
                <input
                  className="form-input"
                  placeholder="e.g. Skills, gaps, or unique goals..."
                  value={form.additional_info}
                  onChange={(e) => update("additional_info", e.target.value)}
                />
              </FormField>

              {/* Submit */}
              <div className="md:col-span-2 flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-[#FF6044] text-[#121313] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#ff4d2e] hover:shadow-[0_0_30px_rgba(255,96,68,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate My Career Roadmap
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500">Powered by AI · Usually takes 15–30 seconds</p>
              </div>
            </form>

            {/* Loading */}
            {loading && <LoadingScreen />}

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 text-sm font-medium">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Result Dashboard */}
        {result && !loading && (
          <RoadmapResult data={result} form={form} onReset={() => setResult(null)} />
        )}
      </main>
    </div>
  );
}
