import { useState } from "react";
import { Clipboard, Loader2, PenLine } from "lucide-react";
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
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="saas-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><PenLine size={22} /></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-950">Cover Letter Generator</h2>
          <p className="text-sm text-gray-500">Generate a structured starting draft from your resume and JD.</p>
        </div>
      </div>

      <form onSubmit={generate} className="grid gap-4 lg:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold text-gray-700">Resume Text</span>
          <textarea className="form-input min-h-40 resize-y" value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste resume text..." />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold text-gray-700">Job Description</span>
          <textarea required className="form-input min-h-40 resize-y" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job description..." />
        </label>
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-gray-700">Or Upload Resume</span>
          <input className="form-input" type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <button disabled={loading} className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <PenLine size={18} />}
          {loading ? "Reading resume and JD..." : "Generate Cover Letter"}
        </button>
      </form>

      {loading && (
        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          Extracting resume evidence, reading role priorities, and drafting a tailored cover letter...
        </div>
      )}

      {coverLetter && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
          {warnings.length > 0 && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {warnings.map((warning) => <p key={warning}>{warning}</p>)}
            </div>
          )}
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-gray-950">Professional Cover Letter</h3>
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100">
              <Clipboard size={16} /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-6 text-gray-700">{coverLetter}</pre>
          <p className="mt-3 text-sm text-gray-500">Use tools like Canva for better formatting.</p>
        </div>
      )}
    </section>
  );
}
