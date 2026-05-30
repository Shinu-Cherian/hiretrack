import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { apiUrl } from "./api";
import Header from "./Header";

function evaluatePassword(password) {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score; // 0 to 4
}

export default function ResetPassword() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pwdScore = evaluatePassword(password);
  
  const getScoreColor = () => {
    if (pwdScore <= 1) return 'bg-red-500';
    if (pwdScore === 2 || pwdScore === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreLabel = () => {
    if (pwdScore === 0) return 'Very Weak';
    if (pwdScore === 1) return 'Weak';
    if (pwdScore === 2 || pwdScore === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    
    if (pwdScore < 2) {
        setError("Please choose a stronger password");
        return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(apiUrl("/reset-password/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uidb64, token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.error || "Invalid or expired link");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern relative overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-xl z-10 animate-fade-in-up">
          <div className="saas-card overflow-hidden flex flex-col border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-[#121313]/80 backdrop-blur-3xl p-10 lg:p-14">
            <div className="mb-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1b1b] border border-[#FF6044]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,96,68,0.15)] animate-float">
                <Lock size={32} className="text-[#FF6044]" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create New Password</h2>
              <p className="text-gray-400 text-sm">Your new password must be different from previous used passwords.</p>
            </div>

            {success ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-6 text-center animate-fade-in-up">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <p className="font-medium">{success}</p>
                <p className="text-sm mt-2 text-green-400/70">Redirecting to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-3 pl-11 pr-12 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Password Strength Meter */}
                  {password && (
                    <div className="flex items-center gap-3 mt-2 px-1 animate-fade-in-up">
                      <div className="flex-1 flex gap-1 h-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level} 
                            className={`flex-1 rounded-full transition-all duration-300 ${pwdScore >= level ? getScoreColor() : 'bg-white/10'}`} 
                          />
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${pwdScore >= 2 ? 'text-green-500' : 'text-red-500'}`}>
                        {getScoreLabel()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <div className="relative group">
                    <CheckCircle2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium ${confirm && password !== confirm ? 'border-red-500/50' : ''}`}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting || !password || !confirm}
                  className="group relative w-full bg-[#FF6044] text-[#121313] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(255,96,68,0.2)] hover:bg-[#ff4d2e] hover:shadow-[0_15px_40px_rgba(255,96,68,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 mt-4 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? "Resetting..." : "Reset Password"}
                    {!submitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
