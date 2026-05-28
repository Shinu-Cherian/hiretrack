import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, AlertCircle, Clock, Search, MessageCircle, FileQuestion, Users, CheckCircle2, ShieldCheck, Map, Target, Route, Briefcase, Pencil } from 'lucide-react';

// --- BEFORE CARDS (THE PROBLEM) ---

export const ResumeConfusion = () => {
  const fileNames = ["resume_final.pdf", "resume_v2.pdf", "resume_FINAL_final.pdf", "marketing_res.pdf"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % fileNames.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-40 w-full bg-red-500/5 rounded border border-red-500/20 overflow-hidden flex flex-col items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20, filter: "blur(4px)" }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-2 text-red-400"
        >
          <div className="relative">
             <FileQuestion size={40} className="text-red-500" />
             <motion.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute -top-2 -right-2 text-red-500"
             >
                <AlertCircle size={16} fill="black" />
             </motion.div>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-1 bg-red-500/10 rounded border border-red-500/20">
            {fileNames[currentIndex]}
          </span>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 text-[10px] text-red-500/50 uppercase tracking-widest font-display">Which one did I send?</div>
    </div>
  );
};

export const MissedFollowups = () => {
  return (
    <div className="relative h-40 w-full bg-red-500/5 rounded border border-red-500/20 overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="w-full flex items-center justify-between mb-4 relative z-10 px-2">
         <div className="flex flex-col items-center">
            <span className="text-xs text-white/40 mb-1">Day 1</span>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
         </div>
         <div className="flex flex-col items-center">
            <span className="text-xs text-white/40 mb-1">Day 3</span>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
         </div>
         <div className="flex flex-col items-center">
            <span className="text-xs text-red-500 mb-1 font-bold">Day 7</span>
            <div className="w-2 h-2 rounded-full border border-red-500 bg-red-500/20"></div>
         </div>
      </div>

      <div className="absolute top-[60px] left-0 w-full h-[1px] bg-white/10 z-0 px-6">
        <motion.div 
          className="h-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "50%", "90%", "90%"] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.7, 0.8, 1] }}
        className="mt-6 flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1 rounded"
      >
         <Clock size={14} />
         <span className="text-xs font-bold uppercase tracking-wider">Opportunity Lost</span>
      </motion.div>
    </div>
  );
};

export const LostReferrals = () => {
  return (
    <div className="relative h-40 w-full bg-red-500/5 rounded border border-red-500/20 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
         <Search size={100} className="text-red-500" />
      </div>
      
      <div className="relative w-full h-full">
         <motion.div 
           initial={{ opacity: 0, x: -20, y: -10 }}
           animate={{ opacity: [0, 1, 0], x: [ -20, 0, 20 ], y: [ -10, 0, 10 ] }}
           transition={{ duration: 3, repeat: Infinity, delay: 0 }}
           className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 p-2 border border-white/5 rounded text-xs text-white/50"
         >
           <MessageCircle size={12} /> LinkedIn DM
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, x: 20, y: 10 }}
           animate={{ opacity: [0, 1, 0], x: [ 20, 0, -20 ], y: [ 10, 0, -10 ] }}
           transition={{ duration: 3, repeat: Infinity, delay: 1 }}
           className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/50 p-2 border border-white/5 rounded text-xs text-white/50"
         >
           <div className="w-3 h-3 rounded bg-red-500/30 flex items-center justify-center text-[8px]">@</div> Email Thread
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, scale: 0 }}
           animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
           transition={{ duration: 3, repeat: Infinity, delay: 2 }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
         >
            <Users size={24} className="text-red-500 mb-1" />
            <span className="text-[10px] text-red-500 font-mono tracking-widest uppercase bg-black px-2 border border-red-500/30">Connection Lost</span>
         </motion.div>
      </div>
    </div>
  );
};

