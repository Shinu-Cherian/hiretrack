import { useEffect, useState } from "react";
import { KeyRound, Moon, Save, ShieldCheck, Sun } from "lucide-react";
import Header from "./Header";
import { apiUrl } from "./api";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const changePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch(apiUrl("/api/change-password/"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (res.ok) {
      setMessage("Password changed successfully.");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } else {
      setError(data.error || "Password could not be changed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans">
      <Header />

      <main className="max-w-5xl mx-auto p-6 animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Personalize your workspace and secure your account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 saas-card p-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-4">
              <ShieldCheck />
            </div>
            <h2 className="text-xl font-semibold">Workspace</h2>
            <p className="text-gray-500 text-sm mt-1">Make HireTrack feel comfortable during long job-hunt sessions.</p>

            <div className="mt-6 rounded-2xl border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="text-blue-600" /> : <Sun className="text-orange-500" />}
                <div>
                  <p className="font-medium">Dark mode</p>
                  <p className="text-xs text-gray-500">Applies across the app</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDarkMode((value) => !value)}
                className={`relative w-14 h-8 rounded-full ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${darkMode ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </section>

          <section className="lg:col-span-2 saas-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <KeyRound />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Change Password</h2>
                <p className="text-gray-500 text-sm">Update your account password securely.</p>
              </div>
            </div>

            {message && <div className="mb-4 rounded-xl bg-green-50 text-green-700 px-4 py-3">{message}</div>}
            {error && <div className="mb-4 rounded-xl bg-red-50 text-red-600 px-4 py-3">{error}</div>}

            <form onSubmit={changePassword} className="grid gap-4">
              <PasswordInput
                label="Current password"
                value={form.current_password}
                onChange={(value) => setForm({ ...form, current_password: value })}
              />
              <PasswordInput
                label="New password"
                value={form.new_password}
                onChange={(value) => setForm({ ...form, new_password: value })}
              />
              <PasswordInput
                label="Confirm new password"
                value={form.confirm_password}
                onChange={(value) => setForm({ ...form, confirm_password: value })}
              />

              <button
                disabled={saving}
                className="mt-2 inline-flex w-fit items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                <Save size={18} /> {saving ? "Saving..." : "Update Password"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input mt-1"
      />
    </label>
  );
}
