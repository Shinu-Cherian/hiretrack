import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Home from "./Home";
import { apiUrl } from "./api";

export default function AddReferralPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    person_name: "",
    company: "",
    email: "",
    linkedin: "",
    date: "",
    status: "pending",
    notes: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const closePage = () => {
    navigate("/");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const res = await fetch(apiUrl("/api/add-referral/"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/referrals");
    } else if (res.status === 401) {
      alert("Please login again before adding a referral");
      navigate("/login");
    } else {
      alert("Error adding referral");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="blur-sm brightness-75 pointer-events-none">
        <Home />
      </div>

      <div
        className="fixed inset-0 z-50 bg-black/45 flex items-start justify-center p-5 md:p-10 overflow-y-auto"
        onClick={closePage}
      >
        <form
          onSubmit={handleSave}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-3xl bg-gray-50 rounded-2xl shadow-2xl border border-white/70 p-8 md:p-9 modal-box"
        >
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl font-bold text-gray-950">Add New Referral</h1>
            <button type="button" onClick={closePage} className="text-gray-500 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <Field label="Person Name *">
              <input
                required
                autoFocus
                placeholder="John Doe"
                className="form-input"
                value={form.person_name}
                onChange={(e) => handleChange("person_name", e.target.value)}
              />
            </Field>

            <Field label="Company *">
              <input
                required
                placeholder="Google"
                className="form-input"
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                placeholder="john@email.com"
                className="form-input"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Field>

            <Field label="LinkedIn">
              <input
                placeholder="linkedin.com/in/..."
                className="form-input"
                value={form.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
              />
            </Field>

            <Field label="Date Requested">
              <input
                required
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </Field>

            <Field label="Status">
              <select
                className="form-input"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="pending">Requested</option>
                <option value="replied">Replied</option>
                <option value="no_response">No Response</option>
              </select>
            </Field>

            <Field label="Notes" wide>
              <textarea
                placeholder="Any notes..."
                className="form-input min-h-32 resize-y"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </Field>
          </div>

          <button className="mt-7 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold shadow-lg">
            Add Referral
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, wide = false, children }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="block text-lg font-medium text-gray-900 mb-3">{label}</span>
      {children}
    </label>
  );
}
