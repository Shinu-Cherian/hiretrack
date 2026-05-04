import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  LayoutDashboard,
  ListChecks,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  FileSearch,
  PenLine,
  X,
  Star
} from "lucide-react";
import Header from "./Header";

const modules = [
  { icon: Plus, title: "Add Job", to: "/add-job", desc: "Log company, role, JD, status, notes, and follow-up date." },
  { icon: ListChecks, title: "View Jobs", to: "/jobs", desc: "Search, edit, star, and manage your application pipeline." },
  { icon: Users, title: "Add Referral", to: "/add-referral", desc: "Record referral requests with person, company, date, and status." },
  { icon: Briefcase, title: "View Referrals", to: "/referrals", desc: "Track who replied, who is pending, and who needs a nudge." },
  { icon: LayoutDashboard, title: "Dashboard", to: "/dashboard", desc: "Visualize progress with clean charts and useful insights." },
  { icon: FileSearch, title: "ATS Resume Analyzer", to: "/resume-analyzer", desc: "Compare your resume to a JD and see missing keywords." },
  { icon: PenLine, title: "Cover Letter", to: "/cover-letter", desc: "Create a structured cover letter draft from your resume and JD." },
];

const features = [
  { icon: Sparkles, title: "Smart Insights", desc: "See what needs attention without reading every row yourself." },
  { icon: ShieldCheck, title: "Private Workspace", desc: "Each logged-in user sees only their own jobs, referrals, and profile." },
  { icon: Zap, title: "Fast Updates", desc: "Edit jobs and referrals instantly from the list view." },
];

const modalContent = {
  about: {
    title: "About Us",
    body: "At HireTrack, our mission is to empower job seekers by transforming the chaotic application process into a streamlined, unified workspace. We built this platform for serious professionals who need more than just a spreadsheet. We help you manage your entire pipeline, track crucial referrals, and leverage intelligent AI tools to craft the perfect cover letter. Trusted by thousands of candidates globally, we are your definitive career management partner."
  },
  faq: {
    title: "Frequently Asked Questions",
    body: (
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900">How does the AI Cover Letter Generator work?</h4>
          <p className="text-gray-600 mt-1">Our intelligent AI engine reads your specific resume and the target job description, bridging the gap between your real past experiences and the core requirements of the role.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">Is HireTrack completely free?</h4>
          <p className="text-gray-600 mt-1">Yes, the core tracking features and AI generation tools are currently free for all registered users.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">How secure is my data?</h4>
          <p className="text-gray-600 mt-1">We take data privacy very seriously. We use enterprise-grade security and do not sell your personal data or application history to third-party data brokers.</p>
        </div>
      </div>
    )
  },
  privacy: {
    title: "Privacy Policy",
    body: "Your privacy is our priority. Types of Data Collected: We collect your name, email address, uploaded resumes, and job tracking data when you use HireTrack. Purpose of Collection: This data is strictly used to process your application logs, generate AI cover letters, and provide the core functionality of our service. Third-Party Sharing: We do not sell your personal data. We may share anonymized usage metrics with trusted analytics providers (e.g., Google Analytics) or use secure LLM APIs (e.g., Pollinations AI) strictly for generating your requested documents. User Rights: You maintain full control over your data. You may request the deletion of your account and all associated data at any time. Data Security: All data is transmitted securely via SSL encryption."
  },
  terms: {
    title: "Terms of Use",
    body: "Acceptance of Terms: By accessing HireTrack, you agree to these terms of use. Prohibited Activities: You agree not to misuse the platform by attempting to upload malicious files, scrape data, or use our AI generation endpoints for unauthorized bulk processing. Intellectual Property: All UI designs, text, logos, and features of HireTrack remain our exclusive property. Limitation of Liability: HireTrack provides tools to assist in your job search, but we cannot guarantee employment outcomes. The AI-generated content (like cover letters) is provided as a draft; you remain solely responsible for reviewing and verifying the accuracy of any documents before submitting them to employers. We reserve the right to terminate accounts that violate these terms."
  }
};

