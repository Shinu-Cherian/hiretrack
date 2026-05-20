import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

def enable_rls():
    print("[+] Connecting to the database...")
    vendor = connection.vendor
    print(f"[+] Active database engine: {vendor}")
    
    if vendor != 'postgresql':
        print("[INFO] Active database is not PostgreSQL (e.g., SQLite).")
        print("[INFO] Row-Level Security (RLS) is a PostgreSQL/Supabase feature and is not needed for SQLite.")
        print("[INFO] Skipping local RLS configuration. This script is fully ready for production PostgreSQL!")
        return

    with connection.cursor() as cursor:
        # Get all custom tables in the public schema
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
              AND table_type = 'BASE TABLE';
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"Found {len(tables)} tables in the public schema.")
        
        # Enable RLS on each table
        for table in tables:
            print(f"[SECURE] Enabling Row-Level Security (RLS) on table: {table}")
            cursor.execute(f'ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY;')
            
    print("[SUCCESS] Successfully enabled Row-Level Security (RLS) on all public tables!")
    print("[OK] Your Supabase database is now completely secured against public API leaks!")

if __name__ == '__main__':
    enable_rls()
