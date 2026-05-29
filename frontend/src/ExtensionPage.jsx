import React from "react";
import Header from "./Header";
import BackButton from "./components/BackButton";
import { Download, Puzzle, Settings, Pin, Globe, MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-[#101212] bg-dot-pattern text-white">
      <Header />

      <main className="mx-auto w-full max-w-5xl space-y-24 px-6 py-12 animate-fade-in-up">
        <div className="flex items-center">
          <BackButton label="Back" />
        </div>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] text-xs font-display tracking-widest uppercase mb-10 rounded-full">
            <Puzzle size={14} /> Extension Module
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black font-display text-white uppercase tracking-tight mb-8 leading-[1.1]">
            Capture Opportunities <br />
            <span className="text-[#FF6044]">Without Switching Tabs</span>
          </h1>
          
          <p className="text-xl font-light text-gray-400 leading-relaxed mb-12">
            The HireTrack extension sits right in your browser. Save jobs and log referrals directly from LinkedIn, Indeed, and across the web instantly.
          </p>

          <a 
            href="/hiretrack-extension.zip" 
            download="hiretrack-extension.zip"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#FF6044] text-[#121313] rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,96,68,0.3)]"
          >
            <Download size={20} strokeWidth={3} />
            Download ZIP
          </a>
        </section>

        {/* Visual Mockup */}
        <section className="flex justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#101212] via-transparent to-transparent z-20 bottom-0 h-32 mt-auto pointer-events-none" />
          <div className="w-full max-w-3xl rounded-t-2xl border-t border-l border-r border-white/10 bg-[#1A1B1B] overflow-hidden shadow-2xl p-2 pb-0 relative">
             <div className="bg-[#121313] w-full h-[320px] rounded-t-xl border border-white/5 relative p-6 overflow-hidden">
                
                {/* Browser top bar mockup */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-6 relative z-10">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-white/10"></div>
                     <div className="w-3 h-3 rounded-full bg-white/10"></div>
                     <div className="w-3 h-3 rounded-full bg-white/10"></div>
                   </div>
                   <div className="flex-1 bg-white/5 h-6 rounded-md"></div>
                   <div className="flex gap-4 relative pr-2">
                     <motion.div 
                       animate={{ scale: [1, 1, 0.85, 1, 1] }} 
                       transition={{ duration: 4, repeat: Infinity, times: [0, 0.35, 0.38, 0.4, 1] }}
                     >
                       <Puzzle size={16} className="text-[#FF6044]" />
                     </motion.div>
                     <div className="w-6 h-6 rounded-full bg-white/10 -mt-1"></div>
                   </div>
                </div>
                
                {/* Extension Popup Mockup */}
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: [0, 0, 1, 1, 0], y: [-10, -10, 0, 0, -10], scale: [0.95, 0.95, 1, 1, 0.95] }}
                  transition={{ duration: 4, repeat: Infinity, times: [0, 0.38, 0.45, 0.9, 1] }}
                  className="absolute top-16 right-6 w-72 bg-[#1A1B1B] border border-white/10 rounded-xl shadow-2xl p-4 z-10 origin-top-right"
                >
                   <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Puzzle size={16} className="text-[#FF6044]" />
                        <span className="font-display font-bold text-sm">HireTrack</span>
                      </div>
                      <Pin size={14} className="text-gray-500" />
                   </div>
                   <div className="space-y-3">
                      <div className="h-8 bg-white/5 rounded w-full"></div>
                      <div className="h-8 bg-white/5 rounded w-full"></div>
                      <motion.div 
                        animate={{ scale: [1, 1, 0.96, 1, 1], backgroundColor: ["#FF6044", "#FF6044", "#ff4d2e", "#FF6044", "#FF6044"] }}
                        transition={{ duration: 4, repeat: Infinity, times: [0, 0.75, 0.78, 0.8, 1] }}
                        className="h-10 rounded w-full mt-4"
                      ></motion.div>
                   </div>
                </motion.div>

                {/* Animated Cursor */}
                <motion.div
                  initial={{ x: "50%", y: "200%", opacity: 0 }}
                  animate={{ 
                    x: ["50%", "92%", "92%", "82%", "82%", "50%"], 
                    y: ["200px", "20px", "20px", "190px", "190px", "200px"],
                    opacity: [0, 1, 1, 1, 1, 0],
                    scale: [1, 1, 0.85, 1, 1, 0.85, 1, 1] // Added scale array for clicking
                  }}
                  transition={{ 
                     duration: 4, 
                     repeat: Infinity,
                     times: [0, 0.25, 0.4, 0.6, 0.8, 1],
                     ease: "easeInOut"
                  }}
                  className="absolute top-0 left-0 z-30 pointer-events-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                >
                   <MousePointer2 size={32} className="text-white fill-[#121313] stroke-[1.5]" />
                </motion.div>
             </div>
          </div>
        </section>

        {/* Installation Guide */}
        <section className="space-y-12">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-black font-display uppercase tracking-widest text-white mb-4">
              Installation Protocol
            </h2>
            <p className="text-gray-400 font-light">Four simple steps to integrate HireTrack into your browser.</p>
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
              icon={<Globe size={40} />}
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
