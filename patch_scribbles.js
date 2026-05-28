const fs = require('fs');

const FILE_PATH = "C:/Users/User/Desktop/hiretrack/frontend/src/Scribbles.jsx";
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Add Paperclip icon import
if (!content.includes('Paperclip')) {
    content = content.replace('Pencil', 'Pencil,\n  Paperclip,\n  X');
}

// 2. Add fileInputRef and handleFileUpload to the component
const refsInjection = `
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("attached_file", file);
    formData.append("title", selectedScribble.title);
    formData.append("content", selectedScribble.content);
    formData.append("color", selectedScribble.color);
    formData.append("font_family", selectedScribble.font_family);
    formData.append("font_size", selectedScribble.font_size);

    setIsSaving(true);
    try {
      const res = await fetch(apiUrl(\`/api/notes/update/\${selectedScribble.id}/\`), {
        method: "POST",
        credentials: "include",
        body: formData, // fetch will automatically set multipart/form-data boundary
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state with the returned file URL
        const updated = { ...selectedScribble, attached_file: data.attached_file };
        setSelectedScribble(updated);
        setScribbles((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsSaving(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = async () => {
    if (!window.confirm("Remove this attachment?")) return;
    
    const formData = new FormData();
    formData.append("remove_attached_file", "true");
    
    setIsSaving(true);
    try {
      const res = await fetch(apiUrl(\`/api/notes/update/\${selectedScribble.id}/\`), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const updated = { ...selectedScribble, attached_file: null };
        setSelectedScribble(updated);
        setScribbles((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
    } catch (err) {
      console.error("Remove error:", err);
    } finally {
      setIsSaving(false);
    }
  };
`;

if (!content.includes('handleFileUpload')) {
    content = content.replace('const [searchQuery, setSearchQuery] = useState("");', 'const [searchQuery, setSearchQuery] = useState("");\n' + refsInjection);
}

// 3. Add the Attach File button to the toolbar
const attachButtonHTML = `
                      {/* Attach File Button */}
                      <div className="flex items-center">
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl text-white transition-all ml-2"
                          title="Attach Image or PDF"
                        >
                          <Paperclip size={13} />
                          <span>Attach</span>
                        </button>
                      </div>
`;

if (!content.includes('fileInputRef.current?.click()')) {
    content = content.replace('{/* Mobile stats show up in the toolbar */}', attachButtonHTML + '\n                      {/* Mobile stats show up in the toolbar */}');
}

// 4. Add the Image/File Viewer at the bottom of the writing pad canvas
const viewerHTML = `
                      {/* Attachment Viewer */}
                      {selectedScribble.attached_file && (
                        <div className="mt-4 pt-4 border-t border-white/10 relative group inline-block self-start max-w-full">
                          <button
                            onClick={handleRemoveFile}
                            className="absolute -top-3 -right-3 z-10 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Remove attachment"
                          >
                            <X size={14} />
                          </button>
                          
                          {selectedScribble.attached_file.match(/\\.(jpeg|jpg|gif|png|webp|svg|avif)$/i) ? (
                            <a href={apiUrl(selectedScribble.attached_file)} target="_blank" rel="noreferrer" className="block max-w-sm rounded-xl overflow-hidden border border-white/10 hover:border-[#FF6044]/50 transition-colors">
                              <img src={apiUrl(selectedScribble.attached_file)} alt="Attachment" className="w-full h-auto object-cover max-h-[300px]" />
                            </a>
                          ) : (
                            <a href={apiUrl(selectedScribble.attached_file)} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-[#121313] border border-white/10 hover:border-[#FF6044]/50 rounded-xl transition-colors">
                              <div className="p-2 bg-[#FF6044]/10 rounded-lg text-[#FF6044]">
                                <FileText size={24} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white font-mono">View Attached Document</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">PDF / File</span>
                              </div>
                            </a>
                          )}
                        </div>
                      )}
`;

if (!content.includes('Attachment Viewer')) {
    content = content.replace('</textarea>', '</textarea>\n' + viewerHTML);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Successfully patched Scribbles.jsx with file upload UI!');
