import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, AlertCircle, Clock, Search, MessageCircle, FileQuestion, Users, CheckCircle2, ShieldCheck, Map, Target, Route, Briefcase } from 'lucide-react';

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
