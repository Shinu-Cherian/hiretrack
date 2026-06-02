FILE = "frontend/src/Scribbles.jsx"
with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '                          <span>Attach</span>\n                          </button>'
new = '''                          <span>
                            {uploadStatus === "uploading" ? "Uploading..." : uploadStatus === "success" ? "✓ Attached!" : "Attach"}
                          </span>
                          </button>'''

if old in content:
    content = content.replace(old, new)
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("Span patched!")
else:
    # Find the exact span
    idx = content.find('<span>Attach</span>')
    print("Found at:", idx)
    print(repr(content[idx-10:idx+100]))
