import { useEffect, useState } from "react";
import Header from "./Header";
import { apiUrl } from "./api";

export default function StarredPage() {

  const [jobs, setJobs] = useState([]);
  const [refs, setRefs] = useState([]);

  useEffect(() => {
    fetch(apiUrl("/api/starred/"), {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setJobs(data.jobs || []);
        setRefs(data.referrals || []);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="p-8">

        <h1 className="text-3xl font-bold mb-8">⭐ Starred</h1>

        {/* ================= JOBS ================= */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">📌 Starred Jobs</h2>

          <div className="bg-white rounded-xl shadow">

            <div className="grid grid-cols-6 p-4 border-b text-sm text-gray-500">
              <span>Role</span>
              <span>Company</span>
              <span>Job ID</span>
              <span>Date</span>
              <span>Status</span>
              <span>Notes</span>
            </div>

            {jobs.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No starred jobs
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="grid grid-cols-6 p-4 border-t">
                  <span>{job.jobTitle}</span>
                  <span>{job.company}</span>
                  <span>{job.jobId || "-"}</span>
                  <span>{job.dateApplied}</span>
                  <span>{job.status}</span>
                  <span>{job.notes || "-"}</span>
                </div>
              ))
            )}

          </div>
        </div>

        {/* ================= REFERRALS ================= */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🤝 Starred Referrals</h2>

          <div className="bg-white rounded-xl shadow">

            <div className="grid grid-cols-6 p-4 border-b text-sm text-gray-500">
              <span>Name</span>
              <span>Company</span>
              <span>Email</span>
              <span>Date</span>
              <span>Status</span>
              <span>Notes</span>
            </div>

            {refs.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No starred referrals
              </div>
            ) : (
              refs.map(ref => (
                <div key={ref.id} className="grid grid-cols-6 p-4 border-t">
                  <span>{ref.person_name}</span>
                  <span>{ref.company}</span>
                  <span>{ref.email || "-"}</span>
                  <span>{ref.date}</span>
                  <span>{ref.status}</span>
                  <span>{ref.notes || "-"}</span>
                </div>
              ))
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
