import { useState, useEffect } from "react";
import Header from "./Header";

export default function JobsPage() {

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/jobs/")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const filtered = jobs.filter(j =>
    (j.jobTitle + j.company)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-4">Jobs</h1>

        <input
          placeholder="Search jobs..."
          className="border p-2 rounded w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 bg-white rounded-xl shadow">

          <div className="grid grid-cols-7 p-4 border-b text-sm text-gray-500">
            <span>Job Title</span>
            <span>Company</span>
            <span>Job ID</span>
            <span>Date</span>
            <span>Status</span>
            <span>Notes</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No jobs found
            </div>
          ) : (
            filtered.map(job => (
              <div key={job.id} className="grid grid-cols-7 p-4 border-t">
                <span>{job.jobTitle}</span>
                <span>{job.company}</span>
                <span>{job.jobId || "-"}</span>
                <span>{job.dateApplied || "-"}</span>
                <span>{job.status}</span>
                <span>{job.notes || "-"}</span>
                <span className="flex gap-3">

  {/* ⭐ STAR */}
  <button
    onClick={async () => {
      await fetch(`http://127.0.0.1:8000/api/job/star/${job.id}/`);
      setJobs(jobs.map(j =>
        j.id === job.id ? { ...j, is_starred: !j.is_starred } : j
      ));
    }}
  >
    {job.is_starred ? "⭐" : "☆"}
  </button>

  {/* 🗑 DELETE */}
  <button
    onClick={async () => {
      await fetch(`http://127.0.0.1:8000/api/job/delete/${job.id}/`);
      setJobs(jobs.filter(j => j.id !== job.id));
    }}
    className="text-red-500"
  >
    Delete
  </button>

</span>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}