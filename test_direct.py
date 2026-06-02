"""Direct test: bypass auth, upload a real PDF to a note, check what the server returns."""
import requests
import os, sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import RequestFactory
from django.contrib.auth.models import User
from tracker.models import Scribble
from tracker.views import update_note_api
from io import BytesIO

# Get first user and their first scribble
user = User.objects.filter(username='shinu').first()
if not user:
    user = User.objects.first()
print(f"User: {user.username}")

# Get or create a scribble
note = Scribble.objects.filter(user=user).first()
if not note:
    note = Scribble.objects.create(user=user, title='Test', content='', color='#FF6044', font_family='Inter', font_size='md')
print(f"Note ID: {note.id}, current attached_file: {note.attached_file}")

# Create a fake PDF content
pdf_bytes = b'%PDF-1.4 fake pdf content for testing'
pdf_file = BytesIO(pdf_bytes)
pdf_file.name = 'test_direct.pdf'

# Use Django's test RequestFactory to make a multipart request
factory = RequestFactory()
request = factory.post(
    f'/api/notes/update/{note.id}/',
    data={
        'title': 'Test Upload',
        'content': 'test content',
        'color': '#FF6044',
        'font_family': 'Inter',
        'font_size': 'md',
        'attached_file': pdf_file,
    },
    content_type='multipart/form-data',
    format='multipart'
)
request.user = user

# Call the view directly
response = update_note_api(request, note.id)
print(f"Status: {response.status_code}")
print(f"Response: {response.content.decode('utf-8')}")

# Check what's in the database now
note.refresh_from_db()
print(f"Note attached_file after save: {note.attached_file}")
if note.attached_file:
    print(f"URL: {note.attached_file.url}")
    from tracker.models import DatabaseFile
    db_files = DatabaseFile.objects.filter(name__contains='scribble_files')
    print(f"DatabaseFiles with scribble_files: {list(db_files.values('name','size'))}")
