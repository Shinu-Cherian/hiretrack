import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { apiUrl } from "./api";
import Header from "./Header";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(apiUrl("/api/forgot-password/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.error || "An error occurred");
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
          <Link to="/login" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-6 font-medium text-sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
          <div className="saas-card overflow-hidden flex flex-col border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-[#121313]/80 backdrop-blur-3xl p-10 lg:p-14">
            <div className="mb-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1b1b] border border-[#FF6044]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,96,68,0.15)] animate-float">
                <ShieldCheck size={32} className="text-[#FF6044]" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Reset Password</h2>
              <p className="text-gray-400 text-sm">Enter your email address and we'll send you a link to securely reset your password.</p>
            </div>

            {message ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-6 text-center animate-fade-in-up">
                <p className="font-medium">{message}</p>
                <p className="text-sm mt-2 text-green-400/70">Please check your spam folder if you don't see it.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting || !email}
                  className="group relative w-full bg-[#FF6044] text-[#121313] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(255,96,68,0.2)] hover:bg-[#ff4d2e] hover:shadow-[0_15px_40px_rgba(255,96,68,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 mt-4 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? "Sending Link..." : "Send Reset Link"}
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
