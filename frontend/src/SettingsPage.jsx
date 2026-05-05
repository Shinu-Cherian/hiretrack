import { useEffect, useState } from "react";
import { ShieldCheck, ArrowLeft, X, Save, Moon } from "lucide-react";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";

export default function SettingsPage() {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white">
      <Header />

      <main className="max-w-[1600px] mx-auto p-6 animate-fade-in-up">
        <BackButton className="mb-8" isMenu={true} />

        {/* Navigation */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account security and platform preferences.</p>
        </div>

        <div className="max-w-md">
          {/* Security Card */}
          <section className="saas-card p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6044] text-[#121313] flex items-center justify-center mb-6 shadow-xl shadow-[#FF6044]/20">
              <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Security & Privacy</h2>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
              Update your password regularly to keep your data private.
            </p>
            
            <button 
              onClick={() => setPasswordModalOpen(true)}
              className="mt-8 w-full py-4 bg-[#FF6044] text-[#121313] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#ff4d2e] hover:shadow-lg hover:shadow-[#FF6044]/20 transition-all active:scale-95 shadow-md"
            >
              Change Password
            </button>
          </section>
        </div>
      </main>

      {/* PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setPasswordModalOpen(false)}>
          <div 
            className="bg-[#1a1b1b] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 w-full max-w-md overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
              <h3 className="text-xl font-black text-white tracking-tight">Change Password</h3>
              <button 
                onClick={() => setPasswordModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              {message && <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-4 py-3 text-sm font-bold animate-pulse">✓ {message}</div>}
              {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 px-4 py-3 text-sm font-bold">⚠️ {error}</div>}

              <form onSubmit={changePassword} className="grid gap-5">
                <PasswordInput
                  label="Current Password"
                  value={form.current_password}
                  onChange={(value) => setForm({ ...form, current_password: value })}
                />
                <PasswordInput
                  label="New Password"
                  value={form.new_password}
                  onChange={(value) => setForm({ ...form, new_password: value })}
                />
                <PasswordInput
                  label="Confirm Password"
                  value={form.confirm_password}
                  onChange={(value) => setForm({ ...form, confirm_password: value })}
                />

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={saving}
                    className="flex-1 inline-flex justify-center items-center gap-2 bg-[#FF6044] text-[#121313] py-4 rounded-xl shadow-lg shadow-[#FF6044]/10 font-black text-sm uppercase tracking-widest hover:bg-[#ff4d2e] transition-all disabled:opacity-50 active:scale-95"
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
      <span className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
        required
        placeholder="••••••••"
      />
    </label>
  );
}
