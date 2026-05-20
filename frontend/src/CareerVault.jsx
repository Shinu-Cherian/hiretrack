import { useEffect, useMemo, useState } from "react";
import { Briefcase, Calendar, Download, Eye, FileText, FolderOpen } from "lucide-react";
import Header from "./Header";
import { API_BASE, apiUrl } from "./api";
import BackButton from "./components/BackButton";

export default function CareerVault() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/api/career-vault/"), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // Only keep jobs that actually have at least one document uploaded
        const withDocs = (data.items || []).filter(
          (item) => item.resumeFile || item.coverLetterFile
        );
        setItems(withDocs);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDateString = (dateStr) => {
    if (!dateStr || dateStr === "No Date") return "No Date";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Group items by date, newest first
  const groupedItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      const dA = a.dateApplied || "";
      const dB = b.dateApplied || "";
      return dB.localeCompare(dA);
    });
    const groups = {};
    sorted.forEach((item) => {
      const date = item.dateApplied || "No Date";
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }, [items]);

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white">
      <Header />
      <main className="mx-auto max-w-7xl p-6 lg:p-8 animate-fade-in-up">
        <BackButton className="mb-6" isMenu={true} />

        {/* Hero Header */}
        <div className="saas-card p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gray-100/50 to-transparent pointer-events-none" />
          <div className="relative z-10 flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Career Vault</h1>
            <p className="text-lg text-gray-400 font-light max-w-xl">
              {loading ? (
                "Loading your documents..."
              ) : items.length === 0 ? (
                "No documents uploaded yet. Add a resume or cover letter when adding a job."
              ) : (
                <>Documents from <strong className="font-semibold text-white">{items.length}</strong> applications stored here.</>
              )}
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center relative w-32 h-32 flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-[#FF6044]/10 border border-[#FF6044]/20 flex items-center justify-center">
              <FolderOpen size={40} className="text-[#FF6044]" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="saas-card p-16 text-center text-gray-500">
            <div className="animate-pulse text-lg">Loading vault...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="saas-card p-16 text-center text-gray-400 space-y-3">
            <FolderOpen size={48} className="mx-auto text-gray-600" />
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm text-gray-500">Upload a resume or cover letter while adding a job to see it here.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Column headers */}
            <div className="hidden grid-cols-5 gap-4 px-4 py-2 border border-transparent text-sm font-bold text-[#FF6044] lg:grid">
              <span className="col-span-2">Job</span>
              <span>Applied Date</span>
              <span>Resume</span>
              <span>Cover Letter</span>
            </div>

            {Object.entries(groupedItems).map(([date, dateItems]) => (
              <div key={date} className="space-y-4">
                {/* Premium Centered Date Divider */}
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1e2020] px-4 py-1.5 text-xs font-bold text-gray-300 shadow-sm">
                    <Calendar size={14} className="text-[#FF6044]" />
                    <span>{formatDateString(date)}</span>
                    <span className="rounded-full bg-[#FF6044]/10 px-2 py-0.5 text-[10px] text-[#FF6044] font-semibold">
                      {dateItems.length} {dateItems.length === 1 ? "job" : "jobs"}
                    </span>
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* Separate saas-card per date group */}
                <div className="saas-card overflow-hidden">
                  <div className="divide-y divide-white/5">
                    {dateItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-5 lg:items-center hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Job Info */}
                        <div className="lg:col-span-2 flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#FF6044]/10 border border-[#FF6044]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Briefcase size={16} className="text-[#FF6044]" />
                          </div>
                          <div>
                            <p className="font-bold text-white leading-snug">{item.jobTitle}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{item.company}</p>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar size={14} className="text-gray-500 flex-shrink-0" />
                          <span>{item.dateApplied || "—"}</span>
                        </div>

                        {/* Resume */}
                        <DocumentActions
                          fileUrl={item.resumeFile}
                          downloadUrl={item.resumeDownload}
                          label="Resume"
                        />

                        {/* Cover Letter */}
                        <DocumentActions
                          fileUrl={item.coverLetterFile}
                          downloadUrl={item.coverLetterDownload}
                          label="Cover Letter"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function DocumentActions({ fileUrl, downloadUrl, label }) {
  if (!fileUrl) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
        <FileText size={14} />
        No {label}
      </span>
    );
  }

  // Direct media URL for inline preview (opens in browser tab)
  const previewHref = `${API_BASE}${fileUrl}`;
  // Download endpoint for forced download
  const downloadHref = downloadUrl ? `${API_BASE}${downloadUrl}` : previewHref;

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={previewHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF6044]/10 border border-[#FF6044]/20 px-3 py-1.5 text-sm font-bold text-[#FF6044] hover:bg-[#FF6044]/20 transition-all"
      >
        <Eye size={14} /> Preview
      </a>
      <a
        href={downloadHref}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10 transition-all"
      >
        <Download size={14} /> Download
      </a>
    </div>
  );
}
