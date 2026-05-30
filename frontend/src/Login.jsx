import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Key, User, ArrowRight, ShieldCheck, Zap, Sparkles, X, Lock } from "lucide-react";
import { apiUrl, syncAuthStorage } from "./api";
import Header from "./Header";

function getCSRFToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken"))
    ?.split("=")[1];
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch(apiUrl("/login/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
      body: new URLSearchParams({ username, password }),
    });

    setSubmitting(false);

    if (res.ok) {
      const data = await res.json();
      syncAuthStorage({ authenticated: true, username: data.username || username, profile_pic: data.profile_pic });
      const nextPath = typeof location.state?.from === "string" ? location.state.from : "/";
      navigate(nextPath);
      window.location.reload();
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern relative overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl z-10 animate-fade-in-up">

        <div className="saas-card overflow-hidden flex flex-col md:flex-row border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          
          {/* 3D ANIMATION SIDE */}
          <div className="hidden md:flex md:w-5/12 bg-[#1a1b1b] flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="relative w-full flex-1 flex items-center justify-center perspective-1000">
                {/* Holographic grid floor */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF60441a_1px,transparent_1px),linear-gradient(to_bottom,#FF60441a_1px,transparent_1px)] bg-[size:2rem_2rem] [transform:rotateX(60deg)_translateZ(-50px)] opacity-30 animate-pulse" />
                
                {/* 3D Ring 1 */}
                <div className="absolute w-48 h-48 border-2 border-[#FF6044]/30 rounded-full animate-spin-slow" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg) rotateY(20deg)' }}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-[#FF6044] rounded-full shadow-[0_0_15px_#FF6044] -translate-x-1/2 -translate-y-1/2" />
                </div>
                
                {/* 3D Ring 2 */}
                <div className="absolute w-64 h-64 border border-white/10 rounded-full animate-spin-slow-reverse" style={{ animationDuration: '15s', transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateY(-20deg)' }}>
                  <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] -translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Central Data Core */}
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF6044] to-[#cc4c36] flex items-center justify-center shadow-[0_0_60px_rgba(255,96,68,0.4)] animate-float z-20 overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 blur-xl group-hover:blur-md transition-all duration-500" />
                  <Lock size={32} className="text-[#121313] relative z-10" />
                </div>

                {/* Floating Holograms */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-bounce shadow-xl" style={{ animationDelay: '0.5s' }}>
                    <Key size={18} className="text-[#FF6044]" />
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin-slow-reverse" style={{ animationDuration: '25s' }}>
                  <div className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '1s' }}>
                    <Zap size={20} className="text-[#FF6044]" />
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '30s' }}>
                  <div className="absolute top-1/3 right-1/3 w-10 h-10 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-bounce shadow-xl" style={{ animationDelay: '2s' }}>
                    <User size={16} className="text-[#FF6044]" />
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin-slow-reverse" style={{ animationDuration: '35s' }}>
                  <div className="absolute bottom-1/3 left-1/3 w-10 h-10 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '3s' }}>
                    <Sparkles size={16} className="text-[#FF6044]" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-center w-full mt-6">
                 <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide leading-tight drop-shadow-md">Secure Access Protocol</h3>
                 <p className="text-[#FF6044] font-bold uppercase tracking-[0.2em] text-[10px]">Encrypted workspace for your professional growth and career data.</p>
              </div>
          </div>

          {/* FORM SIDE */}
          <div className="w-full md:w-7/12 p-6 lg:px-12 lg:py-8 flex flex-col justify-center bg-[#121313]/50 backdrop-blur-3xl">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back</h2>
              <div className="h-1 w-12 bg-[#FF6044] rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email or Username</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" className="text-[10px] text-gray-500 hover:text-[#FF6044] transition-colors font-bold uppercase tracking-widest">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  {submitting ? "Authenticating..." : "Sign In"}
                  {!submitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-white/5 text-center">
              <p className="text-sm text-gray-500 font-medium">
                New to HireTrack?{" "}
                <Link to="/signup" className="text-[#FF6044] font-black hover:underline underline-offset-4 decoration-2">CREATE ACCOUNT</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);
}
