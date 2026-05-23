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
  const [typedLogoText, setTypedLogoText] = useState("");

  // Dynamic welcome statement typing effect
  useEffect(() => {
    const welcomeText = isLoggedIn 
      ? `Hi ${username}, welcome to HireTrack // Shinu Cherian` 
      : "Hi user, welcome to HireTrack // Shinu Cherian";
      
    let index = 0;
    let isDeleting = false;
    let timer = null;

    const tick = () => {
      if (!isDeleting) {
        setTypedName(welcomeText.slice(0, index + 1));
        index++;
        if (index === welcomeText.length) {
          isDeleting = true;
          timer = setTimeout(tick, 5000); // Wait 5 seconds after fully typing
        } else {
          timer = setTimeout(tick, 100 + Math.random() * 40); // Typing speed
        }
      } else {
        setTypedName(welcomeText.slice(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(tick, 1000); // Pause before re-typing
        } else {
          timer = setTimeout(tick, 40); // Deleting speed
        }
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, [isLoggedIn, username]);

  // Dynamic typing effect inside the circular Logo
  useEffect(() => {
    const logoWord = "HireTrack";
    let index = 0;
    let isDeleting = false;
    let timer = null;

    const tick = () => {
      if (!isDeleting) {
        setTypedLogoText(logoWord.slice(0, index + 1));
        index++;
        if (index === logoWord.length) {
          isDeleting = true;
          timer = setTimeout(tick, 5000); // Hold for 5 seconds when full
        } else {
          timer = setTimeout(tick, 140 + Math.random() * 40); // Typing speed
        }
      } else {
        setTypedLogoText(logoWord.slice(0, index - 1));
        index--;
        if (index === 0) {
          isDeleting = false;
          timer = setTimeout(tick, 1000); // Pause 1 second before re-typing
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
      // Fade in title block
      gsap.from('.developer-title-wrapper', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });

      // Scroll trigger animations for sections
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

  // Correctly split and color the typing HireTrack logo inside the circle
  const renderTypedLogo = () => {
    const hirePart = typedLogoText.slice(0, 4);
    const trackPart = typedLogoText.slice(4);
    return (
      <>
        <span className="text-white">{hirePart}</span>
        <span className="text-[#FF6044]">{trackPart}</span>
      </>
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-surface text-white selection:bg-primary selection:text-surface overflow-x-hidden">
      <Header />

      {/* Embedded Styles for cursor animation and hover breakout effects */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typing-cursor {
          animation: blinkCursor 0.8s infinite;
        }
        .logo-circle {
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 18rem; /* 288px */
          height: 18rem; /* 288px */
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #121313;
          transition: border-color 0.5s ease, box-shadow 0.5s ease;
          position: relative;
        }
        @media (min-width: 768px) {
          .logo-circle {
            width: 21rem; /* 336px */
            height: 21rem; /* 336px */
          }
        }
        .logo-circle:hover {
          border-color: rgba(255, 96, 68, 0.4);
          box-shadow: 0 0 30px rgba(255, 96, 68, 0.05);
        }
        .logo-text {
          font-family: var(--font-display, inherit);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-block;
          white-space: nowrap;
        }
        .logo-circle:hover .logo-text {
          transform: scale(1.4);
        }
      `}} />

      <main className="max-w-5xl mx-auto px-6 py-24 md:py-40">
        
        {/* HERO SECTION */}
        <section className="mb-32 grid md:grid-cols-3 gap-12 items-center developer-title-wrapper">
          <div className="md:col-span-2 space-y-8">
            {/* Dynamic Welcome Heading */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black leading-[1.1] uppercase tracking-tighter min-h-[140px] md:min-h-[180px] select-none text-white">
              {typedName}
              <span className="text-primary typing-cursor">|</span>
            </h1>
            
            {/* Gen-Z styled Tagline */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono rounded font-bold uppercase tracking-widest">
                Developer & Founder of HireTrack // System Architect
              </span>
            </div>
            
            {/* Direct speech introduction to the user */}
            <p className="text-lg md:text-xl font-light leading-relaxed text-gray-300 font-sans max-w-2xl border-l-2 border-primary pl-6 italic">
              "Hey human. Yes, I'm talking directly to you. First of all, thank you for stepping into the HireTrack command center. As developers, we build tools to conquer chaos. I designed and engineered this entire platform to serve as your personal workspace. I know how exhausting the job hunt is—the spreadsheets that lose context, the endless follow-up emails, and the black hole of ATS systems. That is why I built HireTrack. It's not just a tracker; it's a structural weapon to bring order to your applications, keep your momentum alive, and help you land your dream role. I hope it serves you well."
            </p>
            
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-6 bg-primary"></div>
              <span className="font-display font-bold text-sm uppercase tracking-wider text-primary">Shinu Cherian</span>
            </div>
          </div>

          {/* Larger Static Circular Logo with Hover Breakout Effect (Centered Right Side) */}
          <div className="flex items-center justify-center md:justify-end w-full md:col-span-1 py-8">
            <div className="logo-circle">
              <span className="logo-text select-none text-3xl sm:text-4xl">
                {renderTypedLogo()}
                <span className="text-[#FF6044] typing-cursor text-2xl md:text-3xl ml-0.5">|</span>
              </span>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="space-y-40">
          
          {/* THE MISSION & Blueprints */}
          <section className="developer-section grid md:grid-cols-2 gap-12 items-stretch border-t border-white/10 pt-20">
            
            {/* The Mission - Shinu speaking directly */}
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">01 / The Mission</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">My Vision</h2>
              </div>

              <div className="relative glass-panel p-8 bg-surface/30 border border-white/5 shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between gap-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-4 font-sans text-gray-300 font-light leading-relaxed">
                  <p>
                    When I started writing the first lines of code for HireTrack, my goal was singular: to engineer a system that stops you from feeling helpless during the job search.
                  </p>
                  <p>
                    Every pipeline step, every contact record, and every streak is designed to keep you moving forward. You're not just applying to jobs; you're running a high-frequency professional campaign. I want HireTrack to be your unfair advantage.
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                  <span>Signed: Shinu Cherian</span>
                  <span>Active Framework v1.4</span>
                </div>
              </div>
            </div>

            {/* The Blueprint - Why Shinu built it */}
            <div className="flex flex-col justify-between h-full gap-8">
              <div>
                <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">02 / The Blueprint</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">The Toolkit</h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                  <h3 className="text-lg font-bold uppercase text-white mb-2">Why I built the Job Pipeline</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                    "To give you instant visual clarity. You should never have to guess what stage an application is in. One glance, and you know where your pressure points are."
                  </p>
                </div>
                
                <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                  <h3 className="text-lg font-bold uppercase text-white mb-2">Why I built the ATS Scanner</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                    "Because modern hiring is gatekept by algorithms. I wanted to give you the exact same tools that recruiters use to filter resumes, so you can optimize your keywords before you hit submit."
                  </p>
                </div>

                <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                  <h3 className="text-lg font-bold uppercase text-white mb-2">Why I built the Referral System</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                    "Because jobs aren't landed by cold applications; they are landed through people. I built this to keep your networks indexed, mapped, and warm."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* PERSONAL NOTE (INCOMING TRANSMISSION) */}
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
            <ShieldCheck size={14} className="text-primary" /> HireTrack Developer Profile Document v1.4.1
          </div>
          <div>All Systems Nominal /// © {new Date().getFullYear()}</div>
        </div>
      </main>
    </div>
  );
}
