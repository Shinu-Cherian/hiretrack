import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { LayoutDashboard, Briefcase, Users, FileText, ChevronRight, Activity, Clock, CheckCircle2, XCircle, Settings, Send, MessageCircle, AlertCircle, PieChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Initial dummy data
const generateInitialTimeline = () => {
  const data = [];
  const now = new Date();
  for (let i = 14; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      apps: Math.floor(Math.random() * 5),
      referrals: Math.floor(Math.random() * 3),
    });
  }
  return data;
};

const insightsRotator = [
  "Your application funnel looks balanced. Keep applying consistently and tracking follow-ups.",
  "Referral activity is healthy. You have 3 pending responses from Google.",
  "Consider diversifying platforms. Most activity is currently on LinkedIn.",
  "High response rate on customized resumes. Continue using your marketing specific variation.",
  "Pipeline velocity increased by 15% this week. Keep up the momentum.",
  "Follow-up alert triggered for Vercel application. Action recommended."
];

const TARGETS = ['Stripe', 'OpenAI', 'Google', 'Vercel', 'Linear', 'Anthropic', 'Netflix', 'Meta', 'Amazon', 'Apple', 'Spotify', 'Shopify'];
const ACTIONS = [
  { action: 'Contact replied', icon: <MessageCircle size={14} className="text-blue-400" /> },
  { action: 'Application sent', icon: <Briefcase size={14} className="text-[#ff6044]" /> },
  { action: 'Follow-up due', icon: <AlertCircle size={14} className="text-yellow-500" /> },
  { action: 'Status changed', icon: <Activity size={14} className="text-green-500" /> },
  { action: 'Request sent', icon: <Send size={14} className="text-blue-400" /> },
  { action: 'Initial Screen', icon: <CheckCircle2 size={14} className="text-green-500" /> }
];

