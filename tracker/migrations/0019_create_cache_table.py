from django.db import migrations
from django.core.management import call_command

def create_cache_table(apps, schema_editor):
    try:
        call_command('createcachetable', 'hiretrack_ratelimit_cache')
    except Exception as e:
        print(f"Failed to create cache table (might already exist): {e}")

class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0018_remove_scribble_attached_file'),
    ]

    operations = [
        migrations.RunPython(create_cache_table, reverse_code=migrations.RunPython.noop),
    ]
