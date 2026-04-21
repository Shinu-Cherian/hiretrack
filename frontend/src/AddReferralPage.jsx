import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function AddReferralPage() {

  const navigate = useNavigate();

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

  const handleSave = () => {
    console.log(form);
    navigate("/referrals");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 HEADER */}
      <Header />

      {/* 🔥 CENTER CONTENT */}
      <div className="flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">

          <h2 className="text-xl font-semibold mb-6">Add New Referral</h2>

          <div className="grid gap-5">

            {/* ROW 1 */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium">Person Name *</label>
                <input
                  placeholder="John Doe"
                  className="mt-1 w-full p-3 border rounded-xl"
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Company *</label>
                <input
                  placeholder="Google"
                  className="mt-1 w-full p-3 border rounded-xl"
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </div>

            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  placeholder="john@email.com"
                  className="mt-1 w-full p-3 border rounded-xl"
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">LinkedIn</label>
                <input
                  placeholder="linkedin.com/in/..."
                  className="mt-1 w-full p-3 border rounded-xl"
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                />
              </div>

            </div>

            {/* ROW 3 */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium">Date Requested</label>
                <input
                  type="date"
                  className="mt-1 w-full p-3 border rounded-xl"
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className="mt-1 w-full p-3 border rounded-xl"
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="requested">Requested</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

            </div>

            {/* NOTES */}
            <div>
              <label className="text-sm font-medium">Notes</label>
              <textarea
                placeholder="Any notes..."
                className="mt-1 w-full p-3 border rounded-xl"
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Add Referral
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}