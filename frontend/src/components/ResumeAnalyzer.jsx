import { useState } from "react";
import { FileSearch, Loader2 } from "lucide-react";
import { apiUrl } from "../api";

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState("");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanResume = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
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
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="saas-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700"><FileSearch size={22} /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-950">ATS Resume Analyzer</h2>
          <p className="text-sm text-gray-500">Compare your resume against a job description before applying.</p>
        </div>
      </div>

      <form onSubmit={scanResume} className="grid gap-4 lg:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-gray-700">Resume Text</span>
          <textarea className="form-input min-h-40 resize-y" value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste resume text..." />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-gray-700">Job Description</span>
          <textarea required className="form-input min-h-40 resize-y" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste JD..." />
        </label>
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-gray-700">Or Upload Resume</span>
          <input className="form-input" type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <button disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <FileSearch size={18} />}
          {loading ? "Reading resume and JD..." : "Scan Resume"}
        </button>
      </form>

      {loading && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          Extracting resume text, comparing skills, checking ATS sections, and scoring JD alignment...
        </div>
      )}

      {result && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {(result.warnings || []).length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 lg:col-span-3">
              {result.warnings.map((warning) => <p key={warning}>{warning}</p>)}
            </div>
          )}
          <div className="rounded-xl bg-gray-950 p-5 text-white">
            <p className="text-sm text-gray-300">ATS Score</p>
            <h3 className="mt-2 text-4xl font-bold">{result.score}%</h3>
            <p className="mt-2 text-xs text-gray-400">{result.resume_chars || 0} resume characters read</p>
          </div>
          <KeywordPanel title="Matching Keywords" words={result.matched || []} tone="green" />
          <KeywordPanel title="Missing Keywords" words={result.missing || []} tone="red" />
          <KeywordPanel title="Matched Skills" words={result.matched_skills || []} tone="green" />
          <KeywordPanel title="Missing Skills" words={result.missing_skills || []} tone="red" />
          <KeywordPanel title="ATS Sections Found" words={result.section_hits || []} tone="green" />
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 lg:col-span-3">
            <h3 className="font-semibold text-gray-950">Suggestions</h3>
            <ul className="mt-3 grid gap-2 md:grid-cols-3">
              {(result.suggestions || []).map((suggestion) => (
                <li key={suggestion} className="rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function KeywordPanel({ title, words, tone }) {
  const classes = tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700";
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="font-semibold text-gray-950">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {words.length ? words.map((word) => <span key={word} className={`rounded-full px-3 py-1 text-sm ${classes}`}>{word}</span>) : <span className="text-sm text-gray-400">No keywords</span>}
      </div>
    </div>
  );
}
