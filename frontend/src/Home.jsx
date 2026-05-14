import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Header from './Header';
import { getAuthStatus } from './api';

// Component for the animated match score with fluctuating state
const MatchScore = ({ target, isAnalyzing }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 85) + 10);
      }, 80);
    } else {
      gsap.to({ val: displayValue }, {
        val: target,
        duration: 1.5,
        ease: "power3.out",
        onUpdate: function() {
          setDisplayValue(Math.round(this.targets()[0].val));
        }
      });
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, target]);

  return (
    <div ref={ref} className="text-primary font-display text-2xl font-bold tracking-tight">
      {displayValue}% MATCH
    </div>
  );
};

const ResumeAnalysisCard = () => {
  const [status, setStatus] = useState('idle');
  const cardRef = useRef(null);

  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 70%",
      onEnter: () => {
        if (status === 'idle') {
          startSequence();
        }
      }
    });
    return () => scrollTrigger.kill();
  }, [status]);

  const startSequence = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      setStatus('uploading');
      await new Promise(r => setTimeout(r, 2500));
      setStatus('analyzing');
      await new Promise(r => setTimeout(r, 5000));
      setStatus('completed');
      await new Promise(r => setTimeout(r, 6000));
    }
  };

  return (
    <div ref={cardRef} className="relative glass-panel brutalist-border p-8 rounded-none overflow-hidden shadow-2xl bg-surface/80 min-h-[400px] flex flex-col justify-center">
      {/* Scanning Line - Faster during analyzing */}
      {(status === 'uploading' || status === 'analyzing') && (
        <>
          <div 
            style={{ animation: `scan ${status === 'analyzing' ? '1.5s' : '4s'} linear infinite` }}
            className="absolute left-0 right-0 h-1 bg-primary/20 z-10 blur-sm pointer-events-none"
          ></div>
          <div 
            style={{ animation: `scan ${status === 'analyzing' ? '1.5s' : '4s'} linear infinite` }}
            className="absolute left-0 right-0 h-[1px] bg-primary z-20 pointer-events-none"
          ></div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { top: -10%; }
          to { top: 110%; }
        }
      `}} />

      <div className="flex items-center justify-between mb-8 relative z-30">
        <div className="flex gap-2 items-center">
          <div className={`w-3 h-3 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-primary'} ${status !== 'completed' ? 'animate-pulse' : ''}`}></div>
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">
            {status === 'idle' && 'SYSTEM_READY'}
            {status === 'uploading' && 'UPLOADING_RESUME...'}
            {status === 'analyzing' && 'AI_ANALYSIS_ACTIVE'}
            {status === 'completed' && 'ANALYSIS_COMPLETE'}
          </span>
        </div>
        <MatchScore target={94} isAnalyzing={status === 'analyzing' || status === 'uploading'} />
      </div>

      {/* Analysis Content */}
      <div className="space-y-6 relative z-30 flex-grow">
        {status === 'uploading' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 animate-pulse">
            <PlusCircle className="w-12 h-12 text-primary opacity-20" />
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]"></div>
            </div>
            <span className="text-[8px] font-mono opacity-30 mt-4">FILE_STREAM: resume_v4_final.pdf</span>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="space-y-4 py-8">
            <div className="h-4 bg-white/5 w-full animate-pulse"></div>
            <div className="h-4 bg-white/5 w-4/5 animate-pulse"></div>
            <div className="h-4 bg-white/5 w-3/4 animate-pulse"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 animate-bounce"></div>
              <div className="w-8 h-8 rounded bg-primary/20 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-8 h-8 rounded bg-primary/20 animate-bounce [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[8px] font-mono opacity-30 mt-12 block">PARSING_KEYWORDS... [STRATEGY, LEADERSHIP, SCALE]</span>
          </div>
        )}

        {status === 'completed' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="p-4 bg-white/5 border border-white/5 transition-all hover:bg-white/10 group">
              <div className="text-[10px] text-primary uppercase mb-2 font-bold tracking-widest">Strength</div>
              <p className="text-sm">Strong alignment with "Product Strategy" and "Technical Leadership" keywords found in semantic mapping.</p>
            </div>

            <div className="p-4 bg-white/10 border border-primary/20">
              <div className="text-[10px] text-yellow-500 uppercase mb-2 font-bold tracking-widest">Recommendation</div>
              <p className="text-sm italic">"Your scale-metrics are buried. Move 'Managed 50+ Engineers' to the top line of Role 1."</p>
            </div>

            <div className="flex items-center gap-2 text-[8px] font-mono opacity-30 mt-4">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              VERIFICATION_COMPLETE /// TRACE_ID: 9942-AX
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
             <Search className="w-12 h-12 mb-4" />
             <span className="text-xs uppercase tracking-[0.3em] font-display">Waiting for scan</span>
          </div>
        )}
      </div>
    </div>
  );
};

