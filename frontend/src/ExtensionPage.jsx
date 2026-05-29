import React from "react";
import Header from "./Header";
import BackButton from "./components/BackButton";
import { Download, Puzzle, Settings, Pin } from "lucide-react";

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-[#121313] bg-dot-pattern text-white">
      <Header />

      <main className="mx-auto w-full max-w-4xl space-y-12 px-6 py-12 animate-fade-in-up">
        <div className="flex items-center">
          <BackButton label="Back" />
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1A1B1B] p-8 md:p-12 shadow-2xl">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#FF6044]/10 to-transparent pointer-events-none" />

          <div className="z-10 relative">
            <div className="w-16 h-16 rounded-2xl bg-[#FF6044]/10 flex items-center justify-center mb-6 border border-[#FF6044]/20">
              <Puzzle className="text-[#FF6044]" size={32} />
            </div>
            
            <h1 className="text-4xl font-black text-white tracking-tight mb-4">
              HireTrack Extension
            </h1>
            <p className="text-lg font-light text-gray-400 max-w-2xl leading-relaxed mb-8">
              Track job applications and save referrals directly from LinkedIn, Indeed, and other portals without switching tabs.
            </p>

            <a 
              href="/hiretrack-extension.zip" 
              download="hiretrack-extension.zip"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF6044] text-[#121313] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#ff4d2e] transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(255,96,68,0.3)]"
            >
              <Download size={18} strokeWidth={3} />
              Download Extension ZIP
            </a>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-4">
            Installation Guide
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <StepCard 
              num="01" 
              title="Download & Extract" 
              icon={<Download />}
              desc="Click the download button above to get the hiretrack-extension.zip file. Extract the ZIP file to a permanent folder on your computer." 
            />
            <StepCard 
              num="02" 
              title="Open Extensions" 
              icon={<Puzzle />}
              desc="Open Google Chrome and type chrome://extensions/ in the address bar to open the Extensions management page." 
            />
            <StepCard 
              num="03" 
              title="Enable Developer Mode" 
              icon={<Settings />}
              desc="In the top right corner of the Extensions page, toggle 'Developer mode' to ON." 
            />
            <StepCard 
              num="04" 
              title="Load Unpacked" 
              icon={<Pin />}
              desc="Click the 'Load unpacked' button at the top left. Select the extracted hiretrack-extension folder. Finally, pin the extension to your toolbar!" 
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function StepCard({ num, title, desc, icon }) {
  return (
    <div className="bg-[#1A1B1B]/50 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-all font-display">
          {num}
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FF6044] transition-all border border-white/5 group-hover:border-[#FF6044]/30">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm font-light text-gray-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
