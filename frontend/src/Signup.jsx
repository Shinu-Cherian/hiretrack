import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Star, ShieldCheck, ArrowRight, UserPlus, Lock, Mail, User, Eye, EyeOff, CheckCircle2, X, Briefcase, FileText, Loader2 } from 'lucide-react';
import { apiUrl } from "./api";
import Header from "./Header";

function getCSRFToken() {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken"))
    ?.split("=")[1];
}

// Password strength evaluator
function evaluatePassword(password) {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score; // 0 to 4
}

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [usernameSuffix, setUsernameSuffix] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Only generate when BOTH First Name and Last Name are provided
    if (!firstName || !lastName) {
      setUsernameSuffix(null);
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    const timeoutId = setTimeout(() => {
      setUsernameSuffix(Math.floor(1000 + Math.random() * 9000));
      setIsGenerating(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [firstName, lastName]);

  const generatedUsername = (firstName && lastName) && usernameSuffix && !isGenerating
    ? `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${usernameSuffix}`
    : "";

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
    
    if (!agreed) {
      alert("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    setSubmitting(true);
    await fetch(apiUrl("/get-csrf/"), { credentials: "include" });

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      confirm_password: confirm,
      username: generatedUsername
    };

    const res = await fetch(apiUrl("/signup/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    
    setSubmitting(false);

    if (res.ok) {
      const nextPath = typeof location.state?.from === "string" ? location.state.from : "/";
      navigate("/login", { state: { from: nextPath } });
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern relative overflow-hidden flex flex-col">
      <Header />

      {/* TERMS MODAL */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1a1b1b] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Terms & Privacy Policy</h2>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-400 text-sm leading-relaxed space-y-4 custom-scrollbar">
              <p>Welcome to HireTrack. By using our service, you agree to these terms.</p>
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">1. Data Security & Privacy</h3>
              <p>Your job application data, notes, and professional history are securely stored. We will never sell your personal data to third-party advertisers or recruiters without your explicit consent.</p>
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">2. Account Responsibilities</h3>
              <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">3. Acceptable Use</h3>
              <p>You agree not to misuse the HireTrack platform. This includes not interfering with our services, trying to access them using a method other than the interface and the instructions that we provide, or using the platform for automated bot scraping.</p>
              <h3 className="text-white font-bold uppercase tracking-wider text-xs">4. Modifications to Service</h3>
              <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.</p>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#121313] flex justify-end">
              <button 
                onClick={() => {
                  setAgreed(true);
                  setShowTerms(false);
                }}
                className="bg-[#FF6044] text-[#121313] px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center gap-2"
              >
                <CheckCircle2 size={18} /> I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl z-10 animate-fade-in-up">
          <div className="saas-card overflow-hidden flex flex-col md:flex-row-reverse border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            
            {/* 3D ANIMATION & MARKETING SIDE */}
            <div className="hidden md:flex md:w-5/12 bg-[#1a1b1b] flex-col items-center justify-center p-8 relative overflow-hidden">
              {/* Radiant glow removed as requested */}
              
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
                  <UserPlus size={32} className="text-[#121313] relative z-10" />
                </div>

                {/* Floating Holograms */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-bounce shadow-xl" style={{ animationDelay: '0.5s' }}>
                    <Sparkles size={18} className="text-[#FF6044]" />
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin-slow-reverse" style={{ animationDuration: '25s' }}>
                  <div className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '1s' }}>
                    <ShieldCheck size={20} className="text-[#FF6044]" />
                  </div>
                </div>
                {/* 2 New Floating Holograms added as requested */}
                <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '30s' }}>
                  <div className="absolute top-1/3 right-1/3 w-10 h-10 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-bounce shadow-xl" style={{ animationDelay: '2s' }}>
                    <Briefcase size={16} className="text-[#FF6044]" />
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin-slow-reverse" style={{ animationDuration: '35s' }}>
                  <div className="absolute bottom-1/3 left-1/3 w-10 h-10 rounded-xl bg-[#1a1b1b]/80 border border-white/10 backdrop-blur-md flex items-center justify-center animate-float shadow-xl" style={{ animationDelay: '3s' }}>
                    <FileText size={16} className="text-[#FF6044]" />
                  </div>
                </div>
              </div>

              <div className="relative z-10 text-center w-full mt-6">
                 <h3 className="text-2xl font-extrabold text-white mb-2 tracking-wide leading-tight drop-shadow-md">The ultimate Career Command Center for ambitious developers.</h3>
                 <p className="text-[#FF6044] font-bold uppercase tracking-[0.2em] text-[10px]">Take control of your job hunt.<br/>Build your future.</p>
              </div>
            </div>

            {/* FORM SIDE */}
            <div className="w-full md:w-7/12 p-6 lg:px-12 lg:py-8 flex flex-col justify-center bg-[#121313]/80 backdrop-blur-3xl">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Create account</h2>
                <div className="h-1 w-12 bg-[#FF6044] rounded-full" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* ROW 1: First Name & Last Name */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ROW 2: Work Email & Auto Username */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Generated Username</label>
                    <div className="relative group">
                      {isGenerating ? (
                        <Loader2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6044] animate-spin" />
                      ) : (
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors" />
                      )}
                      <input
                        type="text"
                        placeholder="Auto-generated"
                        className={`w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm outline-none cursor-not-allowed font-black select-none ${isGenerating ? 'text-gray-500 animate-pulse' : 'text-[#FF6044]'}`}
                        value={isGenerating ? "Generating username..." : generatedUsername}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* ROW 3: Password & Confirm Password */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-2.5 pl-11 pr-10 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
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
                    {password.length > 0 && (
                      <div className="pt-1.5 px-1">
                        <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-white/5">
                          <div className={`h-full transition-all duration-300 ${pwdScore >= 1 ? getScoreColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
                          <div className={`h-full transition-all duration-300 ${pwdScore >= 2 ? getScoreColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
                          <div className={`h-full transition-all duration-300 ${pwdScore >= 3 ? getScoreColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
                          <div className={`h-full transition-all duration-300 ${pwdScore >= 4 ? getScoreColor() : 'bg-transparent'}`} style={{ width: '25%' }} />
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${pwdScore <= 1 ? 'text-red-500' : pwdScore <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {getScoreLabel()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF6044] transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Repeat password"
                        className="w-full bg-[#1a1b1b] border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#FF6044]/50 focus:ring-4 focus:ring-[#FF6044]/5 transition-all placeholder:text-gray-600 font-medium"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* TERMS CHECKBOX */}
                <div className="pt-2 flex items-start gap-3">
                  <div className="mt-0.5 relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer appearance-none w-4 h-4 border-2 border-gray-600 rounded-sm checked:bg-[#FF6044] checked:border-[#FF6044] cursor-pointer transition-all"
                    />
                    <CheckCircle2 size={12} className="absolute text-[#121313] opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                    I agree to the <button type="button" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-white font-bold hover:text-[#FF6044] underline decoration-white/20 hover:decoration-[#FF6044] underline-offset-4 transition-colors">Terms of Service</button> and <button type="button" onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-white font-bold hover:text-[#FF6044] underline decoration-white/20 hover:decoration-[#FF6044] underline-offset-4 transition-colors">Privacy Policy</button>.
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={submitting || !agreed}
                  className="group relative w-full bg-[#FF6044] text-[#121313] py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(255,96,68,0.2)] hover:bg-[#ff4d2e] hover:shadow-[0_15px_40px_rgba(255,96,68,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {submitting ? "Processing..." : "Create Account"}
                    {!submitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#FF6044] font-black hover:underline underline-offset-4 decoration-2">SIGN IN</Link>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
