const fs = require('fs');
const FILE_PATH = "C:/Users/User/Desktop/hiretrack/frontend/src/Scribbles.jsx";
let content = fs.readFileSync(FILE_PATH, 'utf8');

const oldCode = `    const formData = new FormData();
    formData.append("attached_file", file);
    formData.append("title", selectedScribble.title || "");
    formData.append("content", selectedScribble.content || "");
    formData.append("color", selectedScribble.color || "#FF6044");
    formData.append("font_family", selectedScribble.font_family || "Inter");
    formData.append("font_size", selectedScribble.font_size || "md");

    setIsSaving(true);
    try {
      const res = await fetch(apiUrl(\`/api/notes/update/\${selectedScribble.id}/\`), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const updated = { ...selectedScribble, attached_file: data.attached_file };
        setSelectedScribble(updated);
        setScribbles((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const errText = await res.text();
        alert("Upload Failed! Status: " + res.status + " " + errText);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Network Error: " + err.message);
    } finally {
      setIsSaving(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }`;

const newCode = `    alert("File selected: " + file.name + " (" + file.size + " bytes)");
    const formData = new FormData();
    formData.append("attached_file", file);
    formData.append("title", selectedScribble.title || "");
    formData.append("content", selectedScribble.content || "");
    formData.append("color", selectedScribble.color || "#FF6044");
    formData.append("font_family", selectedScribble.font_family || "Inter");
    formData.append("font_size", selectedScribble.font_size || "md");

    setIsSaving(true);
    try {
      alert("Uploading to API: " + apiUrl(\`/api/notes/update/\${selectedScribble.id}/\`));
      const res = await fetch(apiUrl(\`/api/notes/update/\${selectedScribble.id}/\`), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        alert("Upload Success! Server returned: " + data.attached_file);
        const updated = { ...selectedScribble, attached_file: data.attached_file };
        setSelectedScribble(updated);
        setScribbles((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const errText = await res.text();
        alert("Upload Failed! Status: " + res.status + " " + errText);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Network Error: " + err.message);
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }`;

if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync(FILE_PATH, content, 'utf8');
    console.log("Patched successfully with debug alerts!");
} else {
    console.log("Could not find the exact old code block.");
}