export const ScatteredData = () => {
  return (
    <div className="relative h-40 w-full bg-red-500/5 rounded border border-red-500/20 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-16 border border-white/10 bg-white/5 rounded shadow-lg backdrop-blur-sm flex flex-col p-1"
          style={{
            left: `${10 + (i * 15)}%`,
            top: `${20 + (i % 2 === 0 ? 10 : -10)}%`,
          }}
          initial={{ y: 0, rotate: i * 5 - 10, opacity: 0.5 }}
          animate={{ 
            y: [0, -10, 10, 0], 
            rotate: [i * 5 - 10, i * 15 - 20, i * 5 - 10],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-1 bg-red-500/30 rounded-full mb-1"></div>
          <div className="w-3/4 h-1 bg-white/20 rounded-full mb-1"></div>
          <div className="w-1/2 h-1 bg-white/20 rounded-full"></div>
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 flex items-end justify-center pb-2">
         <span className="text-[10px] text-red-500 uppercase font-mono tracking-widest bg-black px-2 border border-red-500/20">Data Fragmentation</span>
      </div>
    </div>
  );
};

// --- AFTER CARDS (THE SOLUTION) ---

export const CareerVault = () => {
  return (
    <div className="relative h-40 w-full bg-primary/5 rounded border border-primary/20 overflow-hidden flex flex-col items-center justify-end pb-4 group">
      {/* Vault Background Graphic */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <ShieldCheck size={120} strokeWidth={1} className="text-primary" />
      </div>

      {/* Files dropping into vault */}
      <div className="relative z-10 w-full flex justify-center mb-2">
        <motion.div 
          className="absolute -top-16 bg-surface border border-primary/40 rounded p-2 flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(196,252,112,0.1)]"
          initial={{ y: -20, opacity: 0, scale: 0.8 }}
          animate={{ y: [ -20, 20, 40 ], opacity: [ 0, 1, 0 ], scale: [ 0.8, 1, 0.7 ] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeIn" }}
        >
          <div className="flex items-center gap-1">
            <FileText size={10} className="text-white" />
            <span className="text-[8px] uppercase font-mono text-white/80">Cover_Letter_Stripe.pdf</span>
          </div>
          <div className="w-full h-[1px] bg-primary/30"></div>
        </motion.div>

        <motion.div 
          className="absolute -top-20 right-[30%] bg-surface border border-white/20 rounded p-2 flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          initial={{ y: -10, opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ y: [ -10, 30, 50 ], opacity: [ 0, 0.8, 0 ], scale: [ 0.8, 1, 0.7 ], rotate: [ 10, 0, -5 ] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeIn", delay: 1 }}
        >
          <div className="flex items-center gap-1">
            <FileText size={10} className="text-primary" />
            <span className="text-[8px] uppercase font-mono text-white/60">Resume_v7_Frontend.pdf</span>
          </div>
        </motion.div>
      </div>

      {/* Vault Base */}
      <div className="relative z-20 w-3/4 h-12 bg-surface/80 border border-primary/50 backdrop-blur-md rounded-t-lg border-b-0 flex items-center justify-center overflow-hidden">
         <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
         <ShieldCheck size={18} className="text-primary mr-2" />
         <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-primary drop-shadow-[0_0_5px_rgba(196,252,112,0.5)]">Secured Context</span>
         
         {/* Scanning line across vault */}
         <motion.div 
           className="absolute left-0 w-full h-[2px] bg-primary/50 blur-[1px]"
           animate={{ top: ['0%', '100%', '0%'] }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         />
      </div>
    </div>
  );
};


export const IntelligentReminders = () => {
  return (
    <div className="relative h-40 w-full bg-primary/5 rounded border border-primary/20 overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="w-full flex items-center justify-between mb-4 relative z-10 px-4">
         <div className="flex flex-col items-center relative gap-1">
            <span className="text-[10px] text-white/40 uppercase">App Sent</span>
            <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center p-0.5"><CheckCircle2 className="text-surface" size={10} /></div>
         </div>
         <div className="flex flex-col items-center relative gap-1">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: [0, 1, 1], y: [10, 0, 0] }}
               transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 1] }} 
               className="absolute -top-6 bg-primary text-surface text-[8px] font-bold px-1 py-0.5 rounded uppercase"
            >
              Alert
            </motion.div>
            <span className="text-[10px] text-white uppercase font-bold">3 Days</span>
            <motion.div 
               className="w-3 h-3 rounded-full border border-primary"
               animate={{ backgroundColor: ["transparent", "var(--color-primary)", "var(--color-primary)"] }}
               transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 1] }}
            ></motion.div>
         </div>
         <div className="flex flex-col items-center relative gap-1">
            <span className="text-[10px] text-white/60 uppercase">7 Days</span>
            <div className="w-3 h-3 rounded-full border border-white/20 bg-surface"></div>
         </div>
      </div>

      <div className="absolute top-[60px] left-0 w-full h-[2px] bg-white/5 z-0 px-8">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "50%", "50%"] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.4, 1] }}
        />
      </div>

       <div className="mt-4 text-[10px] text-primary/70 uppercase tracking-widest font-mono">Automated Engine</div>
    </div>
  );
};


