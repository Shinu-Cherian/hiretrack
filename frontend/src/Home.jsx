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
  X
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
      <section className="relative min-h-screen flex items-center pt-20 pb-32 px-6 lg:px-12 bg-dot-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/95 dark:from-slate-900/60 dark:to-slate-900/95 pointer-events-none" />
        
        <div className="relative max-w-[1600px] mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left z-10">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-600 text-sm font-medium shadow-sm mb-6">
                <Sparkles size={16} className="text-gray-400" />
                <span>The modern way to track applications</span>
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 animate-fade-in-up delay-100 leading-tight">
              Manage your career <br />
              <span className="text-gradient-modern">with precision.</span>
            </h1>

            <p className="mt-6 text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200 font-light">
              Elevate your job search. HireTrack organizes your pipeline, referrals, and insights into a beautifully minimalist workspace.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium overflow-hidden transition-all hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1">
                    <span className="relative z-10 flex items-center gap-2">
                      Go to Workspace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium overflow-hidden transition-all hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1">
                      <span className="relative z-10 flex items-center gap-2">
                        Start for free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </Link>

                  <Link to="/login">
                    <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all hover:-translate-y-1">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right 3D Visual - Restored and Enhanced */}
          <div className="relative w-full h-full min-h-[500px] flex items-center justify-center perspective-1000 animate-fade-in delay-300 hidden md:flex z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 dark:from-slate-800 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none" />
            <Dashboard3DPreview />
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section className="relative py-32 px-6 lg:px-12 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-grid-pattern opacity-30 pointer-events-none" />
        
        <div className="relative max-w-[1600px] mx-auto w-full z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">A suite of powerful tools.</h2>
            <p className="text-xl text-gray-500 mt-4 font-light max-w-2xl mx-auto">Everything you need for a successful job hunt, perfectly integrated.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, i) => (
              <Link key={module.title} to={module.to} className="block group">
                <div className={`saas-card h-full p-8 relative overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500 ease-out" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-700 flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 group-hover:shadow-md duration-300">
                      <module.icon size={26} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-gray-700 transition-colors">{module.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-light">{module.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-32 px-6 lg:px-12 bg-white">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            <div className="order-2 lg:order-1 relative perspective-1000">
               <div className="isometric-container">
                  <div className="saas-card p-6 bg-white isometric-card border border-gray-200">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                           <FileSearch size={20} className="text-blue-600" />
                         </div>
                         <div>
                           <div className="text-sm font-bold text-gray-900">ATS Analyzer</div>
                           <div className="text-xs text-gray-500">Scan Results</div>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">85% Match</div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                         <span className="text-sm font-medium text-gray-700">React.js</span>
                         <ShieldCheck size={16} className="text-green-500" />
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                         <span className="text-sm font-medium text-gray-700">Python</span>
                         <ShieldCheck size={16} className="text-green-500" />
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                         <span className="text-sm font-medium text-gray-700">Docker</span>
                         <span className="text-xs text-red-500 font-medium">Missing</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Engineered for <br/> <span className="text-gradient-highlight">serious job seekers.</span>
              </h2>
              <p className="text-xl text-gray-500 mb-12 font-light">
                We stripped away the clutter to give you a clean, focused environment where your data works for you.
              </p>

              <div className="space-y-8">
                {features.map((feature, i) => (
                  <div key={feature.title} className="flex gap-5 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 flex items-center justify-center shadow-sm">
                        <feature.icon size={22} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-500 font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-gray-50 pt-16 pb-8 text-gray-500">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand & Contact */}
            <div className="col-span-1 md:col-span-1">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase className="text-gray-900" size={24}/> HireTrack</h4>
              <p className="text-sm mb-4">Your modern workspace for serious job seeking and career management.</p>
              <address className="not-italic text-sm space-y-2">
                <p>123 Career Avenue</p>
                <p>Tech District, CA 94103</p>
                <p className="mt-2"><a href="tel:+1234567890" className="hover:text-gray-900 transition-colors">+1 (234) 567-890</a></p>
                <p><a href="mailto:support@hiretrack.com" className="hover:text-gray-900 transition-colors">support@hiretrack.com</a></p>
              </address>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" onClick={(e) => openModal(e, 'about')} className="hover:text-gray-900 transition-colors">About Us</a></li>
                <li><a href="#" onClick={(e) => openModal(e, 'faq')} className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Legal Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" onClick={(e) => openModal(e, 'privacy')} className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => openModal(e, 'terms')} className="hover:text-gray-900 transition-colors">Terms of Use</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {new Date().getFullYear()} HireTrack. All rights reserved.</p>
            <p className="mt-4 md:mt-0 flex gap-6">
               <a href="#" onClick={(e) => openModal(e, 'privacy')} className="hover:text-gray-900 transition-colors">Privacy</a>
               <a href="#" onClick={(e) => openModal(e, 'terms')} className="hover:text-gray-900 transition-colors">Terms</a>
            </p>
          </div>
        </div>
      </footer>

      {/* MODAL OVERLAY */}
      {activeModal && modalContent[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setActiveModal(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{modalContent[activeModal].title}</h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-gray-600 font-light leading-relaxed max-h-[70vh] overflow-y-auto">
              {modalContent[activeModal].body}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
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

// Restored and Enhanced 3D Isometric Dashboard Component for Hero
function Dashboard3DPreview() {
  return (
    <div className="isometric-container w-full max-w-lg origin-center transition-transform duration-500">
      {/* Base Layer - Main Dashboard */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 isometric-card w-full h-[400px] flex flex-col shadow-xl">
        {/* Mock Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">HT</div>
             <div className="text-sm font-semibold text-gray-800">Your Pipeline</div>
          </div>
          <div className="text-xs text-gray-400 font-medium tracking-wide">Last updated: Today</div>
        </div>
        
        {/* Mock Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col justify-end">
            <div className="text-xs text-gray-500 font-medium mb-1">Active Jobs</div>
            <div className="text-3xl font-bold text-gray-900">24</div>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col justify-end">
            <div className="text-xs text-gray-500 font-medium mb-1">Interviews</div>
            <div className="text-3xl font-bold text-gray-900">3</div>
          </div>
        </div>

        {/* Mock Chart Area */}
        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-end p-4 gap-2 relative overflow-hidden">
           <div className="text-xs font-semibold text-gray-400 absolute top-3 left-4">Applications Sent</div>
           <div className="flex items-end gap-3 h-full pt-6">
             {[40, 70, 45, 90, 65, 80].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors" style={{ height: `${h}%` }} />
             ))}
           </div>
        </div>
      </div>

      {/* Floating Layer 1 (Card) - Specific Data */}
      <div className="absolute -right-12 top-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-5 isometric-card-layer-1 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
             <Briefcase size={18} className="text-gray-700"/>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Google</div>
            <div className="text-sm font-bold text-gray-900">Software Engineer</div>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-3 mt-1">
           <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Status</span>
           <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-bold">Interviewing</span>
        </div>
      </div>

      {/* Floating Layer 2 (Notification) - AI Generated Cover letter */}
      <div className="absolute -left-16 bottom-24 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 p-4 isometric-card-layer-2 shadow-xl flex gap-4 items-center">
         <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-sm flex-shrink-0">
           <Sparkles size={18} className="text-white" />
         </div>
         <div>
           <div className="text-xs font-bold text-gray-900 mb-0.5">Cover Letter Ready</div>
           <div className="text-xs text-gray-500 font-medium">AI generated for Stripe</div>
         </div>
      </div>
    </div>
  );
}