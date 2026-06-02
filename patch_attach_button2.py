FILE = "frontend/src/Scribbles.jsx"
with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = 'Attach File Button */}\n                      <div className="flex items-center">\n                        <input type="file" ref={fileInputRef} className="sr-only" onChange={handleFileUpload} accept="image/*,application/pdf" />\n                        <button\n                          type="button"\n                          onClick={() => fileInputRef.current?.click()}\n                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl text-white transition-all ml-2"\n                          title="Attach Image or PDF"\n                        >\n                          <Paperclip size={13} />'

new = '''Attach File Button */}
                      <div className="flex items-center">
                        <input type="file" ref={fileInputRef} className="sr-only" onChange={handleFileUpload} accept="image/*,application/pdf" />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadStatus === "uploading"}
                          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl transition-all ml-2 ${
                            uploadStatus === "uploading"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-wait"
                              : uploadStatus === "success"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20 text-white"
                          }`}
                          title="Attach Image or PDF (max 10MB)"
                        >
                          <Paperclip size={13} className={uploadStatus === "uploading" ? "animate-spin" : ""} />'''

if old in content:
    content = content.replace(old, new)
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS!")
else:
    print("FAILED - pattern not found")
