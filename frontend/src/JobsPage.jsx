import { useEffect, useMemo, useState } from "react";
import { Briefcase, Calendar, DollarSign, Edit3, FileText, Monitor, Search, Star, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";
import HighlightableItem from "./components/HighlightableItem";
import JobForm from "./components/JobForm";
import Modal from "./components/Modal";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [viewingJd, setViewingJd] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetch(apiUrl("/api/jobs/"), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    const id = searchParams.get("highlight");
    if (!id || jobs.length === 0) return;

    const startTimer = window.setTimeout(() => {
      setActiveHighlight(id);
      document.getElementById(`job-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    const endTimer = window.setTimeout(() => setActiveHighlight(null), 3100);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [jobs.length, searchParams]);

  const filtered = useMemo(
    () => jobs.filter((job) => `${job.jobTitle} ${job.company} ${job.platform || ""}`.toLowerCase().includes(search.toLowerCase())),
    [jobs, search]
  );

  const saveEdit = async (form) => {
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) body.append(key, value);
    });

    const res = await fetch(apiUrl(`/api/job/update/${editing.id}/`), {
      method: "POST",
      credentials: "include",
      body,
    });

    if (res.ok) {
      const payload = await res.json();
      setJobs((current) => current.map((job) => (job.id === editing.id ? { ...job, ...form, ...payload } : job)));
      setEditing(null);
      return;
    }

    alert("Could not update job");
  };

  const toggleStar = async (job) => {
    const res = await fetch(apiUrl(`/api/job/star/${job.id}/`), { credentials: "include" });
    if (res.ok) {
      setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, is_starred: !item.is_starred } : item)));
    }
  };

  const deleteJob = async (job) => {
    const res = await fetch(apiUrl(`/api/job/delete/${job.id}/`), { credentials: "include" });
    if (res.ok) {
      setJobs((current) => current.filter((item) => item.id !== job.id));
    }
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white">
      <Header />

      <main className="mx-auto max-w-7xl p-6 lg:p-8 animate-fade-in-up">
        <BackButton className="mb-6" />
        
        {/* Hero Header */}
        <div className="saas-card p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gray-100/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Job Pipeline</h1>
            <p className="text-lg text-gray-400 font-light max-w-xl">
              You are currently tracking <strong className="font-semibold text-white">{jobs.length}</strong> applications. Search, edit, or update statuses below.
            </p>
          </div>
          
          <div className="hidden md:block relative w-64 h-32 flex-shrink-0 perspective-1000">
             <Jobs3DHero />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Search by role, company, or platform..."
              className="form-input !pl-12 shadow-sm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="saas-card overflow-hidden">
          <div className="hidden grid-cols-8 gap-3 border-b border-white/10 p-4 text-sm font-bold text-[#FF6044] lg:grid">
            <span className="col-span-2">Role</span>
            <span>Company</span>
            <span>Platform</span>
            <span>Salary</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No jobs found</div>
          ) : (
            filtered.map((job) => (
              <HighlightableItem
                key={job.id}
                id={`job-${job.id}`}
                highlighted={String(job.id) === String(activeHighlight)}
                className={`grid grid-cols-1 gap-3 border-t border-white/5 p-4 first:border-t-0 lg:grid-cols-8 lg:items-center ${
                  job.status === "selected" ? "border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : ""
                }`}
              >
                <div className="lg:col-span-2">
                  <p className="font-semibold text-white">{job.jobTitle}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-400">
                    <FileText size={14} /> {job.jobId || "No job ID"}
                  </p>
                </div>
                <Meta icon={<Briefcase size={15} />} value={job.company} />
                <Meta icon={<Monitor size={15} />} value={job.platform} />
                <Meta icon={<DollarSign size={15} />} value={job.salaryRange} />
                <Meta icon={<Calendar size={15} />} value={job.dateApplied} />
                <span className="capitalize">
                  <span className="rounded-full bg-[#FF6044]/10 px-3 py-1 text-sm font-bold text-[#FF6044]">{job.status}</span>
                </span>
                <span className="flex gap-2">
                  <IconButton label="Toggle star" onClick={() => toggleStar(job)}>
                    <Star size={18} className={job.is_starred ? "fill-yellow-400 text-yellow-400" : ""} />
                  </IconButton>
                  <IconButton label="Edit job" onClick={() => setEditing({ ...job })}>
                    <Edit3 size={18} />
                  </IconButton>
                  <IconButton label="Delete job" danger onClick={() => deleteJob(job)}>
                    <Trash2 size={18} />
                  </IconButton>
                </span>
                {(job.jd || job.notes) && (
                  <div className="flex flex-col gap-2 rounded-lg bg-[#121313] p-3 text-sm text-gray-400 lg:col-span-8 md:flex-row md:items-center md:justify-between">
                    <p><strong>Notes:</strong> {job.notes || "-"}</p>
                    {job.jd && (
                      <button
                        type="button"
                        onClick={() => setViewingJd(job)}
                        className="inline-flex w-fit items-center gap-1 rounded-lg bg-transparent px-3 py-2 font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
                      >
                        <strong>JD:</strong> Show JD
                      </button>
                    )}
                  </div>
                )}
              </HighlightableItem>
            ))
          )}
        </div>
      </main>

      {editing && (
        <Modal title="Edit Job" onClose={() => setEditing(null)} maxWidth="max-w-5xl">
          <BackButton className="mb-6" />
          <JobForm key={editing.id} initialValues={editing} submitLabel="Save Changes" onSubmit={saveEdit} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {viewingJd && (
        <Modal title={`${viewingJd.jobTitle} JD`} onClose={() => setViewingJd(null)} maxWidth="max-w-4xl">
          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-white/10 bg-[#121313] p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
            {viewingJd.jd || "No job description added."}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Jobs3DHero() {
  return (
    <div className="isometric-container w-full max-w-[200px] scale-75 lg:scale-90 origin-right">
      <div className="bg-transparent rounded-xl border border-white/5 p-3 isometric-card w-full h-[180px] flex flex-col shadow-lg relative">
        <div className="flex items-center gap-2 mb-3 border-b border-gray-50 pb-2">
           <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
           <div className="text-[10px] font-bold text-gray-800 uppercase tracking-tighter">Active Tracking</div>
        </div>
        
        <div className="space-y-2 flex-1">
          {[80, 60, 90, 40].map((w, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="w-1/3 h-1 bg-gray-100 rounded-full"></div>
              <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${w}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-4 top-6 w-24 bg-gray-900 rounded-xl p-2 isometric-card-layer-1 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="text-[8px] font-bold text-white tracking-widest uppercase">Pipeline</div>
        </div>
      </div>

      <div className="absolute -left-4 bottom-6 w-20 bg-transparent border border-white/5 rounded-xl p-2 isometric-card-layer-2 shadow-lg">
         <div className="w-full h-1 bg-gray-100 rounded-full mb-1"></div>
         <div className="w-2/3 h-1 bg-[#121313] rounded-full"></div>
      </div>
    </div>
  );
}

function Meta({ icon, value }) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-sm text-gray-400">
      <span className="text-gray-400">{icon}</span>
      <span className="truncate">{value || "-"}</span>
    </span>
  );
}

function IconButton({ children, onClick, danger = false, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition hover:-translate-y-0.5 ${danger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-white dark:hover:text-white"}`}
    >
      {children}
    </button>
  );
}
