import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Edit, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Check, 
  Search, 
  Sparkles, 
  Pin, 
  Copy, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Grid, 
  FileText, 
  Layers, 
  Globe, 
  Clock, 
  Compass, 
  LayoutGrid, 
  Share2, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { apiUrl } from "./api";
import Header from "./Header";

// Custom Space Brutalist Dropdown Component matching HireTrack UI
function CustomDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-black">{label}:</span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 bg-[#0A0B0B] hover:bg-[#121313] border border-white/10 hover:border-[#FF6044]/40 rounded-xl text-xs font-mono text-white uppercase font-black tracking-wider transition-all select-none min-w-[140px] text-left"
      >
        <span className="truncate">{selectedOption.label}</span>
        <span className="text-gray-500 text-[9px] ml-1">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 min-w-[170px] bg-[#121313] border-2 border-white/10 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.85)] overflow-hidden p-1.5 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-extrabold transition-all select-none ${
                opt.value === value
                  ? "bg-[#FF6044] text-black"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Scribbles() {
  const navigate = useNavigate();
  const [scribbles, setScribbles] = useState([]);
  const [selectedScribble, setSelectedScribble] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  
  // Custom interactive states
  const [canvasPattern, setCanvasPattern] = useState("void");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hiretrack_pinned_scribbles") || "[]");
    } catch {
      return [];
    }
  });

  const autoSaveTimeout = useRef(null);

  // Sync auth status
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchScribbles();
    }
  }, [isLoggedIn]);

  // Fetch all scribbles
  const fetchScribbles = async () => {
    try {
      const res = await fetch(apiUrl("/api/notes/"), {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setScribbles(data);
      }
    } catch (err) {
      console.error("Failed to load scribbles:", err);
    }
  };

  // Add a new blank scribble
  const handleAddScribble = async () => {
    try {
      const res = await fetch(apiUrl("/api/notes/add/"), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const newScribble = await res.json();
        setScribbles((prev) => [newScribble, ...prev]);
        setSelectedScribble(newScribble);
      }
    } catch (err) {
      console.error("Failed to create scribble:", err);
    }
  };

  // Delete a scribble
  const handleDeleteScribble = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this scribble?")) return;

    try {
      const res = await fetch(apiUrl(`/api/notes/delete/${id}/`), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setScribbles((prev) => prev.filter((item) => item.id !== id));
        if (selectedScribble?.id === id) {
          setSelectedScribble(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete scribble:", err);
    }
  };

  // Trigger Debounced Auto-Save
  const triggerAutoSave = (updatedScribble) => {
    setIsSaving(true);
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);

    autoSaveTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(apiUrl(`/api/notes/update/${updatedScribble.id}/`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedScribble.title,
            content: updatedScribble.content,
            color: updatedScribble.color,
            font_family: updatedScribble.font_family,
            font_size: updatedScribble.font_size,
          }),
          credentials: "include",
        });

        if (res.ok) {
          const result = await res.json();
          setScribbles((prev) =>
            prev.map((item) => (item.id === updatedScribble.id ? result : item))
          );
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setIsSaving(false);
      }
    }, 800); // 800ms debounce window
  };

  // Handle local state updates in editor
  const handleEditorChange = (field, value) => {
    if (!selectedScribble) return;
    const updated = { ...selectedScribble, [field]: value };
    setSelectedScribble(updated);
    triggerAutoSave(updated);
  };

  // Force direct save immediately on back/close
  const forceSaveImmediate = async (scribbleToSave) => {
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    try {
      setIsSaving(true);
      await fetch(apiUrl(`/api/notes/update/${scribbleToSave.id}/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: scribbleToSave.title,
          content: scribbleToSave.content,
          color: scribbleToSave.color,
          font_family: scribbleToSave.font_family,
          font_size: scribbleToSave.font_size,
        }),
        credentials: "include",
      });
      fetchScribbles();
    } catch (err) {
      console.error("Force save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToDashboard = () => {
    if (selectedScribble) {
      forceSaveImmediate(selectedScribble);
    }
    setSelectedScribble(null);
  };

  // Note Pinning triggers
  const handleTogglePin = (id, e) => {
    if (e) e.stopPropagation();
    const updatedPins = pinnedIds.includes(id)
      ? pinnedIds.filter((x) => x !== id)
      : [...pinnedIds, id];
    setPinnedIds(updatedPins);
    localStorage.setItem("hiretrack_pinned_scribbles", JSON.stringify(updatedPins));
  };

  // Copy trigger
  const handleCopyNote = (id, text, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text || "");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter notes by search query
  const filteredScribbles = scribbles.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort notes: Pinned notes float to top, followed by updated_at descending
  const sortedScribbles = [...filteredScribbles].sort((a, b) => {
    const aPinned = pinnedIds.includes(a.id);
    const bPinned = pinnedIds.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  // URL Link Extraction logic
  const detectUrls = (text) => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex) || [];
    const uniqueMatches = Array.from(new Set(matches));
    return uniqueMatches.map((url) => {
      let platform = "Web Application";
      let color = "#FF6044"; // Default neon coral
      let brand = "globe";
      const lower = url.toLowerCase();
      
      if (lower.includes("indeed.com")) {
        platform = "Indeed Job";
        color = "#002BFC";
        brand = "briefcase";
      } else if (lower.includes("naukri.com")) {
        platform = "Naukri India";
        color = "#0A2463";
        brand = "briefcase";
      } else if (lower.includes("linkedin.com")) {
        platform = "LinkedIn Portal";
        color = "#0077B5";
        brand = "briefcase";
      } else if (lower.includes("github.com")) {
        platform = "GitHub Repo";
        color = "#F0F6FC";
        brand = "github";
      } else if (lower.includes("glassdoor.com")) {
        platform = "Glassdoor Intel";
        color = "#0CAA41";
        brand = "briefcase";
      }

      return { url, platform, color, brand };
    });
  };

  const detectedLinks = selectedScribble ? detectUrls(selectedScribble.content) : [];

  // Available Ink Colors matching space brutalism
  const COLORS = [
    { hex: "#FF6044", label: "Coral" },
    { hex: "#34D399", label: "Emerald" },
    { hex: "#06B6D4", label: "Cyan" },
    { hex: "#F97316", label: "Orange" },
    { hex: "#A855F7", label: "Violet" },
    { hex: "#FFFFFF", label: "Snow" },
  ];

  // Font options
  const FONTS = [
    { value: "font-sans", label: "Inter (Sans)" },
    { value: "font-serif", label: "Classic (Serif)" },
    { value: "font-mono", label: "Terminal (Mono)" },
  ];

  // Sizing Options
  const SIZES = [
    { value: "sm", label: "Fine" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Bold" },
    { value: "xl", label: "Giant" },
  ];

  const getFontSizeClass = (sz) => {
    switch (sz) {
      case "sm": return "text-sm leading-relaxed";
      case "lg": return "text-lg leading-relaxed";
      case "xl": return "text-xl sm:text-2xl leading-relaxed";
      default: return "text-base leading-relaxed";
    }
  };

  // Ruled, Dotted grid, Blueprint grid inline styling helpers
  const getCanvasPatternStyle = () => {
    let base = {};
    switch (canvasPattern) {
      case "ruled":
        base = {
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
          backgroundSize: "100% 28px",
          lineHeight: "28px"
        };
        break;
      case "dot":
        base = {
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.06) 1.2px, transparent 1.2px)",
          backgroundSize: "20px 20px"
        };
        break;
      case "mesh":
        base = {
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        };
        break;
      default:
        base = {};
    }
    
    // Add dynamic border and glow shadow matching selectedScribble's ink color
    if (selectedScribble) {
      base.borderColor = `${selectedScribble.color}45`;
      base.boxShadow = `0 10px 40px -12px ${selectedScribble.color}35`;
    }
    return base;
  };

  // Word metrics calculator
  const getScribbleMetrics = (text) => {
    if (!text) return { words: 0, chars: 0, readTime: 1 };
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const readTime = Math.max(1, Math.ceil(words / 220)); // avg reading speed
    return { words, chars, readTime };
  };

  const metrics = selectedScribble ? getScribbleMetrics(selectedScribble.content) : { words: 0, chars: 0, readTime: 1 };

  return (
    <div className="h-screen bg-[#121313] bg-dot-pattern text-white selection:bg-[#FF6044] selection:text-black overflow-hidden font-sans flex flex-col">
      <Header />

      <main className="max-w-[1780px] w-full mx-auto px-4 sm:px-6 pt-20 pb-4 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* TOP INTRO BANNER */}
        <div className="mb-6 space-y-3 flex-shrink-0 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#FF6044]/10 border border-[#FF6044]/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#FF6044] w-fit">
              <Sparkles size={10} className="animate-pulse" />
              Scribble Workspace v2.0
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight">
                Scribbles
              </h1>
              <p className="max-w-3xl text-gray-400 text-xs sm:text-sm leading-relaxed font-light font-sans">
                Scribble down quick job requirements, copy-paste application links, or draft notes on the fly. Exit or navigate back to trigger automatic secure cloud sync.
              </p>
            </div>

            {/* Quick Actions (Add Note always accessible in top) */}
            <div className="flex gap-2.5">
              <button
                onClick={handleAddScribble}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#FF6044] hover:bg-white text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all duration-300 brutalist-shadow hover:translate-y-[-2px] select-none"
              >
                <Plus size={14} strokeWidth={3} /> New Scribble
              </button>
            </div>
          </div>
        </div>

        {/* WORKSPACE DIVIDER */}
        <div className="h-[1px] bg-white/5 mb-6 flex-shrink-0" />

        {/* WORKSPACE AREA: SPLIT PANE GRID */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0 items-stretch overflow-hidden">
          
          {/* ========================================================================= */}
          {/* PANE A: LIST SIDEBAR (Col span 4 on desktop, hidden in focus mode or mobile editor) */}
          {/* ========================================================================= */}
          <div className={`
            ${selectedScribble ? "hidden md:flex" : "flex"} 
            ${isFocusMode && selectedScribble ? "md:hidden" : "md:col-span-4 lg:col-span-4"} 
            col-span-12 flex-col space-y-4 h-full min-h-0 overflow-hidden pr-1
          `}>
            
            {/* Search inputs panel */}
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search scribbles or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#1A1B1B] border border-white/10 rounded-xl text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#FF6044]/45 transition-colors font-mono"
              />
            </div>

            {/* Scribble cards list */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 pb-10">
              {sortedScribbles.length > 0 ? (
                sortedScribbles.map((item) => {
                  const isPinned = pinnedIds.includes(item.id);
                  const isSelected = selectedScribble?.id === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedScribble(item)}
                      style={{ 
                        borderColor: isSelected ? item.color : `${item.color}15`,
                        boxShadow: isSelected ? `0 4px 20px -5px ${item.color}35` : "none"
                      }}
                      className={`
                        group relative flex flex-col justify-between p-5 bg-[#1A1B1B] hover:bg-[#222323] border border-white/10 rounded-2xl cursor-pointer transition-all duration-300 select-none
                        ${isSelected ? "translate-x-1 bg-[#222323]" : "hover:translate-x-1"}
                      `}
                    >
                      {/* Left color ribbon indicator */}
                      <div
                        style={{ backgroundColor: item.color }}
                        className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                        }`}
                      />

                      <div className="space-y-2.5 pl-2 overflow-hidden">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            style={{ color: item.color }}
                            className="text-sm font-display font-black uppercase truncate tracking-wide flex-1"
                          >
                            {item.title || "Untitled Draft"}
                          </h3>

                          {/* Pinned pill or Pin trigger */}
                          <div className="flex items-center gap-1">
                            {isPinned && (
                              <span className="p-1 text-yellow-500 rounded bg-yellow-500/10 border border-yellow-500/20" title="Pinned Note">
                                <Pin size={10} className="fill-current" />
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-400 font-sans text-[11px] line-clamp-3 leading-relaxed font-light">
                          {item.content || <em className="text-gray-600 italic">No scribble text added yet.</em>}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex justify-between items-center pl-2 pt-3 mt-3 border-t border-white/5 text-[9px] font-mono text-gray-500">
                        <span>
                          {new Date(item.updated_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Pin Toggle */}
                          <button
                            onClick={(e) => handleTogglePin(item.id, e)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isPinned 
                                ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5 hover:bg-yellow-500/10" 
                                : "border-white/5 text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                            title={isPinned ? "Unpin Note" : "Pin Note"}
                          >
                            <Pin size={10} className={isPinned ? "fill-current" : ""} />
                          </button>

                          {/* Instant Copy */}
                          <button
                            onClick={(e) => handleCopyNote(item.id, item.content, e)}
                            className="p-1.5 rounded-lg border border-white/5 text-gray-400 hover:text-[#34D399] hover:bg-[#34D399]/5 transition-all"
                            title="Copy Content"
                          >
                            {copiedId === item.id ? <Check size={10} /> : <Copy size={10} />}
                          </button>

                          {/* Delete Note */}
                          <button
                            onClick={(e) => handleDeleteScribble(item.id, e)}
                            className="p-1.5 rounded-lg border border-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
                            title="Delete note"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-[#121313]/20 border border-white/5 rounded-2xl space-y-3">
                  <p className="text-gray-600 font-mono text-[10px] uppercase tracking-wider">
                    Zero scribbles logged
                  </p>
                  <button
                    onClick={handleAddScribble}
                    className="text-[#FF6044] hover:text-white text-[10px] font-mono uppercase font-black tracking-widest border border-[#FF6044]/20 hover:border-white px-3 py-1.5 rounded-lg bg-[#FF6044]/5 transition-all"
                  >
                    + Add Scribble
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PANE B: NOTE EDITOR & CANVAS (Col span 8 on desktop, full span on mobile or focus mode) */}
          {/* ========================================================================= */}
          <div className={`
            ${!selectedScribble ? "hidden md:flex" : "flex"} 
            ${isFocusMode ? "col-span-12" : "md:col-span-8 lg:col-span-8"} 
            col-span-12 flex-col h-full min-h-0 bg-[#121313]/25 border border-white/5 rounded-3xl overflow-hidden
          `}>
            
            {selectedScribble ? (
              <div className="flex flex-col h-full min-h-0 overflow-hidden">
                
                {/* Editor Top Bar Controls */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#121313]/40 flex-shrink-0">
                  <div className="flex items-center gap-2.5">
                    {/* Mobile Back / Tablet toggle */}
                    <button
                      onClick={handleBackToDashboard}
                      className="inline-flex items-center justify-center p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-gray-300 hover:text-white transition-colors select-none"
                      title="Save and Return"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    
                    {/* Sync indicator */}
                    <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg select-none">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                      <span className="text-gray-400">{isSaving ? "Syncing..." : "Saved"}</span>
                    </div>
                  </div>

                  {/* Center Metrics (Always Visible & Prominently Styled) */}
                  <div className="hidden md:flex items-center gap-5 bg-[#0A0B0B] border border-white/5 px-4 py-2 rounded-2xl select-none font-mono text-[10px] tracking-widest text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>WORDS:</span>
                      <strong className="text-[#FF6044] font-black text-sm">{metrics.words}</strong>
                    </div>
                    <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                    <div className="flex items-center gap-2">
                      <span>CHARS:</span>
                      <strong className="text-white font-black text-sm">{metrics.chars}</strong>
                    </div>
                    <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                    <div className="flex items-center gap-2">
                      <span>READ:</span>
                      <strong className="text-emerald-400 font-black text-sm">{metrics.readTime}M</strong>
                    </div>
                  </div>

                  {/* Right side utility bar */}
                  <div className="flex items-center gap-2">
                    {/* Pin Status */}
                    <button
                      onClick={(e) => handleTogglePin(selectedScribble.id, e)}
                      className={`p-2 rounded-xl border transition-all ${
                        pinnedIds.includes(selectedScribble.id)
                          ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                          : "border-white/5 bg-white/5 text-gray-400 hover:text-white"
                      }`}
                      title={pinnedIds.includes(selectedScribble.id) ? "Unpin Scribble" : "Pin Scribble"}
                    >
                      <Pin size={13} className={pinnedIds.includes(selectedScribble.id) ? "fill-current" : ""} />
                    </button>

                    {/* Clipboard copy */}
                    <button
                      onClick={(e) => handleCopyNote(selectedScribble.id, selectedScribble.content, e)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-[10px] font-mono uppercase font-black transition-all select-none ${
                        copiedId === selectedScribble.id 
                          ? "border-[#34D399]/20 bg-[#34D399]/10 text-[#34D399]"
                          : "border-white/5 bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {copiedId === selectedScribble.id ? <Check size={11} /> : <Copy size={11} />}
                      {copiedId === selectedScribble.id ? "Copied" : "Copy Note"}
                    </button>

                    {/* Focus toggle (Placed between Copy and Delete) */}
                    <button
                      onClick={() => setIsFocusMode(!isFocusMode)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-[10px] font-mono uppercase font-black transition-all select-none ${
                        isFocusMode
                          ? "border-[#FF6044]/20 bg-[#FF6044]/10 text-[#FF6044]"
                          : "border-white/5 bg-white/5 text-gray-400 hover:text-white hover:border-white/20"
                      }`}
                      title={isFocusMode ? "Exit Focus Mode" : "Focus Canvas"}
                    >
                      {isFocusMode ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                      {isFocusMode ? "Exit Focus" : "Focus"}
                    </button>

                    {/* Delete Note */}
                    <button
                      onClick={() => handleDeleteScribble(selectedScribble.id)}
                      className="p-2 bg-red-500/5 hover:bg-red-500 border border-red-500/10 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition-all"
                      title="Delete draft"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Main Work Area split (Editor sheet on left, Link Hub drawer on right) */}
                <div className="flex-1 flex min-h-0 overflow-hidden relative">
                  
                  {/* CANVAS CONTENT AREA */}
                  <div className="flex-1 flex flex-col min-h-0 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    
                    {/* COMPACT TOP BAR TOOLBAR (Ink Tone Color Cubes & Custom Dropdowns) */}
                    <div className="flex flex-wrap items-center gap-5 p-3 bg-[#121313]/40 border border-white/5 rounded-2xl select-none mb-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                      
                      {/* Ink Accent Color Cubes (No Text) */}
                      <div className="flex items-center gap-2.5">
                        <span>Ink:</span>
                        <div className="flex items-center gap-1.5 bg-[#0A0B0B] px-2 py-1.5 border border-white/5 rounded-xl">
                          {COLORS.map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => handleEditorChange("color", c.hex)}
                              style={{ backgroundColor: c.hex }}
                              className={`w-4 h-4 rounded-md border transition-all relative ${
                                selectedScribble.color === c.hex
                                  ? "ring-2 ring-white scale-110 shadow-md border-transparent"
                                  : "opacity-60 hover:opacity-100 border-white/15"
                              }`}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Custom Font Family Dropdown */}
                      <CustomDropdown
                        label="Font"
                        value={selectedScribble.font_family}
                        options={FONTS}
                        onChange={(val) => handleEditorChange("font_family", val)}
                      />

                      {/* Custom Paper Texture Dropdown */}
                      <CustomDropdown
                        label="Paper"
                        value={canvasPattern}
                        options={[
                          { value: "void", label: "Void" },
                          { value: "ruled", label: "Rules" },
                          { value: "dot", label: "Dots" },
                          { value: "mesh", label: "Grid" },
                        ]}
                        onChange={(val) => setCanvasPattern(val)}
                      />

                      {/* Custom Pencil Sizing (Font Size) Dropdown */}
                      <CustomDropdown
                        label="Pencil"
                        value={selectedScribble.font_size}
                        options={SIZES}
                        onChange={(val) => handleEditorChange("font_size", val)}
                      />

                      {/* Mobile stats show up in the toolbar */}
                      <div className="flex md:hidden ml-auto items-center gap-2 text-gray-400">
                        <span>W: <strong>{metrics.words}</strong></span>
                        <span>C: <strong>{metrics.chars}</strong></span>
                      </div>

                    </div>

                    {/* WRITING PAD CANVAS */}
                    <div 
                      style={getCanvasPatternStyle()}
                      className="flex-1 flex flex-col gap-4 p-6 bg-[#1A1B1B]/95 border rounded-2xl min-h-[350px] transition-all duration-300"
                    >
                      {/* Notebook Title Block */}
                      <input
                        type="text"
                        value={selectedScribble.title}
                        onChange={(e) => handleEditorChange("title", e.target.value)}
                        placeholder="NOTE TITLE / KEYWORD..."
                        style={{ color: selectedScribble.color }}
                        className="w-full bg-transparent text-xl sm:text-2xl font-display font-black uppercase tracking-wide placeholder:text-gray-700 focus:outline-none"
                      />

                      <div className="h-[1px] bg-white/5 my-1" />

                      {/* Text Input Pad (Dynamic Color matching Ink Tone) */}
                      <textarea
                        value={selectedScribble.content}
                        onChange={(e) => handleEditorChange("content", e.target.value)}
                        placeholder="Dump application links, draft job summaries, paste bullet lists, or scribble quick thoughts..."
                        style={{ color: selectedScribble.color }}
                        className={`w-full bg-transparent flex-1 focus:outline-none placeholder:text-gray-700 resize-none min-h-[300px] ${
                          selectedScribble.font_family
                        } ${getFontSizeClass(selectedScribble.font_size)}`}
                      />
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* LINK EXTRACTION PANEL / SIDE DRAWER (Only visible when links detected) */}
                  {/* ========================================================================= */}
                  {detectedLinks.length > 0 && (
                    <div className="w-[320px] border-l border-white/5 bg-[#0e0f0f]/95 p-6 space-y-6 hidden lg:flex flex-col h-full overflow-y-auto animate-fade-in flex-shrink-0">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FF6044]/10 border border-[#FF6044]/20 text-[9px] font-mono uppercase tracking-widest text-[#FF6044]">
                          <Globe size={10} className="animate-spin-slow" />
                          Live Intel
                        </div>
                        <h4 className="text-xs font-mono uppercase font-black tracking-widest text-white">
                          Extracted Links Hub
                        </h4>
                        <p className="text-[10px] text-gray-500 leading-normal">
                          We detected URLs in your scribble. Launch the app directly or dump it into your job pipeline.
                        </p>
                      </div>

                      <div className="h-px bg-white/5" />

                      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {detectedLinks.map((item, idx) => (
                          <div 
                            key={idx}
                            style={{ borderColor: `${item.color}30` }}
                            className="p-4 bg-[#121313]/90 border rounded-xl space-y-3 hover:bg-[#121313] transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span 
                                style={{ backgroundColor: `${item.color}15`, color: item.color }}
                                className="p-1.5 rounded-lg border border-current/10 text-xs font-black uppercase tracking-wider block"
                              >
                                {item.platform.split(" ")[0]}
                              </span>
                              <span className="text-[9px] font-mono text-gray-600 truncate flex-1">
                                {new URL(item.url).hostname}
                              </span>
                            </div>

                            <p className="text-[10px] text-gray-400 truncate font-mono bg-black/30 p-2 rounded border border-white/5 select-all">
                              {item.url}
                            </p>

                            <div className="grid grid-cols-2 gap-2 pt-1.5">
                              {/* Open link */}
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-lg text-[9px] font-mono uppercase font-black text-white transition-all text-center"
                              >
                                Launch <ExternalLink size={8} />
                              </a>

                              {/* Create pipeline job */}
                              <button
                                onClick={() => {
                                  const encodedUrl = encodeURIComponent(item.url);
                                  const encodedTitle = encodeURIComponent(selectedScribble.title || "New Scribbled Role");
                                  const encodedPlatform = encodeURIComponent(item.platform.split(" ")[0]);
                                  const encodedNotes = encodeURIComponent(`Imported from Scribbles draft: ${selectedScribble.title}\nSource Link: ${item.url}`);
                                  navigate(`/add-job?notes=${encodedNotes}&platform=${encodedPlatform}&title=${encodedTitle}`);
                                }}
                                className="inline-flex items-center justify-center gap-1 py-1.5 bg-[#FF6044]/10 hover:bg-[#FF6044] border border-[#FF6044]/25 hover:border-transparent rounded-lg text-[9px] font-mono uppercase font-black text-[#FF6044] hover:text-black transition-all"
                              >
                                + Pipeline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              /* ACTIVE DASHBOARD EMPTY STATE (Fits theme with bold contrast) */
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-7 select-none bg-[#1A1B1B] border border-white/10 rounded-3xl h-full shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                
                {/* Visual telemetry aesthetic graph block */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <div className="absolute inset-0 border border-dashed border-[#FF6044]/20 rounded-full animate-spin-slow" />
                  <div className="absolute inset-4 border border-white/10 rounded-full" />
                  <div className="absolute inset-8 border border-dashed border-[#FF6044]/30 rounded-full animate-reverse-spin" />
                  <div className="w-16 h-16 rounded-full bg-[#FF6044]/10 border border-[#FF6044]/25 flex items-center justify-center text-[#FF6044] shadow-[0_0_30px_rgba(255,96,68,0.25)]">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                </div>

                <div className="space-y-3 max-w-md">
                  <h3 className="text-sm font-mono uppercase font-black tracking-widest text-[#FF6044] flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-[#FF6044] rounded-full animate-ping" />
                    Scribbling Deck Active
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans font-light">
                    Select an existing draft from the log sidebar to begin editing, or initialize a fresh scratchpad to capture quick job specifications, paste Indeed / Naukri application links, or draft notes on the fly!
                  </p>
                </div>

                <button
                  onClick={handleAddScribble}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF6044] hover:bg-white text-black font-black uppercase text-xs font-mono tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-[#FF6044]/15 hover:shadow-white/10 hover:translate-y-[-2px] select-none cursor-pointer"
                >
                  <Plus size={14} strokeWidth={3} /> Initialize New Scribble
                </button>

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
