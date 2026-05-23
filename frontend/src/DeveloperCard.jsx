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
  const [typedName, setTypedName] = useState("");

  // Dynamic typing effect for "Shinu Cherian"
  useEffect(() => {
    const fullName = "Shinu Cherian";
    let index = 0;
    let isDeleting = false;
    let timer = null;

    const tick = () => {
      if (!isDeleting) {
        setTypedName(fullName.slice(0, index + 1));
        index++;
        if (index === fullName.length) {
          isDeleting = true;
          timer = setTimeout(tick, 5000); // Hold full name for 5 seconds
        } else {
          timer = setTimeout(tick, 120 + Math.random() * 40); // Typing speed
        }
      } else {
        setTypedName(fullName.slice(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(tick, 1000); // Pause for 1 second before starting again
        } else {
          timer = setTimeout(tick, 60); // Deleting speed
        }
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  // Fetch authentication status
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
      gsap.from('.developer-title-wrapper', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Scroll trigger slide in sections
      gsap.utils.toArray('.developer-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 40,
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

      {/* Dynamic Keyframes for 3D Rotating Logo and Typing Cursor */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .rotating-3d-logo-container {
          perspective: 1200px;
        }
        .static-3d-logo {
          transform-style: preserve-3d;
          transform: rotateY(-20deg) rotateX(10deg);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .static-3d-logo:hover {
          transform: rotateY(-5deg) rotateX(5deg);
        }
        .typing-cursor {
          animation: blinkCursor 0.8s infinite;
        }
      `}} />

      <main className="max-w-5xl mx-auto px-6 py-24 md:py-40">
        
        {/* HERO SECTION */}
        <section className="mb-32 grid md:grid-cols-3 gap-12 items-center developer-title-wrapper">
          <div className="md:col-span-2 space-y-8">
            {/* Dynamic typed name with typing cursor */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black leading-[1.0] uppercase tracking-tighter min-h-[100px] md:min-h-[160px] select-none text-white">
              {typedName}
              <span className="text-primary typing-cursor">|</span>
            </h1>
            
            <div className="h-2 w-24 bg-primary animate-pulse" />
            
            {/* Shinu Cherian speaking directly to the user about what HireTrack is */}
            <p className="text-lg md:text-xl font-light leading-relaxed text-gray-300 font-sans max-w-2xl border-l-2 border-white/10 pl-6 italic">
              "HireTrack is your ultimate career command center. I built this platform not just as a tracking tool, but as a weapon to conquer the chaotic, often exhausting process of job hunting. When you're searching for your next big breakthrough, spreadsheets lose context and emails pile up. HireTrack brings absolute structural order to your applications, tracks your follow-up streaks, archives your network referrals, and gives you real-time ATS intelligence. It is designed to keep you disciplined, focused, and perpetually in motion. This is your engine for operational growth."
            </p>
            
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-6 bg-primary"></div>
              <span className="font-display font-bold text-sm uppercase tracking-wider text-primary">Shinu Cherian, Architect</span>
            </div>
          </div>

          {/* 3D Static Typography Logo without radiant glow */}
          <div className="flex items-center justify-center md:col-span-1 py-8">
            <div className="rotating-3d-logo-container w-64 h-64 relative flex items-center justify-center">
              <div className="static-3d-logo w-60 h-60 relative flex items-center justify-center bg-[#121313] border-4 border-white/10 rounded-full shadow-2xl">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-display font-black text-3xl sm:text-4xl tracking-tighter uppercase text-white select-none">
                    HIRE<span className="text-primary">TRACK</span>
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-3">CORE SYSTEM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="space-y-40">
          
          {/* THE CONNECTION (GREETINGS) & CORE PILLARS */}
          <section className="developer-section grid md:grid-cols-2 gap-12 items-stretch border-t border-white/10 pt-20">
            
            {/* Gen Z Warm Greeting Box */}
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">01 / The Vibe Check</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">The Connection</h2>
              </div>

              {isLoggedIn ? (
                /* Dynamic Welcome Greeting for Logged-In User */
                <div className="relative glass-panel brutalist-border p-8 bg-surface/30 border border-white/5 shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between gap-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-[#44ff60]/10 border border-[#44ff60]/20 text-[#44ff60] text-[9px] font-mono rounded font-bold uppercase tracking-wider">
                        Active User
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                        Session Synchronized
                      </span>
                    </div>
                    
                    <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                      Hey <span className="text-primary font-bold">{username}</span>, hope you are doing amazing! ⚡
                    </p>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      Welcome to the inner circle of the career command center. Your pipelines are synced, your profile details are fully indexed, and the operational workspace is ready for peak execution. Let's crush your career goals today!
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>Subject: {username}</span>
                    <span>Uptime: 99.9%</span>
                  </div>
                </div>
              ) : (
                /* Dynamic Welcome Greeting for Guests */
                <div className="relative glass-panel brutalist-border p-8 bg-surface/30 border border-white/5 shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between gap-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono rounded font-bold uppercase tracking-wider animate-pulse">
                        Guest Mode
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                        Connection Secure
                      </span>
                    </div>
                    
                    <p className="text-xl md:text-2xl font-light text-white leading-relaxed">
                      Hey human, hope you are doing great! ⚡
                    </p>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      Just wandering around the framework? HireTrack is built to escape the ordinary job-hunting grind. If you want to unlock the full power of your pipeline dashboard, optimize your resume keywords, and access AI roadmaps, authorize your workspace right now.
                    </p>
                  </div>

                  <Link 
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 bg-white text-surface hover:bg-primary font-display font-black text-xs py-4 px-6 uppercase tracking-wider transition-all rounded-xl brutalist-shadow w-full"
                  >
                    Authorize Session & Log In <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Core Pillars / HireTrack Details */}
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">02 / System Capabilities</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">Core Pillars</h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300 flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-mono font-bold">
                    01
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase text-white mb-1">Pipeline Mastery</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      Track job applications through highly customizable pipelines. Drag, drop, and manage interview schedules with zero distraction.
                    </p>
                  </div>
                </div>
                
                <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300 flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-mono font-bold">
                    02
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase text-white mb-1">ATS Intelligence</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      Instantly analyze your resumes against specific job descriptions to beat the algorithmic filters and land more interviews.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300 flex items-start gap-4">
                  <div className="mt-1 h-6 w-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-mono font-bold">
                    03
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase text-white mb-1">Referral Networks</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      Keep records of professional contacts, warm intros, and direct LinkedIn profile mappings to turn connections into opportunities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* THE TRANSMISSION FROM SHINU (PERSONAL NOTE) */}
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

          {/* THE THOUGHT / QUOTE CARD (MODERNIZED PHILOSOPHY) */}
          <section className="developer-section border-t border-white/10 pt-20">
            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">
              {isLoggedIn ? "04 / Engineering Philosophy" : "03 / Engineering Philosophy"}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-12">The Principle</h2>
            
            <div className="relative border-2 border-white/10 p-10 bg-[#0c0d0d]/80 shadow-[8px_8px_0px_rgba(255,96,68,0.15)] hover:shadow-[12px_12px_0px_rgba(255,96,68,0.25)] hover:border-primary/30 transition-all duration-300 rounded-3xl max-w-4xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-transform group-hover:scale-125 duration-500" />
              
              {/* Verified badge */}
              <div className="flex items-center gap-2 mb-6 font-mono text-[9px] text-primary tracking-widest uppercase bg-primary/10 border border-primary/20 py-1 px-3.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span>Verified Architect Philosophy</span>
              </div>

              <p className="text-xl md:text-3xl font-light italic leading-relaxed text-gray-100 mb-8 select-none font-sans">
                "True engineering isn't just about building functional software; it is about bringing order to chaos, transforming scattered potential into an active command center for human growth."
              </p>
              
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-12 bg-primary"></div>
                <span className="font-display font-black text-base uppercase tracking-wider text-primary">Shinu Cherian</span>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">// Architect & Lead Engineer</span>
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
            <ShieldCheck size={14} className="text-primary" /> HireTrack Developer Profile Document v1.3.0
          </div>
          <div>All Systems Nominal /// © {new Date().getFullYear()}</div>
        </div>
      </main>
    </div>
  );
}
