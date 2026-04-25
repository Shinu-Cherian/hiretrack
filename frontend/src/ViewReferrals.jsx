import { useState, useEffect } from "react";
import Header from "./Header";

export default function ViewReferrals() {

  const [search, setSearch] = useState("");
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/referrals/")
      .then(res => res.json())
      .then(data => setReferrals(data));
  }, []);

  const filtered = referrals.filter(r =>
    (r.person_name + r.company)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="p-8">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Referrals</h1>
            <p className="text-gray-500 text-sm">
              {referrals.length} referrals tracked
            </p>
          </div>
        </div>

        <input
          placeholder="Search referrals..."
          className="border p-2 rounded w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">

          <div className="grid grid-cols-6 p-4 border-b text-sm text-gray-500">
            <span>Name</span>
            <span>Company</span>
            <span>Date</span>
            <span>Status</span>
            <span>Notes</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No referrals found
            </div>
          ) : (
            filtered.map(ref => (
              <div key={ref.id} className="grid grid-cols-6 p-4 border-t">
                <span>{ref.person_name}</span>
                <span>{ref.company}</span>
                <span>{ref.date}</span>
                <span className="capitalize">{ref.status}</span>
                <span>{ref.notes || "-"}</span>
                <span className="flex gap-3">

  {/* ⭐ STAR */}
  <button
    onClick={async () => {
      await fetch(`http://127.0.0.1:8000/api/referral/star/${ref.id}/`);
      setReferrals(referrals.map(r =>
        r.id === ref.id ? { ...r, is_starred: !r.is_starred } : r
      ));
    }}
  >
    {ref.is_starred ? "⭐" : "☆"}
  </button>

  {/* 🗑 DELETE */}
  <button
    onClick={async () => {
      await fetch(`http://127.0.0.1:8000/api/referral/delete/${ref.id}/`);
      setReferrals(referrals.filter(r => r.id !== ref.id));
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