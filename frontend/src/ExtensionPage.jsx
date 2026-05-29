import React from "react";
import Header from "./Header";
import BackButton from "./components/BackButton";
import { Download, Puzzle, Settings, Pin, Globe, MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-[#101212] bg-dot-pattern text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] space-y-16 px-6 lg:px-12 py-8 animate-fade-in-up">
        <div className="flex items-center">
          <BackButton label="Back" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center pt-2">
          {/* Hero Section */}
          <section className="flex flex-col items-start text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] text-xs font-display tracking-widest uppercase mb-10 rounded-full">
              <Puzzle size={14} /> Extension Module
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black font-display text-white uppercase tracking-tight mb-8 leading-[1.05]">
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

          {/* Visual Mockup - Full Chrome Walkthrough */}
          <section className="flex justify-center relative w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-[#101212] via-transparent to-transparent z-20 bottom-0 h-32 mt-auto pointer-events-none" />
            <div className="w-full max-w-2xl rounded-t-2xl border-t border-l border-r border-white/10 bg-[#1A1B1B] overflow-hidden shadow-2xl p-2 pb-0 relative">
               <div className="bg-[#121313] w-full h-[360px] rounded-t-xl border border-white/5 relative overflow-hidden">
                
                {/* Browser top bar mockup */}
                <div className="flex items-center gap-4 border-b border-white/5 p-4 relative z-10 bg-[#121313]">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-white/10"></div>
                     <div className="w-3 h-3 rounded-full bg-white/10"></div>
                     <div className="w-3 h-3 rounded-full bg-white/10"></div>
                   </div>
                   
                   <motion.div 
                     className="flex-1 bg-white/5 h-7 rounded-md px-4 flex items-center overflow-hidden"
                   >
                     <motion.span 
                       animate={{ opacity: [0, 0, 1, 1, 0] }}
                       transition={{ duration: 10, repeat: Infinity, times: [0, 0.30, 0.31, 0.99, 1] }}
                       className="text-[11px] text-gray-500 font-mono tracking-wide"
                     >
                       chrome://extensions
                     </motion.span>
                   </motion.div>
                   
                   <div className="flex gap-5 relative pr-2 items-center">
                     <Puzzle size={16} className="text-gray-600" />
                     <div className="w-7 h-7 rounded-full bg-white/10"></div>
                     
                     {/* 3 Dots Menu */}
                     <motion.div 
                       animate={{ scale: [1, 1, 0.8, 1, 1] }} 
                       transition={{ duration: 10, repeat: Infinity, times: [0, 0.15, 0.165, 0.18, 1] }}
                       className="flex flex-col gap-[3px] items-center justify-center w-5 h-5 cursor-pointer hover:bg-white/5 rounded-full"
                     >
                       <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
                       <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
                       <div className="w-[3px] h-[3px] rounded-full bg-gray-400"></div>
                     </motion.div>
                   </div>
                </div>
                
                {/* Dropdown Menu Mockup */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [0.95, 0.95, 1, 1, 0.95, 0.95] }}
                  transition={{ duration: 10, repeat: Infinity, times: [0, 0.18, 0.19, 0.30, 0.31, 1] }}
                  className="absolute top-14 right-4 w-48 bg-[#1A1B1B] border border-white/10 rounded-xl shadow-2xl py-2 z-20 origin-top-right"
                >
                   <div className="px-4 py-2.5 text-xs text-gray-400">New Tab</div>
                   <div className="px-4 py-2.5 text-xs text-gray-400">History</div>
                   <div className="px-4 py-2.5 text-xs text-gray-400">Settings</div>
                   <div className="my-1 border-t border-white/5"></div>
                   <motion.div 
                     animate={{ backgroundColor: ["transparent", "transparent", "rgba(255,255,255,0.05)", "rgba(255,255,255,0.05)", "transparent"] }}
                     transition={{ duration: 10, repeat: Infinity, times: [0, 0.26, 0.27, 0.31, 1] }}
                     className="px-4 py-2.5 text-xs text-white flex justify-between items-center"
                   >
                     Extensions <Globe size={12} className="text-gray-500" />
                   </motion.div>
                </motion.div>

                {/* Browser Body - New Tab (Empty State) */}
                <motion.div 
                  animate={{ opacity: [1, 1, 0, 0, 1] }}
                  transition={{ duration: 10, repeat: Infinity, times: [0, 0.30, 0.31, 0.99, 1] }}
                  className="absolute inset-0 top-[60px] flex flex-col items-center justify-center z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Globe size={24} className="text-white/20" />
                  </div>
                  <div className="w-64 h-8 bg-white/5 rounded-full"></div>
                </motion.div>

                {/* Browser Body - Extensions Page */}
                <motion.div 
                  animate={{ opacity: [0, 0, 1, 1, 0] }}
                  transition={{ duration: 10, repeat: Infinity, times: [0, 0.30, 0.31, 0.99, 1] }}
                  className="absolute inset-0 top-[60px] p-8 z-10 bg-[#121313]"
                >
                  <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-2xl font-display font-bold text-white">Extensions</h2>
                    <div className="px-3 py-1 bg-[#FF6044]/10 text-[#FF6044] text-[10px] uppercase tracking-widest font-bold rounded-full border border-[#FF6044]/20">
                      Developer mode ON
                    </div>
                  </div>
                  
                  {/* HireTrack Extension Card */}
                  <div className="w-full max-w-[340px] bg-[#1A1B1B] border border-white/5 rounded-2xl p-6 shadow-lg relative">
                     <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-[#FF6044]/10 flex items-center justify-center border border-[#FF6044]/20 flex-shrink-0">
                          <Puzzle size={28} className="text-[#FF6044]" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-white text-base">HireTrack</h3>
                          <p className="text-[11px] text-gray-500 mb-2 font-mono">Version 1.0.0</p>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">Capture job postings and manage referrals directly from the web.</p>
                        </div>
                     </div>
                     <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Status</span>
                        {/* Toggle Switch */}
                        <div className="w-11 h-6 rounded-full bg-[#333] relative flex items-center px-1 shadow-inner">
                          <motion.div 
                            animate={{ 
                              x: [0, 0, 20, 20, 0],
                              backgroundColor: ["#888", "#888", "#fff", "#fff", "#888"]
                            }}
                            transition={{ duration: 10, repeat: Infinity, times: [0, 0.48, 0.49, 0.99, 1] }}
                            className="w-4 h-4 rounded-full absolute left-1 shadow-md z-10"
                          ></motion.div>
                          
                          <motion.div 
                            animate={{ backgroundColor: ["#333", "#333", "#FF6044", "#FF6044", "#333"] }}
                            transition={{ duration: 10, repeat: Infinity, times: [0, 0.48, 0.49, 0.99, 1] }}
                            className="absolute inset-0 rounded-full"
                          ></motion.div>
                        </div>
                     </div>
                  </div>
                </motion.div>

                {/* Animated Cursor */}
                <motion.div
                  animate={{ 
                    left: ["50%", "50%", "95%", "95%", "95%", "85%", "85%", "85%", "40%", "40%", "40%", "40%", "50%", "50%"],
                    top:  ["110%", "80%", "28px", "28px", "28px", "155px", "155px", "155px", "280px", "280px", "280px", "280px", "110%", "110%"],
                    scale: [1, 1, 1, 0.7, 1, 1, 0.7, 1, 1, 0.7, 1, 1, 1, 1],
                    opacity:[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
                  }}
                  transition={{ 
                     duration: 10, 
                     repeat: Infinity,
                     times: [0, 0.05, 0.15, 0.165, 0.18, 0.27, 0.285, 0.30, 0.45, 0.465, 0.48, 0.85, 0.90, 1],
                     ease: "easeInOut"
                  }}
                  className="absolute z-30 pointer-events-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] -ml-2 -mt-2"
                >
                   <MousePointer2 size={24} className="text-white fill-[#121313] stroke-[1.5]" />
                </motion.div>
             </div>
          </div>
        </section>
        </div>

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
