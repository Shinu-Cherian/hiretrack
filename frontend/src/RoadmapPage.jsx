import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Rocket, Compass, Cpu, Globe, Zap, ShieldCheck, 
  ArrowRight, Layers, Sparkles, Database 
} from 'lucide-react';
import Header from './Header';
import { getAuthStatus } from './api';

gsap.registerPlugin(ScrollTrigger);

export default function RoadmapPage() {
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    getAuthStatus().then(status => {
      setIsLoggedIn(Boolean(status?.authenticated));
    });

    const ctx = gsap.context(() => {
      // Fade in title
      gsap.from('.roadmap-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      });

      // Timeline entries animation
      gsap.utils.toArray('.roadmap-entry').forEach((entry) => {
        gsap.from(entry, {
          scrollTrigger: {
            trigger: entry,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          x: -50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // Animated line
      gsap.from('.timeline-line', {
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1
        },
        scaleY: 0,
        transformOrigin: 'top center'
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
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black leading-[0.8] uppercase tracking-tighter mb-12 roadmap-title">
            The<br />
            <span className="text-primary">Roadmap</span>
          </h1>
          <div className="h-2 w-24 bg-primary mb-12" />
          <p className="text-2xl md:text-4xl font-light leading-tight text-gray-400 max-w-3xl">
            Architecting the future of career intelligence. A systematic progression of modules and intelligence layers.
          </p>
        </section>

        {/* TIMELINE SECTION */}
        <div className="relative timeline-container pl-8 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 timeline-line md:-translate-x-1/2" />

          <div className="space-y-32 relative">
            <TimelineEntry 
              side="left"
              phase="Phase Alpha"
              title="Operational Core"
              icon={<Database size={24} />}
              features={[
                "Universal Job Pipeline Architecture",
                "Career Vault Encrypted Storage",
                "Momentum Tracking Protocol (Streaks)",
                "Referral Network Mapping"
              ]}
              status="Completed"
            />

            <TimelineEntry 
              side="right"
              phase="Phase Beta"
              title="Intelligence Layer"
              icon={<Cpu size={24} />}
              features={[
                "AI Resume Optimization Engine",
                "Cover Letter Architectural Synthesis",
                "Chrome Command Extension (v1.0)",
                "Unified Search & Indexing"
              ]}
              status="Completed"
            />

            <TimelineEntry 
              side="left"
              phase="Phase Gamma"
              title="Neural Expansion"
              icon={<Layers size={24} />}
              features={[
                "Advanced Trajectory Roadmap (v2.0)",
                "Automated Network Follow-ups",
                "Predictive Interview Simulation",
                "Multi-Resume Version Syncing"
              ]}
              status="Under Architectural Review"
            />

            <TimelineEntry 
              side="right"
              phase="Phase Delta"
              title="The Global Ecosystem"
              icon={<Globe size={24} />}
              features={[
                "P2P Verified Referral Marketplace",
                "Autonomous Job Hunt Agents",
                "Global Talent Indexing [REDACTED]",
                "Encrypted Achievement Protocols"
              ]}
              status="Classified Protocol"
            />
          </div>
        </div>

        {/* FINAL CTA */}
        <section className="mt-48 border-t border-white/10 pt-20">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-7xl font-display font-black uppercase mb-12">Join The<br />Movement</h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed font-light">
              We aren't just building a tool; we're building the new standard for professional excellence. Secure your clearance today.
            </p>
            
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-4 bg-white text-surface font-display font-black text-2xl px-12 py-6 uppercase tracking-tight hover:bg-primary transition-all brutalist-shadow"
              >
                Enter Command Center <ArrowRight size={24} />
              </Link>
            ) : (
              <Link to="/signup" className="inline-flex items-center gap-4 bg-primary text-surface font-display font-black text-2xl px-12 py-6 uppercase tracking-tight hover:bg-white transition-all brutalist-shadow">
                Register Clearance <ArrowRight size={24} />
              </Link>
            )}
          </div>
        </section>

        {/* FOOTER DECORATION */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> HireTrack Strategic Roadmap v4.1.0
          </div>
          <div>All Systems Nominal /// © 2026</div>
        </div>
      </main>
    </div>
  );
}

function TimelineEntry({ side, phase, title, icon, features, status }) {
  const isLeft = side === 'left';
  
  return (
    <div className={`roadmap-entry flex flex-col md:flex-row w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
      {/* Empty space for desktop */}
      <div className="hidden md:block w-1/2" />
      
      {/* Dot on timeline */}
      <div className="absolute left-[-4px] md:left-1/2 top-0 w-2 h-2 bg-primary md:-translate-x-1/2 mt-2" />

      {/* Content */}
      <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
        <div className="space-y-4">
          <div className={`flex items-center gap-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            <span className="text-primary font-mono text-xs tracking-widest uppercase">{phase}</span>
          </div>
          
          <div className={`flex items-center gap-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 bg-white/5 flex items-center justify-center text-primary border border-white/10">
              {icon}
            </div>
            <h3 className="text-2xl md:text-4xl font-display font-bold uppercase tracking-tight">{title}</h3>
          </div>

          <div className={`flex flex-col gap-2 ${isLeft ? 'md:items-end' : ''}`}>
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-tighter w-fit">
              {status}
            </span>
          </div>

          <ul className={`space-y-2 pt-4 ${isLeft ? 'md:items-end' : ''}`}>
            {features.map((feature, idx) => (
              <li key={idx} className={`flex items-center gap-3 text-sm text-gray-500 font-light ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-1 h-1 bg-primary/40" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
