import { useEffect, useMemo, useState } from "react";
import { Building2, Calendar, Edit3, Link2, Mail, Search, Star, Trash2, UserRound, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import Card from "./components/Card";
import HighlightableItem from "./components/HighlightableItem";
import Modal from "./components/Modal";
import ReferralForm from "./components/ReferralForm";
import AuthActionModal from "./components/AuthActionModal";

export default function ViewReferrals() {
  const [search, setSearch] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [searchParams] = useSearchParams();
  const [isDemo, setIsDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [deletingReferral, setDeletingReferral] = useState(null);

  const getStatusBadgeClass = (status) => {
    const baseClass = "rounded-full bg-[#FF6044]/10 border border-[#FF6044]/20 px-3 py-1 text-sm font-bold capitalize transition-colors duration-300";
    switch (status?.toLowerCase()) {
      case "pending":
        return `${baseClass} text-blue-400`;
      case "replied":
        return `${baseClass} text-emerald-400`;
      case "no_response":
      default:
        return `${baseClass} text-[#FF6044]`;
    }
  };

  useEffect(() => {
    fetch(apiUrl("/api/referrals/"), { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          setIsDemo(true);
          return [];
        }
        return res.json();
      })
      .then((data) => setReferrals(Array.isArray(data) ? data : []))
      .catch(() => {
        setIsDemo(true);
        setReferrals([]);
      });
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

  const formatDateString = (dateStr) => {
    if (!dateStr || dateStr === "No Date") return "No Date";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const groupedReferrals = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      const dateA = a.date || "";
      const dateB = b.date || "";
      return dateB.localeCompare(dateA);
    });
    const groups = {};
    sorted.forEach((ref) => {
      const date = ref.date || "No Date";
      if (!groups[date]) groups[date] = [];
      groups[date].push(ref);
    });
    return groups;
  }, [filtered]);

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
    if (isDemo) {
      setShowAuthModal(true);
      return;
    }
    const res = await fetch(apiUrl(`/api/referral/star/${referral.id}/`), { credentials: "include" });
    if (res.ok) {
      setReferrals((current) => current.map((item) => (item.id === referral.id ? { ...item, is_starred: !item.is_starred } : item)));
    }
  };

  const deleteReferral = async (referral) => {
    if (isDemo) {
      setShowAuthModal(true);
      return;
    }
    const res = await fetch(apiUrl(`/api/referral/delete/${referral.id}/`), { credentials: "include" });
    if (res.ok) {
      setReferrals((current) => current.filter((item) => item.id !== referral.id));
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
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Referrals</h1>
            <p className="text-lg text-gray-400 font-light max-w-xl">
              {isDemo 
                ? "Sign in to build and manage your professional referral network."
                : <>You are currently tracking <strong className="font-semibold text-white">{referrals.length}</strong> referrals. Build and manage your network here.</>
              }
            </p>
          </div>

          <div className="hidden md:block relative w-64 h-32 flex-shrink-0 perspective-1000">
             <Referrals3DHero />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 flex justify-end">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Search by contact, company, or email..."
              className="form-input !pl-12 shadow-sm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {Object.keys(groupedReferrals).length === 0 ? (
          <div className="saas-card p-10 text-center text-gray-400">No referrals found</div>
        ) : (
          <div className="space-y-10">
            {/* The Grid Header row displayed right at the very top, before any cards */}
            <div className="hidden grid-cols-8 gap-3 px-4 py-2 border border-transparent text-sm font-bold text-[#FF6044] lg:grid">
              <span className="col-span-2">Contact</span>
              <span>Company</span>
              <span className="col-span-2">Email</span>
              <span>Date</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {Object.entries(groupedReferrals).map(([date, items]) => (
              <div key={date} className="space-y-4">
                {/* Premium Centered Date Divider */}
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                  <span className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1e2020] px-4 py-1.5 text-xs font-bold text-gray-300 shadow-sm">
                    <Calendar size={14} className="text-[#FF6044]" />
                    <span>{formatDateString(date)}</span>
                    <span className="rounded-full bg-[#FF6044]/10 px-2 py-0.5 text-[10px] text-[#FF6044] font-semibold">
                      {items.length} {items.length === 1 ? "referral" : "referrals"}
                    </span>
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                {/* Separate saas-card for each referral item with space-y-3 gap */}
                <div className="space-y-3">
                  {items.map((referral) => (
                    <div key={referral.id} className="saas-card overflow-hidden">
                      <HighlightableItem
                        id={`referral-${referral.id}`}
                        highlighted={String(referral.id) === String(activeHighlight)}
                        className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-8 lg:items-center"
                      >
                        <div className="lg:col-span-2">
                          <p className="flex items-center gap-2 font-semibold text-white">
                            <UserRound size={16} /> {referral.person_name}
                          </p>
                          {referral.linkedin ? (
                            <a href={referral.linkedin} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-[#FF6044] hover:underline font-bold">
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
                        <span>
                          <span className={getStatusBadgeClass(referral.status)}>{referral.status?.replace("_", " ")}</span>
                        </span>
                        <span className="flex gap-2">
                          <IconButton label="Toggle star" onClick={() => toggleStar(referral)}>
                            <Star size={18} className={referral.is_starred ? "fill-yellow-400 text-yellow-400" : ""} />
                          </IconButton>
                          <IconButton label="Edit referral" onClick={() => {
                            if (isDemo) setShowAuthModal(true);
                            else setEditing({ ...referral });
                          }}>
                            <Edit3 size={18} />
                          </IconButton>
                          <IconButton label="Delete referral" danger onClick={() => {
                            if (isDemo) setShowAuthModal(true);
                            else setDeletingReferral(referral);
                          }}>
                            <Trash2 size={18} />
                          </IconButton>
                        </span>
                        {referral.notes && (
                          <div className="rounded-lg bg-[#121313] p-3 text-sm text-gray-400 lg:col-span-8">
                            <strong>Notes:</strong> {referral.notes}
                          </div>
                        )}
                      </HighlightableItem>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {editing && (
        <Modal title="Edit Referral" onClose={() => setEditing(null)} maxWidth="max-w-5xl">
          <BackButton className="mb-6" />
          <ReferralForm key={editing.id} initialValues={editing} submitLabel="Save Changes" onSubmit={saveEdit} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {deletingReferral && (
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-surface/80 backdrop-blur-md animate-fade-in"
          onClick={() => setDeletingReferral(null)}
        >
          <div 
            className="bg-[#121313] border border-white/10 p-12 max-w-md w-full text-center space-y-6 brutalist-shadow relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative skewed background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6044]/5 -skew-x-12 translate-x-16 -translate-y-16 pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-[#FF6044]/10 text-[#FF6044] rounded-none mx-auto flex items-center justify-center border border-[#FF6044]/20">
              <Trash2 size={32} />
            </div>

            <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white">Confirm Deletion</h3>

            <p className="text-gray-400 font-light lowercase tracking-tight italic text-lg leading-relaxed">
              "are you sure you want to delete this referral? this action is permanent. ⚠️"
            </p>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setDeletingReferral(null)}
                className="flex-1 py-3.5 border border-white/20 hover:bg-white/10 transition-all font-display uppercase tracking-widest text-sm font-bold text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteReferral(deletingReferral);
                  setDeletingReferral(null);
                }}
                className="flex-1 py-3.5 bg-[#FF6044] text-[#121313] hover:bg-white hover:text-black transition-all font-display uppercase tracking-widest text-sm font-black"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthActionModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        title="Network Locked"
        message="Referral tracking and LinkedIn syncing are reserved for secure workspaces. Log in to claim yours."
      />
    </div>
  );
}

function Referrals3DHero() {
  return (
    <div className="isometric-container w-full max-w-[200px] scale-75 lg:scale-90 origin-right">
      <div className="bg-transparent rounded-xl border border-white/5 p-3 isometric-card w-full h-[180px] flex flex-col shadow-lg relative">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
           <Users size={16} className="text-[#FF6044]" />
           <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Network Map</div>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative">
           <div className="w-10 h-10 rounded-full bg-[#FF6044]/20 flex items-center justify-center">
              <Users size={20} className="text-[#FF6044]" />
           </div>
           
           <div className="absolute top-2 right-4 w-6 h-6 rounded-full bg-[#121313] border border-white/5"></div>
           <div className="absolute bottom-2 left-4 w-5 h-5 rounded-full bg-[#121313] border border-white/5"></div>
           <div className="absolute top-10 left-2 w-4 h-4 rounded-full bg-[#121313] border border-white/5"></div>
        </div>

        <div className="mt-2 h-1.5 w-full bg-[#121313] rounded-full overflow-hidden">
           <div className="h-full bg-[#FF6044] rounded-full w-2/3"></div>
        </div>
      </div>

      <div className="absolute -right-4 top-10 w-24 bg-[#121313] rounded-xl p-2 isometric-card-layer-1 shadow-xl border border-white/5">
        <div className="text-[8px] font-bold text-[#FF6044] tracking-widest uppercase">Growing</div>
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
      className={`rounded-lg p-2 transition hover:-translate-y-0.5 ${danger ? "text-red-500 hover:bg-red-500/10 hover:text-red-400" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}
    >
      {children}
    </button>
  );
}
