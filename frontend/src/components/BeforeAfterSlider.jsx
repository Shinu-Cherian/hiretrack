import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, AlertCircle, LayoutDashboard, CheckCircle2, FileText, Mail, Search } from 'lucide-react';

export default function BeforeAfterSlider() {
   const [position, setPosition] = useState(50);
   const [isDragging, setIsDragging] = useState(false);
   const containerRef = useRef(null);

   const handleMove = (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setPosition(percent);
   };

   const onMouseMove = (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
   };

   const onTouchMove = (e) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
   };

   useEffect(() => {
      if (isDragging) {
         window.addEventListener('mousemove', onMouseMove);
         window.addEventListener('mouseup', () => setIsDragging(false));
         window.addEventListener('touchmove', onTouchMove);
         window.addEventListener('touchend', () => setIsDragging(false));
      }
      return () => {
         window.removeEventListener('mousemove', onMouseMove);
         window.removeEventListener('mouseup', () => setIsDragging(false));
         window.removeEventListener('touchmove', onTouchMove);
         window.removeEventListener('touchend', () => setIsDragging(false));
      };
   }, [isDragging]);

   return (
      <div className="w-full max-w-[1400px] mx-auto flex flex-col items-center">

         <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(-8deg); }
        }
        @keyframes floatSpread {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(10px) rotate(1deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,96,68,0.1); }
          50% { box-shadow: 0 0 40px rgba(255,96,68,0.4); }
        }
      `}</style>

         {/* Slider Container */}
         <div
            ref={containerRef}
            className="relative w-full h-[600px] md:h-[700px] rounded-[40px] overflow-hidden cursor-ew-resize border border-white/10 select-none touch-none shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-[#0a0606]"
            onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
            onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
         >

            {/* ── LEFT SIDE: WITHOUT HIRETRACK (THE CHAOS) ── */}
            <div className="absolute inset-0 bg-[#160f0d] overflow-hidden">

               {/* Faded Stressed User Background Image */}
               <div
                  className="absolute inset-0 opacity-[0.4] mix-blend-screen bg-cover bg-center bg-no-repeat pointer-events-none scale-105"
                  style={{ backgroundImage: "url('/stressed_user_bg.png')" }}
               />
               
               {/* Erratic Warning Glows - Optimized for Performance */}
               <div className="absolute top-[30%] left-[20%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(127,29,29,0.15)_0%,transparent_70%)] mix-blend-screen pointer-events-none z-[-1] will-change-transform" style={{ animation: 'pulse 3s infinite' }} />
               <div className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,45,18,0.1)_0%,transparent_70%)] mix-blend-screen pointer-events-none z-[-1] will-change-transform" style={{ animation: 'pulse 4s infinite 1s' }} />

               {/* Vignette Overlay to ensure text readability */}
               <div className="absolute inset-0 bg-gradient-to-b from-[#160f0d]/90 via-[#160f0d]/30 to-[#160f0d]/90 pointer-events-none z-[-1]" />
               <div className="absolute inset-0 bg-gradient-to-r from-[#160f0d] via-[#160f0d]/40 to-transparent pointer-events-none z-[-1]" />

               {/* Chaos Typography (Fades out when dragged left) */}
               <div
                  className="absolute top-12 left-10 lg:left-16 z-20 max-w-lg pointer-events-none transition-opacity duration-300"
                  style={{ opacity: position > 25 ? 1 : 0 }}
               >
                  <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 font-black tracking-widest uppercase text-[10px] mb-6 backdrop-blur-md">
                     Without HireTrack
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black text-white mb-4 uppercase leading-[0.9] tracking-tighter">
                     The Dark Age of <br /><span className="text-red-500">Job Hunting.</span>
                  </h3>
                  <p className="text-gray-400 text-base lg:text-lg font-medium leading-relaxed">
                     Scattered spreadsheets, endless "resume_final_v4" files, forgotten referrals, and the constant stress of not knowing where you applied.
                  </p>
               </div>

               {/* VISUAL MOCKUP 1: Messy Inbox */}
               <div className="absolute top-1/2 left-[5%] lg:left-[8%] w-[300px] lg:w-[350px] bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden opacity-70 pointer-events-none will-change-transform" style={{ animation: 'floatSlow 7s ease-in-out infinite' }}>
                  <div className="bg-black/50 p-3 flex items-center gap-2 border-b border-white/5">
                     <div className="w-3 h-3 rounded-full bg-red-500/80" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                     <div className="w-3 h-3 rounded-full bg-green-500/80" />
                     <span className="text-xs text-gray-500 font-mono ml-2 font-bold tracking-tight">Inbox (4,092 unread)</span>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-3">
                           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <Mail size={14} className="text-gray-500" />
                           </div>
                           <div>
                              <div className="text-sm font-bold text-gray-300 mb-1">Update on application</div>
                              <div className="text-xs text-red-400/80 font-medium">Unfortunately, we have decided...</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* VISUAL MOCKUP 2: Stressful Spreadsheet */}
               <div className="absolute top-[35%] left-[30%] lg:left-[40%] w-[400px] lg:w-[450px] bg-[#0d1117] rounded-2xl border border-red-500/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden opacity-90 pointer-events-none will-change-transform" style={{ animation: 'floatSpread 8s ease-in-out infinite' }}>
                  <div className="bg-black/60 p-3 border-b border-white/5 flex gap-2 items-center">
                     <FileText size={16} className="text-green-500" />
                     <span className="text-xs text-gray-400 font-mono font-bold tracking-tight">Job_Tracker_FINAL_v12.xlsx</span>
                  </div>
                  <div className="p-5">
                     <div className="flex gap-4 mb-3 pb-3 border-b border-white/10">
                        <div className="w-32 text-[10px] font-black text-gray-500 uppercase tracking-widest">Company</div>
                        <div className="w-24 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</div>
                        <div className="w-32 text-[10px] font-black text-gray-500 uppercase tracking-widest">Follow Up</div>
                     </div>
                     {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-4 mb-3 items-center">
                           <div className="w-32 h-8 bg-white/5 rounded-md px-3 flex items-center text-xs font-mono text-gray-400 font-bold border border-white/5">Company_0{i + 1}</div>
                           <div className="w-24 h-8 bg-red-500/10 border border-red-500/20 rounded-md px-3 flex items-center justify-center text-xs text-red-400 font-bold tracking-wider">Ghosted</div>
                           <div className="w-32 h-8 bg-yellow-500/10 border border-yellow-500/20 rounded-md px-3 flex items-center gap-2 text-xs text-yellow-400 font-bold">
                              <AlertCircle size={14} /> Overdue
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* VISUAL MOCKUP 3: The Resume Folder Nightmare */}
               <div className="absolute top-[10%] right-[10%] lg:right-[20%] w-[300px] bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden opacity-85 pointer-events-none will-change-transform" style={{ animation: 'floatSlow 9s ease-in-out infinite reverse' }}>
                  <div className="bg-[#2d2d2d] p-3 flex items-center gap-2 border-b border-white/5">
                     <div className="w-3 h-3 rounded-full bg-red-500/80" />
                     <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                     <div className="w-3 h-3 rounded-full bg-green-500/80" />
                     <span className="text-xs text-gray-400 font-mono ml-2 font-bold tracking-tight">/Documents/Resumes</span>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                     <div className="flex items-center gap-3 text-gray-400 text-[11px] font-mono bg-white/5 p-2 rounded-lg border border-white/5"><FileText size={14} className="text-red-400" /> resume_final.pdf</div>
                     <div className="flex items-center gap-3 text-gray-400 text-[11px] font-mono bg-white/5 p-2 rounded-lg border border-white/5"><FileText size={14} className="text-red-400" /> resume_final_v2_google.pdf</div>
                     <div className="flex items-center gap-3 text-gray-400 text-[11px] font-mono bg-white/5 p-2 rounded-lg border border-white/5"><FileText size={14} className="text-red-400" /> resume_real_final_use.pdf</div>
                     <div className="flex items-center gap-3 text-red-400 text-[11px] font-mono bg-red-500/10 p-2 rounded-lg border border-red-500/30"><AlertCircle size={14} /> resume_amazon_v4_PLEASE.pdf</div>
                  </div>
               </div>

               {/* VISUAL MOCKUP 4: Referral Panic Sticky Note */}
               <div className="absolute bottom-[10%] left-[20%] lg:left-[30%] w-[280px] p-5 bg-yellow-900/80 border border-yellow-500/50 backdrop-blur-md shadow-2xl rotate-6 opacity-95 pointer-events-none will-change-transform" style={{ animation: 'floatSpread 6s ease-in-out infinite reverse' }}>
                  <div className="text-yellow-400 font-mono text-[11px] font-black tracking-widest mb-3 border-b border-yellow-500/30 pb-2 uppercase flex items-center gap-2">
                     <AlertCircle size={14} /> Referral Check
                  </div>
                  <div className="text-yellow-400/90 font-mono text-sm leading-relaxed">
                     Wait, did I ask John for the Microsoft referral? When did I message him on LinkedIn? Need to check DM history...
                  </div>
               </div>

               {/* VISUAL MOCKUP 5: Tracking Panic Note */}
               <div className="absolute bottom-[5%] lg:bottom-[8%] right-[4%] lg:right-[8%] w-[260px] p-5 bg-red-950/90 border border-red-500/50 backdrop-blur-md shadow-2xl -rotate-6 opacity-95 pointer-events-none will-change-transform" style={{ animation: 'floatSlow 7s ease-in-out infinite' }}>
                  <div className="text-red-400 font-mono text-[11px] font-black tracking-widest mb-3 border-b border-red-500/30 pb-2 uppercase flex items-center gap-2">
                     <AlertCircle size={14} /> Total Lost Track
                  </div>
                  <div className="text-red-400/90 font-mono text-sm leading-relaxed">
                     How many jobs have I applied to this month? 50? 100? Where did I even apply last week?! Completely lost count...
                  </div>
               </div>

               {/* VISUAL MOCKUP 6: Resume Mismatch Panic Note */}
               <div className="absolute top-[35%] lg:top-[38%] right-[2%] lg:right-[5%] w-[250px] p-5 bg-orange-950/90 border border-orange-500/50 backdrop-blur-md shadow-2xl rotate-3 opacity-95 pointer-events-none will-change-transform" style={{ animation: 'floatSpread 5s ease-in-out infinite reverse' }}>
                  <div className="text-orange-400 font-mono text-[11px] font-black tracking-widest mb-3 border-b border-orange-500/30 pb-2 uppercase flex items-center gap-2">
                     <AlertCircle size={14} /> Version Mismatch
                  </div>
                  <div className="text-orange-400/90 font-mono text-sm leading-relaxed">
                     Oh no... did I send the Frontend resume for the Backend role? Which version did I attach? I can't find the record...
                  </div>
               </div>

            </div>

            {/* ── RIGHT SIDE: WITH HIRETRACK (THE SYSTEM) ── */}
            <div
               className="absolute inset-0 overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.8)] border-l border-[#FF6044]/50 pointer-events-none"
               style={{ clipPath: `inset(0 0 0 ${position}%)`, backgroundColor: '#050709' }}
            >

               {/* Faded Success Background Image */}
               <div
                  className="absolute inset-0 opacity-[0.25] mix-blend-screen bg-cover bg-center bg-no-repeat pointer-events-none scale-105"
                  style={{ backgroundImage: "url('/relaxed_command_center_bg.png')" }}
               />
               {/* Vignette Overlays for contrast */}
               <div className="absolute inset-0 bg-gradient-to-b from-[#050709]/80 via-transparent to-[#050709]/80 pointer-events-none z-[-1]" />
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050709]/40 to-[#050709]/80 pointer-events-none z-[-1]" />

               {/* Animated Flow State Background Glows - Optimized for Performance */}
               {/* Aurora Orbs */}
               <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.2)_0%,transparent_70%)] mix-blend-screen pointer-events-none z-[-1] will-change-transform" style={{ animation: 'aurora-1 20s ease-in-out infinite' }} />
               <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(6,78,59,0.15)_0%,transparent_70%)] mix-blend-screen pointer-events-none z-[-1] will-change-transform" style={{ animation: 'aurora-2 25s ease-in-out infinite' }} />
               <div className="absolute top-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,96,68,0.08)_0%,transparent_70%)] mix-blend-screen pointer-events-none z-[-1] will-change-transform" style={{ animation: 'aurora-3 30s ease-in-out infinite' }} />

               {/* Animated Precision Grid */}
               <div className="absolute inset-[-100%] opacity-[0.03] pointer-events-none z-[-2]" style={{
                  backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')",
                  animation: 'grid-pan 15s linear infinite'
               }}
               />

               {/* System Typography (Fades out when dragged right) */}
               <div
                  className="absolute top-6 lg:top-8 right-6 lg:right-12 z-20 max-w-[350px] lg:max-w-[400px] text-right pointer-events-none transition-opacity duration-300"
                  style={{ opacity: position < 75 ? 1 : 0 }}
               >
                  <div className="inline-block px-4 py-2 bg-[#FF6044]/10 border border-[#FF6044]/30 rounded-full text-[#FF6044] font-black tracking-widest uppercase text-[10px] mb-4 backdrop-blur-md">
                     With HireTrack
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-black text-white mb-3 uppercase leading-[1] tracking-tighter">
                     Engineered for <br /><span className="text-[#FF6044]">Precision.</span>
                  </h3>
                  <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed ml-auto">
                     One unified command center. Watch how AI and automation organize your entire job hunt in real-time.
                  </p>
               </div>

               {/* Workflow Animations Styles */}
               <style>{`
            /* 3 Cards Flow Animations */
            @keyframes scrollDash {
              0%, 10% { transform: translateY(0); }
              40%, 60% { transform: translateY(-60px); }
              90%, 100% { transform: translateY(0); }
            }
            @keyframes typeReferrer {
              0%, 10% { content: ""; }
              15% { content: "J"; }
              20% { content: "Joh"; }
              25%, 100% { content: "John Doe"; }
            }
            @keyframes typeCompany {
              0%, 30% { content: ""; }
              35% { content: "M"; }
              40% { content: "Mic"; }
              45%, 100% { content: "Microsoft"; }
            }
            @keyframes clickBtn {
              0%, 55% { background-color: #2563eb; transform: scale(1); }
              60% { background-color: #1d4ed8; transform: scale(0.95); }
              65%, 100% { background-color: #22c55e; transform: scale(1); }
            }
            @keyframes btnText {
              0%, 60% { content: "Save Referral"; }
              65%, 100% { content: "Saved ✓"; }
            }
          `}</style>

               {/* BENEFIT CARD 1: Organized (Positioned ABOVE Dashboard) */}
               <div className="absolute top-[4%] lg:top-[6%] left-[15%] lg:left-[20%] w-[250px] p-5 bg-blue-950/80 border border-blue-500/50 backdrop-blur-md shadow-2xl rotate-2 opacity-95 pointer-events-none z-30" style={{ animation: 'floatSlow 7s ease-in-out infinite' }}>
                  <div className="text-blue-400 font-mono text-[11px] font-black tracking-widest mb-3 border-b border-blue-500/30 pb-2 uppercase flex items-center gap-2">
                     <CheckCircle2 size={14} /> Perfect Sync
                  </div>
                  <div className="text-blue-100/90 font-mono text-sm leading-relaxed">
                     Everything in one place. My job applications and referrals are finally perfectly organized.
                  </div>
               </div>

               {/* BENEFIT CARD 2: Stress Free (Positioned BELOW Dashboard) */}
               <div className="absolute bottom-[4%] lg:bottom-[6%] left-[12%] lg:left-[15%] w-[260px] p-5 bg-green-950/80 border border-green-500/50 backdrop-blur-md shadow-2xl -rotate-3 opacity-95 pointer-events-none z-30" style={{ animation: 'floatSpread 8s ease-in-out infinite reverse' }}>
                  <div className="text-green-400 font-mono text-[11px] font-black tracking-widest mb-3 border-b border-green-500/30 pb-2 uppercase flex items-center gap-2">
                     <CheckCircle2 size={14} /> Zero Stress
                  </div>
                  <div className="text-green-100/90 font-mono text-sm leading-relaxed">
                     Job hunting is actually stress-free now. I just open my dashboard and know exactly what to do next.
                  </div>
               </div>

               {/* BENEFIT CARD 3: Resumes (Positioned to the RIGHT of Dashboard) */}
               <div className="absolute top-[45%] lg:top-[50%] right-[4%] lg:right-[6%] w-[250px] p-5 bg-purple-950/80 border border-purple-500/50 backdrop-blur-md shadow-2xl rotate-2 opacity-95 pointer-events-none z-30" style={{ animation: 'floatSlow 6s ease-in-out infinite' }}>
                  <div className="text-purple-400 font-mono text-[11px] font-black tracking-widest mb-3 border-b border-purple-500/30 pb-2 uppercase flex items-center gap-2">
                     <CheckCircle2 size={14} /> Vault Secured
                  </div>
                  <div className="text-purple-100/90 font-mono text-sm leading-relaxed">
                     I never lose track of my resumes anymore. Every application is linked to the exact version I used.
                  </div>
               </div>

               {/* VISUAL MOCKUP: Dashboard Container (Positioned securely in CENTER-LEFT) */}
               <div className="absolute top-1/2 -translate-y-1/2 left-[8%] lg:left-[12%] w-[700px] lg:w-[820px] scale-[0.85] lg:scale-[0.9] origin-left flex flex-col justify-center z-10 pointer-events-none">

                  {/* Dashboard Window */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 lg:p-8 backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative z-10">
                     {/* Header */}
                     <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                              <LayoutDashboard size={28} />
                           </div>
                           <div>
                              <div className="text-2xl font-black uppercase tracking-widest text-white">Pipeline Sync</div>
                              <div className="text-sm font-bold text-gray-500 tracking-widest mt-1">Real-time job tracking</div>
                           </div>
                        </div>
                        <div className="px-5 py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-[11px] uppercase font-black tracking-widest rounded-full flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" /> Live Status
                        </div>
                     </div>

                     {/* 3 Animated Flow Cards */}
                     <div className="grid grid-cols-3 gap-6 h-[250px] overflow-hidden">

                        {/* Card 1: View Jobs (Scrolling) */}
                        <div className="bg-[#0a0f16] border border-white/10 rounded-2xl p-4 overflow-hidden relative shadow-inner">
                           <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-20"><LayoutDashboard size={12} className="text-blue-400" /> View Jobs</div>

                           <div className="absolute top-10 left-0 w-full h-8 bg-gradient-to-b from-[#0a0f16] to-transparent z-10 pointer-events-none" />
                           <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0f16] to-transparent z-10 pointer-events-none" />

                           <div className="flex flex-col gap-3" style={{ animation: 'scrollDash 8s ease-in-out infinite' }}>
                              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                 <div className="flex justify-between items-center mb-2"><div className="text-xs font-bold text-white">Google</div><div className="text-[8px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded font-bold">Applied</div></div>
                                 <div className="text-[10px] text-gray-400">Frontend Engineer</div>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                 <div className="flex justify-between items-center mb-2"><div className="text-xs font-bold text-white">Netflix</div><div className="text-[8px] bg-[#FF6044]/20 text-[#FF6044] px-2 py-1 rounded font-bold">Interview</div></div>
                                 <div className="text-[10px] text-gray-400">UI Developer</div>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                 <div className="flex justify-between items-center mb-2"><div className="text-xs font-bold text-white">Stripe</div><div className="text-[8px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">Offer</div></div>
                                 <div className="text-[10px] text-gray-400">Design Engineer</div>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                 <div className="flex justify-between items-center mb-2"><div className="text-xs font-bold text-white">Amazon</div><div className="text-[8px] bg-gray-500/20 text-gray-400 px-2 py-1 rounded font-bold">Rejected</div></div>
                                 <div className="text-[10px] text-gray-400">Fullstack</div>
                              </div>
                           </div>
                        </div>

                        {/* Card 2: Add Referral (Typing) */}
                        <div className="bg-[#0a0f16] border border-white/10 rounded-2xl p-4 shadow-inner flex flex-col justify-center">
                           <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle2 size={12} className="text-green-400" /> Add Referral</div>
                           <div className="space-y-4">
                              <div>
                                 <div className="text-[9px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Referrer Name</div>
                                 <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono h-9 flex items-center">
                                    <span className="after:content-[''] after:animate-[typeReferrer_6s_infinite]" />
                                    <span className="w-1.5 h-3 bg-blue-500 ml-1 animate-pulse" />
                                 </div>
                              </div>
                              <div>
                                 <div className="text-[9px] text-gray-500 mb-1 uppercase font-bold tracking-wider">Company</div>
                                 <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono h-9 flex items-center">
                                    <span className="after:content-[''] after:animate-[typeCompany_6s_infinite]" />
                                 </div>
                              </div>
                              <div className="mt-2 rounded-lg p-2.5 text-center text-xs text-white font-bold transition-colors flex justify-center items-center h-9 after:content-['Save_Referral'] after:animate-[btnText_6s_infinite]" style={{ animation: 'clickBtn 6s infinite' }}>
                                 {/* Text handled by pseudo element animation */}
                              </div>
                           </div>
                        </div>

                        {/* Card 3: Dashboard Scrolling */}
                        <div className="bg-[#0a0f16] border border-white/10 rounded-2xl p-4 overflow-hidden relative shadow-inner">
                           <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-20"><LayoutDashboard size={12} className="text-purple-400" /> Dashboard</div>

                           <div className="absolute top-10 left-0 w-full h-8 bg-gradient-to-b from-[#0a0f16] to-transparent z-10 pointer-events-none" />
                           <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0f16] to-transparent z-10 pointer-events-none" />

                           <div className="flex flex-col gap-4 mt-2" style={{ animation: 'scrollDash 10s ease-in-out infinite reverse' }}>
                              <div className="grid grid-cols-2 gap-2">
                                 <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                                    <div className="text-2xl text-blue-400 font-black">142</div>
                                    <div className="text-[8px] text-blue-400/80 uppercase font-black tracking-widest mt-1">Total Jobs</div>
                                 </div>
                                 <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                                    <div className="text-2xl text-green-400 font-black">12</div>
                                    <div className="text-[8px] text-green-400/80 uppercase font-black tracking-widest mt-1">Interviews</div>
                                 </div>
                              </div>
                              <div className="bg-white/5 rounded-xl border border-white/10 p-3">
                                 <div className="text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-widest">Application Activity</div>
                                 <div className="flex items-end justify-between h-16 gap-1.5">
                                    <div className="w-full bg-blue-500/40 rounded-t h-[30%]" />
                                    <div className="w-full bg-blue-500/60 rounded-t h-[60%]" />
                                    <div className="w-full bg-blue-500/80 rounded-t h-[40%]" />
                                    <div className="w-full bg-blue-500 rounded-t h-[90%]" />
                                    <div className="w-full bg-[#FF6044] rounded-t h-[100%] shadow-[0_0_10px_rgba(255,96,68,0.5)]" />
                                    <div className="w-full bg-blue-500/50 rounded-t h-[50%]" />
                                 </div>
                              </div>
                              <div className="bg-white/5 rounded-xl border border-white/10 p-3 h-20">
                                 <div className="h-2 w-1/2 bg-white/20 rounded mb-2" />
                                 <div className="h-2 w-full bg-white/10 rounded" />
                              </div>
                           </div>
                        </div>

                     </div>
                  </div>
               </div>
            </div>

            {/* ── DRAG HANDLE ── */}
            <div
               className="absolute top-0 bottom-0 w-[2px] bg-[#FF6044] pointer-events-none z-30"
               style={{ left: `${position}%` }}
            >
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FF6044] rounded-full flex items-center justify-center text-[#080909] shadow-[0_0_40px_rgba(255,96,68,0.8)] cursor-ew-resize border-4 border-[#080909]">
                  <GripVertical size={28} />
               </div>
            </div>

            {/* Helper Text */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-opacity duration-300" style={{ opacity: (position > 25 && position < 75) ? 1 : 0 }}>
               <div className="px-8 py-4 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FF6044] animate-ping" /> Drag to Transform
               </div>
            </div>

         </div>
      </div>
   );
}
