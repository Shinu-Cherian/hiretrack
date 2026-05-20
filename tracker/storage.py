import os
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from django.utils.deconstruct import deconstructible

@deconstructible
class DatabaseStorage(Storage):
    def __init__(self, option=None):
        pass

    def _open(self, name, mode='rb'):
        from tracker.models import DatabaseFile
        # Normalize name to use forward slashes
        normalized_name = name.replace('\\', '/')
        try:
            db_file = DatabaseFile.objects.get(name=normalized_name)
            return ContentFile(db_file.content, name=normalized_name)
        except DatabaseFile.DoesNotExist:
            raise FileNotFoundError(f"File not found in database: {normalized_name}")

    def _save(self, name, content):
        from tracker.models import DatabaseFile
        normalized_name = name.replace('\\', '/')
        content_bytes = content.read()
        db_file, created = DatabaseFile.objects.update_or_create(
            name=normalized_name,
            defaults={
                'content': content_bytes,
                'size': len(content_bytes)
            }
        )
        return normalized_name

    def exists(self, name):
        from tracker.models import DatabaseFile
        normalized_name = name.replace('\\', '/')
        return DatabaseFile.objects.filter(name=normalized_name).exists()

    def url(self, name):
        normalized_name = name.replace('\\', '/')
        return f"/media/{normalized_name}"

    def size(self, name):
        from tracker.models import DatabaseFile
        normalized_name = name.replace('\\', '/')
        try:
            return DatabaseFile.objects.get(name=normalized_name).size
        except DatabaseFile.DoesNotExist:
            return 0

    def get_available_name(self, name, max_length=None):
        return super().get_available_name(name, max_length)
