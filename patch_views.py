import os
import json

VIEWS_PATH = "C:/Users/User/Desktop/hiretrack/tracker/views.py"

with open(VIEWS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Patch get_notes_api
if '"attached_file":' not in content:
    content = content.replace(
        '"font_size": n.font_size,',
        '"font_size": n.font_size,\n            "attached_file": n.attached_file.url if n.attached_file else None,'
    )

# Patch add_note_api
if '"attached_file": None' not in content:
    content = content.replace(
        '"font_size": note.font_size,',
        '"font_size": note.font_size,\n        "attached_file": None,'
    )

# Patch update_note_api
if 'note.attached_file = request.FILES' not in content:
    update_str = """    try:
        body = _json.loads(request.body)
    except Exception:
        body = request.POST

    if 'attached_file' in request.FILES:
        note.attached_file = request.FILES['attached_file']
        
    if body.get('remove_attached_file') == 'true' or body.get('remove_attached_file') is True:
        if note.attached_file:
            note.attached_file.delete()
            note.attached_file = None

    note.title = body.get("title", note.title)"""
    
    content = content.replace(
        """    try:
        body = _json.loads(request.body)
    except Exception:
        body = request.POST

    note.title = body.get("title", note.title)""",
        update_str
    )

with open(VIEWS_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully patched tracker/views.py")
