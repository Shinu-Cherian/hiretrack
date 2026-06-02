"""
Patch Scribbles.jsx:
1. Add selectedScribbleRef to always have latest selectedScribble
2. Use ref in handleFileUpload to avoid stale closure
3. Add upload status state with clear visual feedback
"""
import re

FILE = "frontend/src/Scribbles.jsx"
with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add selectedScribbleRef after fileInputRef
old1 = "  const fileInputRef = useRef(null);"
new1 = """  const fileInputRef = useRef(null);
  const selectedScribbleRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'success' | 'error'"""
assert old1 in content, "Pattern 1 not found"
content = content.replace(old1, new1)

# 2. Keep selectedScribbleRef in sync - add after setSelectedScribble
old2 = "  const [selectedScribble, setSelectedScribble] = useState(null);"
new2 = """  const [selectedScribble, _setSelectedScribble] = useState(null);
  const setSelectedScribble = (val) => {
    selectedScribbleRef.current = val;
    _setSelectedScribble(val);
  };"""
assert old2 in content, "Pattern 2 not found"
content = content.replace(old2, new2)

# 3. Rewrite handleFileUpload to use the ref
old3 = """  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("attached_file", file);
    formData.append("title", selectedScribble.title || "");
    formData.append("content", selectedScribble.content || "");
    formData.append("color", selectedScribble.color || "#FF6044");
    formData.append("font_family", selectedScribble.font_family || "Inter");
    formData.append("font_size", selectedScribble.font_size || "md");

    setIsSaving(true);
    try {
      const res = await fetch(apiUrl(`/api/notes/update/${selectedScribble.id}/`), {
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
    }
  };"""

new3 = """  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Always read from ref to avoid stale closure
    const currentScribble = selectedScribbleRef.current;
    if (!currentScribble) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("attached_file", file);
    formData.append("title", currentScribble.title || "");
    formData.append("content", currentScribble.content || "");
    formData.append("color", currentScribble.color || "#FF6044");
    formData.append("font_family", currentScribble.font_family || "Inter");
    formData.append("font_size", currentScribble.font_size || "md");

    setIsSaving(true);
    setUploadStatus("uploading");
    try {
      const res = await fetch(apiUrl(`/api/notes/update/${currentScribble.id}/`), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const updated = { ...currentScribble, attached_file: data.attached_file };
        setSelectedScribble(updated);
        setScribbles((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setUploadStatus("success");
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        setUploadStatus("error");
        alert("Upload Failed! Status: " + res.status + "\\n" + JSON.stringify(data));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("error");
      alert("Network Error: " + err.message);
    } finally {
      setIsSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };"""

assert old3 in content, "Pattern 3 not found"
content = content.replace(old3, new3)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("All patches applied successfully!")
