import { useState } from "react";
import { Clipboard, Loader2, PenLine, FileText, ExternalLink, Check } from "lucide-react";
import { apiUrl } from "../api";

export default function CoverLetterGenerator() {
  const [resume, setResume] = useState("");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCoverLetter("");
    setWarnings([]);
    const body = new FormData();
    body.append("resume", resume);
    body.append("job_description", jobDescription);
    if (file) body.append("resume_file", file);
    try {
      const res = await fetch(apiUrl("/api/generate-cover-letter/"), {
        method: "POST",
        credentials: "include",
        body,
      });
      const data = await res.json();
      setCoverLetter(data.cover_letter || "");
      setWarnings(data.warnings || []);
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const openCanva = () => {
    // Copy text first so user can paste immediately in Canva
    navigator.clipboard.writeText(coverLetter).catch(() => {});
    window.open("https://www.canva.com/create/cover-letters/", "_blank", "noopener");
  };

  return (
    <section className="saas-card p-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
          <PenLine size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-950">Cover Letter Generator</h2>
          <p className="text-sm text-gray-500">
            Generate a tailored cover letter from your resume and JD. Then design it beautifully in Canva.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={generate} className="grid gap-4 lg:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-gray-700">Resume Text</span>
          <textarea
            className="form-input min-h-40 resize-y"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste resume text..."
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-gray-700">Job Description</span>
          <textarea
            required
            className="form-input min-h-40 resize-y"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description..."
          />
        </label>
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-gray-700">Or Upload Resume</span>
          <input
            className="form-input"
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <button
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 transition-all hover:shadow-md"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <PenLine size={18} />}
          {loading ? "Analysing resume & JD..." : "Generate Cover Letter"}
        </button>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800 animate-pulse">
          Reading your resume and JD, mapping your experience to the role, and drafting a tailored letter...
        </div>
      )}

      {/* Result */}
      {coverLetter && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-in-up">

          {warnings.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {warnings.map((w) => <p key={w}>{w}</p>)}
            </div>
          )}

          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                <FileText size={18} />
              </div>
              <h3 className="font-bold text-gray-950">AI-Generated Draft</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Copy */}
              <button
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-all"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Clipboard size={16} />}
                {copied ? "Copied!" : "Copy Text"}
              </button>

              {/* Design in Canva */}
              <button
                onClick={openCanva}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
              >
                <ExternalLink size={16} />
                Design in Canva
              </button>
            </div>
          </div>

          {/* Editable letter */}
          <div className="relative group">
            <textarea
              className="w-full min-h-[420px] p-6 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 leading-relaxed font-serif resize-none transition-all"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Your cover letter will appear here..."
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="px-2 py-1 bg-white/80 backdrop-blur-sm rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">
                Editable
              </span>
            </div>
          </div>

          {/* Canva CTA tip */}
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
            <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
              <ExternalLink size={12} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-violet-900">Design it in Canva</p>
              <p className="text-xs text-violet-700 mt-0.5">
                Click <strong>"Design in Canva"</strong> — your letter is copied automatically. Open any cover letter template in Canva, add a text block, and paste. Choose from hundreds of professional designs.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
