import React from "react";
import { X, FileText, Download, Check } from "lucide-react";

const templates = [
  { id: "1", name: "Silicon Valley", desc: "Modern & Tech-focused", color: "bg-blue-500" },
  { id: "2", name: "Executive", desc: "Traditional & Professional", color: "bg-gray-800" },
  { id: "3", name: "Creative Sidebar", desc: "Stylish & Unique", color: "bg-indigo-600" },
  { id: "4", name: "The Minimalist", desc: "Clean & Simple", color: "bg-gray-400" },
  { id: "5", name: "Tech Focus", desc: "Monospace & Terminal", color: "bg-green-600" },
  { id: "6", name: "Emerald Growth", desc: "Fresh & Vibrant", color: "bg-emerald-500" },
  { id: "7", name: "Midnight Corporate", desc: "Deep Blue Authority", color: "bg-blue-900" },
  { id: "8", name: "The Traditionalist", desc: "Classic & Reliable", color: "bg-amber-800" },
  { id: "9", name: "Startup Pulse", desc: "Energetic & Bold", color: "bg-pink-500" },
  { id: "10", name: "Signature Series", desc: "Personal & Signed", color: "bg-rose-400" },
];

export default function TemplateSelectorModal({ isOpen, onClose, onSelect, selectedId, coverLetterText, onTextChange, userProfile }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-7xl h-[85vh] overflow-hidden flex flex-col animate-fade-in-up border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100 bg-white">
          <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Template Studio</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Refine your letter directly in the template preview.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar: Template Gallery */}
          <div className="w-[380px] border-r border-gray-100 overflow-y-auto p-6 bg-gray-50/30 text-gray-900">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">Professional Styles</h4>
            <div className="space-y-4">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => onSelect(tpl.id)}
                  className={`group relative p-4 cursor-pointer transition-all duration-300 rounded-2xl border-2 flex items-center gap-4 ${
                    selectedId === tpl.id 
                      ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10" 
                      : "border-transparent hover:border-gray-200 bg-white shadow-sm"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl ${tpl.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                     <FileText size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{tpl.name}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1 font-medium">{tpl.desc}</p>
                  </div>
                  {selectedId === tpl.id && (
                     <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Check size={14} strokeWidth={3} />
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Area: Live Preview with Editability */}
          <div className="flex-1 bg-gray-100/50 p-10 overflow-y-auto flex justify-center">
             <div className="w-full max-w-[650px] shadow-2xl shadow-gray-400/20 origin-top">
                <LiveDocumentPreview 
                  templateId={selectedId} 
                  text={coverLetterText} 
                  onTextChange={onTextChange} 
                  userProfile={userProfile} 
                />
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-6 bg-white border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                 <Download size={24} />
              </div>
              <div>
                 <p className="font-bold text-gray-900 text-lg">Ready to Export</p>
                 <p className="text-gray-500 text-sm font-medium">Standard A4 Format &bull; High Resolution</p>
              </div>
           </div>
           
           <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="px-8 py-3.5 border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all hover:shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => onSelect(selectedId, true)}
                disabled={!selectedId}
                className="px-10 py-3.5 bg-gray-950 text-white rounded-2xl font-bold shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:bg-black hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                Download Cover Letter
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function LiveDocumentPreview({ templateId, text, onTextChange, userProfile }) {
  const profile = userProfile || { name: "Your Name", email: "email@example.com" };
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const styles = {
    "1": { // Silicon Valley
       container: "bg-white p-12 min-h-[842px] font-sans text-gray-800",
       header: "border-b-4 border-blue-600 pb-6 mb-8",
       name: "text-4xl font-black text-blue-900 mb-1 uppercase tracking-tighter",
       contact: "text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 font-medium",
       content: "text-[13px] leading-relaxed w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent text-gray-700"
    },
    "2": { // Executive
       container: "bg-white p-16 min-h-[842px] font-serif text-gray-900 text-center",
       header: "border-b border-gray-900 pb-8 mb-10",
       name: "text-4xl uppercase tracking-[0.2em] font-light mb-2",
       contact: "text-[10px] italic text-gray-600 flex justify-center flex-wrap gap-4",
       content: "text-sm leading-loose text-justify w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent"
    },
    "3": { // Creative Sidebar
       container: "bg-white min-h-[842px] flex font-sans",
       sidebar: "w-1/3 bg-slate-900 text-white p-8",
       main: "w-2/3 p-12",
       name: "text-2xl font-black mb-6 leading-tight",
       content: "text-[12px] leading-relaxed w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent text-gray-600"
    },
    "4": { // Minimalist
       container: "bg-white p-14 min-h-[842px] font-sans text-gray-600",
       header: "mb-12 border-t border-gray-100 pt-8",
       name: "text-2xl tracking-[0.3em] uppercase text-gray-950 font-light mb-4",
       contact: "text-[9px] tracking-widest text-gray-400 flex gap-4 uppercase",
       content: "text-[13px] leading-relaxed w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent"
    },
    "5": { // Tech Focus
       container: "bg-white p-12 min-h-[842px] font-mono text-gray-900",
       header: "bg-gray-50 p-8 mb-10 border-l-8 border-gray-900",
       name: "text-2xl font-bold mb-2",
       contact: "text-[11px] space-y-1 opacity-70",
       content: "text-[12px] leading-normal w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent"
    },
    "6": { // Emerald Growth
       container: "bg-white p-12 min-h-[842px] font-sans text-gray-700",
       header: "mb-10",
       name: "text-5xl font-black text-emerald-600 mb-2 tracking-tighter",
       contact: "text-sm font-bold text-emerald-800/60 flex gap-4",
       content: "text-[14px] leading-relaxed w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent"
    },
    "7": { // Midnight Corporate
       container: "bg-white min-h-[842px] font-sans text-gray-700",
       header: "bg-slate-900 text-white p-12 mb-10 border-b-8 border-blue-500",
       name: "text-4xl font-bold mb-2 uppercase tracking-tight",
       main: "p-12 pt-0",
       contact: "text-sm opacity-80 flex flex-wrap gap-4",
       content: "text-[13px] leading-relaxed w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent text-gray-700"
    },
    "8": { // Traditionalist
       container: "bg-white p-12 min-h-[842px] font-serif border-[12px] border-gray-50",
       header: "text-center mb-10 border-b border-gray-200 pb-8",
       name: "text-3xl font-bold text-gray-900",
       contact: "text-sm text-gray-500 mt-2 flex justify-center gap-4",
       content: "text-[14px] leading-relaxed w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent"
    },
    "9": { // Startup Pulse
       container: "bg-white p-12 min-h-[842px] font-sans text-gray-900",
       header: "mb-12",
       name: "text-6xl font-black text-pink-500 mb-2 tracking-tighter",
       role: "hidden",
       contact: "text-xs font-bold text-gray-400 flex gap-4",
       content: "text-[14px] leading-relaxed w-full min-h-[500px] border-none focus:ring-0 p-0 resize-none bg-transparent"
    },
    "10": { // Signature Series
       container: "bg-white p-14 min-h-[842px] font-sans text-gray-800 flex flex-col",
       header: "mb-10",
       name: "text-3xl font-bold mb-1",
       contact: "text-sm text-gray-400 flex gap-4",
       content: "flex-1 text-[13px] leading-relaxed w-full border-none focus:ring-0 p-0 resize-none bg-transparent mb-10",
       footer: "border-t border-gray-900 pt-4 w-48 italic text-gray-400 text-sm"
    }
  };

  const style = styles[templateId] || styles["1"];

  if (templateId === "3") {
    return (
      <div className={style.container}>
        <div className={style.sidebar}>
           <h2 className={style.name}>{profile.name}</h2>
           <div className="space-y-6 text-[10px] opacity-70 font-bold tracking-wider">
              <div><p className="text-blue-400 mb-1 uppercase">Email</p>{profile.email}</div>
              {profile.phone && <div><p className="text-blue-400 mb-1 uppercase">Phone</p>{profile.phone}</div>}
              {profile.linkedin && <div><p className="text-blue-400 mb-1 uppercase">LinkedIn</p>{profile.linkedin}</div>}
              {profile.github && <div><p className="text-blue-400 mb-1 uppercase">GitHub</p>{profile.github}</div>}
           </div>
        </div>
        <div className={style.main}>
           <div className="text-[10px] font-black text-gray-300 mb-8 uppercase tracking-[0.3em]">{currentDate}</div>
           <textarea 
             className={style.content} 
             value={text} 
             onChange={(e) => onTextChange(e.target.value)} 
           />
        </div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h2 className={style.name}>{profile.name}</h2>
        {templateId === "9" && <div className={style.role}>Top-Tier Candidate</div>}
        <div className={style.contact}>
           {profile.address && <div className="w-full text-gray-400 mb-1">{profile.address}</div>}
           <span>{profile.email}</span>
           {profile.phone && <span>{templateId === "4" ? "/" : "·"} {profile.phone}</span>}
           {profile.linkedin && <span>{templateId === "4" ? "/" : "·"} {profile.linkedin}</span>}
           {profile.github && <span>{templateId === "4" ? "/" : "·"} {profile.github}</span>}
        </div>
      </div>
      <div className="text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-widest">{currentDate}</div>
      <textarea 
        className={style.content} 
        value={text} 
        onChange={(e) => onTextChange(e.target.value)} 
      />
      {templateId === "10" && <div className={style.footer}>Digital Signature: {profile.name}</div>}
    </div>
  );
}