const FrustrationScene = () => {
  const cards = [
    { text: "Rejected for this role", type: "error", left: "10%" },
    { text: "Which resume did I use?!", type: "thought", left: "65%" },
    { text: "Update resume again...", type: "warning", left: "25%" },
    { text: "Applied for this role?", type: "info", left: "50%" },
    { text: "Where did I apply!?", type: "thought", left: "80%" },
    { text: "Who did I ask for referral?", type: "thought", left: "15%" },
    { text: "Lost in sheets...", type: "error", left: "70%" }
  ];

  return (
    <div className="relative h-[450px] md:h-[500px] w-full bg-transparent overflow-hidden flex items-center justify-center group">
       <style dangerouslySetInnerHTML={{__html: `
         @keyframes float-up-0 {
            0% { transform: translateY(250px) translateX(-30px) rotate(-5deg) scale(0.95); opacity: 0; }
            15% { opacity: 1; }
            50% { transform: translateY(0px) translateX(20px) rotate(2deg) scale(1); }
            85% { opacity: 1; }
            100% { transform: translateY(-250px) translateX(-10px) rotate(-2deg) scale(1.05); opacity: 0; }
         }
         @keyframes float-up-1 {
            0% { transform: translateY(250px) translateX(30px) rotate(5deg) scale(0.95); opacity: 0; }
            15% { opacity: 1; }
            50% { transform: translateY(0px) translateX(-20px) rotate(-2deg) scale(1); }
            85% { opacity: 1; }
            100% { transform: translateY(-250px) translateX(10px) rotate(2deg) scale(1.05); opacity: 0; }
         }
         @keyframes float-up-2 {
            0% { transform: translateY(250px) translateX(-10px) rotate(-2deg) scale(0.95); opacity: 0; }
            15% { opacity: 1; }
            50% { transform: translateY(0px) translateX(30px) rotate(4deg) scale(1); }
            85% { opacity: 1; }
            100% { transform: translateY(-250px) translateX(-20px) rotate(-4deg) scale(1.05); opacity: 0; }
         }
         @keyframes shake-head {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            25% { transform: rotate(-2deg) translateY(2px); }
            75% { transform: rotate(2deg) translateY(-2px); }
         }
         @keyframes blink-screen {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.95; box-shadow: 0 -20px 60px rgba(100, 150, 255, 0.15); }
         }
         @keyframes pulse-code {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
         }
       `}} />
       
       {/* Floating Notification Cards - Positioned to not overlap */}
       {cards.map((card, i) => {
         const isError = card.type === 'error';
         const isWarning = card.type === 'warning';
         const isThought = card.type === 'thought';
         const isInfo = card.type === 'info';
         
         // Continuous scroll loop inside the container
         const animDuration = 14; 
         const animDelay = (i * (animDuration / cards.length)) * -1;
         const animName = `float-up-${i % 3}`;
         
         return (
           <div 
             key={i} 
             className={`absolute w-32 h-32 md:w-36 md:h-36 p-3 md:p-4 rounded-xl border backdrop-blur-xl shadow-2xl shadow-black/50 flex flex-col justify-center items-center text-center gap-3 z-50 transition-all hover:scale-105 hover:z-[60] cursor-default
               ${isError ? 'border-red-500/20 bg-[#2A1111]/80 text-red-300' : 
                 isWarning ? 'border-yellow-500/20 bg-[#2A2311]/80 text-yellow-300' : 
                 isInfo ? 'border-blue-500/20 bg-[#111A2A]/80 text-blue-300' :
                 'border-[#4a4a55]/40 bg-[#2A2A2E]/80 text-gray-300'}`}
             style={{
               left: card.left,
               // removing static top as we use animation
               top: '50%',
               animation: `${animName} ${animDuration}s infinite linear ${animDelay}s`
             }}
           >
             {isError && <X className="w-6 h-6 md:w-8 md:h-8 shrink-0 opacity-80" />}
             {isWarning && <AlertCircle className="w-6 h-6 md:w-8 md:h-8 shrink-0 opacity-80" />}
             {isInfo && <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 shrink-0 opacity-80" />}
             {isThought && <div className="w-3 h-3 rounded-full bg-current shrink-0 animate-pulse"></div>}
             <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-widest leading-relaxed drop-shadow-md font-semibold">
               {card.text}
             </span>
           </div>
         );
       })}

       {/* Interactive CSS Recreation of the Stressed User (Space Gray / Minimalist) */}
       
       <div className="absolute inset-0 flex flex-col items-center justify-end z-10 pointer-events-none overflow-hidden">
          
          {/* User Figure (From Behind) */}
          <div className="relative flex flex-col items-center z-30 bottom-[-20px] md:bottom-0">
             
             {/* Head and Hands area */}
             <div className="relative w-32 h-32 md:w-40 md:h-40" style={{ animation: 'shake-head 4s infinite ease-in-out' }}>
                
                {/* Hair / Head (Darker Space Gray) */}
                <div className="absolute inset-x-0 bottom-0 top-2 bg-surface rounded-t-[50%] border-t border-surface-bright shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 overflow-hidden">
                   {/* Hair texture details */}
                   <div className="absolute -top-4 w-full h-1/2 rounded-full border-b-2 border-surface-bright bg-surface/40"></div>
                   <div className="absolute top-4 left-1/4 w-1/2 h-4 border-t border-surface-bright rounded-full opacity-30"></div>
                </div>
                
                {/* Left Arm / Hand clutching head */}
                <div className="absolute -left-5 md:-left-8 top-10 w-12 md:w-14 h-24 md:h-28 bg-[#2d3030] rounded-[30px] transform -rotate-[20deg] z-30 shadow-[5px_5px_15px_rgba(0,0,0,0.4)] border-y border-r border-[#3a3d3d]">
                   <div className="absolute top-2 right-2 w-2 h-8 border-r border-[#404343] rounded-full"></div>
                </div>
                
                {/* Right Arm / Hand clutching head */}
                <div className="absolute -right-5 md:-right-8 top-10 w-12 md:w-14 h-24 md:h-28 bg-[#2d3030] rounded-[30px] transform rotate-[20deg] z-30 shadow-[-5px_5px_15px_rgba(0,0,0,0.4)] border-y border-l border-[#3a3d3d]">
                   <div className="absolute top-2 left-2 w-2 h-8 border-l border-[#404343] rounded-full"></div>
                </div>
             </div>
             
             {/* Body (Hoodie / Shoulders) */}
             <div className="w-[280px] md:w-[380px] h-48 md:h-56 bg-[#2d3030] rounded-t-[100px] -mt-8 z-10 border-t border-[#3a3d3d] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                {/* Hoodie details */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-32 rounded-[50%] border-t border-[#404343] opacity-30"></div>
             </div>
             
          </div>

          {/* Desk Surface */}
          <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-[#181a1a] to-surface border-t border-surface-bright z-40 flex justify-center items-end">
            
            {/* Papers / Mess on the desk */}
            <div className="absolute left-8 bottom-6 w-24 h-32 bg-[#2d3030] rotate-[-15deg] rounded p-2 border border-surface-bright shadow-lg hidden md:block opacity-60">
                <div className="w-12 h-1 bg-surface-bright mb-2"></div>
                <div className="w-full h-1 bg-surface-bright/50 mb-1"></div>
                <div className="w-10 h-1 bg-surface-bright/50 mb-1"></div>
                <div className="w-full h-1 bg-surface-bright/50"></div>
            </div>

            {/* Laptop Back (Facing Away from us, Screen facing user) */}
            <div className="absolute -top-16 md:-top-24 w-64 md:w-80 h-32 md:h-40 bg-gradient-to-b from-surface to-black rounded-t-xl border border-surface-bright border-b-0 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex justify-center pt-8 z-50">
               {/* Glowing Logo on Laptop back */}
               <div className="w-8 h-8 rounded-full border border-surface-bright bg-white/5 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]" style={{ animation: 'blink-screen 4s infinite ease-in-out' }}>
                 <div className="w-1.5 h-3 bg-white/20 rounded-full"></div>
               </div>
            </div>
          </div>
       </div>
    </div>
  )
}

import { 
  Building2, 
  Target, 
  Workflow, 
  Users, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  LineChart, 
  ShieldCheck,
  LayoutDashboard,
  Code,
  Layout,
  Menu,
  X,
  Play,
  Briefcase,
  PlusCircle,
  Kanban,
  UserPlus,
  ClipboardCheck,
  FileEdit,
  Route,
  LayoutGrid,
  History,
  CheckCircle2,
  AlertCircle,
  User,
  Laptop,
  Flame,
  Bell,
  Camera,
  MessageCircle,
  Star,
  Zap,
  Phone
} from 'lucide-react';
import Core3D from './components/Core3D';
import CompanyOrbits from './components/CompanyOrbits';
import { 
  ResumeConfusion, 
  MissedFollowups, 
  LostReferrals, 
  ScatteredData, 
  CareerVault, 
  IntelligentReminders, 
  PipelineStream, 
  CareerRoadmap 
} from './components/VisualCards';
import Dashboard from './components/Dashboard';
import { RollingHeading, RollingWord } from './components/RollingHeading';

gsap.registerPlugin(ScrollTrigger);

function SocialIcon({ icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-all cursor-pointer group bg-surface hover:bg-primary/5"
    >
      <div className="group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </button>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-display text-sm text-primary uppercase font-bold tracking-widest">{title}</h4>
      <ul className="flex flex-col gap-4">
        {children}
      </ul>
    </div>
  );
}

function FooterLink({ children, to, onClick }) {
  if (onClick) {
    return (
      <li>
        <button 
          onClick={onClick}
          className="text-gray-500 hover:text-white text-sm uppercase tracking-[0.1em] transition-colors font-light"
        >
          {children}
        </button>
      </li>
    );
  }
  return (
    <li>
      <Link 
        to={to} 
        onClick={() => window.scrollTo(0,0)}
        className="text-gray-500 hover:text-white text-sm uppercase tracking-[0.1em] transition-colors font-light"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Home() {
  const [showComingSoon, setShowComingSoon] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let alive = true;
    getAuthStatus()
      .then((status) => {
        if (!alive) return;
        setIsLoggedIn(Boolean(status?.authenticated));
        setProfile(status?.authenticated ? status : null);
      })
      .catch(() => {
        if (!alive) return;
        setIsLoggedIn(false);
        setProfile(null);
      });
    return () => {
      alive = false;
    };
  }, []);

  const scrollHomeToTop = (event) => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Lenis for smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync ScrollTrigger with Lenis
    let lastScroll = 0;
    let isVisible = true;
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      const currentScroll = e.animatedScroll ?? e.scroll ?? window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        if (isVisible) {
          isVisible = false;
          setIsHeaderVisible(false);
        }
      } else if (currentScroll < lastScroll || currentScroll <= 100) {
        if (!isVisible) {
          isVisible = true;
          setIsHeaderVisible(true);
        }
      }
      lastScroll = currentScroll;
    });

    const ticker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Initial load animations
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-title', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1
      });

      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out'
      });

      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.7,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      });

      // Dashboard Section ScrollTrigger (Play once, never hide)
      gsap.utils.toArray('.dashboard-section').forEach((section) => {
        gsap.from(section.querySelectorAll('.dashboard-item'), {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        });
      });

      // Section ScrollTriggers
      gsap.utils.toArray('.reveal-section').forEach((section) => {
        gsap.from(section.querySelectorAll('.reveal-item'), {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        });
      });

      // Parallax effect for the background grid
      gsap.to('.bg-grid', {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        },
        y: -100,
        opacity: 0.5
      });

      // Horizontal Scroll Section
      const horizontalContainer = document.querySelector('.horizontal-scroll-container');
      const horizontalContent = document.querySelector('.horizontal-scroll-content');
      
      if (horizontalContainer && horizontalContent) {
        gsap.to(horizontalContent, {
          x: () => -(horizontalContent.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalContainer,
            start: "top top",
            end: () => `+=${horizontalContent.scrollWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });
      }

    }, containerRef);

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden bg-surface">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="bg-grid absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
               backgroundSize: '40px 40px' 
             }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface to-surface"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-76px)] mt-[76px] py-20 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 scale-125 md:scale-100">
          <Canvas>
            <Suspense fallback={null}>
              <Core3D />
            </Suspense>
          </Canvas>
        </div>
        
        <CompanyOrbits />

        <div className="relative z-10 w-full px-4">
          <div className="inline-block px-4 py-1 border border-primary/30 rounded-none text-xs font-display tracking-[0.4em] mb-8 hero-subtitle bg-primary/5 text-primary">
            SYSTEM ENGINE v2.0.4.ACTIVE
          </div>
          <h1 className="text-6xl md:text-[10rem] font-display font-black leading-[0.8] hero-title uppercase mb-10 tracking-normal text-white/80 flex flex-col items-center">
            <span>The end of</span>
            <span className="text-white/50 italic whitespace-nowrap mt-4">Searching chaos</span>
          </h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-2xl font-light leading-relaxed mb-12 hero-subtitle lowercase tracking-tight">
            Stop guessing. Start tracking. The high-performance command center for the modern job hunt.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 hero-cta">
            <Link to="/manifesto" className="group relative px-12 py-6 border-2 border-primary text-primary font-display font-black text-2xl uppercase tracking-tight transition-all hover:bg-primary hover:text-surface transform -skew-x-12">
              <div className="transform skew-x-12 flex items-center gap-4">
                Read The Manifesto
                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </Link>
            <div className="px-12 py-6 border-2 border-white/20 font-display text-xl uppercase tracking-[0.2em] text-white/40 cursor-default transform -skew-x-12">
              <div className="transform skew-x-12">
                Engineered for Serious Seekers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - THE 8 PILLARS */}
      <section id="features" className="py-24 bg-surface relative z-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <span className="text-primary font-display text-sm tracking-widest uppercase mb-4 block">Engine Components</span>
            <RollingHeading 
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black mb-8 uppercase tracking-tight flex flex-nowrap whitespace-nowrap justify-center gap-x-6 md:gap-x-10 leading-[1.1] text-primary"
              title={
              <>
                <RollingWord text="The" />
                <RollingWord text="8" />
                <RollingWord text="Strategic" />
                <RollingWord text="Pillars" className="text-primary italic pr-6 -mr-6 p-2 -my-2" />
              </>
            } />
            <p className="text-on-surface-variant text-xl max-w-3xl mx-auto font-light leading-relaxed">
              Every tool required to dominate the recruitment cycle. Engineered for precision, optimized for performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Add Job', to: '/add-job', desc: 'Manually input a new role into your active pipeline.', icon: <PlusCircle size={40} /> },
              { title: 'Job Pipeline', to: '/jobs', desc: 'Track and manage all your saved job applications.', icon: <Kanban size={40} /> },
              { title: 'Add Referral', to: '/add-referral', desc: 'Log a new professional connection to your network.', icon: <UserPlus size={40} /> },
              { title: 'View Referrals', to: '/referrals', desc: 'Monitor your active networking outreach and status.', icon: <Users size={40} /> },
              { title: 'ATS Analyzer', to: '/resume-analyzer', desc: 'Atomic-level resume analysis vs Job Descriptions.', icon: <ClipboardCheck size={40} /> },
              { title: 'Cover Letter Generator', to: '/cover-letter', desc: 'AI-crafted letters tailored precisely to your target roles.', icon: <FileEdit size={40} /> },
              { title: 'Career Roadmap', to: '/career-roadmap', desc: 'AI-powered personalised path based on your degree and goals.', icon: <Route size={40} /> },
              { title: 'Live Workspace', to: '/dashboard', desc: 'Your mission control. Real-time stats and deep insights.', icon: <LayoutGrid size={40} /> }
            ].map((feature, i) => (
              <Link key={i} to={feature.to} className="reveal-item group p-10 bg-surface-container/50 border border-white/5 hover:border-primary transition-all duration-500 cursor-pointer relative overflow-hidden brutalist-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <div className="text-7xl font-black font-display text-primary">{i + 1}</div>
                </div>
                <div className="text-primary mb-10 group-hover:scale-110 transition-transform origin-left duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-white uppercase mb-4 leading-none">{feature.title}</h3>
                <p className="text-on-surface-variant text-xs uppercase tracking-tight leading-relaxed font-light">{feature.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-mono uppercase">SYSTEM_READY</span>
                   <ArrowUpRight size={14} className="text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mindset Bar */}
      <section className="bg-surface-container py-16 border-b border-white/5 reveal-section relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-sm font-display text-primary tracking-[0.4em] uppercase mb-12 opacity-80">Operational Philosophy</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Strategy', quote: "The job hunt is a marathon of refinement.", icon: <Target className="w-5 h-5" /> },
              { label: 'Preparation', quote: "Build the skills that make you obvious.", icon: <Code className="w-5 h-5" /> },
              { label: 'Resilience', quote: "Rejection is redirection, not defeat.", icon: <ShieldCheck className="w-5 h-5" /> },
              { label: 'Focus', quote: "The clarity of your story is your edge.", icon: <Layout className="w-5 h-5" /> }
            ].map((item, i) => (
              <div key={i} className="reveal-item flex flex-col gap-3 group cursor-default">
                <div className="text-primary opacity-40 group-hover:opacity-100 transition-opacity">{item.icon}</div>
                <p className="text-lg font-light text-on-surface leading-snug">"{item.quote}"</p>
                <span className="text-[10px] uppercase font-display tracking-[0.2em] text-primary font-bold opacity-60">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Resume Analyzer Section */}
      <section className="min-h-screen px-6 sm:px-12 lg:px-20 py-28 reveal-section relative overflow-hidden bg-[#101212] border-y border-white/5">
        <div
          className="absolute inset-0 opacity-[0.16] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[1530px] items-start gap-14 lg:grid-cols-[720px_760px] lg:gap-24">
          <div className="reveal-item mt-14 [&>div]:min-h-[480px] [&>div]:h-[480px]">
            <ResumeAnalysisCard />
          </div>

          <div className="reveal-item">
            <span className="block font-display text-[18px] font-medium uppercase tracking-[0.18em] text-primary">
              Precision Tools
            </span>

            <h2 className="mt-8 font-display text-[clamp(4.6rem,6.25vw,7.35rem)] font-black uppercase leading-[0.88] tracking-normal">
              <span className="block whitespace-nowrap text-primary">Stand out with</span>
              <span className="block">
                <span className="text-primary">the</span>{" "}
                <span className="text-white">AI</span>
              </span>
              <span className="block text-white">
                Analyzer<span className="text-primary">.</span>
              </span>
            </h2>

            <p className="mt-9 max-w-[680px] text-[22px] leading-[1.55] text-[#dbc0bb] font-light">
              Don't leave it to chance. Our atomic-level analysis compares your resume against every job description,
              providing instant feedback and optimization tips.
            </p>

            <Link
              to="/resume-analyzer"
              className="mt-11 inline-flex h-[68px] min-w-[255px] items-center justify-center border border-primary px-8 font-display text-[18px] font-bold uppercase tracking-[0.16em] text-primary transition-all hover:bg-primary hover:text-[#101212]"
            >
              Initialize Analysis
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="min-h-screen px-6 py-36 reveal-section relative overflow-hidden bg-[#101212] flex items-center">
        <div
          className="absolute inset-0 opacity-[0.16] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-20 md:grid-cols-[690px_minmax(0,1fr)] lg:gap-24">
          <div className="reveal-item">
            <span className="text-primary font-display text-[16px] tracking-[0.18em] uppercase mb-8 block">Systemic Failure</span>
            <h2 className="font-display text-[clamp(4.4rem,5.9vw,7.1rem)] font-black mb-12 leading-[0.86] uppercase tracking-normal">
              <span className="block text-primary">Spreadsheets</span>
              <span className="block">
                <span className="text-primary">Are</span>{" "}
                <span className="text-white/20">Dead</span>
                <span className="text-primary">.</span>
              </span>
            </h2>
            <p className="max-w-[670px] text-[#dbc0bb] text-[24px] leading-[1.55] mb-14 font-light">
              Managing hundreds of applications across dozens of platforms using clunky spreadsheets is a recipe for disaster. 
              Lost emails, forgotten follow-ups, and lack of insights turn excitement into stress.
            </p>
            <div className="flex items-center gap-6 text-white font-display text-[22px] uppercase tracking-[0.2em] border-l-2 border-primary pl-7">
              Transition to Intelligence
            </div>
          </div>
          
          <div className="reveal-item relative min-w-0">
            <FrustrationScene />
          </div>
        </div>
      </section>

      {/* Transformation Section - Horizontal Scroll */}
      <section className="horizontal-scroll-container h-screen relative bg-surface border-b border-white/5 overflow-hidden">
        <div className="horizontal-scroll-content flex h-full will-change-transform w-[200vw]" style={{ width: '200vw' }}>
          
          {/* Slide 1: Before HireTrack */}
            <div className="w-screen h-full flex flex-col items-center justify-center px-8 pb-24 pt-36 relative bg-[#0a0a0a] border-r border-[#FF6044]/20">
              
              <div className="relative z-10 w-full max-w-[1230px] flex flex-col items-start gap-16">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-display tracking-widest uppercase mb-10">
                    <X size={14} /> The Problem
                  </div>
                  <h2 className="font-display text-[clamp(4.8rem,5.1vw,6.2rem)] font-black uppercase leading-[0.98] tracking-normal text-white/90">
                    The <span className="text-red-500">Chaos</span> of<br/>Job Hunting
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                  <div className="glass-panel min-h-[360px] p-7 border-red-500/20 bg-red-500/5 flex flex-col items-center text-center justify-between">
                    <ResumeConfusion />
                    <div>
                      <h3 className="font-display text-[26px] leading-none font-black uppercase mb-4 text-white">Resume Confusion</h3>
                      <p className="text-white/60 text-[17px] font-semibold">"Which version did I send?"</p>
                    </div>
                  </div>
                  <div className="glass-panel min-h-[360px] p-7 border-red-500/20 bg-red-500/5 flex flex-col items-center text-center justify-between">
                    <MissedFollowups />
                    <div>
                      <h3 className="font-display text-[26px] leading-none font-black uppercase mb-4 text-white">Missed Follow-ups</h3>
                      <p className="text-white/60 text-[17px] font-semibold">Ghosted. Forgot to follow up.</p>
                    </div>
                  </div>
                  <div className="glass-panel min-h-[360px] p-7 border-red-500/20 bg-red-500/5 flex flex-col items-center text-center justify-between">
                    <LostReferrals />
                    <div>
                      <h3 className="font-display text-[26px] leading-none font-black uppercase mb-4 text-white">Lost Referrals</h3>
                      <p className="text-white/60 text-[17px] font-semibold">Scattered comms across platforms.</p>
                    </div>
                  </div>
                  <div className="glass-panel min-h-[360px] p-7 border-red-500/20 bg-red-500/5 flex flex-col items-center text-center justify-between">
                    <ScatteredData />
                    <div>
                      <h3 className="font-display text-[26px] leading-none font-black uppercase mb-4 text-white">Scattered Data</h3>
                      <p className="text-white/60 text-[17px] font-semibold">No unified career strategy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: After HireTrack */}
            <div className="w-screen h-full flex flex-col items-center justify-center p-8 md:p-24 relative bg-surface">
              
              <div className="relative z-10 w-full max-w-5xl flex flex-col items-start gap-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-display tracking-widest uppercase mb-6">
                    <CheckCircle2 size={14} /> The Solution
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white">
                    Your Career<br/><span className="text-primary">Command Center</span>
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  <div className="glass-panel p-6 border-primary/20 bg-primary/5 hover:border-primary/50 transition-colors flex flex-col items-center text-center">
                    <CareerVault />
                    <h3 className="text-xl font-bold mb-2 mt-4 text-white">Career Vault</h3>
                    <p className="text-white/70 text-sm">Store, label, and map specific resumes and cover letters.</p>
                  </div>
                  <div className="glass-panel p-6 border-primary/20 bg-primary/5 hover:border-primary/50 transition-colors flex flex-col items-center text-center">
                    <IntelligentReminders />
                    <h3 className="text-xl font-bold mb-2 mt-4 text-white">Intelligent Reminders</h3>
                    <p className="text-white/70 text-sm">Automated 3-day and 7-day follow-up prompts.</p>
                  </div>
                  <div className="glass-panel p-6 border-primary/20 bg-primary/5 hover:border-primary/50 transition-colors flex flex-col items-center text-center">
                    <PipelineStream />
                    <h3 className="text-xl font-bold mb-2 mt-4 text-white">Unified Database</h3>
                    <p className="text-white/70 text-sm">See all your job applications and referrals in one live stream.</p>
                  </div>
                  <div className="glass-panel p-6 border-primary/20 bg-primary/5 hover:border-primary/50 transition-colors flex flex-col items-center text-center">
                    <CareerRoadmap />
                    <h3 className="text-xl font-bold mb-2 mt-4 text-white">Career Roadmap Generator</h3>
                    <p className="text-white/70 text-sm">Strategic insights to level up your career.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="py-20 px-6 dashboard-section relative bg-[#080808]">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          <div className="text-center mb-16">
            <span className="text-primary font-display text-sm tracking-widest uppercase mb-4 block dashboard-item">Operational UI</span>
            <RollingHeading 
              className="text-7xl md:text-[10rem] font-black mb-8 leading-none uppercase tracking-tight flex flex-nowrap whitespace-nowrap justify-center gap-x-4 md:gap-x-8 text-primary"
              title={
              <>
                <RollingWord text="Command" />
                <RollingWord text="Center" className="text-primary" />
              </>
            } />
          </div>
          
          <div className="dashboard-item w-full relative">
            <div className="w-full">
               <Dashboard />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 bg-surface relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-7xl md:text-[12rem] font-display font-black mb-12 leading-[0.75] uppercase tracking-tight">
              Secure the <br /><span className="text-primary italic">Future</span>.
            </h2>
            <p className="text-on-surface-variant text-xl md:text-3xl mb-16 max-w-3xl mx-auto font-light leading-snug">
              The search is inevitable. The failure is optional. Join the elite command center for high-performance job seekers.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="w-full md:w-auto px-16 py-8 bg-primary text-surface font-display font-black text-3xl uppercase tracking-tight hover:bg-white transition-all brutalist-shadow transform hover:-translate-y-1">
                Establish Command
              </Link>
              <div className="block text-primary font-mono text-xs uppercase tracking-[0.4em] opacity-50">
                // System Readiness Checklist: OK
              </div>
            </div>
        </div>
      </section>

      {/* Professional Apple-Style Footer */}
      <footer className="bg-surface border-t border-white/5 pt-24 pb-12 px-6 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
            {/* Brand Column */}
            <div className="space-y-8">
              <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-2 font-extrabold text-3xl tracking-tight text-white group mb-8">
                <Briefcase 
                  className="text-[#FF6044] transition-transform group-hover:scale-110 group-hover:rotate-3" 
                  size={32} 
                /> 
                <span>
                  Hire
                  <span className="text-white/60 font-light ml-0.5">Track</span>
                </span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed font-light max-w-xs">
                HireTrack helps professionals organize applications, referrals, resumes, and career growth using data-driven intelligence.
              </p>
              <div className="flex gap-4">
                <SocialIcon 
                  icon={
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                    </svg>
                  } 
                  onClick={() => setShowComingSoon("X socials are being architected. stay tuned for the signal. 📡")} 
                />
                <SocialIcon 
                  icon={
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  } 
                  onClick={() => setShowComingSoon("We're curating the HireTrack vibe. Instagram launch is imminent. 📸")} 
                />
                <SocialIcon 
                  icon={
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  } 
                  onClick={() => setShowComingSoon("Secure support lines are being encrypted. WhatsApp is coming soon. 📱")} 
                />
                <SocialIcon 
                  icon={
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                    </svg>
                  } 
                  onClick={() => setShowComingSoon("Engineering tutorials are in production. YouTube channel is loading. 🍿")} 
                />
              </div>
            </div>

            {/* Links Columns */}
            <FooterColumn title="Ecosystem">
              <FooterLink to="/dashboard">Command Center</FooterLink>
              <FooterLink to="/career-roadmap">Career Roadmap</FooterLink>
              <FooterLink to="/career-vault">The Vault</FooterLink>
              <FooterLink onClick={() => setShowComingSoon("chrome extension is in beta... stay cracked ⚡")}>Extension</FooterLink>
            </FooterColumn>

            <FooterColumn title="Company">
              <FooterLink to="/manifesto">The Manifesto</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/roadmap">Roadmap</FooterLink>
            </FooterColumn>

            <FooterColumn title="Resources">
              <FooterLink onClick={() => setShowComingSoon("documentation is being compiled... 📚")}>Docs</FooterLink>
              <FooterLink onClick={() => setShowComingSoon("interview guides are in the vault... 🔐")}>Interview Prep</FooterLink>
              <FooterLink onClick={() => setShowComingSoon("support protocols active soon... 📡")}>Help Center</FooterLink>
            </FooterColumn>

            <FooterColumn title="Legal">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
            </FooterColumn>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-mono tracking-[0.3em] text-gray-600 uppercase">
              © {new Date().getFullYear()} HireTrack Global Operations /// All Rights Reserved
            </div>
            <div className="flex gap-8 text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">
              <span>Status: Nominal</span>
              <span>Uptime: 99.9%</span>
              <span>Version: 2.0.4</span>
            </div>
          </div>
        </div>

        {/* Apple-Style Coming Soon Modal */}
        {showComingSoon && (
          <div 
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-surface/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowComingSoon(null)}
          >
            <div 
              className="bg-surface border border-white/10 p-12 max-w-sm w-full text-center space-y-6 brutalist-shadow animate-in zoom-in-95 duration-300 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative skewed background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -skew-x-12 translate-x-16 -translate-y-16 pointer-events-none"></div>
              
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-none mx-auto flex items-center justify-center">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-display font-black uppercase tracking-tight">System Notice</h3>
              <p className="text-gray-400 font-light lowercase tracking-tight italic">"{showComingSoon}"</p>
              <button 
                onClick={() => setShowComingSoon(null)}
                className="w-full py-4 border border-white/20 hover:bg-primary hover:border-primary hover:text-white transition-all font-display uppercase tracking-widest text-sm font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
