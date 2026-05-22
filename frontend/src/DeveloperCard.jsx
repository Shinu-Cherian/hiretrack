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

  useEffect(() => {
    window.scrollTo(0, 0);
    
    getAuthStatus().then(status => {
      setIsLoggedIn(Boolean(status?.authenticated));
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
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black leading-[0.8] uppercase tracking-tighter mb-12 developer-title">
            Shinu<br />
            <span className="text-primary">Cherian</span>
          </h1>
          <div className="h-2 w-24 bg-primary mb-12 animate-pulse" />
          <p className="text-2xl md:text-4xl font-light leading-tight text-gray-400 max-w-3xl developer-section">
            HireTrack is designed and developed by Shinu Cherian.
          </p>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="space-y-40">
          
          {/* THE SYSTEM DESCRIPTION */}
          <section className="developer-section grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">01 / The Project</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-8">Architectural Order</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
              <p>
                HireTrack was born out of a simple realization: the modern job hunt is broken, not by a lack of opportunities, but by a fragmentation of focus. Spreadsheets lose context, emails bury follow-ups, and resume versions blur together.
              </p>
              <p>
                To solve this, HireTrack was engineered as a high-performance command center for serious seekers. By combining structured job pipelines, direct referral networks, and integrated AI-powered ATS intelligence, the system helps you reclaim control of your narrative and operational momentum.
              </p>
            </div>
          </section>

          {/* THE THOUGHT / QUOTE CARD */}
          <section className="developer-section border-t border-white/10 pt-20">
            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">02 / Engineering Philosophy</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-12">The Principle</h2>
            
            <div className="relative glass-panel brutalist-border p-8 md:p-12 bg-surface/50 max-w-3xl border border-white/10 overflow-hidden group shadow-2xl">
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
            <ShieldCheck size={14} className="text-primary" /> HireTrack Developer Profile Document v1.0.0
          </div>
          <div>All Systems Nominal /// © {new Date().getFullYear()}</div>
        </div>
      </main>
    </div>
  );
}
