"""
End-to-end test: login, get notes, upload file to first note, verify attached_file in response.
"""
import requests
import os

BASE = "http://localhost:8000"
session = requests.Session()

# 1. Get CSRF token
r = session.get(f"{BASE}/get-csrf/")
csrf = r.cookies.get("csrftoken") or r.json().get("csrfToken", "")
print("CSRF:", csrf)

# 2. Login
r = session.post(
    f"{BASE}/login/",
    json={"username": "shinu", "password": "test123"},
    headers={"X-CSRFToken": csrf},
)
print("Login:", r.status_code, r.text[:100])

# Update CSRF after login
csrf = session.cookies.get("csrftoken", csrf)

# 3. Get notes list
r = session.get(f"{BASE}/api/notes/")
print("Notes:", r.status_code)
notes = r.json()
if not notes:
    # Create one
    r = session.post(f"{BASE}/api/notes/add/", headers={"X-CSRFToken": csrf})
    notes = [r.json()]
    print("Created note:", notes[0])

note_id = notes[0]["id"]
print("Using note id:", note_id, "current attached_file:", notes[0].get("attached_file"))

# 4. Upload a PDF to the note
dummy_pdf = b"%PDF-1.4 test"
r = session.post(
    f"{BASE}/api/notes/update/{note_id}/",
    data={
        "title": "Test Upload",
        "content": "Testing",
        "color": "#FF6044",
        "font_family": "Inter",
        "font_size": "md",
    },
    files={"attached_file": ("test_attach.pdf", dummy_pdf, "application/pdf")},
    headers={"X-CSRFToken": csrf},
)
print("Upload:", r.status_code)
print("Response:", r.json())
