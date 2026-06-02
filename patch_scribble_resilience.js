const fs = require('fs');

const FILE_PATH = "C:/Users/User/Desktop/hiretrack/frontend/src/Scribbles.jsx";
let content = fs.readFileSync(FILE_PATH, 'utf8');

const oldHandleFileUpload = `    const formData = new FormData();
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
    } finally {`;

const newHandleFileUpload = `    const formData = new FormData();
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
    } finally {`;

if (content.includes(oldHandleFileUpload)) {
    content = content.replace(oldHandleFileUpload, newHandleFileUpload);
    fs.writeFileSync(FILE_PATH, content, 'utf8');
    console.log("Patched safely!");
} else {
    console.log("Could not find the exact old code block.");
}
