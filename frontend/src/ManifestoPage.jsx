import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Briefcase, ShieldCheck, Zap, Target, ArrowRight, ArrowLeft, 
  Users, Route, ClipboardCheck, FileEdit, Flame, Bell, Star 
} from 'lucide-react';
import Header from './Header';
import { getAuthStatus } from './api';

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoPage() {
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    getAuthStatus().then(status => {
      setIsLoggedIn(Boolean(status?.authenticated));
    });

    const ctx = gsap.context(() => {
      // Fade in animations
      gsap.from('.manifesto-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      });

      gsap.utils.toArray('.manifesto-section').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
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
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black leading-[0.8] uppercase tracking-tighter mb-12 manifesto-title">
            The<br />
            <span className="text-primary">Manifesto</span>
          </h1>
          <div className="h-2 w-24 bg-primary mb-12" />
          <p className="text-2xl md:text-4xl font-light leading-tight text-gray-400 max-w-3xl">
            In an era of fragmented tools and chaotic spreadsheets, we engineered a singular solution for the serious seeker.
          </p>
        </section>

        {/* CONTENT SECTIONS */}
        <div className="space-y-40">
          
          <section className="manifesto-section grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">01 / The Problem</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-8">The Fragmented Professional</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
              <p>
                The modern job hunt is a storm of data. Fifty applications, thirty referrals, and a dozen different resume versions scattered across downloads and emails.
              </p>
              <p>
                The "chaos" isn't the number of jobs—it's the <span className="text-white font-medium">loss of context.</span> When you can't remember which specific version of your story you told to which company, you've lost control of your narrative.
              </p>
            </div>
          </section>

          <section className="manifesto-section grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">02 / The Solution</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold uppercase mb-8">Structural Intelligence</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
              <p>
                HireTrack wasn't built for "scanning." It was built for <span className="text-white font-medium italic">Architectural Clarity.</span> 
              </p>
              <p>
                We engineered a system where every job application is pinned to the exact resume version used. Every referral is mapped to a structural pipeline. It is the permanent record of your career trajectory.
              </p>
            </div>
          </section>

          {/* SYSTEM MODULES - DETAILED BREAKDOWN */}
          <section className="manifesto-section">
            <div className="mb-16">
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">03 / System Modules</span>
              <h2 className="text-4xl md:text-7xl font-display font-black uppercase">The Architecture<br />Of Success</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
              <ModuleCard 
                icon={<Briefcase size={24} />} 
                title="Job Pipeline" 
                desc="Structural tracking for every application. Manage stages, track specific resume versions, and maintain absolute clarity on your search status." 
              />
              <ModuleCard 
                icon={<Users size={24} />} 
                title="Referral Network" 
                desc="Your network is your highest-value asset. Map your professional connections directly to active opportunities with zero friction." 
              />
              <ModuleCard 
                icon={<ShieldCheck size={24} />} 
                title="Career Vault" 
                desc="A permanent, encrypted archive for every professional asset. Store resumes, cover letters, and certificates with version-level precision." 
              />
              <ModuleCard 
                icon={<Route size={24} />} 
                title="Career Roadmap" 
                desc="AI-powered trajectory mapping. Visualize your long-term growth path and identify the skills required for the next level of clearance." 
              />
              <ModuleCard 
                icon={<ClipboardCheck size={24} />} 
                title="ATS Intelligence" 
                desc="Atomic-level resume optimization. Compare your story against job descriptions to ensure maximum compatibility before deployment." 
              />
              <ModuleCard 
                icon={<FileEdit size={24} />} 
                title="Cover Letter Engine" 
                desc="High-performance document generation. Architect cover letters that align perfectly with the target company's mission and requirements." 
              />
              <ModuleCard 
                icon={<Flame size={24} />} 
                title="Streak Protocol" 
                desc="Momentum is everything. High-visibility tracking to ensure you maintain daily operational consistency in your career growth." 
              />
              <ModuleCard 
                icon={<Bell size={24} />} 
                title="Neural Reminders" 
                desc="Smart notification system. Never miss a follow-up, an interview, or a deadline with automated system-wide alerts." 
              />
              <ModuleCard 
                icon={<Star size={24} />} 
                title="Starred Assets" 
                desc="Priority-level pinning. Keep your highest-value jobs and referrals at the top of your command center for instant access." 
              />
            </div>
          </section>

          <section className="manifesto-section border-t border-white/10 pt-20">
            <div className="max-w-3xl">
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block">04 / The Future</span>
              <h2 className="text-4xl md:text-7xl font-display font-black uppercase mb-12">The System<br />Of Record</h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                We are building the infrastructure for the next generation of professional leaders. A platform where your data isn't just stored—it's weaponized for your growth.
              </p>
              
              {isLoggedIn ? (
                <Link 
                  to="/" 
                  onClick={() => window.scrollTo(0, 0)}
                  className="inline-flex items-center gap-4 bg-white text-surface font-display font-black text-2xl px-12 py-6 uppercase tracking-tight hover:bg-primary transition-all brutalist-shadow"
                >
                  Return To Home <ArrowRight size={24} />
                </Link>
              ) : (
                <Link to="/signup" className="inline-flex items-center gap-4 bg-primary text-surface font-display font-black text-2xl px-12 py-6 uppercase tracking-tight hover:bg-white transition-all brutalist-shadow">
                  Enlist Now <ArrowRight size={24} />
                </Link>
              )}
            </div>
          </section>

        </div>

        {/* FOOTER DECORATION */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> HireTrack Operational Document v2.0.4
          </div>
          <div>All Systems Nominal /// © 2026</div>
        </div>
      </main>
    </div>
  );
}

function ModuleCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-surface border border-white/5 hover:border-primary/50 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold uppercase mb-4 tracking-tight">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed font-light">{desc}</p>
    </div>
  );
}
