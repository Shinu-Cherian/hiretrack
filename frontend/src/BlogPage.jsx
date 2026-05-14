import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  BookOpen, Calendar, Clock, ArrowRight, 
  Search, Hash, ChevronRight, Share2 
} from 'lucide-react';
import Header from './Header';
import { getAuthStatus } from './api';

export default function BlogPage() {
  const containerRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    getAuthStatus().then(status => {
      setIsLoggedIn(Boolean(status?.authenticated));
    });

    const ctx = gsap.context(() => {
      gsap.from('.blog-title', {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });

      gsap.utils.toArray('.blog-post').forEach((post, idx) => {
        gsap.from(post, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          delay: idx * 0.1,
          scrollTrigger: {
            trigger: post,
            start: 'top 90%'
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-surface text-white selection:bg-primary selection:text-surface overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        {/* HERO */}
        <section className="mb-32 border-b border-white/5 pb-20">
          <div className="flex items-center gap-3 text-primary font-mono text-xs tracking-widest uppercase mb-6">
            <BookOpen size={16} /> Intelligence Logs
          </div>
          <h1 className="text-6xl md:text-9xl font-display font-black uppercase tracking-tighter mb-12 blog-title leading-none">
            The<br />
            <span className="text-primary italic">Blog</span>
          </h1>
          <p className="text-2xl md:text-4xl font-light text-gray-400 max-w-3xl leading-tight">
            Insights, strategies, and engineering logs from the frontier of modern career growth.
          </p>
        </section>

        {/* FEATURED POST */}
        <section className="mb-32 blog-post group cursor-pointer">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-[16/9] bg-white/5 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2032&auto=format&fit=crop" 
                alt="AI Neural Network" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
                <span>Featured Log</span>
                <span className="w-1 h-1 bg-primary" />
                <span>May 12, 2026</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold uppercase leading-none group-hover:text-primary transition-colors">
                The Future of AI in Talent Acquisition
              </h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed">
                How large language models are fundamentally changing how engineers are discovered, vetted, and hired in the high-stakes tech ecosystem.
              </p>
              <div className="inline-flex items-center gap-3 text-white font-display font-bold uppercase tracking-widest group-hover:gap-6 transition-all">
                Read Log <ArrowRight size={20} className="text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* POST GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-48">
          <BlogPost 
            date="May 08, 2026"
            title="How to Hack the Modern ATS"
            desc="A technical breakdown of parser algorithms and how to structure your resume for maximum neural compatibility."
            category="Engineering"
          />
          <BlogPost 
            date="May 05, 2026"
            title="Networking for Introverts"
            desc="Building a high-value referral network without the performance anxiety. Using systems over social skills."
            category="Strategy"
          />
          <BlogPost 
            date="Apr 28, 2026"
            title="The Referral Loop Protocol"
            desc="How to turn every interview into three new connections. The secret math of the professional flywheel."
            category="Growth"
          />
          <BlogPost 
            date="Apr 22, 2026"
            title="Optimizing Your Streak"
            desc="Why consistency in the job hunt leads to exponential outcomes. The science of operational momentum."
            category="Culture"
          />
          <BlogPost 
            date="Apr 15, 2026"
            title="Designing for Impact"
            desc="A guide to brutalist resume design that stands out in a sea of generic templates. Minimalism as a weapon."
            category="Design"
          />
          <BlogPost 
            date="Apr 02, 2026"
            title="Version Control for Your Career"
            desc="Why tracking every resume iteration is the only way to maintain narrative clarity in a long hunt."
            category="Engineering"
          />
        </div>

        {/* NEWSLETTER / CTA */}
        <section className="bg-primary p-12 md:p-24 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4 rotate-12">
            <Share2 size={400} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-display font-black uppercase text-surface leading-none mb-8 italic">Stay<br />Cracked</h2>
            <p className="text-xl text-surface/80 mb-12 leading-relaxed">
              Get the latest strategy logs delivered directly to your command center. No spam, just pure intelligence.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS" 
                className="flex-1 bg-surface/10 border border-surface/20 px-8 py-6 text-surface font-mono placeholder:text-surface/40 focus:outline-none focus:border-surface"
              />
              <button className="bg-surface text-white px-12 py-6 font-display font-black uppercase tracking-tight hover:bg-white hover:text-surface transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER DECORATION */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-primary" /> HireTrack Editorial Board v1.0.4
          </div>
          <div>All Systems Nominal /// © 2026</div>
        </div>
      </main>
    </div>
  );
}

function BlogPost({ date, title, desc, category }) {
  return (
    <div className="blog-post group cursor-pointer border border-white/5 p-8 hover:border-primary/50 transition-all flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">{category}</span>
        <span className="text-[10px] font-mono text-gray-600 uppercase">{date}</span>
      </div>
      <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight group-hover:text-primary transition-colors leading-tight">
        {title}
      </h3>
      <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 flex-1">
        {desc}
      </p>
      <div className="pt-6 border-t border-white/5 flex justify-between items-center group-hover:border-primary/20 transition-all">
        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600 group-hover:text-white">Read Log</span>
        <ChevronRight size={16} className="text-gray-700 group-hover:text-primary transition-all group-hover:translate-x-1" />
      </div>
    </div>
  );
}
