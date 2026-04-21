import { useState } from "react";
import Header from "./Header";

export default function ViewReferrals() {

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [referrals, setReferrals] = useState([
    {
      id: 1,
      name: "Rahul",
      company: "Google",
      role: "SDE",
      status: "requested",
      date: "2026-04-20"
    }
  ]);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    linkedin: "",
    date: "",
    status: "requested",
    notes: ""
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleAdd = () => {
    const newReferral = {
      id: Date.now(),
      name: form.name,
      company: form.company,
      role: "Referral",
      status: form.status,
      date: form.date
    };

    setReferrals([newReferral, ...referrals]);
    setShowModal(false);

    setForm({
      name: "",
      company: "",
      email: "",
      linkedin: "",
      date: "",
      status: "requested",
      notes: ""
    });
  };

  const filtered = referrals.filter(r =>
    (r.name + r.company + r.role)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 HEADER */}
      <Header />

      {/* 🔥 CONTENT WRAPPER */}
      <div className="p-8">

        {/* PAGE HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Referrals</h1>
            <p className="text-gray-500 text-sm">
              {referrals.length} referrals tracked
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Referral
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search referrals..."
          className="border p-2 rounded w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="mt-6 bg-white rounded-xl shadow overflow-hidden">

          <div className="grid grid-cols-6 p-4 border-b text-sm text-gray-500">
            <span>Name</span>
            <span>Company</span>
            <span>Role</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No referrals found
            </div>
          ) : (
            filtered.map(ref => (
              <div key={ref.id} className="grid grid-cols-6 p-4 border-t">
                <span>{ref.name}</span>
                <span>{ref.company}</span>
                <span>{ref.role}</span>
                <span>{ref.date}</span>

                <span className="text-blue-600 capitalize">
                  {ref.status}
                </span>

                <span>
                  <button
                    onClick={() =>
                      setReferrals(referrals.filter(r => r.id !== ref.id))
                    }
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

      {/* 🔥 MODAL OUTSIDE CONTENT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6">Add New Referral</h2>

            <div className="grid gap-5">

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="John Doe"
                  className="p-3 border rounded-xl"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <input
                  placeholder="Google"
                  className="p-3 border rounded-xl"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="john@email.com"
                  className="p-3 border rounded-xl"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                <input
                  placeholder="linkedin.com/in/..."
                  className="p-3 border rounded-xl"
                  value={form.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="p-3 border rounded-xl"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
                <select
                  className="p-3 border rounded-xl"
                  value={form.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="requested">Requested</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <textarea
                placeholder="Any notes..."
                className="p-3 border rounded-xl"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />

              <button
                onClick={handleAdd}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
              >
                Add Referral
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}