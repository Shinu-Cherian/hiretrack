import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  FileText, ShieldCheck, Scale, Globe, 
  ArrowRight, Download, Info, ChevronRight 
} from 'lucide-react';
import Header from './Header';

export default function LegalPage() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('privacy'); // 'privacy' or 'terms'

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.from('.legal-title', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
      
      gsap.from('.legal-sidebar', {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.3
      });

      gsap.from('.legal-content', {
        opacity: 0,
        duration: 1,
        delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div ref={containerRef} className="min-h-screen bg-surface text-white selection:bg-primary selection:text-surface overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        {/* HEADER */}
        <section className="mb-24">
          <div className="flex items-center gap-3 text-primary font-mono text-xs tracking-widest uppercase mb-6">
            <Scale size={16} /> Compliance Document
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 legal-title">
            Legal<br />
            <span className="text-primary">Protocols</span>
          </h1>
          <div className="flex flex-wrap gap-4 mb-12">
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`px-8 py-4 font-display font-bold uppercase tracking-widest text-sm transition-all border ${activeTab === 'privacy' ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'}`}
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setActiveTab('terms')}
              className={`px-8 py-4 font-display font-bold uppercase tracking-widest text-sm transition-all border ${activeTab === 'terms' ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'}`}
            >
              Terms of Service
            </button>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:w-64 flex-shrink-0 space-y-8 legal-sidebar">
            <div className="space-y-4">
              <h4 className="text-primary font-mono text-[10px] tracking-widest uppercase mb-6">Quick Jump</h4>
              <nav className="space-y-2">
                <JumpLink text="Data Collection" />
                <JumpLink text="User Rights" />
                <JumpLink text="Security Measures" />
                <JumpLink text="Third Parties" />
                <JumpLink text="Cookies" />
                <JumpLink text="Contact Legal" />
              </nav>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Download size={16} />
                <span className="font-mono text-[10px] uppercase font-bold">Download PDF</span>
              </div>
              <p className="text-[10px] text-gray-500 uppercase leading-relaxed font-light">
                Archive version v4.0.2 Last Updated: May 14, 2026
              </p>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <article className="flex-1 max-w-3xl space-y-16 legal-content">
            {activeTab === 'privacy' ? (
              <PrivacyContent />
            ) : (
              <TermsContent />
            )}

            {/* FINAL CLAUSE */}
            <div className="pt-20 border-t border-white/10">
              <div className="p-8 bg-primary/5 border border-primary/20 rounded-none flex gap-6 items-start">
                <Info size={24} className="text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="text-white font-bold uppercase text-sm">Need Clarification?</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">
                    Our legal department is available for any specific inquiries regarding data handling or operational terms. Contact <span className="text-white font-medium">legal@hiretrack.com</span>
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* FOOTER DECORATION */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-primary" /> HireTrack Compliance Index v1.0
          </div>
          <div>All Systems Nominal /// © 2026</div>
        </div>
      </main>
    </div>
  );
}

function JumpLink({ text }) {
  return (
    <a href="#" className="flex items-center justify-between group py-2 border-b border-white/5 hover:border-primary/30 transition-all">
      <span className="text-xs uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{text}</span>
      <ChevronRight size={14} className="text-gray-700 group-hover:text-primary transition-colors" />
    </a>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-12">
      <Section title="01 / Introduction">
        <p>This Privacy Protocol describes how HireTrack ("we", "us", or "our") collects, weaponizes, and protects your career data when you deploy our services.</p>
        <p>By engaging with the platform, you acknowledge the terms of this operational document.</p>
      </Section>
      <Section title="02 / Data Collection">
        <p>We collect high-fidelity professional data including but not limited to:</p>
        <ul className="list-disc pl-5 space-y-2 text-gray-400 font-light">
          <li>Resumes and Professional Documents (Encrypted)</li>
          <li>Job Application Metadata and History</li>
          <li>Referral Network Maps</li>
          <li>Operational Metrics (Streaks, Activity Logs)</li>
        </ul>
      </Section>
      <Section title="03 / Security Infrastructure">
        <p>Data security is our primary directive. We implement AES-256 encryption at rest and TLS 1.3 in transit. For detailed technical specifications, please refer to our <Link to="/security" className="text-primary hover:underline">Security Protocol</Link>.</p>
      </Section>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="space-y-12">
      <Section title="01 / Acceptance of Terms">
        <p>By registering for a HireTrack clearance level, you agree to abide by the structural guidelines of our platform.</p>
      </Section>
      <Section title="02 / User Conduct">
        <p>HireTrack is a tool for professional excellence. We expect users to maintain high-integrity data and professional conduct within the ecosystem.</p>
      </Section>
      <Section title="03 / Intellectual Property">
        <p>The HireTrack brand, architecture, and "Cyberpunk/Brutalist" design language are the exclusive intellectual property of HireTrack.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-6">
      <h3 className="text-primary font-mono text-xs tracking-widest uppercase border-l-2 border-primary pl-4">{title}</h3>
      <div className="text-lg text-gray-400 font-light leading-relaxed space-y-4">
        {children}
      </div>
    </div>
  );
}
