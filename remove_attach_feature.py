import re
import os

print("--- Patching Scribbles.jsx ---")
js_file = "frontend/src/Scribbles.jsx"
with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# Remove state and refs
js_content = re.sub(r'\s*const \[uploadStatus, setUploadStatus\] = useState\(null\);', '', js_content)
js_content = re.sub(r'\s*const fileInputRef = useRef\(null\);', '', js_content)
js_content = re.sub(r'\s*// This ref always holds the latest selectedScribble to avoid stale closures in async handlers\s*const selectedScribbleRef = useRef\(null\);\s*useEffect\(\(\) => \{\s*selectedScribbleRef\.current = selectedScribble;\s*\}, \[selectedScribble\]\);', '', js_content)

# Remove handleFileUpload
handle_upload_pattern = r'\s*const handleFileUpload = async \(e\) => \{.*?^\s*};\s*'
js_content = re.sub(handle_upload_pattern, '', js_content, flags=re.MULTILINE | re.DOTALL)

# Remove handleRemoveFile
handle_remove_pattern = r'\s*const handleRemoveFile = async \(\) => \{.*?^\s*};\s*'
js_content = re.sub(handle_remove_pattern, '', js_content, flags=re.MULTILINE | re.DOTALL)

# Remove Attach File Button
attach_btn_pattern = r'\s*\{\/\* Attach File Button \*\/\}\s*<div className="flex items-center">.*?<\/div>'
js_content = re.sub(attach_btn_pattern, '', js_content, flags=re.MULTILINE | re.DOTALL)

# Remove Attachment Preview
preview_pattern = r'\s*\{\/\* ── ATTACHMENT PREVIEW ── \*\/\}\s*\{selectedScribble\.attached_file && \(\(\) => \{.*?\}\)\(\)\}'
js_content = re.sub(preview_pattern, '', js_content, flags=re.MULTILINE | re.DOTALL)

with open(js_file, "w", encoding="utf-8") as f:
    f.write(js_content)
print("Scribbles.jsx patched.")


print("--- Patching models.py ---")
models_file = "tracker/models.py"
with open(models_file, "r", encoding="utf-8") as f:
    models_content = f.read()

models_content = re.sub(r'\s*attached_file = models\.FileField\(upload_to=\'scribble_files/\', null=True, blank=True\)', '', models_content)

with open(models_file, "w", encoding="utf-8") as f:
    f.write(models_content)
print("models.py patched.")


print("--- Patching views.py ---")
views_file = "tracker/views.py"
with open(views_file, "r", encoding="utf-8") as f:
    views_content = f.read()

# get_notes_api
views_content = views_content.replace('            "attached_file": n.attached_file.url if n.attached_file else None,\n', '')

# add_note_api
views_content = views_content.replace('        "attached_file": None,\n', '')

# update_note_api logic block
update_logic = r'''
    if 'attached_file' in request\.FILES:
        note\.attached_file = request\.FILES\['attached_file'\]
        
    if body\.get\('remove_attached_file'\) == 'true' or body\.get\('remove_attached_file'\) is True:
        if note\.attached_file:
            note\.attached_file\.delete\(\)
            note\.attached_file = None
'''
views_content = re.sub(update_logic, '', views_content)

# update_note_api response
views_content = views_content.replace('        "attached_file": note.attached_file.url if note.attached_file else None,\n', '')

with open(views_file, "w", encoding="utf-8") as f:
    f.write(views_content)
print("views.py patched.")
