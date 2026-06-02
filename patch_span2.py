FILE = "frontend/src/Scribbles.jsx"
with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

old = '          <span>Attach</span>\n                        </button>'
new = '''          <span>
                            {uploadStatus === "uploading" ? "Uploading..." : uploadStatus === "success" ? "✓ Attached!" : "Attach"}
                          </span>
                        </button>'''

if old in content:
    content = content.replace(old, new)
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS!")
else:
    print("FAILED")
    idx = content.find('<span>Attach</span>')
    print(repr(content[idx-20:idx+80]))
