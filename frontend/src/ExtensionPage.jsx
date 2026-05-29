import React from "react";
import Header from "./Header";
import BackButton from "./components/BackButton";
import { Download, Puzzle, Settings, Pin } from "lucide-react";

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-[#101212] bg-dot-pattern text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1500px] space-y-20 px-6 py-12 animate-fade-in-up">
        <div className="flex items-center">
          <BackButton label="Back" />
        </div>

        {/* Hero Section */}
        <section className="mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] text-xs font-display tracking-widest uppercase mb-12">
            <Puzzle size={14} /> Extension Module
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black leading-[0.8] uppercase tracking-tighter mb-12 manifesto-title">
            The<br />
            <span className="text-[#FF6044]">Extension</span>
          </h1>
          <div className="h-2 w-24 bg-[#FF6044] mb-12" />
          <p className="text-2xl md:text-4xl font-light leading-tight text-gray-400 max-w-4xl mb-12">
            Don't switch tabs. Capture job postings and log referrals directly from LinkedIn, Indeed, and across the web instantly.
          </p>

          <a 
            href="/hiretrack-extension.zip" 
            download="hiretrack-extension.zip"
            className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#FF6044] text-[#121313] rounded-none brutalist-shadow font-display font-black text-xl md:text-2xl uppercase tracking-tight hover:bg-white transition-all transform hover:-translate-y-1"
          >
            <Download size={28} strokeWidth={3} />
            Download ZIP
          </a>
        </section>

        {/* Installation Guide */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h2 className="text-3xl font-black font-display uppercase tracking-widest text-white">
              Installation Protocol
            </h2>
            <span className="text-[#FF6044] font-mono text-xs uppercase tracking-widest hidden md:inline-block">System Configuration</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StepCard 
              num="1" 
              title="Extract" 
              icon={<Download size={40} />}
              desc="Download the ZIP file and extract it to a permanent folder on your machine." 
            />
            <StepCard 
              num="2" 
              title="Navigate" 
              icon={<Puzzle size={40} />}
              desc="Open Google Chrome and navigate to chrome://extensions/ to access settings." 
            />
            <StepCard 
              num="3" 
              title="Dev Mode" 
              icon={<Settings size={40} />}
              desc="Toggle 'Developer mode' to ON in the top right corner of the Extensions dashboard." 
            />
            <StepCard 
              num="4" 
              title="Deploy" 
              icon={<Pin size={40} />}
              desc="Click 'Load unpacked', select the extracted folder, and pin the extension to your toolbar." 
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function StepCard({ num, title, desc, icon }) {
  return (
    <div className="reveal-item group p-10 bg-[#121313]/50 border border-white/5 hover:border-[#FF6044] transition-all duration-500 cursor-default relative overflow-hidden brutalist-shadow h-full flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
         <div className="text-7xl font-black font-display text-[#FF6044]">{num}</div>
      </div>
      <div className="text-[#FF6044] mb-10 group-hover:scale-110 transition-transform origin-left duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-display font-bold text-white uppercase mb-4 leading-none">{title}</h3>
      <p className="text-gray-400 text-xs uppercase tracking-tight leading-relaxed font-light flex-grow">{desc}</p>
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
         <span className="text-[10px] font-mono text-gray-400 uppercase">STEP_0{num}</span>
      </div>
    </div>
  );
}
