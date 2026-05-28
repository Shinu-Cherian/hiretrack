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
  const [revealWidths, setRevealWidths] = useState({ title: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
  const [particles, setParticles] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [eraseAlpha, setEraseAlpha] = useState(1);

  useEffect(() => {
    let active = true;
    let start = Date.now();
    let prevChalkX = 450;
    let prevChalkY = 200;

    const animate = () => {
      if (!active) return;
      const now = Date.now();
      const elapsed = now - start;

      const totalCycle = 25000;
      const cycleTime = elapsed % totalCycle;

      let currentX = 450;
      let currentY = 200;
      let currentOpacity = 1;
      
      // Simulate up/down handwriting movement
      const handwritingBounce = Math.sin(now / 30) * 8 + Math.cos(now / 20) * 4;

      if (cycleTime < 1500) {
        // Move to Title
        const pct = cycleTime / 1500;
        currentX = 450 - pct * (450 - 40);
        currentY = 200 - pct * (200 - 45);
        currentOpacity = 1;
        setStep(0);
        setRevealWidths({ title: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
        setIsErasing(false);
        setEraseAlpha(1);
      } 
      else if (cycleTime < 3500) {
        // Draw Title
        const pct = (cycleTime - 1500) / 2000;
        const totalW = 300; 
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 45 + handwritingBounce;
        currentOpacity = 1;
        setStep(1);
        setRevealWidths({ title: currentW, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 4500) {
        // Move to B1
        const pct = (cycleTime - 3500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 45 + pct * (100 - 45);
        currentOpacity = 0; // lift pencil
        setStep(2);
        setRevealWidths({ title: 300, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 6500) {
        // Draw B1
        const pct = (cycleTime - 4500) / 2000;
        const totalW = 280;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 100 + handwritingBounce;
        currentOpacity = 1;
        setStep(3);
        setRevealWidths({ title: 300, b1: currentW, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 7500) {
        // Move to B2
        const pct = (cycleTime - 6500) / 1000;
        currentX = 320 + pct * (40 - 320);
        currentY = 100 + pct * (140 - 100);
        currentOpacity = 0;
        setStep(4);
        setRevealWidths({ title: 300, b1: 280, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 9500) {
        // Draw B2
        const pct = (cycleTime - 7500) / 2000;
        const totalW = 340;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 140 + handwritingBounce;
        currentOpacity = 1;
        setStep(5);
        setRevealWidths({ title: 300, b1: 280, b2: currentW, b3: 0, b4: 0, b5: 0, b6: 0 });
      } 
      else if (cycleTime < 10500) {
        // Move to B3
        const pct = (cycleTime - 9500) / 1000;
        currentX = 380 + pct * (40 - 380);
        currentY = 140 + pct * (180 - 140);
        currentOpacity = 0;
        setStep(6);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 0, b4: 0, b5: 0, b6: 0 });
      }
      else if (cycleTime < 12500) {
        // Draw B3
        const pct = (cycleTime - 10500) / 2000;
        const totalW = 300;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 180 + handwritingBounce;
        currentOpacity = 1;
        setStep(7);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: currentW, b4: 0, b5: 0, b6: 0 });
      }
      else if (cycleTime < 13500) {
        // Move to B4
        const pct = (cycleTime - 12500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 180 + pct * (220 - 180);
        currentOpacity = 0;
        setStep(8);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 0, b5: 0, b6: 0 });
      }
      else if (cycleTime < 15500) {
        // Draw B4
        const pct = (cycleTime - 13500) / 2000;
        const totalW = 300;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 220 + handwritingBounce;
        currentOpacity = 1;
        setStep(9);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: currentW, b5: 0, b6: 0 });
      }
      else if (cycleTime < 16500) {
        // Move to B5
        const pct = (cycleTime - 15500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 220 + pct * (260 - 220);
        currentOpacity = 0;
        setStep(10);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 0, b6: 0 });
      }
      else if (cycleTime < 18500) {
        // Draw B5
        const pct = (cycleTime - 16500) / 2000;
        const totalW = 300;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 260 + handwritingBounce;
        currentOpacity = 1;
        setStep(11);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: currentW, b6: 0 });
      }
      else if (cycleTime < 19500) {
        // Move to B6
        const pct = (cycleTime - 18500) / 1000;
        currentX = 340 + pct * (40 - 340);
        currentY = 260 + pct * (300 - 260);
        currentOpacity = 0;
        setStep(12);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 300, b6: 0 });
      }
      else if (cycleTime < 21500) {
        // Draw B6
        const pct = (cycleTime - 19500) / 2000;
        const totalW = 340;
        const currentW = pct * totalW;
        currentX = 40 + currentW;
        currentY = 300 + handwritingBounce;
        currentOpacity = 1;
        setStep(13);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 300, b6: currentW });
      }
      else if (cycleTime < 23500) {
        // Erase Sweep
        const pct = (cycleTime - 21500) / 2000;
        currentX = 380 + pct * (450 - 380);
        currentY = 300 + pct * (200 - 300);
        currentOpacity = 0;
        setStep(14);
        setIsErasing(true);
        setEraseAlpha(1 - pct);
        setRevealWidths({ title: 300, b1: 280, b2: 340, b3: 300, b4: 300, b5: 300, b6: 340 });
      } 
      else {
        // Pause before restart
        setStep(15);
        currentOpacity = 0;
        currentX = 450;
        currentY = 200;
        setEraseAlpha(0);
      }

      setChalk({ x: currentX, y: currentY, opacity: currentOpacity });

      const isDrawing = step % 2 !== 0 && step <= 13 && currentOpacity === 1;
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
  }, []);

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

  return (
    <div className="relative w-full max-w-[600px] h-[380px] flex justify-center items-center">
      <div className="relative w-full h-full overflow-hidden">
        
        {/* Decorative Particles */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                left: `${(p.x / 500) * 100}%`,
                top: `${(p.y / 340) * 100}%`,
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
              top: `${(chalk.y / 340) * 100}%`,
              opacity: chalk.opacity,
              transition: "opacity 0.2s ease-in-out"
            }}
            className="absolute z-30 text-primary pointer-events-none transform -translate-x-[2px] -translate-y-[24px]"
          >
            <Pencil size={24} className="transform -scale-x-100" />
          </div>
        )}

        {/* Eraser sweep overlay */}
        {isErasing && (
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent z-40 pointer-events-none"
          />
        )}

        {/* Chalkboard Drawing Core SVG */}
        <svg viewBox="0 0 500 340" className="w-full h-full relative z-10" preserveAspectRatio="none">
          <defs>
            <clipPath id="reveal-title"><rect x="35" y="10" width={revealWidths.title} height="50" /></clipPath>
            <clipPath id="reveal-b1"><rect x="35" y="70" width={revealWidths.b1} height="40" /></clipPath>
            <clipPath id="reveal-b2"><rect x="35" y="110" width={revealWidths.b2} height="40" /></clipPath>
            <clipPath id="reveal-b3"><rect x="35" y="150" width={revealWidths.b3} height="40" /></clipPath>
            <clipPath id="reveal-b4"><rect x="35" y="190" width={revealWidths.b4} height="40" /></clipPath>
            <clipPath id="reveal-b5"><rect x="35" y="230" width={revealWidths.b5} height="40" /></clipPath>
            <clipPath id="reveal-b6"><rect x="35" y="270" width={revealWidths.b6} height="40" /></clipPath>
          </defs>

          {/* Title */}
          <text x="40" y="45" fontFamily="Caveat, cursive" fontSize="38" fill="var(--color-primary)" clipPath="url(#reveal-title)" opacity={eraseAlpha}>
            Let's Scribble here!
          </text>
          
          <text x="40" y="100" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b1)" opacity={eraseAlpha}>
            → Applied to 10 jobs today
          </text>
          <text x="40" y="140" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b2)" opacity={eraseAlpha}>
            → Update resume for Frontend role
          </text>
          <text x="40" y="180" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b3)" opacity={eraseAlpha}>
            → Follow up with Stripe HR
          </text>
          <text x="40" y="220" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b4)" opacity={eraseAlpha}>
            → Prepare for system design
          </text>
          <text x="40" y="260" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b5)" opacity={eraseAlpha}>
            → Schedule mock interview
          </text>
          <text x="40" y="300" fontFamily="Caveat, cursive" fontSize="24" fill="var(--color-primary)" clipPath="url(#reveal-b6)" opacity={eraseAlpha}>
            → Review React hooks & concepts
          </text>
        </svg>
      </div>
    </div>
  );
};
