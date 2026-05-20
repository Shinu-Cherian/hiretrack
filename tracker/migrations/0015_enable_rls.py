from django.db import migrations

def enable_supabase_rls(apps, schema_editor):
    from django.db import connection
    vendor = connection.vendor
    print(f"\n[+] Migrations executing RLS script. Engine: {vendor}")
    
    if vendor != 'postgresql':
        print("[INFO] SQLite detected. Skipping PostgreSQL RLS setup.")
        return

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
              AND table_type = 'BASE TABLE';
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"[+] Found {len(tables)} tables to secure in public schema.")
        
        for table in tables:
            print(f"[SECURE] Enabling RLS on: {table}")
            try:
                cursor.execute(f'ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY;')
            except Exception as e:
                print(f"[WARNING] Could not enable RLS on table {table}: {e}")
                
    print("[SUCCESS] Row-Level Security enabled on all PostgreSQL public tables!")

class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0014_databasefile'),
    ]

    operations = [
        migrations.RunPython(enable_supabase_rls, reverse_code=migrations.RunPython.noop),
    ]
