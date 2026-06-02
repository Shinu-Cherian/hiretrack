import requests
import os

url = 'http://localhost:8000/api/notes/update/1/'

# Create a dummy image file
with open('test.png', 'wb') as f:
    f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')

with open('test.png', 'rb') as f:
    files = {'attached_file': ('test.png', f, 'image/png')}
    data = {
        'title': 'My Title',
        'content': 'My Content',
        'color': '#FFFFFF',
        'font_family': 'Inter',
        'font_size': 'md'
    }
    response = requests.post(url, data=data, files=files)

print('Status:', response.status_code)
print('Response:', response.text)
