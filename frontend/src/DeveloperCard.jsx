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
  const [typedGreeting, setTypedGreeting] = useState("");
  const [typedLogoText, setTypedLogoText] = useState("");

  // Typing effect for the Greeting - Runs ONLY ONCE per page load
  useEffect(() => {
    const greetingText = isLoggedIn 
      ? `Hi ${username}, welcome to HireTrack` 
      : "Hi user, welcome to HireTrack";
      
    let index = 0;
    setTypedGreeting("");
    
    const interval = setInterval(() => {
      setTypedGreeting((prev) => {
        if (index >= greetingText.length) {
          clearInterval(interval);
          return prev;
        }
        const next = greetingText.slice(0, index + 1);
        index++;
        return next;
      });
    }, 60);
    
    return () => clearInterval(interval);
  }, [isLoggedIn, username]);

  // Dynamic typing effect inside the circular Logo - Loops continuously
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

  // Split and style greeting dynamically as it types to give user custom Neon Coral colors
  const renderTypedGreeting = () => {
    if (!isLoggedIn) {
      return (
        <>
          {typedGreeting}
          {typedGreeting.length < "Hi user, welcome to HireTrack".length && (
            <span className="text-primary typing-cursor">|</span>
          )}
        </>
      );
    } else {
      const fullText = `Hi ${username}, welcome to HireTrack`;
      if (typedGreeting.startsWith("Hi ")) {
        const afterHi = typedGreeting.slice(3);
        if (afterHi.length <= username.length) {
          return (
            <>
              <span>Hi </span>
              <span className="text-[#FF6044] font-black text-2xl sm:text-3xl md:text-4xl">{afterHi}</span>
              <span className="text-primary typing-cursor">|</span>
            </>
          );
        } else {
          const welcomePart = afterHi.slice(username.length);
          return (
            <>
              <span>Hi </span>
              <span className="text-[#FF6044] font-black text-2xl sm:text-3xl md:text-4xl">{username}</span>
              <span>{welcomePart}</span>
              {typedGreeting.length < fullText.length && (
                <span className="text-primary typing-cursor">|</span>
              )}
            </>
          );
        }
      }
      return typedGreeting;
    }
  };

  // Correctly split and color the typing HireTrack logo
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
        .logo-text-wrapper {
          font-family: var(--font-display, inherit);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-block;
          cursor: default;
        }
        .logo-text-wrapper:hover {
          transform: scale(1.3);
        }
      `}} />

      <main className="max-w-5xl mx-auto px-6 py-24 md:py-40">
        
        {/* HERO SECTION */}
        <section className="mb-32 grid md:grid-cols-3 gap-12 items-center developer-title-wrapper">
          <div className="md:col-span-2 space-y-8">
            {/* Dynamic Single-Line Welcome Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-gray-300 tracking-tight min-h-[60px] md:min-h-[80px] select-none text-white block">
              {renderTypedGreeting()}
            </h1>
            
            {/* Gen-Z styled Tagline */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono rounded font-bold uppercase tracking-widest">
                Developer & Founder of HireTrack // System Architect
              </span>
            </div>
            
            {/* Direct speech introduction: fully tailored to the architect's Malayalam voice */}
            <p className="text-lg md:text-xl font-light leading-relaxed text-gray-300 font-sans max-w-2xl border-l-2 border-primary pl-6 italic">
              "Hey human, I'm Shinu Cherian, the developer and founder of HireTrack. I hope you're doing good! I assume you've just started your job hunt journey—either way, you have come to the absolute right place. Everything you need to conquer your job hunt is provided here by me, so you can use it with absolute confidence. This platform is engineered to push you forward significantly, make your application process completely stress-free, and bring order to the chaos. It’s not just a tracker; it's a structural weapon designed to keep your momentum alive and help you land your dream role. I hope it serves you well."
            </p>
            
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-6 bg-primary"></div>
              <span className="font-display font-bold text-sm uppercase tracking-wider text-primary">Shinu Cherian</span>
            </div>
          </div>

          {/* Larger Floating Logo without Circle (Centered Right Side with Pop Animation on Hover) */}
          <div className="flex items-center justify-center md:justify-end w-full md:col-span-1 py-8">
            <div className="logo-text-wrapper select-none text-4xl sm:text-5xl md:text-6xl">
              <span>
                {renderTypedLogo()}
                <span className="text-[#FF6044] typing-cursor ml-0.5">|</span>
              </span>
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="space-y-40">
          
          {/* THE MISSION & BLUEPRINTS (Re-structured grid to match box heights perfectly) */}
          <section className="developer-section border-t border-white/10 pt-20">
            <div className="grid md:grid-cols-5 gap-12 items-stretch">
              
              {/* Column 1: The Mission (Taller, Narrower, Perfect structured vertical match) */}
              <div className="md:col-span-2 flex flex-col justify-between h-full gap-8">
                <div>
                  <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">01 / The Mission</span>
                  <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">My Vision</h2>
                </div>

                <div className="relative glass-panel p-8 bg-surface/30 border border-white/5 shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-between h-full min-h-[500px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-6 font-sans text-gray-300 font-light leading-relaxed text-sm md:text-base">
                    <p className="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-2 first-letter:float-left">
                      When I started writing the first lines of code for HireTrack, my goal was singular: to engineer a system that stops you from feeling helpless during the job search.
                    </p>
                    <p>
                      Every pipeline step, every contact record, and every streak is designed to keep you moving forward. You're not just applying to jobs; you're running a high-frequency professional campaign. I want HireTrack to be your unfair advantage.
                    </p>
                    <p>
                      This platform represents months of refinement and engineering. I hope it brings you absolute clarity and operational momentum as you step into your next career breakthrough.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-8 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>Signed: Shinu Cherian</span>
                    <span>Active Framework v1.5</span>
                  </div>
                </div>
              </div>

              {/* Column 2: The Toolkit (Wider, beautifully stacked cards matching vision height) */}
              <div className="md:col-span-3 flex flex-col justify-between h-full gap-8">
                <div>
                  <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">02 / The Blueprint</span>
                  <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-4">The Toolkit</h2>
                </div>

                <div className="space-y-6 flex flex-col justify-between h-full">
                  
                  {/* Job Pipeline */}
                  <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                    <h3 className="text-lg font-bold uppercase text-white mb-2">Why I built the Job Pipeline</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                      "I engineered the Job Pipeline so you can manage your chaos. When you apply to dozens of places, you need to know instantly where you applied, which exact resume version you used, what the JD specifications were, and run smart performance analytics on your pipeline."
                    </p>
                  </div>
                  
                  {/* ATS Scanner */}
                  <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                    <h3 className="text-lg font-bold uppercase text-white mb-2">Why I built the ATS Scanner</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                      "Because modern hiring is gatekept by algorithms. I wanted to give you the exact same tools that recruiters use to filter resumes, so you can optimize your keywords before you hit submit."
                    </p>
                  </div>

                  {/* Referral System */}
                  <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                    <h3 className="text-lg font-bold uppercase text-white mb-2">Why I built the Referral System</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                      "Because cold applications are slow; jobs are won through real human connections. I built this so you can map your referrers, log exact notes, track follow-ups, and turn networking into a science."
                    </p>
                  </div>

                  {/* Career Roadmap */}
                  <div className="p-6 bg-surface/20 border border-white/5 rounded-2xl hover:border-primary/20 transition-all duration-300">
                    <h3 className="text-lg font-bold uppercase text-primary mb-2">Why I built the Career Roadmap</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                      "An industry-first, personalized career planning engine. I engineered this because no other website gives you a clear visual blueprint of your future. It analyzes your degree and target role to generate a multi-year execution timeline, so you can coordinate your long-term career leaps with absolute conviction."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gen-Z styled warm call to action for all users (Adjusted from command center to inside HireTrack) */}
            <div className="mt-16 p-8 bg-[#0c0d0d]/80 border-2 border-white/10 rounded-3xl shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-display font-black uppercase text-white tracking-tight">
                    Wait, there is more... ⚡
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400 font-sans font-light max-w-2xl leading-relaxed">
                    Honestly? This is just the tip of the iceberg. There are so many more secret weapons waiting for you inside HireTrack. Kindly log in, unlock your session, and feel free to make HireTrack your own. It's all yours now. Let's get it!
                  </p>
                </div>
                {!isLoggedIn && (
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-3 bg-white text-surface font-display font-black text-sm px-8 py-4 uppercase tracking-wider hover:bg-primary transition-all rounded-xl brutalist-shadow whitespace-nowrap"
                  >
                    Unlock It Now <ArrowRight size={16} />
                  </Link>
                )}
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
            <ShieldCheck size={14} className="text-primary" /> HireTrack Developer Profile Document v1.5.2
          </div>
          <div>All Systems Nominal /// © {new Date().getFullYear()}</div>
        </div>
      </main>
    </div>
  );
}
