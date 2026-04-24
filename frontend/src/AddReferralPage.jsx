import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function AddReferralPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    person_name: "",
    company: "",
    email: "",
    date: "",
    status: "pending",
    notes: ""
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/add-referral/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate("/referrals");
    } else {
      alert("Error adding referral");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6">

          <h2 className="text-xl font-semibold mb-6">Add New Referral</h2>

          <div className="grid gap-5">

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="John Doe"
                className="p-3 border rounded-xl"
                onChange={(e) => handleChange("person_name", e.target.value)}
              />
              <input
                placeholder="Google"
                className="p-3 border rounded-xl"
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="john@email.com"
                className="p-3 border rounded-xl"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                className="p-3 border rounded-xl"
                onChange={(e) => handleChange("date", e.target.value)}
              />

              <select
                className="p-3 border rounded-xl"
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                <option value="no_response">No Response</option>
              </select>
            </div>

            <textarea
              placeholder="Notes"
              className="p-3 border rounded-xl"
              onChange={(e) => handleChange("notes", e.target.value)}
            />

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white py-3 rounded-xl"
            >
              Add Referral
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}