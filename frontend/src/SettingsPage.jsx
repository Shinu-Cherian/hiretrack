import { useEffect, useState } from "react";
import { ShieldCheck, ArrowLeft, X, Save, Eye, EyeOff, AlertTriangle, Trash2, ArrowRight } from "lucide-react";
import Header from "./Header";
import { apiUrl } from "./api";
import BackButton from "./components/BackButton";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete Account State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: Confirm, 2: Email, 3: OTP
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const handleRequestDeletionOtp = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError("");

    const res = await fetch(apiUrl("/api/delete-account-otp/"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: deleteEmail }),
    });

    const data = await res.json().catch(() => ({}));
    setDeleteLoading(false);

    if (res.ok) {
      setDeleteStep(3);
    } else {
      setDeleteError(data.error || "Failed to send OTP. Make sure you entered your correct email.");
    }
  };

  const handleConfirmDeletion = async (e) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError("");

    const res = await fetch(apiUrl("/api/delete-account-confirm/"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: deleteEmail, otp: deleteOtp }),
    });

    const data = await res.json().catch(() => ({}));
    setDeleteLoading(false);

    if (res.ok) {
      navigate("/login");
    } else {
      setDeleteError(data.error || "Invalid or expired OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern font-sans text-white flex flex-col">
      <Header />

      <main className="w-full px-6 md:px-12 py-6 animate-fade-in-up">
        <BackButton className="mb-8" isMenu={true} />

        {/* Navigation */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account security and platform preferences.</p>
        </div>

        <div className="flex flex-wrap gap-6 w-full">
          {/* Security Card */}
          <section className="saas-card w-full md:w-[380px] p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6044] text-[#121313] flex items-center justify-center mb-5 shadow-xl shadow-[#FF6044]/20">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Security & Privacy</h2>
            <p className="text-gray-400 mt-2 text-xs leading-relaxed flex-1">
              Update your password regularly to keep your data private and secure from unauthorized access.
            </p>
            
            <button 
              onClick={() => setPasswordModalOpen(true)}
              className="mt-6 w-full py-3 bg-[#FF6044] text-[#121313] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#ff4d2e] hover:shadow-lg hover:shadow-[#FF6044]/20 transition-all active:scale-95 shadow-md"
            >
              Change Password
            </button>
          </section>

          {/* Danger Zone Card */}
          <section className="saas-card w-full md:w-[380px] p-6 flex flex-col items-center text-center border-red-500/10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-5 shadow-xl shadow-red-500/10 border border-red-500/20">
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">Danger Zone</h2>
            <p className="text-gray-400 mt-2 text-xs leading-relaxed flex-1">
              Permanently delete your account and all associated data including applications, referrals, and notes. This action cannot be undone.
            </p>
            
            <button 
              onClick={() => {
                setDeleteModalOpen(true);
                setDeleteStep(1);
                setDeleteEmail("");
                setDeleteOtp("");
                setDeleteError("");
              }}
              className="mt-6 w-full py-3 bg-transparent border border-red-500/30 text-red-400 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete Account
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

      {/* DELETE ACCOUNT MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in" onClick={() => !deleteLoading && setDeleteModalOpen(false)}>
          <div 
            className="bg-[#1a1b1b] rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-red-500/20 w-full max-w-md overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-red-500/10 bg-red-500/5">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                Delete Account
              </h3>
              <button 
                onClick={() => !deleteLoading && setDeleteModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
                disabled={deleteLoading}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              {deleteError && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 px-4 py-3 text-sm font-bold">⚠️ {deleteError}</div>}

              {deleteStep === 1 && (
                <div className="text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 mx-auto flex items-center justify-center mb-6">
                    <Trash2 size={32} className="text-red-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Are you absolutely sure?</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8">
                    This action will permanently delete your account, jobs, referrals, notes, and activity history. This data <strong>cannot</strong> be recovered.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteModalOpen(false)}
                      className="flex-1 py-4 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setDeleteStep(2)}
                      className="flex-1 inline-flex justify-center items-center gap-2 bg-red-500 text-white py-4 rounded-xl shadow-lg shadow-red-500/20 font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95"
                    >
                      Yes, Proceed
                    </button>
                  </div>
                </div>
              )}

              {deleteStep === 2 && (
                <form onSubmit={handleRequestDeletionOtp} className="animate-fade-in">
                  <h4 className="text-lg font-bold text-white mb-2">Confirm Your Identity</h4>
                  <p className="text-gray-400 text-sm mb-6">
                    Please enter your email address to receive an OTP to confirm deletion.
                  </p>
                  
                  <label className="block mb-6">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">Email Address</span>
                    <input
                      type="email"
                      required
                      value={deleteEmail}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#121313] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                    />
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setDeleteStep(1)}
                      className="py-4 px-6 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10 text-sm"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      type="submit"
                      disabled={deleteLoading || !deleteEmail}
                      className="flex-1 inline-flex justify-center items-center gap-2 bg-red-500 text-white py-4 rounded-xl shadow-lg shadow-red-500/20 font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {deleteLoading ? "Sending..." : <>Send OTP <ArrowRight size={18} /></>}
                    </button>
                  </div>
                </form>
              )}

              {deleteStep === 3 && (
                <form onSubmit={handleConfirmDeletion} className="animate-fade-in text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 mx-auto flex items-center justify-center mb-6">
                    <AlertTriangle size={32} className="text-red-500 animate-pulse" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Final Confirmation</h4>
                  <p className="text-gray-400 text-sm mb-6">
                    Enter the 6-digit OTP sent to <strong className="text-white">{deleteEmail}</strong> to permanently delete your account.
                  </p>
                  
                  <label className="block mb-8">
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={deleteOtp}
                      onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="------"
                      className="w-full bg-[#121313] border border-red-500/30 rounded-xl py-4 text-center text-3xl text-white outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all placeholder:text-gray-600 font-black tracking-[0.5em]"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={deleteLoading || deleteOtp.length !== 6}
                    className="w-full inline-flex justify-center items-center gap-2 bg-red-500 text-white py-4 rounded-xl shadow-lg shadow-red-500/20 font-black text-sm uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {deleteLoading ? "Deleting..." : "Permanently Delete Account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordInput({ label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <label className="block">
      <span className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-2">{label}</span>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-input w-full pr-12"
          required
          placeholder="••••••••"
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}
