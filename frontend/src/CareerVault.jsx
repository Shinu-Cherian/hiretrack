import { useEffect, useState } from "react";
import { Download, Eye } from "lucide-react";
import Header from "./Header";
import { API_BASE, apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";

export default function CareerVault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/career-vault/"), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white">
      <Header />
      <main className="mx-auto max-w-7xl p-6">
        <BackButton className="mb-5" isMenu={true} />
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white">Career Vault</h1>
          <p className="mt-1 text-gray-400">Only applications with uploaded documents appear here.</p>
        </div>

        <div className="saas-card overflow-hidden">
          <div className="hidden grid-cols-5 gap-4 border-b border-white/5 p-4 text-sm font-bold text-gray-400 lg:grid">
            <span className="col-span-2">Job</span>
            <span>Applied Date</span>
            <span>Resume Used</span>
            <span>Cover Letter Used</span>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading vault...</div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No resume to show. Upload a resume or cover letter while adding a job.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 gap-4 border-b border-gray-100 p-4 last:border-b-0 lg:grid-cols-5 lg:items-center">
                <div className="lg:col-span-2">
                  <p className="font-bold text-white">{item.jobTitle}</p>
                  <p className="text-sm text-gray-400">{item.company}</p>
                </div>
                <span className="text-sm text-gray-600">{item.dateApplied || "-"}</span>
                <DocumentActions file={item.resumeFile} download={item.resumeDownload} empty="No resume" />
                <DocumentActions file={item.coverLetterFile} download={item.coverLetterDownload} empty="No cover letter" />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function DocumentActions({ file, download, empty }) {
  if (!file) return <span className="text-sm text-gray-400">{empty}</span>;
  return (
    <div className="flex flex-wrap gap-2">
      <a href={`${API_BASE}${file}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-[#FF6044]/10 px-3 py-2 text-sm font-bold text-[#FF6044] hover:bg-[#FF6044]/20 transition-all">
        <Eye size={15} /> Preview
      </a>
      <a href={`${API_BASE}${download}`} className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 transition-all">
        <Download size={15} /> Download
      </a>
    </div>
  );
}
