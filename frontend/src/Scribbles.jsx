import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, ArrowLeft, Check, Search, Sparkles } from "lucide-react";
import { apiUrl } from "./api";
import Header from "./Header";

export default function Scribbles() {
  const navigate = useNavigate();
  const [scribbles, setScribbles] = useState([]);
  const [selectedScribble, setSelectedScribble] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

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
          // Update list view
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

  // Filter notes by search query
  const filteredScribbles = scribbles.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Available Ink Colors matching space brutalism
  const COLORS = [
    { hex: "#FF6044", label: "Coral" },
    { hex: "#34D399", label: "Emerald" },
    { hex: "#06B6D4", label: "Cyan" },
    { hex: "#F97316", label: "Orange" },
    { hex: "#FFFFFF", label: "White" },
  ];

  // Font options
  const FONTS = [
    { value: "font-sans", label: "Sans (Inter)" },
    { value: "font-serif", label: "Serif (Classic)" },
    { value: "font-mono", label: "Mono (Code)" },
    { value: "font-display", label: "Display (Outfit)" },
  ];

  // Sizing Options
  const SIZES = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" },
  ];

  const getFontSizeClass = (sz) => {
    switch (sz) {
      case "sm": return "text-sm leading-relaxed";
      case "lg": return "text-lg leading-relaxed";
      case "xl": return "text-xl sm:text-2xl leading-relaxed";
      default: return "text-base leading-relaxed";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0B] text-white selection:bg-[#FF6044] selection:text-black overflow-x-hidden font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        {/* VIEW A: SCRIBLES LIST DASHBOARD */}
        {!selectedScribble ? (
          <div className="space-y-12 animate-fade-in">
            {/* Header intro */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF6044]/10 border border-[#FF6044]/20 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#FF6044]">
                <Sparkles size={10} className="animate-pulse" />
                Workspace Telemetry
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">
                Scribbles
              </h1>
              <p className="max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed font-light font-sans">
                SCRIBBLES // A zero-friction scratchpad to capture raw requirements, dump unformatted text, or draft application context on the fly. Exit or navigate back to trigger instant background cloud sync.
              </p>
            </div>

            {/* Controls panel: Add & Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pt-4 border-t border-white/5">
              <button
                onClick={handleAddScribble}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#FF6044] hover:bg-white text-black font-black uppercase tracking-wider text-xs rounded-2xl transition-all duration-300 brutalist-shadow hover:translate-y-[-2px] select-none"
              >
                <Plus size={16} /> New Scribble
              </button>

              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search scribbles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#121313]/90 border border-white/5 rounded-2xl text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#FF6044]/40 transition-colors"
                />
              </div>
            </div>

            {/* Note cards grid */}
            {filteredScribbles.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {filteredScribbles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedScribble(item)}
                    style={{ borderColor: `${item.color}15` }}
                    className="group relative flex flex-col justify-between p-6 bg-[#121313]/50 hover:bg-[#121313]/85 border rounded-3xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 h-[220px]"
                  >
                    {/* Glowing side accent line */}
                    <div
                      style={{ backgroundColor: item.color }}
                      className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full opacity-60 group-hover:opacity-100 transition-opacity"
                    />

                    <div className="space-y-3 pl-2 overflow-hidden">
                      <h3
                        style={{ color: item.color }}
                        className="text-lg font-display font-black uppercase truncate tracking-wide"
                      >
                        {item.title || "Untitled Scribble"}
                      </h3>
                      <p
                        className={`text-gray-400 font-sans text-xs line-clamp-5 leading-relaxed font-light`}
                      >
                        {item.content || <em className="text-gray-600 italic">No notes scribbled yet.</em>}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pl-2 pt-4 border-t border-white/5">
                      <span className="text-[10px] font-mono uppercase text-gray-500">
                        {new Date(item.updated_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <button
                        onClick={(e) => handleDeleteScribble(item.id, e)}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#121313]/30 border border-white/5 rounded-3xl space-y-3">
                <p className="text-gray-500 font-mono text-sm uppercase tracking-wider">
                  No scribbles found
                </p>
                <button
                  onClick={handleAddScribble}
                  className="text-[#FF6044] hover:text-white text-xs font-mono uppercase font-black"
                >
                  Create one now
                </button>
              </div>
            )}
          </div>
        ) : (
          /* VIEW B: SCRIBLES RICH EDITOR */
          <div className="space-y-8 animate-fade-in">
            {/* Header / Actions bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-6 border-b border-white/5">
              <button
                onClick={handleBackToDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono uppercase font-black tracking-wider transition-colors select-none"
              >
                <ArrowLeft size={14} /> Back to Scribbles
              </button>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                {/* Auto Save status */}
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-gray-500 select-none">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSaving ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`}
                  />
                  {isSaving ? "Saving telemetry..." : "Synced 🛰️"}
                </div>

                <button
                  onClick={() => handleDeleteScribble(selectedScribble.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-mono uppercase font-black transition-all select-none"
                >
                  <Trash2 size={13} /> Delete Note
                </button>
              </div>
            </div>

            {/* Custom Interactive Controls Tool-shelf */}
            <div className="grid md:grid-cols-3 gap-6 p-6 bg-[#121313]/60 border border-white/5 rounded-3xl select-none">
              {/* Color picker */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                  Ink Color Accent
                </span>
                <div className="flex items-center gap-2.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleEditorChange("color", c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-6 h-6 rounded-full border-2 transition-all relative ${
                        selectedScribble.color === c.hex
                          ? "border-white scale-110 shadow-lg"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      title={c.label}
                    >
                      {selectedScribble.color === c.hex && (
                        <Check size={10} className="absolute inset-0 m-auto text-black font-black" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                  Font Family
                </span>
                <div className="flex items-center gap-1.5 bg-[#0A0B0B] p-1 border border-white/5 rounded-xl">
                  {FONTS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => handleEditorChange("font_family", f.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedScribble.font_family === f.value
                          ? "bg-[#FF6044] text-black font-extrabold"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {f.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size slider */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                  Pencil Size
                </span>
                <div className="flex items-center gap-1.5 bg-[#0A0B0B] p-1 border border-white/5 rounded-xl">
                  {SIZES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleEditorChange("font_size", s.value)}
                      className={`flex-1 text-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedScribble.font_size === s.value
                          ? "bg-white text-black font-black"
                          : "text-gray-500 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Note Editor Surface */}
            <div
              style={{ borderColor: `${selectedScribble.color}20` }}
              className="flex flex-col gap-4 p-8 bg-[#121313]/30 border rounded-3xl min-h-[500px]"
            >
              {/* Note Title Input */}
              <input
                type="text"
                value={selectedScribble.title}
                onChange={(e) => handleEditorChange("title", e.target.value)}
                placeholder="Title / Heading..."
                style={{ color: selectedScribble.color }}
                className="w-full bg-transparent text-2xl sm:text-3xl font-display font-black uppercase tracking-wide placeholder:text-gray-700 focus:outline-none"
              />

              <div className="h-[1px] bg-white/5 my-2" />

              {/* Note Content Textarea */}
              <textarea
                value={selectedScribble.content}
                onChange={(e) => handleEditorChange("content", e.target.value)}
                placeholder="Start scribbling your thoughts, links, or requirements here..."
                className={`w-full bg-transparent flex-1 focus:outline-none placeholder:text-gray-600 resize-none min-h-[400px] ${
                  selectedScribble.font_family
                } ${getFontSizeClass(selectedScribble.font_size)}`}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
