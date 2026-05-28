import os
VIEWS_PATH = "C:/Users/User/Desktop/hiretrack/tracker/views.py"

with open(VIEWS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Fix update_note_api's attached_file return
new_update_ret = """    return JsonResponse({
        "status": "Success",
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "color": note.color,
        "font_family": note.font_family,
        "font_size": note.font_size,
        "attached_file": note.attached_file.url if note.attached_file else None,
        "updated_at": note.updated_at.isoformat() if note.updated_at else "",
    })"""

import re
content = re.sub(r'return JsonResponse\(\{[\s\S]*?"updated_at": note\.updated_at\.isoformat\(\) if note\.updated_at else "",\n\s+\}\)', new_update_ret, content)

with open(VIEWS_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed update_note_api return object")
