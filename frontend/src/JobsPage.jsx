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
    const res = await fetch(apiUrl(`/api/job/update/${editing.id}/`), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setJobs((current) => current.map((job) => (job.id === editing.id ? { ...job, ...form } : job)));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Header />

      <main className="mx-auto max-w-7xl p-6 animate-fade-in-up">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <BackButton className="mb-4" />
            <h1 className="text-3xl font-bold text-gray-950">Jobs</h1>
            <p className="text-gray-500">{jobs.length} applications tracked for this account</p>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              placeholder="Search jobs..."
              className="w-full rounded-lg border border-gray-200 bg-white/90 p-3 pl-10 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="hidden grid-cols-8 gap-3 border-b border-gray-100 p-4 text-sm font-semibold text-gray-500 lg:grid">
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
                className="grid grid-cols-1 gap-3 border-t p-4 first:border-t-0 lg:grid-cols-8 lg:items-center"
              >
                <div className="lg:col-span-2">
                  <p className="font-semibold text-gray-950">{job.jobTitle}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <FileText size={14} /> {job.jobId || "No job ID"}
                  </p>
                </div>
                <Meta icon={<Briefcase size={15} />} value={job.company} />
                <Meta icon={<Monitor size={15} />} value={job.platform} />
                <Meta icon={<DollarSign size={15} />} value={job.salaryRange} />
                <Meta icon={<Calendar size={15} />} value={job.dateApplied} />
                <span className="capitalize">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">{job.status}</span>
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
                  <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 lg:col-span-8 md:flex-row md:items-center md:justify-between">
                    <p><strong>Notes:</strong> {job.notes || "-"}</p>
                    {job.jd && (
                      <button
                        type="button"
                        onClick={() => setViewingJd(job)}
                        className="inline-flex w-fit items-center gap-1 rounded-lg bg-white px-3 py-2 font-semibold text-blue-700 shadow-sm hover:bg-blue-50"
                      >
                        <strong>JD:</strong> Show JD
                      </button>
                    )}
                  </div>
                )}
              </HighlightableItem>
            ))
          )}
        </Card>
      </main>

      {editing && (
        <Modal title="Edit Job" onClose={() => setEditing(null)}>
          <BackButton className="mb-6" />
          <JobForm key={editing.id} initialValues={editing} submitLabel="Save Changes" onSubmit={saveEdit} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {viewingJd && (
        <Modal title={`${viewingJd.jobTitle} JD`} onClose={() => setViewingJd(null)}>
          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
            {viewingJd.jd || "No job description added."}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Meta({ icon, value }) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
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
      className={`rounded-lg p-2 transition hover:-translate-y-0.5 ${danger ? "text-red-500 hover:bg-red-50" : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"}`}
    >
      {children}
    </button>
  );
}
