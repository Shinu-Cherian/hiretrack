import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function AddJobPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    jobId: "",
    dateApplied: "",
    status: "applied",
    jd: "",
    notes: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/add-job/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/jobs");
    } else {
      alert("Error adding job");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">

          <h2 className="text-xl font-semibold mb-6">Add New Job</h2>

          <div className="grid gap-5">

            <input
              placeholder="Software Engineer"
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("jobTitle", e.target.value)}
            />

            <input
              placeholder="Google"
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("company", e.target.value)}
            />

            <input
              placeholder="JOB-12345"
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("jobId", e.target.value)}
            />

            <input
              type="date"
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("dateApplied", e.target.value)}
            />

            <select
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="applied">Applied</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="selected">Selected</option>
            </select>

            <textarea
              placeholder="Job Description"
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("jd", e.target.value)}
            />

            <textarea
              placeholder="Notes"
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("notes", e.target.value)}
            />

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-3 rounded-xl"
            >
              Add Job
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}