export default function Dashboard() {
  const [timelineData, setTimelineData] = useState(generateInitialTimeline());
  const [metrics, setMetrics] = useState({
    totalApps: 142,
    pendingApps: 24,
    rejectedApps: 45,
    selectedApps: 3,
    totalReferrals: 38,
    pendingReferrals: 12,
    repliedReferrals: 22,
    noResponseReferrals: 4,
  });
  const [insightIndex, setInsightIndex] = useState(0);

  const [topCompanies, setTopCompanies] = useState([
    { name: 'Google', value: 8 },
    { name: 'Linear', value: 5 },
    { name: 'Vercel', value: 4 },
    { name: 'Stripe', value: 3 },
  ]);

  const [pipelineActivity, setPipelineActivity] = useState([
    { id: 5, action: 'Contact replied', target: 'Alex (Stripe)', time: 'Just now', icon: <MessageCircle size={14} className="text-blue-400" /> },
    { id: 4, action: 'Application sent', target: 'OpenAI - Frontend', time: '2m ago', icon: <Briefcase size={14} className="text-[#ff6044]" /> },
    { id: 3, action: 'Follow-up due', target: 'Google Application', time: '12m ago', icon: <AlertCircle size={14} className="text-yellow-500" /> },
    { id: 2, action: 'Status changed', target: 'Vercel (In Review)', time: '1h ago', icon: <Activity size={14} className="text-green-500" /> },
    { id: 1, action: 'Request sent', target: 'Sarah (Linear)', time: '3h ago', icon: <Send size={14} className="text-blue-400" /> },
  ]);

  useEffect(() => {
    // Fast, continuous live updates with staggered, independent loops
    const timers = [];

    // 1. Independent Metric Updaters (Staggered tick rates so they don't animate together)
    timers.push(setInterval(() => setMetrics(p => Math.random() > 0.4 ? { ...p, totalApps: Math.max(120, Math.min(180, p.totalApps + (Math.random() > 0.5 ? 1 : -1))) } : p), 600));
    timers.push(setInterval(() => setMetrics(p => Math.random() > 0.5 ? { ...p, pendingApps: Math.max(10, Math.min(40, p.pendingApps + (Math.random() > 0.5 ? 1 : -1))) } : p), 850));
    timers.push(setInterval(() => setMetrics(p => Math.random() > 0.7 ? { ...p, rejectedApps: Math.max(30, Math.min(60, p.rejectedApps + (Math.random() > 0.5 ? 1 : -1))) } : p), 2100));
    timers.push(setInterval(() => setMetrics(p => Math.random() > 0.8 ? { ...p, selectedApps: Math.max(1, Math.min(8, p.selectedApps + (Math.random() > 0.5 ? 1 : -1))) } : p), 4500));
    
    timers.push(setInterval(() => setMetrics(p => Math.random() > 0.5 ? { ...p, totalReferrals: Math.max(25, Math.min(60, p.totalReferrals + (Math.random() > 0.5 ? 1 : -1))) } : p), 1100));
    timers.push(setInterval(() => setMetrics(p => Math.random() > 0.6 ? { ...p, pendingReferrals: Math.max(5, Math.min(25, p.pendingReferrals + (Math.random() > 0.5 ? 1 : -1))) } : p), 1400));
    timers.push(setInterval(() => setMetrics(p => Math.random() > 0.6 ? { ...p, repliedReferrals: Math.max(10, Math.min(35, p.repliedReferrals + (Math.random() > 0.5 ? 1 : -1))) } : p), 2800));

    // 2. Add new pipeline activity log
    timers.push(setInterval(() => {
      if (Math.random() > 0.4) {
        setPipelineActivity(prev => {
          const newAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
          const newTarget = TARGETS[Math.floor(Math.random() * TARGETS.length)] + (newAction.action === 'Contact replied' || newAction.action === 'Request sent' ? ' (Referral)' : ' Application');
          
          const newLog = {
            id: Date.now(), // unique key for animations
            action: newAction.action,
            target: newTarget,
            time: 'Just now',
            icon: newAction.icon
          };
          
          return [newLog, ...prev.map(p => ({
            ...p,
            time: p.time === 'Just now' ? '1m ago' : (p.time === '1m ago' ? '2m ago' : p.time)
          }))].slice(0, 5);
        });
      }
    }, 1200));

    // 3. Update top companies
    timers.push(setInterval(() => {
      setTopCompanies(prev => {
         let newArr = prev.map(item => ({ ...item }));
         
         // Chance to swap a company
         if (Math.random() > 0.6) {
             const currentNames = newArr.map(a => a.name);
             const availableTargets = TARGETS.filter(t => !currentNames.includes(t));
             if (availableTargets.length > 0) {
                 const newCompany = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                 // Replace one of the bottom two
                 const idxToReplace = newArr.length - 1 - (Math.random() > 0.5 ? 1 : 0);
                 newArr[idxToReplace] = { name: newCompany, value: Math.max(1, newArr[idxToReplace].value - 1) };
             }
         }

         // Fluctuate values
         newArr.forEach(item => {
             if (Math.random() > 0.4) item.value += Math.floor(Math.random() * 3); // +0, +1, or +2
             if (Math.random() > 0.8 && item.value > 3) item.value -= 1; // Slight decay
         });

         // Sort descending
         return newArr.sort((a,b) => b.value - a.value);
      });
    }, 1500));

    // 4. Update Timeline Chart
    timers.push(setInterval(() => {
      setTimelineData(prev => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        
        if (Math.random() > 0.8) {
          const d = new Date();
          newData.shift();
          newData.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.getHours() + ':' + d.getMinutes(),
            apps: Math.floor(Math.random() * 5),
            referrals: Math.floor(Math.random() * 3),
          });
        } else {
           newData[lastIndex] = {
             ...newData[lastIndex],
             apps: Math.max(0, newData[lastIndex].apps + (Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
             referrals: Math.max(0, newData[lastIndex].referrals + (Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
           };
        }
        return newData;
      });
    }, 800));

    // 5. Change Active Insights
    timers.push(setInterval(() => {
      setInsightIndex(prev => (prev + 1) % insightsRotator.length);
    }, 4500));

    return () => {
      timers.forEach(clearInterval);
    };
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] border border-[#ff6044]/20 rounded-xl flex flex-col p-8 font-sans shadow-[0_0_50px_rgba(255,96,68,0.05)]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff6044] animate-pulse shadow-[0_0_8px_rgba(255,96,68,0.8)]"></span>
            <span className="text-[#ff6044] font-display text-xs uppercase tracking-[0.2em] font-bold">Live</span>
            <span className="text-white/40 text-[10px] uppercase font-mono ml-2 border border-white/10 px-1.5 rounded">App_Version_2.0.4</span>
          </div>
          <h3 className="text-primary font-black text-2xl tracking-tighter uppercase">Command Center</h3>
        </div>
        <div className="flex gap-4">
           <div className="text-right">
             <div className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Sync Status</div>
             <div className="text-[#ff6044] text-xs font-bold uppercase flex items-center gap-1 justify-end">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                 <Settings size={12} />
               </motion.div> Connected
             </div>
           </div>
        </div>
      </div>

      {/* Unified Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {/* Jobs Metrics */}
        <div className="bg-[#131313] border border-white/5 p-4 rounded flex flex-col justify-between overflow-hidden relative">
           <div className="flex justify-between items-start mb-2 relative z-10">
             <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Total Apps</div>
             <Briefcase size={12} className="text-[#ff6044]" />
           </div>
           <motion.div key={metrics.totalApps} initial={{ scale: 1.2, color: "#ff6044" }} animate={{ scale: 1, color: "#ffffff" }} className="text-2xl font-black font-display relative z-10">{metrics.totalApps}</motion.div>
        </div>
        <div className="bg-[#131313] border border-white/5 p-4 rounded flex flex-col justify-between relative overflow-hidden">
           <div className="flex justify-between items-start mb-2 relative z-10">
             <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Pending</div>
             <Clock size={12} className="text-yellow-500" />
           </div>
           <motion.div key={metrics.pendingApps} initial={{ scale: 1.2, color: "#eab308" }} animate={{ scale: 1, color: "#ffffff" }} className="text-2xl font-black font-display relative z-10">{metrics.pendingApps}</motion.div>
        </div>
        <div className="bg-[#131313] border border-[#ff6044]/10 p-4 rounded flex flex-col justify-between relative overflow-hidden">
           <motion.div className="absolute inset-0 bg-[#ff6044]/5" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3 }} />
           <div className="flex justify-between items-start mb-2 relative z-10">
             <div className="text-[10px] text-[#ff6044]/70 uppercase tracking-widest font-bold">Rejected</div>
             <XCircle size={12} className="text-[#ff6044]" />
           </div>
           <motion.div key={metrics.rejectedApps} initial={{ scale: 1.2, color: "#ff6044" }} animate={{ scale: 1, color: "#ffffff" }} className="text-2xl font-black font-display relative z-10">{metrics.rejectedApps}</motion.div>
        </div>
        <div className="bg-[#131313] border border-green-500/20 p-4 rounded flex flex-col justify-between relative overflow-hidden">
           <motion.div className="absolute inset-0 bg-green-500/5" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} />
           <div className="flex justify-between items-start mb-2 relative z-10">
             <div className="text-[10px] text-green-500/70 uppercase tracking-widest font-bold">Selected</div>
             <CheckCircle2 size={12} className="text-green-500" />
           </div>
           <motion.div key={metrics.selectedApps} initial={{ scale: 1.2, color: "#22c55e" }} animate={{ scale: 1, color: "#ffffff" }} className="text-2xl font-black font-display relative z-10">{metrics.selectedApps}</motion.div>
        </div>

        {/* Separator style for the grid layout on large screens */}
        <div className="hidden lg:block w-[1px] h-full bg-white/5 self-center justify-self-center"></div>

        {/* Referral Metrics */}
        <div className="bg-[#131313] border border-white/5 p-4 rounded flex flex-col justify-between relative overflow-hidden">
           <div className="flex justify-between items-start mb-2 relative z-10">
             <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Referrals</div>
             <Users size={12} className="text-blue-400" />
           </div>
           <motion.div key={metrics.totalReferrals} initial={{ scale: 1.2, color: "#3b82f6" }} animate={{ scale: 1, color: "#ffffff" }} className="text-2xl font-black font-display relative z-10">{metrics.totalReferrals}</motion.div>
        </div>
        <div className="bg-[#131313] border border-white/5 p-4 rounded flex flex-col justify-between relative overflow-hidden">
           <div className="flex justify-between items-start mb-2 relative z-10">
             <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Req Pend</div>
             <Clock size={12} className="text-yellow-500" />
           </div>
           <motion.div key={metrics.pendingReferrals} initial={{ scale: 1.2, color: "#eab308" }} animate={{ scale: 1, color: "#ffffff" }} className="text-2xl font-black font-display relative z-10">{metrics.pendingReferrals}</motion.div>
        </div>
        <div className="bg-[#131313] border border-green-500/20 p-4 rounded flex flex-col justify-between relative overflow-hidden">
           <div className="flex justify-between items-start mb-2 relative z-10">
             <div className="text-[10px] text-green-500/70 uppercase tracking-widest font-bold">Replied</div>
             <MessageCircle size={12} className="text-green-500" />
           </div>
           <motion.div key={metrics.repliedReferrals} initial={{ scale: 1.2, color: "#22c55e" }} animate={{ scale: 1, color: "#ffffff" }} className="text-2xl font-black font-display relative z-10">{metrics.repliedReferrals}</motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#131313] border border-white/5 rounded-lg p-5">
             <div className="flex justify-between items-end mb-6">
               <div>
                  <h4 className="text-white font-bold mb-1">Activity Streaming</h4>
                  <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest">Real-time throughput (Apps & Referrals)</p>
               </div>
               <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest">
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-[#ff6044]"></span><span className="text-white/60">Apps</span></div>
                  <div className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500"></span><span className="text-white/60">Referrals</span></div>
               </div>
             </div>
             
             <div className="h-[120px] w-full">
               <ResponsiveContainer width="100%" height="100%" key={`rc-${timelineData.length}`}>
                 <AreaChart data={timelineData}>
                   <defs>
                     <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ff6044" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#ff6044" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorRefs" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                   <XAxis 
                     dataKey="date" 
                     stroke="#666" 
                     fontSize={10} 
                     tickLine={false} 
                     axisLine={false}
                     dy={10}
                     fontFamily="monospace"
                   />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,96,68,0.2)', borderRadius: '4px' }}
                     itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                     labelStyle={{ color: '#888', fontSize: '10px', marginBottom: '4px' }}
                     animationDuration={200}
                     isAnimationActive={false}
                   />
                   <Area 
                     type="step"
                     dataKey="apps" 
                     stroke="#ff6044" 
                     fillOpacity={1} 
                     fill="url(#colorApps)" 
                     strokeWidth={2}
                     isAnimationActive={true}
                     animationDuration={800}
                   />
                   <Area 
                     type="step" 
                     dataKey="referrals" 
                     stroke="#3b82f6" 
                     fillOpacity={1} 
                     fill="url(#colorRefs)" 
                     strokeWidth={2}
                     isAnimationActive={true}
                     animationDuration={800}
                   />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#131313] border border-white/5 rounded-lg p-5">
              <h4 className="text-white font-bold mb-1 flex items-center gap-2">Top Companies <Activity size={12} className="text-[#ff6044] animate-pulse"/></h4>
              <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest mb-4">Most applications</p>
              
              <div className="h-[100px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCompanies} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#fff" fontSize={11} tickLine={false} axisLine={false} width={60} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }} />
                    <Bar dataKey="value" fill="#ff6044" radius={[0, 4, 4, 0]} barSize={12} isAnimationActive={true} animationDuration={500}>
                      {topCompanies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ff6044' : '#ff604480'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#ff6044]/5 border border-[#ff6044]/20 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff6044] to-transparent" style={{ transform: 'translateX(-100%)', animation: 'scan 4.5s linear infinite' }}></div>
              <style>{`@keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
              
              <div className="flex items-center gap-2 text-[#ff6044] mb-3 relative z-10">
                 <Send size={16} />
                 <h4 className="font-bold text-sm uppercase tracking-widest">Active Insights</h4>
              </div>
              <div className="flex-1 flex items-center relative z-10">
                 <AnimatePresence mode="wait">
                    <motion.p 
                      key={insightIndex}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                      transition={{ duration: 0.4 }}
                      className="text-white/90 text-sm leading-relaxed"
                    >
                      {insightsRotator[insightIndex]}
                    </motion.p>
                 </AnimatePresence>
              </div>
              <div className="text-[10px] text-[#ff6044]/50 font-mono mt-4 flex items-center justify-between relative z-10">
                <span>SYSTEM.AI_AGENT.V2</span>
                <span className="flex gap-1">
                  {insightsRotator.map((_, i) => (
                    <span key={i} className={`w-1 h-1 rounded flex shrink-0 transition-all ${i === insightIndex ? 'bg-[#ff6044] w-3' : 'bg-[#ff6044]/20'}`}></span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Events & Pipeline */}
        <div className="space-y-6">
          <div className="bg-[#131313] border border-white/5 rounded-lg p-5 h-[390px] flex flex-col overflow-hidden">
            <div className="flex justify-between items-start mb-6">
               <div>
                 <h4 className="text-white font-bold mb-1">Live Pipeline Activity</h4>
                 <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest">Real-time event stream</p>
               </div>
               <div className="flex items-center gap-2 text-[#ff6044] text-[10px] font-mono border border-[#ff6044]/20 px-2 py-1 rounded bg-[#ff6044]/10">
                 <div className="w-1.5 h-1.5 bg-[#ff6044] rounded-full animate-pulse"></div> REC
               </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden">
               <div className="absolute inset-0 mask-image-bottom flex flex-col gap-3">
                 <AnimatePresence initial={false}>
                   {pipelineActivity.map((act) => (
                     <motion.div 
                       key={act.id} 
                       layout
                       initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(4px)' }} 
                       animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} 
                       exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                       transition={{ type: "spring", stiffness: 400, damping: 30 }}
                       className="flex items-start gap-4 p-3 rounded bg-white/[0.02] border border-white/[0.05] shadow-sm cursor-default"
                     >
                       <div className="mt-1 bg-[#0a0a0a] p-1.5 rounded border border-white/5">{act.icon}</div>
                       <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-bold flex justify-between items-center gap-2">
                            <span className="truncate">{act.action}</span>
                            <span className="text-[9px] font-mono text-[#ff6044] bg-[#ff6044]/10 px-1.5 py-0.5 rounded whitespace-nowrap">{act.time}</span>
                          </div>
                          <div className="text-white/50 text-xs mt-1 truncate">{act.target}</div>
                       </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
            </div>

            <button className="w-full mt-4 py-3 border border-white/10 hover:border-[#ff6044]/50 hover:bg-[#ff6044]/5 hover:text-[#ff6044] text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold transition-all rounded shadow-sm">
              Tail Log View
            </button>
          </div>
        </div>

      </div>
      
      <style>{`
        .mask-image-bottom {
          -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }
      `}</style>
    </div>
  );
}
