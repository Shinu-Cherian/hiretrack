import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Home from "./Home";
import { apiUrl } from "./api";

export default function AddJobPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    jobId: "",
    platform: "",
    dateApplied: "",
    status: "applied",
    salaryRange: "",
    jd: "",
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

    const res = await fetch(apiUrl("/api/add-job/"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/jobs");
    } else if (res.status === 401) {
      alert("Please login again before adding a job");
      navigate("/login");
    } else {
      alert("Error adding job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="blur-sm brightness-75 pointer-events-none">
        <Home />
      </div>

      <div
        className="fixed inset-0 z-50 bg-black/45 flex items-start justify-center p-5 md:p-8 overflow-y-auto"
        onClick={closePage}
      >
        <form
          onSubmit={handleSave}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-3xl bg-gray-50 rounded-2xl shadow-2xl border border-white/70 p-8 md:p-9 modal-box"
        >
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl font-bold text-gray-950">Add New Job</h1>
            <button type="button" onClick={closePage} className="text-gray-500 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <Field label="Job Title *">
              <input
                required
                autoFocus
                placeholder="Software Engineer"
                className="form-input"
                value={form.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
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

            <Field label="Job ID">
              <input
                placeholder="JOB-12345"
                className="form-input"
                value={form.jobId}
                onChange={(e) => handleChange("jobId", e.target.value)}
              />
            </Field>

            <Field label="Platform">
              <input
                placeholder="LinkedIn, Indeed..."
                className="form-input"
                value={form.platform}
                onChange={(e) => handleChange("platform", e.target.value)}
              />
            </Field>

            <Field label="Date Applied">
              <input
                required
                type="date"
                className="form-input"
                value={form.dateApplied}
                onChange={(e) => handleChange("dateApplied", e.target.value)}
              />
            </Field>

            <Field label="Status">
              <select
                className="form-input"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="selected">Selected</option>
              </select>
            </Field>

            <Field label="Salary Range" wide>
              <input
                placeholder="$100k - $150k"
                className="form-input"
                value={form.salaryRange}
                onChange={(e) => handleChange("salaryRange", e.target.value)}
              />
            </Field>

            <Field label="Job Description" wide>
              <textarea
                placeholder="Paste JD here..."
                className="form-input min-h-28 resize-y"
                value={form.jd}
                onChange={(e) => handleChange("jd", e.target.value)}
              />
            </Field>

            <Field label="Notes" wide>
              <textarea
                placeholder="Any notes..."
                className="form-input min-h-24 resize-y"
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </Field>
          </div>

          <button className="mt-7 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold shadow-lg">
            Add Job
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
