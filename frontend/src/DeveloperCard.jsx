import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Header from './Header';
import { getAuthStatus } from './api';

gsap.registerPlugin(ScrollTrigger);

export default function DeveloperCard() {
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [username, setUsername] = useState(localStorage.getItem("username") || "Seeker");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    getAuthStatus().then(status => {
      const authed = Boolean(status?.authenticated);
      setIsLoggedIn(authed);
      if (authed && status?.username) {
        setUsername(status.username);
      }
    });

    const ctx = gsap.context(() => {
      // Fade in title
      gsap.from('.developer-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      });

      // Scroll trigger slide in sections
      gsap.utils.toArray('.developer-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-surface text-white selection:bg-primary selection:text-surface overflow-x-hidden">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-24 md:py-40">
        {/* HERO SECTION */}
        <section className="mb-32">
          {isLoggedIn ? (
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black leading-[0.9] uppercase tracking-tighter mb-12 developer-title">
              Hello,<br />
              <span className="text-primary">{username}</span>
            </h1>
          ) : (
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black leading-[0.8] uppercase tracking-tighter mb-12 developer-title">
              Shinu<br />
              <span className="text-primary">Cherian</span>
            </h1>
          )}
          <div className="h-2 w-24 bg-primary mb-12 animate-pulse" />
          <p className="text-2xl md:text-4xl font-light leading-tight text-gray-400 max-w-3xl developer-section">
            {isLoggedIn 
              ? `Designed and developed with precision by Shinu Cherian — personalized for ${username}.` 
              : "HireTrack is designed and developed by Shinu Cherian."}
          </p>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="space-y-40">
          
          {/* THE SYSTEM DESCRIPTION & SECURITY ACCESS */}
          <section className="developer-section grid md:grid-cols-2 gap-12 items-stretch">
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">01 / Terminal Clearance</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">Access Level</h2>
              </div>
              
              {isLoggedIn ? (
                /* ACTIVE SEEKER PASSPORT CARD */
                <div className="relative glass-panel brutalist-border p-8 bg-surface/30 border border-white/5 shadow-2xl rounded-2xl flex flex-col justify-between gap-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Clearance Level</span>
                      <span className="text-xs font-display font-black text-primary uppercase tracking-wider block mt-0.5">Authorized Seeker</span>
                    </div>
                    <span className="px-2 py-0.5 border border-[#44ff60]/30 text-[#44ff60] bg-[#44ff60]/10 text-[9px] font-mono rounded font-bold uppercase tracking-wider animate-pulse">
                      Active Session
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 my-2">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary to-orange-500 flex items-center justify-center font-display font-black text-xl text-white shadow-lg shadow-primary/20">
                      {username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block">Identified Subject</span>
                      <span className="text-base font-bold text-white block mt-0.5 truncate max-w-[160px]">{username}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 flex justify-between text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>System: Nominal</span>
                    <span>Verified Dev Card v1.2</span>
                  </div>
                </div>
              ) : (
                /* ENCRYPTED STATE */
                <div className="relative glass-panel brutalist-border p-8 bg-red-500/5 border border-red-500/20 shadow-2xl rounded-2xl flex flex-col justify-between gap-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest block">Operational Status</span>
                      <span className="text-xs font-display font-black text-red-500 uppercase tracking-wider block mt-0.5">Encrypted Connection</span>
                    </div>
                    <span className="px-2 py-0.5 border border-red-500/30 text-red-500 bg-red-500/10 text-[9px] font-mono rounded font-bold uppercase tracking-wider">
                      Unauthorized
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 leading-relaxed my-2">
                    The architect has encrypted a signed developer's note and personalized career dedication card for active users of the command center.
                  </p>
                  
                  <Link 
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 bg-white text-surface hover:bg-primary font-display font-black text-xs py-3 px-4 uppercase tracking-wider transition-all rounded-lg brutalist-shadow"
                  >
                    Decrypt & Authorize Session <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed flex flex-col justify-center">
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-2 block">02 / The Project</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">Architectural Order</h2>
              <p>
                HireTrack was born out of a simple realization: the modern job hunt is broken, not by a lack of opportunities, but by a fragmentation of focus. Spreadsheets lose context, emails bury follow-ups, and resume versions blur together.
              </p>
              <p>
                To solve this, HireTrack was engineered as a high-performance command center for serious seekers. By combining structured job pipelines, direct referral networks, and integrated AI-powered ATS intelligence, the system helps you reclaim control of your narrative and operational momentum.
              </p>
            </div>
          </section>

          {/* THE TRANSMISSION FROM SHINU */}
          {isLoggedIn && (
            <section className="developer-section border-t border-white/10 pt-20">
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">03 / Personal Transmission</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-12">Architect's Note</h2>
              
              <div className="relative glass-panel brutalist-border p-8 md:p-12 bg-primary/5 max-w-4xl border border-primary/20 overflow-hidden group shadow-2xl rounded-3xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-orange-500/10 blur-3xl pointer-events-none" />
                
                <div className="font-mono text-[10px] text-primary mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>SECURE_COMMUNICATION_ESTABLISHED // INCOMING MESSAGE</span>
                </div>
                
                <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-200 mb-8 font-sans">
                  "Hey <span className="text-primary font-bold">{username}</span>, I built HireTrack to bring absolute order to the chaotic journey of job hunting. Seeing you navigate through this system is the highest form of validation for my work. I hope this platform serves as the tactical command center you need to conquer your career pipeline and land your dream role. Keep pushing, stay focused, and conquer the pipeline!"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-8 bg-primary"></div>
                  <span className="font-display font-black text-sm uppercase tracking-wider text-primary">Shinu Cherian</span>
                  <span className="text-xs font-mono text-gray-500 uppercase">// Lead Developer</span>
                </div>
              </div>
            </section>
          )}

          {/* THE THOUGHT / QUOTE CARD */}
          <section className="developer-section border-t border-white/10 pt-20">
            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">
              {isLoggedIn ? "04 / Engineering Philosophy" : "03 / Engineering Philosophy"}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-12">The Principle</h2>
            
            <div className="relative glass-panel brutalist-border p-8 md:p-12 bg-surface/50 max-w-3xl border border-white/10 overflow-hidden group shadow-2xl rounded-3xl">
              {/* Decorative skewed background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -skew-x-12 translate-x-16 -translate-y-16 pointer-events-none transition-transform group-hover:scale-110 duration-500"></div>
              
              <p className="text-xl md:text-2xl font-light italic leading-relaxed text-gray-200 mb-8 select-none">
                "True engineering isn't just about building functional software; it is about bringing order to chaos, transforming scattered potential into an active command center for human growth."
              </p>
              
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-8 bg-primary"></div>
                <span className="font-display font-black text-sm uppercase tracking-wider text-primary">Shinu Cherian</span>
              </div>
            </div>
          </section>

          {/* BACK HOME CALL TO ACTION */}
          <section className="developer-section border-t border-white/10 pt-20">
            <div className="max-w-3xl">
              <Link 
                to="/" 
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-4 bg-white text-surface font-display font-black text-2xl px-12 py-6 uppercase tracking-tight hover:bg-primary transition-all brutalist-shadow"
              >
                Return To Home <ArrowRight size={24} />
              </Link>
            </div>
          </section>

        </div>

        {/* FOOTER DECORATION */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> HireTrack Developer Profile Document v1.2.0
          </div>
          <div>All Systems Nominal /// © {new Date().getFullYear()}</div>
        </div>
      </main>
    </div>
  );
}
