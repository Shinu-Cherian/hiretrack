import { useEffect, useState } from "react";
import { KeyRound, Moon, ShieldCheck, Sun, ArrowLeft, X, Save } from "lucide-react";
import Header from "./Header";
import { apiUrl } from "./api";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
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
      setTimeout(() => {
        setPasswordModalOpen(false);
        setMessage("");
      }, 2000);
    } else {
      setError(data.error || "Password could not be changed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-dot-pattern font-sans">
      <Header />

      <main className="max-w-5xl mx-auto p-6 animate-fade-in-up">
        {/* Back to menu button */}
        <button 
          onClick={() => window.dispatchEvent(new Event("open-sidebar"))}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <ArrowLeft size={18} /> Menu
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500">Personalize your workspace and secure your account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
          <section className="saas-card p-6">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-4">
              <ShieldCheck />
            </div>
            <h2 className="text-xl font-semibold">Workspace</h2>
            <p className="text-gray-500 text-sm mt-1">Make HireTrack feel comfortable during long job-hunt sessions.</p>

            <div className="mt-6 rounded-2xl border p-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="text-blue-600" /> : <Sun className="text-orange-500" />}
                <div>
                  <p className="font-medium text-gray-900">Dark mode</p>
                  <p className="text-xs text-gray-500">Applies across the app</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDarkMode((value) => !value)}
                className={`relative w-14 h-8 rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${darkMode ? "left-7" : "left-1"}`} />
              </button>
            </div>
          </section>

          <section className="saas-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <KeyRound />
              </div>
              <h2 className="text-xl font-semibold">Security</h2>
              <p className="text-gray-500 text-sm mt-1">Update your account password to stay secure.</p>
            </div>
            
            <button 
              onClick={() => setPasswordModalOpen(true)}
              className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              Change Password
            </button>
          </section>
        </div>
      </main>

      {/* PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setPasswordModalOpen(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button 
                onClick={() => setPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {message && <div className="mb-4 rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm">{message}</div>}
              {error && <div className="mb-4 rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>}

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

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={saving}
                    className="flex-1 inline-flex justify-center items-center gap-2 bg-gray-900 text-white py-3 rounded-xl shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : <><Save size={18} /> Update</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
        required
      />
    </label>
  );
}
