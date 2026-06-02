with open('frontend/src/Scribbles.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className="hidden" onChange={handleFileUpload}',
    'className="sr-only" onChange={handleFileUpload}'
)

with open('frontend/src/Scribbles.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced successfully!")
