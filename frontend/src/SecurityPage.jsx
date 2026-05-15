import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  ShieldCheck, Lock, EyeOff, Server, Terminal, 
  Key, RefreshCw, Database, ArrowRight, Shield 
} from 'lucide-react';
import Header from './Header';
import { getAuthStatus } from './api';

export default function SecurityPage() {
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    getAuthStatus().then(status => {
      setIsLoggedIn(Boolean(status?.authenticated));
    });

    const ctx = gsap.context(() => {
      gsap.from('.security-title', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      });

      gsap.utils.toArray('.security-card').forEach((card, idx) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: idx * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%'
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-surface text-white selection:bg-primary selection:text-surface overflow-x-hidden">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-24 md:py-40">
        {/* HERO SECTION */}
        <section className="mb-32">
          <div className="flex items-center gap-4 text-primary font-mono text-sm tracking-[0.3em] uppercase mb-8">
            <Shield size={20} /> Protocol Status: Active
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black leading-[0.8] uppercase tracking-tighter mb-12 security-title">
            The<br />
            <span className="text-primary">Security</span>
          </h1>
          <div className="h-2 w-24 bg-primary mb-12" />
          <p className="text-2xl md:text-4xl font-light leading-tight text-gray-400 max-w-3xl">
            Your career data is your most sensitive asset. We treat it with the same rigor as financial architecture.
          </p>
        </section>

        {/* SECURITY GRID */}
        <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5 mb-32">
          <SecurityCard 
            icon={<Lock size={32} />}
            title="Secure Data Transmission"
            desc="All data moving between your device and our servers is encrypted using industry-standard TLS 1.3 protocols, ensuring that your career assets are never exposed in transit."
          />
          <SecurityCard 
            icon={<Terminal size={32} />}
            title="Privacy-First Architecture"
            desc="Our systems are designed to ensure that your specific career narrative remains private. Your personal vault is logically isolated from other users in our database."
          />
          <SecurityCard 
            icon={<Key size={32} />}
            title="Identity Clearance (JWT)"
            desc="We use secure JSON Web Tokens for authentication. This ensures that only you can access your command center, with automated session protection and secure storage."
          />
          <SecurityCard 
            icon={<Server size={32} />}
            title="Encrypted At Rest"
            desc="Our production databases utilize volume-level encryption to ensure that even in the physical storage layer, your career intelligence remains unreadable to unauthorized entities."
          />
        </div>

        {/* DETAILED TECHNICAL SECTION */}
        <section className="space-y-24 mb-48">
          <div className="grid md:grid-cols-2 gap-12 items-start border-t border-white/10 pt-20">
            <div>
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block underline underline-offset-8 decoration-primary/30">Protocol 01 / Data Handling</span>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-8 leading-none">Security<br />Strategy</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
              <p>
                HireTrack is built on a foundation of transparency and structural integrity. Our current security model focuses on <span className="text-white">Active Protection</span>.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 flex-shrink-0" />
                  <p><strong className="text-white font-medium uppercase text-sm">Active:</strong> Secure authentication via JWT and session isolation.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-primary mt-2 flex-shrink-0" />
                  <p><strong className="text-white font-medium uppercase text-sm">Active:</strong> SSL/TLS encryption for all data transmissions.</p>
                </li>
                <li className="flex items-start gap-4 opacity-50">
                  <div className="w-1.5 h-1.5 bg-gray-500 mt-2 flex-shrink-0" />
                  <p><strong className="text-gray-300 font-medium uppercase text-sm">Planned:</strong> Automated malware sanitization and sharded storage architectures.</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start border-t border-white/10 pt-20">
            <div>
              <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block underline underline-offset-8 decoration-primary/30">Protocol 02 / Privacy</span>
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-8 leading-none">Privacy<br />Integrity</h2>
            </div>
            <div className="space-y-6 text-lg text-gray-400 font-light leading-relaxed">
              <p>
                We adhere to fundamental privacy standards to ensure your professional data is never weaponized against you.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-6 bg-white/5 border border-white/5">
                  <h4 className="text-white font-bold uppercase text-xs mb-2">Privacy</h4>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Zero Data Selling</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/5">
                  <h4 className="text-white font-bold uppercase text-xs mb-2">Security</h4>
                  <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Standard Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary p-12 md:p-24 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <ShieldCheck size={400} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-display font-black uppercase text-surface leading-none mb-8">Deploy With<br />Confidence</h2>
            <p className="text-xl text-surface/80 mb-12 leading-relaxed">
              Your data is safe. Your trajectory is secure. Focus on the hunt, we'll guard the assets.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-4 bg-surface text-white font-display font-black text-2xl px-12 py-6 uppercase tracking-tight hover:bg-white hover:text-surface transition-all">
              Join The Secure Network <ArrowRight size={24} />
            </Link>
          </div>
        </section>

        {/* FOOTER DECORATION */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> HireTrack Security Whitepaper v2.0
          </div>
          <div>All Systems Nominal /// © 2026</div>
        </div>
      </main>
    </div>
  );
}

function SecurityCard({ icon, title, desc }) {
  return (
    <div className="security-card p-12 bg-surface hover:bg-white/5 transition-colors group">
      <div className="w-16 h-16 bg-white/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-light">{desc}</p>
    </div>
  );
}
