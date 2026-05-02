import { useEffect, useMemo, useState } from "react";
import { Building2, Calendar, Edit3, Link2, Mail, Search, Star, Trash2, UserRound } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";
import HighlightableItem from "./components/HighlightableItem";
import Modal from "./components/Modal";
import ReferralForm from "./components/ReferralForm";

export default function ViewReferrals() {
  const [search, setSearch] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetch(apiUrl("/api/referrals/"), { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setReferrals(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    const id = searchParams.get("highlight");
    if (!id || referrals.length === 0) return;

    const startTimer = window.setTimeout(() => {
      setActiveHighlight(id);
      document.getElementById(`referral-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    const endTimer = window.setTimeout(() => setActiveHighlight(null), 3100);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [referrals.length, searchParams]);

  const filtered = useMemo(
    () => referrals.filter((ref) => `${ref.person_name} ${ref.company} ${ref.email || ""}`.toLowerCase().includes(search.toLowerCase())),
    [referrals, search]
  );

  const saveEdit = async (form) => {
    const res = await fetch(apiUrl(`/api/referral/update/${editing.id}/`), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setReferrals((current) => current.map((ref) => (ref.id === editing.id ? { ...ref, ...form } : ref)));
      setEditing(null);
      return;
    }

    alert("Could not update referral");
  };

  const toggleStar = async (referral) => {
    const res = await fetch(apiUrl(`/api/referral/star/${referral.id}/`), { credentials: "include" });
    if (res.ok) {
      setReferrals((current) => current.map((item) => (item.id === referral.id ? { ...item, is_starred: !item.is_starred } : item)));
    }
  };

  const deleteReferral = async (referral) => {
    const res = await fetch(apiUrl(`/api/referral/delete/${referral.id}/`), { credentials: "include" });
    if (res.ok) {
      setReferrals((current) => current.filter((item) => item.id !== referral.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans">
      <Header />

      <main className="mx-auto max-w-7xl p-6 lg:p-8 animate-fade-in-up">
        <BackButton className="mb-6" />
        
        {/* Hero Header */}
        <div className="saas-card p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gray-100/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">Referrals</h1>
            <p className="text-lg text-gray-500 font-light max-w-xl">
              You are currently tracking <strong className="font-semibold text-gray-900">{referrals.length}</strong> referrals. Build and manage your network here.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              placeholder="Search by contact, company, or email..."
              className="form-input pl-11 shadow-sm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="saas-card overflow-hidden">
          <div className="hidden grid-cols-8 gap-3 border-b border-gray-100 p-4 text-sm font-semibold text-gray-500 lg:grid">
            <span className="col-span-2">Contact</span>
            <span>Company</span>
            <span className="col-span-2">Email</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No referrals found</div>
          ) : (
            filtered.map((referral) => (
              <HighlightableItem
                key={referral.id}
                id={`referral-${referral.id}`}
                highlighted={String(referral.id) === String(activeHighlight)}
                className="grid grid-cols-1 gap-3 border-t p-4 first:border-t-0 lg:grid-cols-8 lg:items-center"
              >
                <div className="lg:col-span-2">
                  <p className="flex items-center gap-2 font-semibold text-gray-950">
                    <UserRound size={16} /> {referral.person_name}
                  </p>
                  {referral.linkedin ? (
                    <a href={referral.linkedin} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <Link2 size={14} /> LinkedIn URL
                    </a>
                  ) : (
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-400">
                      <Link2 size={14} /> No LinkedIn URL
                    </p>
                  )}
                </div>
                <Meta icon={<Building2 size={15} />} value={referral.company} />
                <div className="lg:col-span-2">
                  <Meta icon={<Mail size={15} />} value={referral.email} />
                </div>
                <Meta icon={<Calendar size={15} />} value={referral.date} />
                <span className="capitalize">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">{referral.status}</span>
                </span>
                <span className="flex gap-2">
                  <IconButton label="Toggle star" onClick={() => toggleStar(referral)}>
                    <Star size={18} className={referral.is_starred ? "fill-yellow-400 text-yellow-400" : ""} />
                  </IconButton>
                  <IconButton label="Edit referral" onClick={() => setEditing({ ...referral })}>
                    <Edit3 size={18} />
                  </IconButton>
                  <IconButton label="Delete referral" danger onClick={() => deleteReferral(referral)}>
                    <Trash2 size={18} />
                  </IconButton>
                </span>
                {referral.notes && (
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 lg:col-span-8">
                    <strong>Notes:</strong> {referral.notes}
                  </div>
                )}
              </HighlightableItem>
            ))
          )}
        </div>
      </main>

      {editing && (
        <Modal title="Edit Referral" onClose={() => setEditing(null)}>
          <BackButton className="mb-6" />
          <ReferralForm key={editing.id} initialValues={editing} submitLabel="Save Changes" onSubmit={saveEdit} onCancel={() => setEditing(null)} />
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
