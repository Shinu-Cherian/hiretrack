import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Briefcase,
  LayoutDashboard,
  ListChecks,
  Map,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  FileSearch,
  PenLine,
  Layers,
  Terminal,
} from "lucide-react";
import Header from "./Header";
import { getAuthStatus } from "./api";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const modules = [
  { icon: Plus, title: "Add Job", to: "/add-job", desc: "Log company, role, JD, status, notes, and follow-up date." },
  { icon: ListChecks, title: "View Jobs", to: "/jobs", desc: "Search, edit, star, and manage your application pipeline." },
  { icon: Users, title: "Add Referral", to: "/add-referral", desc: "Record referral requests with person, company, date, and status." },
  { icon: Briefcase, title: "View Referrals", to: "/referrals", desc: "Track who replied, who is pending, and who needs a nudge." },
  { icon: LayoutDashboard, title: "Dashboard", to: "/dashboard", desc: "Visualize progress with clean charts and useful insights." },
  { icon: FileSearch, title: "ATS Resume Analyzer", to: "/resume-analyzer", desc: "Compare your resume to a JD and see missing keywords." },
  { icon: PenLine, title: "Cover Letter", to: "/cover-letter", desc: "Create a structured cover letter draft from your resume and JD." },
  { icon: Map, title: "Career Roadmap", to: "/career-roadmap", desc: "AI-powered personalised career plan based on your degree, target role, and country." },
];

const features = [
  { icon: Sparkles, title: "Smart Insights", desc: "See what needs attention without reading every row yourself." },
  { icon: ShieldCheck, title: "Private Workspace", desc: "Each logged-in user sees only their own jobs, referrals, and profile." },
  { icon: Zap, title: "Fast Updates", desc: "Edit jobs and referrals instantly from the list view." },
];