export const PipelineStream = () => {
  const [items, setItems] = useState([
    { id: 3, type: 'app', text: 'Linear - Applied', icon: <Briefcase size={12} className="text-primary"/> },
    { id: 2, type: 'ref', text: 'Stripe - Referral', icon: <Users size={12} className="text-blue-400"/> },
    { id: 1, type: 'app', text: 'Vercel - Sent', icon: <Briefcase size={12} className="text-primary"/> },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newId = prev.length ? prev[0].id + 1 : 1;
        const isApp = Math.random() > 0.4;
        const companies = ['Google', 'Meta', 'Netflix', 'Spotify', 'Apple', 'Anthropic', 'OpenAI'];
        const comp = companies[Math.floor(Math.random() * companies.length)];
        const newItem = isApp 
          ? { id: newId, type: 'app', text: `${comp} - Applied`, icon: <Briefcase size={12} className="text-primary"/> }
          : { id: newId, type: 'ref', text: `${comp} - Referral`, icon: <Users size={12} className="text-blue-400"/> };
        
        return [newItem, ...prev].slice(0, 3);
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-40 w-full bg-primary/5 rounded border border-primary/20 overflow-hidden flex flex-col p-3">
       <div className="flex justify-between items-center mb-3">
         <span className="text-[10px] uppercase tracking-widest text-primary/70 font-mono">Live Sync</span>
         <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_5px_var(--color-primary)]"></div>
       </div>
       <div className="flex-1 flex flex-col gap-2 relative">
          <AnimatePresence initial={false}>
            {items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1 - (i * 0.3), y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center gap-2 bg-surface/80 border border-white/5 p-2 rounded shadow-sm"
              >
                 <div className="bg-white/5 p-1 rounded">{item.icon}</div>
                 <span className="text-[10px] text-white/90 font-bold truncate">{item.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
       </div>
       <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export const CareerRoadmap = () => {
  return (
    <div className="relative h-40 w-full bg-primary/5 rounded border border-primary/20 overflow-hidden flex flex-col items-center justify-end pb-4 px-6">
       
       <div className="w-full relative h-[80px]">
          <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none" className="absolute inset-0">
             <path d="M 10,70 L 60,70 L 80,40 L 140,40 L 160,10 L 190,10" stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />
             <motion.path 
               d="M 10,70 L 60,70 L 80,40 L 140,40 L 160,10 L 190,10" stroke="var(--color-primary)" strokeWidth="3" fill="none"
               strokeDasharray="200"
               initial={{ strokeDashoffset: 200 }}
               animate={{ strokeDashoffset: [200, 0, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             />
          </svg>

          <motion.div 
            className="absolute bg-surface border border-primary text-primary px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold"
            style={{ left: '50px', top: '75px' }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.2, 1] }}
          >Mid-Level</motion.div>

          <motion.div 
            className="absolute bg-surface border border-primary text-primary px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold"
            style={{ left: '120px', top: '45px' }}
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
          >Senior Lead</motion.div>

          <motion.div 
            className="absolute bg-primary text-surface px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold shadow-[0_0_10px_var(--color-primary)]"
            style={{ left: '170px', top: '15px' }}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 1], scale: [0, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.8, 1] }}
          >Director</motion.div>
       </div>
    </div>
  );
};


export const ChalkboardShowcase = () => {
  const [chalk, setChalk] = useState({ x: 450, y: 200, opacity: 0 });
  const [step, setStep] = useState(0);
  const [revealWidths, setRevealWidths] = useState({ title: 0, naukri: 0, link: 0 });
  const [tictactoeProgress, setTictactoeProgress] = useState(0);
  const [particles, setParticles] = useState([]);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    let active = true;
    let start = Date.now();
    let prevChalkX = 450;
    let prevChalkY = 200;

    const animate = () => {
      if (!active) return;
      const now = Date.now();
      const elapsed = now - start;

      const totalCycle = 23000;
      const cycleTime = elapsed % totalCycle;

      let currentX = 450;
      let currentY = 200;
      let currentOpacity = 1;
      
      // Simulate up/down handwriting movement
      const handwritingBounce = Math.sin(now / 30) * 8 + Math.cos(now / 20) * 4;

      if (cycleTime < 1500) {
        const pct = cycleTime / 1500;
        currentX = 450 - pct * (450 - 40);
        currentY = 200 - pct * (200 - 55);
        currentOpacity = 1;
        setStep(0);
        setRevealWidths({ title: 0, naukri: 0, link: 0 });
        setTictactoeProgress(0);
        setIsErasing(false);
      } 
      else if (cycleTime < 4500) {
        const pct = (cycleTime - 1500) / 3000;
        const totalWidth = 260; // Approx width of "Let's Scribble here!"
        const currentW = pct * totalWidth;
        
        currentX = 40 + currentW;
        currentY = 50 + handwritingBounce;
        currentOpacity = 1;
        
        setStep(1);
        setRevealWidths({ title: currentW, naukri: 0, link: 0 });
      } 
      else if (cycleTime < 6000) {
        const pct = (cycleTime - 4500) / 1500;
        currentX = 300 + pct * (385 - 300);
        currentY = 50 + pct * (105 - 50);
        currentOpacity = 1;
        setStep(2);
        setRevealWidths({ title: 260, naukri: 0, link: 0 });
      } 
      else if (cycleTime < 12000) {
        const subElapsed = cycleTime - 6000;
        const pct = subElapsed / 6000;
        setStep(3);
        setTictactoeProgress(pct);
        setRevealWidths({ title: 260, naukri: 0, link: 0 });

        if (pct < 0.12) {
          const t = pct / 0.12;
          currentX = 385;
          currentY = 105 + t * (165 - 105);
        } else if (pct < 0.24) {
          const t = (pct - 0.12) / 0.12;
          currentX = 415;
          currentY = 105 + t * (165 - 105);
        } else if (pct < 0.36) {
          const t = (pct - 0.24) / 0.12;
          currentX = 360 + t * (440 - 360);
          currentY = 125;
        } else if (pct < 0.48) {
          const t = (pct - 0.36) / 0.12;
          currentX = 360 + t * (440 - 360);
          currentY = 145;
        } else if (pct < 0.56) {
          const t = (pct - 0.48) / 0.08;
          currentX = 365 + t * (375 - 365);
          currentY = 110 + t * (120 - 110);
        } else if (pct < 0.64) {
          const t = (pct - 0.56) / 0.08;
          currentX = 375 - t * (375 - 365);
          currentY = 110 + t * (120 - 110);
        } else if (pct < 0.78) {
          const t = (pct - 0.64) / 0.14;
          const angle = t * Math.PI * 2;
          currentX = 400 + Math.cos(angle) * 6;
          currentY = 135 + Math.sin(angle) * 6;
        } else if (pct < 0.86) {
          const t = (pct - 0.78) / 0.08;
          currentX = 422 + t * (432 - 422);
          currentY = 150 + t * (160 - 150);
        } else if (pct < 0.94) {
          const t = (pct - 0.86) / 0.08;
          currentX = 432 - t * (432 - 422);
          currentY = 150 + t * (160 - 150);
        } else {
          currentX = 422;
          currentY = 160;
          currentOpacity = 0;
        }
      } 
      else if (cycleTime < 13500) {
        const pct = (cycleTime - 12000) / 1500;
        currentX = 422 + pct * (40 - 422);
        currentY = 160 + pct * (195 - 160);
        currentOpacity = 1;
        setStep(4);
        setRevealWidths({ title: 260, naukri: 0, link: 0 });
      } 
      else if (cycleTime < 16500) {
        const pct = (cycleTime - 13500) / 3000;
        const totalWidth = 320;
        const currentW = pct * totalWidth;
        
        currentX = 40 + currentW;
        currentY = 195 + handwritingBounce;
        currentOpacity = 1;
        
        setStep(5);
        setRevealWidths({ title: 260, naukri: currentW, link: 0 });
      } 
      else if (cycleTime < 18000) {
        const pct = (cycleTime - 16500) / 1500;
        currentX = 360 + pct * (40 - 360);
        currentY = 195 + pct * (240 - 195);
        currentOpacity = 1;
        setStep(6);
        setRevealWidths({ title: 260, naukri: 320, link: 0 });
      } 
      else if (cycleTime < 21000) {
        const pct = (cycleTime - 18000) / 3000;
        const totalWidth = 300;
        const currentW = pct * totalWidth;
        
        currentX = 40 + currentW;
        currentY = 240 + handwritingBounce;
        currentOpacity = 1;
        
        setStep(7);
        setRevealWidths({ title: 260, naukri: 320, link: currentW });
      } 
      else {
        const pct = (cycleTime - 21000) / 2000;
        currentX = 340 + pct * (450 - 340);
        currentY = 240 + pct * (200 - 240);
        currentOpacity = 0.5;
        setStep(8);
        setIsErasing(true);
        setRevealWidths({ title: 260, naukri: 320, link: 300 });
      }

      setChalk({ x: currentX, y: currentY, opacity: currentOpacity });

      const isDrawing = (step === 1 || step === 3 || step === 5 || step === 7) && currentOpacity === 1;
      if (isDrawing && Math.random() < 0.6) {
        const dx = currentX - prevChalkX;
        const dy = currentY - prevChalkY;
        
        const p = {
          id: Math.random(),
          x: currentX,
          y: currentY,
          vx: (Math.random() * 2 - 1) * 0.2 - (dx * 0.1),
          vy: -Math.random() * 0.4 - 0.1,
          size: Math.random() * 2.5 + 0.8,
          alpha: 0.9
        };
        setParticles((prev) => [...prev.slice(-30), p]);
      }

      prevChalkX = currentX;
      prevChalkY = currentY;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => {
      active = false;
    };
  }, []); // Empty dependency array prevents infinite reset

  useEffect(() => {
    let active = true;
    const updateParticles = () => {
      if (!active) return;
      setParticles((prev) =>
        prev
          .map((p) => ({
             ...p,
             x: p.x + p.vx,
             y: p.y + p.vy,
             alpha: p.alpha - 0.02,
             size: p.size * 0.97
          }))
          .filter((p) => p.alpha > 0)
      );
      requestAnimationFrame(updateParticles);
    };
    requestAnimationFrame(updateParticles);
    return () => {
      active = false;
    };
  }, []);

  // Tic-Tac-Toe Line Lengths
  const v1Offset = tictactoeProgress < 0.12 ? 60 - (tictactoeProgress / 0.12) * 60 : 0;
  const v2Offset = tictactoeProgress < 0.12 ? 60 : tictactoeProgress < 0.24 ? 60 - ((tictactoeProgress - 0.12) / 0.12) * 60 : 0;
  const h1Offset = tictactoeProgress < 0.24 ? 80 : tictactoeProgress < 0.36 ? 80 - ((tictactoeProgress - 0.24) / 0.12) * 80 : 0;
  const h2Offset = tictactoeProgress < 0.36 ? 80 : tictactoeProgress < 0.48 ? 80 - ((tictactoeProgress - 0.36) / 0.12) * 80 : 0;
  const x1aOffset = tictactoeProgress < 0.48 ? 14 : tictactoeProgress < 0.56 ? 14 - ((tictactoeProgress - 0.48) / 0.08) * 14 : 0;
  const x1bOffset = tictactoeProgress < 0.56 ? 14 : tictactoeProgress < 0.64 ? 14 - ((tictactoeProgress - 0.56) / 0.08) * 14 : 0;
  const o1Offset = tictactoeProgress < 0.64 ? 38 : tictactoeProgress < 0.78 ? 38 - ((tictactoeProgress - 0.64) / 0.14) * 38 : 0;
  const x2aOffset = tictactoeProgress < 0.78 ? 14 : tictactoeProgress < 0.86 ? 14 - ((tictactoeProgress - 0.78) / 0.08) * 14 : 0;
  const x2bOffset = tictactoeProgress < 0.86 ? 14 : tictactoeProgress < 0.94 ? 14 - ((tictactoeProgress - 0.86) / 0.08) * 14 : 0;

  return (
    <div className="relative w-full max-w-[600px] h-[340px] flex justify-center items-center">
      <div className="relative w-full h-full overflow-hidden">
        
        {/* Decorative Particles (Optional, you can keep them for magic effect) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                left: `${(p.x / 500) * 100}%`,
                top: `${(p.y / 300) * 100}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.alpha,
                backgroundColor: "var(--color-primary)",
              }}
              className="absolute rounded-full pointer-events-none"
            />
          ))}
        </div>

        {/* Custom Chalk Position & Pencil Cursor */}
        {chalk.opacity > 0 && (
          <div
            style={{
              left: `${(chalk.x / 500) * 100}%`,
              top: `${(chalk.y / 300) * 100}%`,
              opacity: chalk.opacity,
              transition: "opacity 0.2s ease-in-out"
            }}
            className="absolute z-30 text-primary pointer-events-none transform -translate-x-[2px] -translate-y-[24px]"
          >
            <Pencil size={24} className="transform -scale-x-100" />
          </div>
        )}

        {/* Chalkboard Drawing Core SVG */}
        <svg viewBox="0 0 500 300" className="w-full h-full relative z-10" preserveAspectRatio="none">
          <defs>
            <clipPath id="reveal-title">
              <rect x="35" y="0" width={revealWidths.title + 10} height="100" />
            </clipPath>
            <clipPath id="reveal-naukri">
              <rect x="35" y="150" width={revealWidths.naukri + 10} height="70" />
            </clipPath>
            <clipPath id="reveal-link">
              <rect x="35" y="210" width={revealWidths.link + 10} height="70" />
            </clipPath>
          </defs>

          {/* Clean Google Font Text without glow */}
          <text 
            x="40" y="55" 
            fontFamily="Caveat, cursive" 
            fontSize="42" 
            fill="var(--color-primary)" 
            clipPath="url(#reveal-title)"
            opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
          >
            Let's Scribble here!
          </text>

          {/* Tic-Tac-Toe Game (Top Right Area, animated line-by-line) */}
          <g opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}>
            {tictactoeProgress > 0 && (
              <line x1="385" y1="105" x2="385" y2="165" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v1Offset} />
            )}
            {tictactoeProgress > 0.12 && (
              <line x1="415" y1="105" x2="415" y2="165" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset={v2Offset} />
            )}
            {tictactoeProgress > 0.24 && (
              <line x1="360" y1="125" x2="440" y2="125" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h1Offset} />
            )}
            {tictactoeProgress > 0.36 && (
              <line x1="360" y1="145" x2="440" y2="145" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={h2Offset} />
            )}
            {tictactoeProgress > 0.48 && (
              <line x1="365" y1="110" x2="375" y2="120" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1aOffset} />
            )}
            {tictactoeProgress > 0.56 && (
              <line x1="375" y1="110" x2="365" y2="120" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x1bOffset} />
            )}
            {tictactoeProgress > 0.64 && (
              <path d="M 394,135 A 6,6 0 1,1 406,135 A 6,6 0 1,1 394,135" stroke="var(--color-primary)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="38" strokeDashoffset={o1Offset} />
            )}
            {tictactoeProgress > 0.78 && (
              <line x1="422" y1="150" x2="432" y2="160" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2aOffset} />
            )}
            {tictactoeProgress > 0.86 && (
              <line x1="432" y1="150" x2="422" y2="160" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeDasharray="14" strokeDashoffset={x2bOffset} />
            )}
          </g>

          <text 
            x="40" y="195" 
            fontFamily="Caveat, cursive" 
            fontSize="30" 
            fill="var(--color-primary)" 
            clipPath="url(#reveal-naukri)"
            opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
          >
            I applied 10 jobs in Naukri today
          </text>

          <text 
            x="40" y="240" 
            fontFamily="Caveat, cursive" 
            fontSize="30" 
            fill="var(--color-primary)" 
            clipPath="url(#reveal-link)"
            opacity={isErasing ? 1 - (tictactoeProgress * 2) : 1}
          >
            Okay, I will paste the link here
          </text>
        </svg>
      </div>
    </div>
  );
};
