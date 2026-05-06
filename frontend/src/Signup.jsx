import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Sparkles, Zap, Star, ShieldCheck, ArrowRight, UserPlus, Lock } from 'lucide-react';
import { apiUrl } from "./api";

function getCSRFToken() {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken"))
    ?.split("=")[1];
}

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    await fetch(apiUrl("/get-csrf/"), { credentials: "include" });

    const res = await fetch(apiUrl("/signup/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
      body: new URLSearchParams({
        username: username,
        password: password,
        confirm_password: confirm,
      }),
    });
    setSubmitting(false);

    if (res.ok) {
      localStorage.setItem("isLoggedIn", "true"); 
      navigate("/login");
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121313] bg-dot-pattern p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6044]/10 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />

      <div className="w-full max-w-5xl z-10 animate-fade-in-up">
        
        <Link to="/" className="flex items-center justify-center gap-3 font-black text-3xl mb-12 group">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6044] flex items-center justify-center shadow-[0_0_20px_rgba(255,96,68,0.4)] group-hover:scale-110 transition-transform">
            <Briefcase className="h-7 w-7 text-[#121313]" />
          </div>
          <span className="text-white tracking-tighter">Hire<span className="text-[#FF6044]">Track</span></span>
        </Link>

        <div className="saas-card overflow-hidden flex flex-col md:flex-row-reverse border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          
          {/* 3D ANIMATION SIDE */}
          <div className="hidden md:flex md:w-1/2 bg-[#1a1b1b] items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF6044]/5 to-transparent z-0" />
            
            {/* Neural Hub Scene */}
            <div className="relative w-64 h-64 flex items-center justify-center perspective-1000">
               {/* Central Core */}
               <div className="w-32 h-32 rounded-[2.5rem] bg-[#FF6044] flex items-center justify-center shadow-[0_0_50px_rgba(255,96,68,0.3)] animate-float z-20">
                  <UserPlus size={48} className="text-[#121313]" />
               </div>

               {/* Orbiting Elements */}
               <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center animate-bounce shadow-xl">
                    <Sparkles size={20} className="text-[#FF6044]" />
                  </div>
               </div>

               <div className="absolute inset-0 animate-spin-slow-reverse" style={{ animationDuration: '12s' }}>
                  <div className="absolute bottom-10 -left-4 w-12 h-12 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center animate-pulse shadow-xl">
                    <Star size={20} className="text-[#FF6044]" />
                  </div>
                  <div className="absolute top-1/2 -right-8 w-14 h-14 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center animate-float shadow-xl">
                    <ShieldCheck size={24} className="text-[#FF6044]" />
                  </div>
               </div>

               {/* Grid Background Effect */}
               <div className="absolute inset-0 border border-white/5 rounded-full animate-ping opacity-20" style={{ animationDuration: '4s' }} />
               <div className="absolute inset-[-40px] border border-white/5 rounded-full animate-ping opacity-10" style={{ animationDuration: '6s' }} />
            </div>

            <div className="absolute bottom-12 text-center px-8">
               <h3 className="text-xl font-black text-white mb-2 tracking-tight">Your Career Command Center</h3>
               <p className="text-gray-500 text-sm leading-relaxed">Join thousands of professionals tracking their future with AI precision.</p>
            </div>
          </div>

          {/* FORM SIDE */}
          <div className="w-full md:w-1/2 p-10 lg:p-14 flex flex-col justify-center bg-[#121313]/50 backdrop-blur-3xl">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create account</h2>
              <div className="h-1 w-12 bg-[#FF6044] rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                  <input
                    type="text"
                    placeholder="Choose a username"
                    className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="group relative w-full bg-[#FF6044] text-[#121313] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(255,96,68,0.2)] hover:bg-[#ff4d2e] hover:shadow-[0_15px_40px_rgba(255,96,68,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 mt-4 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {submitting ? "Processing..." : "Register Now"}
                  {!submitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Already part of the network?{" "}
                <Link to="/login" className="text-[#FF6044] font-black hover:underline underline-offset-4 decoration-2">SIGN IN</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