const BrandLogos = {
  Google: () => (
    <svg viewBox="0 0 24 24" className="brand-logo" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Meta: () => (
    <svg viewBox="0 0 48 28" className="brand-logo brand-logo-wide" aria-hidden="true">
      <path d="M4 19.2C7.1 9.8 10.3 5.1 14 5.1c2.7 0 5 2.2 7.3 6.1l2.7 4.5 2.7-4.5c2.3-3.9 4.6-6.1 7.3-6.1 3.7 0 6.9 4.7 10 14.1 1 3 .1 5.1-2.3 5.1-2.1 0-4.1-1.7-6.4-5.3l-4-6.4-3.1 5c-1.4 2.3-2.7 3.9-4.2 3.9s-2.8-1.6-4.2-3.9l-3.1-5-4 6.4c-2.3 3.6-4.3 5.3-6.4 5.3-2.4 0-3.3-2.1-2.3-5.1Z" fill="none" stroke="#0866FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Apple: () => (
    <svg viewBox="0 0 24 24" className="brand-logo brand-logo-mono" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05 1.78-3.19 1.76-1.11-.02-1.47-.7-2.73-.7-1.26 0-1.66.68-2.73.72-1.13.04-2.31-.92-3.3-2.34-2-2.89-1.5-7.46.46-10.29.98-1.41 2.45-2.29 3.79-2.31 1.02-.02 1.98.69 2.6.69.62 0 1.78-.85 3-.73 1.28.13 2.27.59 2.9 1.52-2.61 1.54-2.18 5.11.47 6.42-.6 1.49-1.4 3.03-2.27 4.26zM12.04 7.23c-.02-2.38 1.96-4.4 4.33-4.43.03 2.5-2.21 4.67-4.33 4.43z" />
    </svg>
  ),
  Amazon: () => (
    <svg viewBox="0 0 64 28" className="brand-logo brand-logo-wide" aria-hidden="true">
      <text x="2" y="15.5" fill="#F6F7F9" fontSize="14" fontWeight="800" letterSpacing="-0.8">amazon</text>
      <path d="M18 22c9 4 20 3.8 31-2" fill="none" stroke="#FF9900" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M45.5 18.2l5.8.7-3.4 4.5" fill="none" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Netflix: () => (
    <svg viewBox="0 0 24 24" className="brand-logo" aria-hidden="true">
      <path d="M6.51 2.21h2.89l5.09 13.91V2.21h2.99v19.58h-2.89l-5.09-13.91v13.91h-2.99V2.21z" fill="#E50914" />
    </svg>
  ),
  Stripe: () => (
    <svg viewBox="0 0 54 24" className="brand-logo brand-logo-wide" aria-hidden="true">
      <rect x="1" y="3" width="52" height="18" rx="6" fill="#635BFF" />
      <text x="10" y="16" fill="#fff" fontSize="11" fontWeight="900" letterSpacing="-0.4">stripe</text>
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" className="brand-logo" aria-hidden="true">
      <path fill="#e0e0e0" d="M12 .3a12.1 12.1 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.3-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12.1 12.1 0 0 0 12 .3" />
    </svg>
  ),
  Microsoft: () => (
    <svg viewBox="0 0 24 24" className="brand-logo" aria-hidden="true">
      <path fill="#f35323" d="M1 1h10v10H1z"/><path fill="#80bb03" d="M13 1h10v10H13z"/><path fill="#05a6f0" d="M1 13h10v10H1z"/><path fill="#ffba08" d="M13 13h10v10H13z"/>
    </svg>
  ),
  Spotify: () => (
    <svg viewBox="0 0 24 24" className="brand-logo" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.306c-.215.352-.676.463-1.028.248-2.856-1.745-6.452-2.14-10.686-1.171-.403.093-.809-.16-.902-.563-.093-.403.16-.809.563-.902 4.634-1.06 8.604-.613 11.805 1.341.352.215.463.676.248 1.028zm1.464-3.26c-.271.44-.847.578-1.287.307-3.268-2.008-8.25-2.593-12.115-1.419-.496.151-1.02-.128-1.171-.624-.151-.496.128-1.02.624-1.171 4.417-1.34 9.907-.686 13.642 1.609.44.271.578.847.307 1.287zm.126-3.385c-3.92-2.328-10.375-2.545-14.135-1.405-.601.182-1.238-.164-1.42-.765-.182-.601.164-1.238.765-1.42 4.316-1.311 11.45-1.053 15.975 1.632.541.32.716 1.018.396 1.558-.32.541-1.018.716-1.558.396z" fill="#1ED760"/>
    </svg>
  ),
  Airbnb: () => (
    <svg viewBox="0 0 32 32" className="brand-logo" aria-hidden="true">
      <path d="M16 4.3c-1.3 0-2.2.8-3 2.3L5.8 20.4c-1.3 2.6.3 5.3 3.1 5.3 2.1 0 3.9-1.5 5.6-3.7l1.5-2 1.5 2c1.7 2.2 3.5 3.7 5.6 3.7 2.8 0 4.4-2.7 3.1-5.3L19 6.6c-.8-1.5-1.7-2.3-3-2.3Zm0 11.4c-1.6 0-2.9-1.3-2.9-2.9S14.4 9.9 16 9.9s2.9 1.3 2.9 2.9-1.3 2.9-2.9 2.9Zm-3.5 3.5c-1.2 1.6-2.3 2.4-3.4 2.4-.8 0-1.2-.8-.8-1.6l3.2-6.2c.3 1.5 1.2 2.8 2.5 3.5l-1.5 1.9Zm11.2.8c.4.8 0 1.6-.8 1.6-1.1 0-2.2-.8-3.4-2.4L18 17.3c1.3-.7 2.2-2 2.5-3.5l3.2 6.2Z" fill="#FF5A5F" />
    </svg>
  )
};

const companiesRow1 = [
  { name: "Google", Logo: BrandLogos.Google },
  { name: "Meta", Logo: BrandLogos.Meta },
  { name: "Apple", Logo: BrandLogos.Apple },
  { name: "Amazon", Logo: BrandLogos.Amazon },
  { name: "Netflix", Logo: BrandLogos.Netflix },
  { name: "Microsoft", Logo: BrandLogos.Microsoft },
];

const companiesRow2 = [
  { name: "Stripe", Logo: BrandLogos.Stripe },
  { name: "GitHub", Logo: BrandLogos.GitHub },
  { name: "Spotify", Logo: BrandLogos.Spotify },
  { name: "Airbnb", Logo: BrandLogos.Airbnb },
  { name: "Google", Logo: BrandLogos.Google },
  { name: "Meta", Logo: BrandLogos.Meta },
];

const modalContent = {
  about: {
    title: "About Us",
    kicker: "Company",
    intro: "HireTrack is built for job seekers who want one private place to organize applications, referrals, resumes, cover letters, and career progress.",
    sections: [
      {
        heading: "Our Purpose",
        body: "We turn scattered job-search activity into a clear workflow so users can follow up on time, understand their pipeline, and keep every opportunity connected to the right notes and documents.",
      },
      {
        heading: "Privacy First",
        body: "Career data is personal. HireTrack is designed around account-based workspaces so each user sees only their own jobs, referrals, profile, documents, and analytics.",
      },
    ],
  },
  faq: {
    title: "FAQ",
    kicker: "Help",
    intro: "Quick answers about how HireTrack works.",
    sections: [
      {
        heading: "Do I need an account?",
        body: "Yes. Jobs, referrals, dashboard analytics, profile details, and document tools require login so your data can stay private to your workspace.",
      },
      {
        heading: "What can I track?",
        body: "You can track job applications, referral outreach, follow-up dates, statuses, notes, resumes, cover letters, saved/starred items, and dashboard progress.",
      },
      {
        heading: "Does HireTrack replace my judgment?",
        body: "No. AI-assisted tools can help draft or analyze, but you should review every resume, cover letter, and recommendation before using it professionally.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    kicker: "Legal",
    intro: "This Privacy Policy explains how HireTrack handles your account and career data inside the application.",
    sections: [
      {
        heading: "Information We Store",
        body: "HireTrack may store your username, profile details, education, experience, skills, job applications, referrals, notes, follow-up dates, uploaded resumes, uploaded cover letters, and generated career documents.",
      },
      {
        heading: "How We Use Your Data",
        body: "We use your data to show your dashboard, manage job and referral records, generate analytics, support profile features, and power tools like resume analysis, cover letter generation, career roadmap suggestions, notifications, and streak tracking.",
      },
      {
        heading: "Account Isolation",
        body: "Your private workspace is tied to your authenticated user account. Other users should not be able to view, create, edit, star, or delete your jobs, referrals, profile, dashboard data, documents, or notifications.",
      },
      {
        heading: "AI Tools",
        body: "When you use AI-powered features, the text you provide, such as resumes or job descriptions, may be sent to the configured AI service only for generating the requested result. Avoid submitting information you do not want processed by that tool.",
      },
      {
        heading: "Data Sharing",
        body: "HireTrack does not sell your personal data. We only process data for product functionality, account security, document handling, and requested AI features.",
      },
      {
        heading: "Your Control",
        body: "You can update profile details and remove jobs, referrals, or documents from your workspace. If account deletion is needed, use the data deletion guidance in this footer.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    kicker: "Legal",
    intro: "These Terms describe the basic rules for using HireTrack responsibly.",
    sections: [
      {
        heading: "Use Of The Product",
        body: "HireTrack is provided as a career organization tool for managing job applications, referrals, profile details, documents, and career-planning workflows.",
      },
      {
        heading: "Your Responsibility",
        body: "You are responsible for the accuracy of the information you add, upload, generate, download, or submit to employers. Review AI-generated content before using it.",
      },
      {
        heading: "Account Security",
        body: "Keep your login credentials private. Actions performed from your account may affect your saved jobs, referrals, profile, documents, and analytics.",
      },
      {
        heading: "Prohibited Use",
        body: "Do not attempt to access another user's workspace, misuse APIs, upload harmful files, scrape private data, or use HireTrack to submit misleading or unlawful content.",
      },
      {
        heading: "No Employment Guarantee",
        body: "HireTrack helps you organize and improve your job search, but it cannot guarantee interviews, referrals, offers, salaries, visa outcomes, or hiring decisions.",
      },
      {
        heading: "Changes",
        body: "Features and terms may evolve as HireTrack improves. Continued use of the product means you accept the current product behavior and terms shown here.",
      },
    ],
  },
  deletion: {
    title: "Data Deletion",
    kicker: "Account Control",
    intro: "Because HireTrack stores career data, users should know how deletion works.",
    sections: [
      {
        heading: "Delete Individual Records",
        body: "You can delete jobs and referrals from their list views. Deleted records should no longer appear in your dashboard, starred list, notifications, or related analytics.",
      },
      {
        heading: "Uploaded Documents",
        body: "Resume and cover letter files connected to job records should be treated as private career documents. Remove the related record or request cleanup if a file must be deleted fully.",
      },
      {
        heading: "Account Deletion Request",
        body: "If you need your full account removed, contact the site owner or project administrator with your username and deletion request. The account and related workspace data can then be removed from the database.",
      },
    ],
  },
  support: {
    title: "Support",
    kicker: "Help",
    intro: "Need help with your HireTrack workspace?",
    sections: [
      {
        heading: "What To Include",
        body: "When reporting an issue, include the page name, what you tried to do, what happened, and whether you were logged in. This helps debug account, dashboard, job, referral, or document problems faster.",
      },
      {
        heading: "Common Issues",
        body: "If private data appears incorrect, log out, sign in again, and confirm the correct account is being used. HireTrack should only show records tied to the current logged-in user.",
      },
    ],
  },
};

const footerProductLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Jobs", to: "/jobs" },
  { label: "Referrals", to: "/referrals" },
  { label: "Resume Analyzer", to: "/resume-analyzer" },
  { label: "Cover Letter", to: "/cover-letter" },
  { label: "Career Roadmap", to: "/career-roadmap" },
  { label: "Career Vault", to: "/career-vault" },
];

const footerResourceLinks = [
  { label: "About HireTrack", modal: "about" },
  { label: "FAQ", modal: "faq" },
  { label: "Support", modal: "support" },
];

const footerLegalLinks = [
  { label: "Privacy Policy", modal: "privacy" },
  { label: "Terms of Use", modal: "terms" },
  { label: "Data Deletion", modal: "deletion" },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const containerRef = useRef(null);

  React.useEffect(() => {
    let alive = true;
    getAuthStatus()
      .then((user) => {
        if (alive) setIsLoggedIn(Boolean(user.authenticated));
      })
      .catch(() => {
        if (alive) setIsLoggedIn(false);
      });
    return () => { alive = false; };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 0. Safety Set - hide elements instantly
    gsap.set([".hero-badge", ".hero-title-line", ".hero-subtitle", ".hero-actions", "[data-reveal]"], { 
      opacity: 0, 
      y: 20 
    });

    // 1. Hero Reveal Sequence
    tl.to(".hero-badge", { opacity: 1, y: 0, duration: 1, ease: "power4.out" })
      .to(".hero-title-line", { 
        opacity: 1, 
        y: 0, 
        stagger: 0.15, 
        duration: 1.2, 
        ease: "power4.out" 
      }, "-=0.7")
      .to(".hero-subtitle", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.8")
      .to(".hero-actions", { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.8");

    // 2. Scroll-Triggered Reveals
    const revealElements = gsap.utils.toArray('[data-reveal]');
    revealElements.forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

    // 3. Floating background elements
    gsap.to(".hub-item", {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      duration: "random(3, 5)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  }, { scope: containerRef, dependencies: [isLoggedIn] });

  const openModal = (e, type) => {
    e.preventDefault();
    setActiveModal(type);
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden bg-[#080909] font-sans text-white">
      <Header />

      {/* HERO SECTION */}
      <section className="home-hero-v2 relative min-h-screen flex items-center pt-8 pb-16 px-6 lg:px-12 overflow-hidden">
        <div className="hero-ambient" />
        <div className="hero-grid-floor" />
        <div className="hero-scanline" />

        <div className="hero-universe-bg">
          <div className="hub-item hub-item-1"><BrandLogos.Google /></div>
          <div className="hub-item hub-item-2"><span>Applied</span></div>
          <div className="hub-item hub-item-3"><BrandLogos.Meta /></div>
          <div className="hub-item hub-item-4"><span>Interview</span></div>
          <div className="hub-item hub-item-5"><span>Offer</span></div>
          <div className="hub-item hub-item-6"><BrandLogos.Apple /></div>
          <div className="hub-item hub-item-7"><span>Referral</span></div>
          <div className="hub-item hub-item-8"><span>Resume</span></div>
        </div>

        <div className="relative max-w-[1600px] mx-auto w-full grid lg:grid-cols-[0.92fr_1.08fr] gap-12 xl:gap-20 items-center">
          <div className="hero-copy text-center lg:text-left z-10">
            <span className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-[#FF6044] text-[10px] font-black uppercase tracking-widest mb-8">
              <Sparkles size={14} />
              <span>The modern way to track applications</span>
            </span>
            <h1 className="hero-title text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] text-white mb-8">
              <span className="hero-title-line block">Manage your career</span>
              <span className="hero-title-line block text-[#FF6044]">with precision.</span>
            </h1>
            <p className="hero-subtitle text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed mb-12">
              Elevate your job search. HireTrack organizes your pipeline, referrals, and insights into a beautifully minimalist workspace.
            </p>
            <div className="hero-actions flex flex-wrap gap-5 justify-center lg:justify-start">
              <Link to={isLoggedIn ? "/dashboard" : "/signup"}>
                <button className="px-10 py-5 bg-[#FF6044] text-[#050505] rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-[#ff4d2e] hover:shadow-[0_0_40px_rgba(255,96,68,0.4)] hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                  {isLoggedIn ? "Go to Workspace" : "Start For Free"} <ArrowRight size={18} />
                </button>
              </Link>
              {!isLoggedIn && (
                <Link to="/login">
                  <button className="px-10 py-5 bg-white/[0.04] text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all hover:-translate-y-1">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="hero-pipeline-scene-wrapper relative w-full min-h-[520px] lg:min-h-[620px] flex items-center justify-center z-10">
             <HeroPipelineScene />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative bg-[#0a0b0b] border-t border-white/5 overflow-hidden">
        <div className="relative py-20 px-6 lg:px-12">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-grid-pattern opacity-30 pointer-events-none" />
          <div className="relative max-w-[1600px] mx-auto w-full z-10">
            <div className="text-center mb-12" data-reveal>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4">LESS CHAOS. <span className="text-[#FF6044]">MORE OFFERS.</span></h2>
              <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">Every tool a serious job seeker needs — and nothing they don't.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {modules.map((module, i) => (
                <Link
                  key={module.title}
                  to={module.to}
                  className="group saas-card p-5 border-white/5 hover:border-[#FF6044]/50 transition-all duration-500"
                  data-reveal
                  style={{ '--reveal-delay': `${i * 80}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] flex items-center justify-center mb-4">
                    <module.icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 uppercase">{module.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{module.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Logo Rail at bottom of features */}
        <div className="logo-showcase border-t border-white/5">
          <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12">
            <LogoRail companies={companiesRow2} reverse />
          </div>
        </div>
      </section>

      {/* GLOBE SECTION */}
      <section className="globe-section">
        <div className="globe-section-inner">
          <div className="globe-copy sr-slide-left" data-reveal>
            <span className="globe-kicker">The complete job-search OS</span>
            <h2 className="globe-heading">
              STOP <span className="globe-coral">LOSING</span><br />
              TRACK OF<br />
              <span className="globe-coral">EVERY</span> CHANCE.
            </h2>
            <p className="globe-sub">
              HireTrack is one private workspace where every application, referral,
              resume, follow-up, and deadline stays organized — so you always
              know exactly where you stand.
            </p>
            <div className="globe-stats-row">
              <div className="globe-stat"><strong>8</strong><span>Integrated Tools</span></div>
              <div className="globe-stat-divider" />
              <div className="globe-stat"><strong>100%</strong><span>Private Workspace</span></div>
              <div className="globe-stat-divider" />
              <div className="globe-stat"><strong>Live</strong><span>Dashboard Analytics</span></div>
            </div>
          </div>
          <div className="globe-right sr-slide-right" data-reveal>
            <GlobeScene />
          </div>
        </div>
      </section>

      {/* COMBINED: HOW IT WORKS + FOOTER */}
      <section className="hiw-footer-section">

        {/* ── TOP: HOW IT WORKS ── */}
        <div className="hiw-top-wrap">
          <div className="relative max-w-[1600px] mx-auto w-full z-10">
            <div className="text-center mb-12" data-reveal>
              <span className="inline-block text-[#FF6044] text-xs font-black uppercase tracking-[0.2em] mb-4">How It Works</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3">
                FROM CHAOS TO <span className="text-[#FF6044]">CLARITY.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Three steps. One workspace. Zero missed opportunities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="hiw-card" data-reveal>
                <div className="hiw-step-num">01</div>
                <div className="hiw-icon-wrap"><Plus size={28} className="text-[#FF6044]" /></div>
                <h3 className="hiw-title">Log Your Applications</h3>
                <p className="hiw-desc">Add jobs, companies, roles, notes, and deadlines in seconds. Never lose track of an opportunity again.</p>
                <div className="hiw-connector" />
              </div>
              <div className="hiw-card" data-reveal style={{'--reveal-delay': '120ms'}}>
                <div className="hiw-step-num">02</div>
                <div className="hiw-icon-wrap"><LayoutDashboard size={28} className="text-[#FF6044]" /></div>
                <h3 className="hiw-title">Track Everything Live</h3>
                <p className="hiw-desc">Your dashboard shows pipeline stats, referral status, follow-up alerts, and streak progress — all in one view.</p>
                <div className="hiw-connector" />
              </div>
              <div className="hiw-card" data-reveal style={{'--reveal-delay': '240ms'}}>
                <div className="hiw-step-num">03</div>
                <div className="hiw-icon-wrap"><Zap size={28} className="text-[#FF6044]" /></div>
                <h3 className="hiw-title">Get Hired Faster</h3>
                <p className="hiw-desc">Follow up on time, analyze your resume against job descriptions, and build a career roadmap — all from one place.</p>
              </div>
            </div>

          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="hiw-footer-divider" />

        {/* ── BOTTOM: RICH FOOTER ── */}
        <footer className="ht-footer-embedded">
          <div className="ht-footer-inner">
            <div className="ht-footer-grid">

              {/* Brand */}
              <div className="ht-footer-brand">
                <Link to="/" className="ht-footer-logo-link">
                  <Briefcase className="text-[#FF6044]" size={20} />
                  <span>Hire<span className="text-gray-400 font-light">Track</span></span>
                </Link>
                <p className="ht-footer-tagline">
                  A private workspace to track jobs, referrals, resumes, and career progress.
                </p>
                <div className="ht-footer-trust">
                  <ShieldCheck size={13} />
                  <span>Your career data stays in your workspace.</span>
                </div>
              </div>

              {/* Product */}
              <div className="ht-footer-col">
                <h5 className="ht-footer-col-heading ht-footer-col-heading-coral">Product</h5>
                <ul className="ht-footer-links">
                  {footerProductLinks.map(({ label, to }) => (
                    <li key={label}><Link to={to} className="ht-footer-link">{label}</Link></li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="ht-footer-col">
                <h5 className="ht-footer-col-heading ht-footer-col-heading-coral">Resources</h5>
                <ul className="ht-footer-links">
                  {footerResourceLinks.map(({ label, modal }) => (
                    <li key={label}><a href="#" onClick={(e) => openModal(e, modal)} className="ht-footer-link">{label}</a></li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div className="ht-footer-col">
                <h5 className="ht-footer-col-heading ht-footer-col-heading-coral">Legal</h5>
                <ul className="ht-footer-links">
                  {footerLegalLinks.map(({ label, modal }) => (
                    <li key={label}><a href="#" onClick={(e) => openModal(e, modal)} className="ht-footer-link">{label}</a></li>
                  ))}
                </ul>
              </div>

              {/* CTA Card */}
              <div className="ht-footer-cta-card">
                <p className="ht-footer-cta-headline">Ready to organize your job&nbsp;search?</p>
                <p className="ht-footer-cta-sub">Free to start. No card required.</p>
                <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="ht-footer-cta-btn">
                  {isLoggedIn ? "Go to workspace" : "Start for free"}
                  <ArrowRight size={15} />
                </Link>
                {!isLoggedIn && (
                  <Link to="/login" className="ht-footer-signin-link">Already have an account? Sign in</Link>
                )}
              </div>

            </div>

            {/* Pre-copyright taglines */}
            <div className="ht-footer-pre-copy">
              <p>Track smarter. Apply faster. Get hired.</p>
              <p>Your career, organized.</p>
            </div>

            {/* Bottom bar */}
            <div className="ht-footer-bottom">
              <span>© {new Date().getFullYear()} HireTrack. All rights reserved.</span>
              <span className="ht-footer-bottom-badge">Made for serious job seekers.</span>
            </div>
          </div>
        </footer>

      </section>


      {/* MODAL */}
      {activeModal && (
        <div className="ht-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="ht-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ht-modal-header">
              <div>
                <span className="ht-modal-kicker">{modalContent[activeModal].kicker}</span>
                <h3 className="ht-modal-title">{modalContent[activeModal].title}</h3>
              </div>
              <button className="ht-modal-close" onClick={() => setActiveModal(null)} aria-label="Close modal">✕</button>
            </div>
            <div className="ht-modal-body">
              <p className="ht-modal-intro">{modalContent[activeModal].intro}</p>
              <div className="ht-modal-sections">
                {modalContent[activeModal].sections.map((sec) => (
                  <div key={sec.heading} className="ht-modal-section">
                    <h4 className="ht-modal-section-heading">{sec.heading}</h4>
                    <p className="ht-modal-section-body">{sec.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="ht-modal-footer">
              <button onClick={() => setActiveModal(null)} className="ht-modal-close-btn">Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LogoRail({ companies, reverse = false }) {
  return (
    <div className="logo-rail" aria-label="Company logos">

      <div className={`logo-rail-track ${reverse ? "logo-rail-track-reverse" : ""}`}>
        {[0, 1, 2].map((groupIndex) => (
          <div className="logo-rail-group" key={groupIndex} aria-hidden={groupIndex > 0}>
            {companies.map((company) => (
              <LogoTile company={company} key={`${groupIndex}-${company.name}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoTile({ company }) {
  const Logo = company.Logo;

  return (
    <div className="logo-tile">
      <Logo />
      <span>{company.name}</span>
    </div>
  );
}


const pipelineCards = [
  { icon: Briefcase, label: "Applications", value: "24", meta: "+6 this week", tone: "coral" },
  { icon: Users, label: "Interviews", value: "3", meta: "2 scheduled", tone: "white" },
  { icon: ShieldCheck, label: "Offers", value: "2", meta: "1 pending", tone: "mint" },
  { icon: Zap, label: "Follow-ups", value: "8", meta: "due soon", tone: "amber" },
];

const orbitChips = ["Referral", "Resume", "Screening", "Offer"];

function HeroPipelineScene() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setTilt({ x: y * -8, y: x * 10 });
  };

  return (
    <div
      className="hero-pipeline-wrap"
      style={{
        "--tilt-x": `${tilt.x}deg`,
        "--tilt-y": `${tilt.y}deg`,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="pipeline-halo" />
      <div className="pipeline-stage">
        <svg className="pipeline-lines" viewBox="0 0 720 560" aria-hidden="true">
          <path className="pipeline-line pipeline-line-soft" d="M130 190 C220 90 344 104 420 188 S562 284 626 188" />
          <path className="pipeline-line pipeline-line-hot" d="M130 190 C220 90 344 104 420 188 S562 284 626 188" />
          <path className="pipeline-line pipeline-line-soft" d="M128 370 C220 470 342 452 420 366 S552 280 626 370" />
          <path className="pipeline-line pipeline-line-hot pipeline-line-delay" d="M128 370 C220 470 342 452 420 366 S552 280 626 370" />
          <path className="pipeline-line pipeline-line-muted" d="M360 146 C340 240 338 322 360 416" />
        </svg>

        <div className="pipeline-core">
          <div className="pipeline-core-header">
            <div>
              <span>HireTrack OS</span>
              <strong>Live pipeline</strong>
            </div>
            <div className="pipeline-live-dot" />
          </div>
          <div className="pipeline-core-list">
            {["Applied", "Interview", "Offer"].map((item, index) => (
              <div className="pipeline-row" key={item}>
                <span>{item}</span>
                <div className="pipeline-progress">
                  <i style={{ width: `${[74, 46, 28][index]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pipeline-terminal">
            <Terminal size={15} />
            <span>next follow-up in 2 days</span>
          </div>
        </div>

        {pipelineCards.map((card, index) => (
          <div className={`pipeline-card pipeline-card-${index + 1}`} key={card.label}>
            <div className={`pipeline-icon pipeline-icon-${card.tone}`}>
              <card.icon size={20} />
            </div>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.meta}</small>
          </div>
        ))}

        <div className="pipeline-doc">
          <FileSearch size={18} />
          <span>Resume match</span>
          <strong>86%</strong>
        </div>

        <div className="pipeline-stack">
          <Layers size={18} />
          <span>Insights synced</span>
        </div>

        {orbitChips.map((chip, index) => (
          <span className={`orbit-chip orbit-chip-${index + 1}`} key={chip}>{chip}</span>
        ))}
      </div>
    </div>
  );
}

/* ── GLOBE SCENE COMPONENT ── */
const globeChips = [
  { label: "84 Applications", color: "coral",  orbit: 1 },
  { label: "12 Referrals",    color: "white",  orbit: 2 },
  { label: "Interview Booked",color: "green",  orbit: 3 },
  { label: "Follow-up Due",   color: "amber",  orbit: 4 },
  { label: "Offer Received 🎉",color: "coral", orbit: 5 },
];

function GlobeScene() {
  return (
    <div className="gs-wrap">
      {/* floor glow */}
      <div className="gs-floor-glow" />

      {/* sphere */}
      <div className="gs-sphere">
        {/* latitude arcs */}
        <svg className="gs-svg gs-lat" viewBox="-140 -140 280 280" aria-hidden="true">
          <ellipse cx="0" cy="0" rx="136" ry="52" fill="none" stroke="rgba(255,96,68,0.4)"  strokeWidth="1.2"/>
          <ellipse cx="0" cy="0" rx="120" ry="32" fill="none" stroke="rgba(255,96,68,0.22)" strokeWidth="0.9"/>
          <ellipse cx="0" cy="0" rx="90"  ry="18" fill="none" stroke="rgba(255,96,68,0.14)" strokeWidth="0.7"/>
          <ellipse cx="0" cy="0" rx="136" ry="80" fill="none" stroke="rgba(255,96,68,0.18)" strokeWidth="0.8"/>
        </svg>
        {/* longitude arcs */}
        <svg className="gs-svg gs-lon" viewBox="-140 -140 280 280" aria-hidden="true">
          <ellipse cx="0" cy="0" rx="52"  ry="136" fill="none" stroke="rgba(255,96,68,0.3)"  strokeWidth="1"/>
          <ellipse cx="0" cy="0" rx="100" ry="136" fill="none" stroke="rgba(255,96,68,0.16)" strokeWidth="0.8"/>
          <ellipse cx="0" cy="0" rx="20"  ry="136" fill="none" stroke="rgba(255,96,68,0.1)"  strokeWidth="0.6"/>
        </svg>
        {/* glowing core dot */}
        <div className="gs-core" />
        {/* surface nodes */}
        <div className="gs-node gs-node-1" />
        <div className="gs-node gs-node-2" />
        <div className="gs-node gs-node-3" />
        <div className="gs-node gs-node-4" />
      </div>

      {/* orbital chips */}
      {globeChips.map((chip) => (
        <div key={chip.label} className={`gs-orbit gs-orbit-${chip.orbit}`}>
          <div className={`gs-chip gs-chip-${chip.color}`}>{chip.label}</div>
        </div>
      ))}
    </div>
  );
}

