import { useState, useEffect } from "react";
import { Edit3, Mail, Search, Star, Trash2, X } from "lucide-react";
import Header from "./Header";
import { apiUrl } from "./api";

export default function ViewReferrals() {
  const [search, setSearch] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch(apiUrl("/api/referrals/"), {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setReferrals(Array.isArray(data) ? data : []));
  }, []);

  const filtered = referrals.filter((r) =>
    `${r.person_name} ${r.company}`.toLowerCase().includes(search.toLowerCase())
  );

  const saveEdit = async () => {
    const res = await fetch(apiUrl(`/api/referral/update/${editing.id}/`), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      setReferrals(referrals.map((ref) => (ref.id === editing.id ? editing : ref)));
      setEditing(null);
    } else {
      alert("Could not update referral");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Header />

      <main className="p-6 animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Referrals</h1>
            <p className="text-gray-500">{referrals.length} referrals tracked for this account</p>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              placeholder="Search referrals..."
              className="border p-3 pl-10 rounded-xl w-full bg-white/85 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white/85 rounded-2xl shadow overflow-hidden">
          <div className="hidden lg:grid grid-cols-7 p-4 border-b text-sm text-gray-500">
            <span>Name</span>
            <span>Company</span>
            <span>Email</span>
            <span>Date</span>
            <span>Status</span>
            <span>Notes</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No referrals found</div>
          ) : (
            filtered.map((ref) => (
              <div key={ref.id} className="grid grid-cols-1 lg:grid-cols-7 gap-3 p-4 border-t items-center">
                <span className="font-medium">{ref.person_name}</span>
                <span>{ref.company}</span>
                <span className="flex items-center gap-2 text-sm text-gray-500"><Mail size={14} /> {ref.email || "-"}</span>
                <span>{ref.date || "-"}</span>
                <span className="capitalize">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm">{ref.status}</span>
                </span>
                <span className="text-sm text-gray-500">{ref.notes || "-"}</span>
                <span className="flex gap-2">
                  <IconButton
                    onClick={async () => {
                      await fetch(apiUrl(`/api/referral/star/${ref.id}/`), { credentials: "include" });
                      setReferrals(referrals.map((r) => (r.id === ref.id ? { ...r, is_starred: !r.is_starred } : r)));
                    }}
                  >
                    <Star size={18} className={ref.is_starred ? "fill-yellow-400 text-yellow-400" : ""} />
                  </IconButton>
                  <IconButton onClick={() => setEditing({ ...ref })}>
                    <Edit3 size={18} />
                  </IconButton>
                  <IconButton
                    danger
                    onClick={async () => {
                      await fetch(apiUrl(`/api/referral/delete/${ref.id}/`), { credentials: "include" });
                      setReferrals(referrals.filter((r) => r.id !== ref.id));
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </span>
              </div>
            ))
          )}
        </div>
      </main>

      {editing && (
        <Modal title="Edit Referral" onClose={() => setEditing(null)} onSave={saveEdit}>
          <Input label="Person Name" value={editing.person_name} onChange={(value) => setEditing({ ...editing, person_name: value })} />
          <Input label="Company" value={editing.company} onChange={(value) => setEditing({ ...editing, company: value })} />
          <Input label="Email" type="email" value={editing.email || ""} onChange={(value) => setEditing({ ...editing, email: value })} />
          <Input label="Date" type="date" value={editing.date || ""} onChange={(value) => setEditing({ ...editing, date: value })} />
          <label>
            <span className="text-sm font-medium text-gray-600">Status</span>
            <select className="mt-1 w-full rounded-xl border p-3" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="no_response">No Response</option>
            </select>
          </label>
          <Textarea label="Notes" value={editing.notes || ""} onChange={(value) => setEditing({ ...editing, notes: value })} />
        </Modal>
      )}
    </div>
  );
}

function IconButton({ children, onClick, danger = false }) {
  return (
    <button onClick={onClick} className={`p-2 rounded-lg ${danger ? "text-red-500 hover:bg-red-50" : "hover:bg-gray-100"}`}>
      {children}
    </button>
  );
}

function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 modal-box max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 rounded-xl bg-blue-600 text-white">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label>
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <input type={type} className="mt-1 w-full rounded-xl border p-3" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="md:col-span-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <textarea className="mt-1 w-full rounded-xl border p-3" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
