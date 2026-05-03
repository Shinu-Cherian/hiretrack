import { useEffect, useState } from "react";
import { Briefcase, Calendar, Handshake, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";

export default function StarredPage() {
  const [jobs, setJobs] = useState([]);
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(apiUrl("/api/starred/"), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs || []);
        setRefs(data.referrals || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const openItem = (type, id) => {
    navigate(type === "referral" ? `/referrals?highlight=${id}` : `/jobs?highlight=${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans">
      <Header />

      <main className="mx-auto max-w-5xl p-6 animate-fade-in-up">
        <BackButton className="mb-5" isMenu={true} />

        <div className="mb-6">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-950">
            <Star className="fill-yellow-400 text-yellow-400" /> Starred
          </h1>
          <p className="mt-1 text-gray-500">Open a saved item to jump to it and highlight it in context.</p>
        </div>

        {loading ? (
          <div className="saas-card p-10 text-center text-gray-500">Loading starred items...</div>
        ) : (
          <div className="space-y-8">
            <StarredSection
              title="Starred Jobs"
              empty="No starred jobs"
              items={jobs}
              renderItem={(job) => (
                <StarredButton key={job.id} icon={<Briefcase size={19} />} onClick={() => openItem("job", job.id)}>
                  <span>
                    <span className="block font-semibold text-gray-950">{job.jobTitle} at {job.company}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1"><Calendar size={14} /> {job.dateApplied || "-"}</span>
                      <span className="capitalize">{job.status || "-"}</span>
                      <span>{job.platform || "No platform"}</span>
                    </span>
                  </span>
                </StarredButton>
              )}
            />

            <StarredSection
              title="Starred Referrals"
              empty="No starred referrals"
              items={refs}
              renderItem={(ref) => (
                <StarredButton key={ref.id} icon={<Handshake size={19} />} onClick={() => openItem("referral", ref.id)}>
                  <span>
                    <span className="block font-semibold text-gray-950">{ref.person_name} at {ref.company}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1"><Calendar size={14} /> {ref.date || "-"}</span>
                      <span className="capitalize">{ref.status || "-"}</span>
                      <span>{ref.email || "No email"}</span>
                    </span>
                  </span>
                </StarredButton>
              )}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function StarredSection({ title, empty, items, renderItem }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold text-gray-950">{title}</h2>
      <div className="saas-card overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">{empty}</div>
        ) : (
          items.map(renderItem)
        )}
      </div>
    </section>
  );
}

function StarredButton({ icon, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-gray-100 p-4 text-left transition hover:bg-blue-50/70 last:border-b-0"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-950 text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}