export default function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (e, type) => {
    e.preventDefault();
    setActiveModal(type);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32 px-6 lg:px-12 bg-dot-pattern overflow-hidden">
        {/* Neon Glow Blobs */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#FF6044]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-[#FF6044]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <FloatingParticles />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121313]/0 via-[#121313]/40 to-[#121313] pointer-events-none" />
        
        <div className="relative max-w-[1600px] mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[#FF6044] text-sm font-medium shadow-sm mb-6 shimmer-container">
                <Sparkles size={16} className="text-[#FF6044]" />
                <span>The modern way to track applications</span>
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              {["Manage", "your", "career"].map((word, i) => (
                <span key={i} className="inline-block animate-fade-in-up text-white" style={{ animationDelay: `${i * 100}ms` }}>
                  {word}&nbsp;
                </span>
              ))}
              <br />
              <span className="text-[#FF6044] animate-fade-in-up" style={{ animationDelay: "400ms" }}>with precision.</span>
            </h1>

            <p className="mt-6 text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-500 font-light">
              Elevate your job search. HireTrack organizes your pipeline, referrals, and insights into a beautifully minimalist workspace.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up delay-700">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#FF6044] text-white rounded-2xl font-bold overflow-hidden transition-all hover:bg-[#ff4d2e] hover:shadow-2xl hover:shadow-[#FF6044]/30 hover:-translate-y-1">
                    <span className="relative z-10 flex items-center gap-2">
                      Go to Workspace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#FF6044] text-white rounded-2xl font-bold overflow-hidden transition-all hover:bg-[#ff4d2e] hover:shadow-2xl hover:shadow-[#FF6044]/30 hover:-translate-y-1">
                      <span className="relative z-10 flex items-center gap-2">
                        Start for free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </Link>

                  <Link to="/login">
                    <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-white/10 transition-all hover:-translate-y-1">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right 3D Visual - Restored and Enhanced */}
          <div className="relative w-full h-full min-h-[500px] flex items-center justify-center perspective-1000 animate-fade-in delay-500 hidden md:flex z-10 hover:scale-105 transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 dark:from-slate-800 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none" />
            <Dashboard3DPreview />
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="relative py-32 px-6 lg:px-12 bg-[#121313] border-t border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-grid-pattern opacity-30 pointer-events-none" />
        
        <div className="relative max-w-[1600px] mx-auto w-full z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">A suite of powerful tools.</h2>
            <p className="text-xl text-gray-400 mt-4 font-light max-w-2xl mx-auto">Everything you need for a successful job hunt, perfectly integrated.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, i) => (
              <Link key={module.title} to={module.to} className="block group">
                <div className={`saas-card h-full p-8 relative overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#121313] rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 ease-out" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF6044]/10 border border-[#FF6044]/20 shadow-sm text-[#FF6044] flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 group-hover:shadow-[0_0_20px_rgba(255,96,68,0.3)] duration-300">
                      <module.icon size={26} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#FF6044] transition-colors">{module.title}</h3>
                    <p className="text-gray-400 leading-relaxed font-light text-sm">{module.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6 lg:px-12 bg-transparent">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            <div className="order-2 lg:order-1 relative perspective-1000">
               <div className="isometric-container">
                  <div className="saas-card p-6 bg-transparent isometric-card border border-white/10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-[#FF6044]/20 flex items-center justify-center">
                           <FileSearch size={20} className="text-[#FF6044]" />
                         </div>
                         <div>
                           <div className="text-sm font-bold text-white">ATS Analyzer</div>
                           <div className="text-xs text-gray-400">Scan Results</div>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">85% Match</div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-[#121313] rounded-lg border border-white/5 flex items-center justify-between">
                         <span className="text-sm font-medium text-gray-700">React.js</span>
                         <ShieldCheck size={16} className="text-green-500" />
                      </div>
                      <div className="p-3 bg-[#121313] rounded-lg border border-white/5 flex items-center justify-between">
                         <span className="text-sm font-medium text-gray-700">Python</span>
                         <ShieldCheck size={16} className="text-green-500" />
                      </div>
                      <div className="p-3 bg-[#121313] rounded-lg border border-white/5 flex items-center justify-between">
                         <span className="text-sm font-medium text-gray-700">Docker</span>
                         <span className="text-xs text-red-500 font-medium">Missing</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Engineered for <br/> <span className="text-gradient-highlight">serious job seekers.</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 font-light">
                We stripped away the clutter to give you a clean, focused environment where your data works for you.
              </p>

              <div className="space-y-8">
                {features.map((feature, i) => (
                  <div key={feature.title} className="flex gap-5 animate-fade-in-up group" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-xl bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] flex items-center justify-center shadow-sm group-hover:bg-[#FF6044] group-hover:text-white transition-all">
                        <feature.icon size={22} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#121313] pt-16 pb-8 text-gray-400">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Briefcase className="text-white" size={24}/> HireTrack</h4>
              <p className="text-sm mb-4">Your modern workspace for serious job seeking and career management.</p>
              <address className="not-italic text-sm space-y-2">
                <p>123 Career Avenue</p>
                <p>Tech District, CA 94103</p>
                <p className="mt-2"><a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a></p>
                <p><a href="mailto:support@hiretrack.com" className="hover:text-white transition-colors">support@hiretrack.com</a></p>
              </address>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" onClick={(e) => openModal(e, 'about')} className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" onClick={(e) => openModal(e, 'faq')} className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" onClick={(e) => openModal(e, 'privacy')} className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => openModal(e, 'terms')} className="hover:text-white transition-colors">Terms of Use</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-transparent border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-300 transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} HireTrack. All rights reserved.</p>
            <p className="mt-4 md:mt-0 flex gap-6">
               <a href="#" onClick={(e) => openModal(e, 'privacy')} className="hover:text-white transition-colors">Privacy</a>
               <a href="#" onClick={(e) => openModal(e, 'terms')} className="hover:text-white transition-colors">Terms</a>
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL OVERLAY */}
      {activeModal && modalContent[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div 
            className="bg-transparent rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">{modalContent[activeModal].title}</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-gray-400 font-light leading-relaxed max-h-[70vh] overflow-y-auto">
              {modalContent[activeModal].body}
            </div>
            <div className="px-6 py-4 bg-[#121313] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => {
        const size = Math.random() * 40 + 20;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 15;
        const icons = [Briefcase, Users, Sparkles, Zap, Star];
        const Icon = icons[i % icons.length];
        
        return (
          <div
            key={i}
            className="absolute animate-float opacity-[0.05]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <Icon size={size} strokeWidth={1} />
          </div>
        );
      })}
    </div>
  );
}

function Dashboard3DPreview() {
  return (
    <div className="isometric-container w-full max-w-lg origin-center transition-transform duration-500">
      <div className="bg-transparent rounded-2xl border border-white/10 p-6 isometric-card w-full h-[400px] flex flex-col shadow-xl">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF6044]" />
            <div className="h-2 w-20 bg-white/10 rounded" />
          </div>
          <div className="h-6 w-6 rounded-full border-2 border-[#FF6044] border-t-transparent animate-spin" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#121313] rounded-xl border border-white/5 p-4 flex flex-col justify-end">
            <div className="text-xs text-gray-400 font-medium mb-1">Active Jobs</div>
            <div className="text-3xl font-bold text-white">24</div>
          </div>
          <div className="bg-[#121313] rounded-xl border border-white/5 p-4 flex flex-col justify-end">
            <div className="text-xs text-gray-400 font-medium mb-1">Interviews</div>
            <div className="text-3xl font-bold text-white">3</div>
          </div>
        </div>

        {/* Mock Chart Area */}
        <div className="flex-1 bg-[#121313] rounded-xl border border-white/5 flex flex-col justify-end p-4 gap-2 relative overflow-hidden">
           <div className="text-xs font-semibold text-gray-400 absolute top-3 left-4">Applications Sent</div>
           <div className="flex items-end gap-3 h-full pt-6">
             {[40, 70, 45, 90, 65, 80].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors" style={{ height: `${h}%` }} />
             ))}
           </div>
        </div>
      </div>

      {/* Floating Layer 1 (Card) - Specific Data */}
      <div className="absolute -right-12 top-20 w-64 bg-transparent/95 backdrop-blur-md rounded-2xl border border-white/10 p-5 isometric-card-layer-1 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
             <Briefcase size={18} className="text-gray-700"/>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Google</div>
            <div className="text-sm font-bold text-white">Software Engineer</div>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-1">
           <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Status</span>
           <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-bold">Interviewing</span>
        </div>
      </div>

      {/* Floating Layer 2 (Notification) - AI Generated Cover letter */}
      <div className="absolute -left-16 bottom-24 w-64 bg-[#121313]/95 backdrop-blur-xl rounded-2xl border border-[#FF6044]/30 p-4 isometric-card-layer-2 shadow-[0_0_30px_rgba(255,96,68,0.15)] flex gap-4 items-center">
         <div className="w-10 h-10 rounded-full bg-[#FF6044] flex items-center justify-center shadow-sm flex-shrink-0">
           <Sparkles size={18} className="text-white" />
         </div>
         <div>
           <div className="text-xs font-bold text-white mb-0.5">Cover Letter Ready</div>
           <div className="text-xs text-gray-400 font-medium">AI generated for Stripe</div>
         </div>
      </div>
    </div>
  );
}