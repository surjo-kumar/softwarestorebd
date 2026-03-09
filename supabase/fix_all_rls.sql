-- ==============================================
-- FIX ALL STORAGE & TABLE PERMISSIONS
-- Run this in Supabase SQL Editor
-- ==============================================

-- ===== STEP 1: Create thumbnails bucket if not exists =====
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('thumbnails', 'thumbnails', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

-- ===== STEP 2: Drop ALL existing storage policies for thumbnails =====
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage'
        AND policyname ILIKE '%thumbnail%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Also drop common policy names that might exist
DROP POLICY IF EXISTS "Public thumbnails read" ON storage.objects;
DROP POLICY IF EXISTS "Public thumbnails upload" ON storage.objects;
DROP POLICY IF EXISTS "Public thumbnails update" ON storage.objects;
DROP POLICY IF EXISTS "Public thumbnails delete" ON storage.objects;
DROP POLICY IF EXISTS "allow_public_read_thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "allow_public_upload_thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "allow_public_update_thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "allow_public_delete_thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload thumbnails" ON storage.objects;

-- ===== STEP 3: Create FRESH permissive storage policies =====
CREATE POLICY "thumbnails_select_all" ON storage.objects
FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "thumbnails_insert_all" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'thumbnails');

CREATE POLICY "thumbnails_update_all" ON storage.objects
FOR UPDATE USING (bucket_id = 'thumbnails');

CREATE POLICY "thumbnails_delete_all" ON storage.objects
FOR DELETE USING (bucket_id = 'thumbnails');

-- ===== STEP 4: Also fix product-files bucket =====
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('product-files', 'product-files', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ===== STEP 5: Ensure RLS is enabled (required for policies to work) =====
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ===== STEP 6: Fix products table - add missing columns =====
DO $$
BEGIN
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'slug') THEN
        ALTER TABLE products ADD COLUMN slug TEXT;
    END IF;

    -- Add featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'featured') THEN
        ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;

    -- Add pricing_variants column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'pricing_variants') THEN
        ALTER TABLE products ADD COLUMN pricing_variants JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- Add monthly_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'monthly_price') THEN
        ALTER TABLE products ADD COLUMN monthly_price NUMERIC(10,2);
    END IF;

    -- Add yearly_price column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'yearly_price') THEN
        ALTER TABLE products ADD COLUMN yearly_price NUMERIC(10,2);
    END IF;
END $$;

-- ===== STEP 7: Fix products table RLS =====
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_all" ON products;
DROP POLICY IF EXISTS "products_insert_all" ON products;
DROP POLICY IF EXISTS "products_update_all" ON products;
DROP POLICY IF EXISTS "products_delete_all" ON products;
DROP POLICY IF EXISTS "Everyone can read products" ON products;
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_all" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_all" ON products FOR UPDATE USING (true);
CREATE POLICY "products_delete_all" ON products FOR DELETE USING (true);

-- ===== STEP 8: Fix categories table RLS =====
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_all" ON categories;
DROP POLICY IF EXISTS "categories_insert_all" ON categories;
DROP POLICY IF EXISTS "categories_update_all" ON categories;
DROP POLICY IF EXISTS "categories_delete_all" ON categories;

CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_all" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "categories_update_all" ON categories FOR UPDATE USING (true);
CREATE POLICY "categories_delete_all" ON categories FOR DELETE USING (true);

-- ===== STEP 9: Fix orders table RLS =====
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        
        EXECUTE 'DROP POLICY IF EXISTS "orders_select_all" ON orders';
        EXECUTE 'DROP POLICY IF EXISTS "orders_insert_all" ON orders';
        EXECUTE 'DROP POLICY IF EXISTS "orders_update_all" ON orders';
        EXECUTE 'DROP POLICY IF EXISTS "orders_delete_all" ON orders';
        
        EXECUTE 'CREATE POLICY "orders_select_all" ON orders FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "orders_insert_all" ON orders FOR INSERT WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "orders_update_all" ON orders FOR UPDATE USING (true)';
        EXECUTE 'CREATE POLICY "orders_delete_all" ON orders FOR DELETE USING (true)';
    END IF;
END $$;

-- ===== STEP 10: Fix site_settings table RLS =====
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
        ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
        
        EXECUTE 'DROP POLICY IF EXISTS "site_settings_select_all" ON site_settings';
        EXECUTE 'DROP POLICY IF EXISTS "site_settings_insert_all" ON site_settings';
        EXECUTE 'DROP POLICY IF EXISTS "site_settings_update_all" ON site_settings';
        EXECUTE 'DROP POLICY IF EXISTS "site_settings_delete_all" ON site_settings';
        
        EXECUTE 'CREATE POLICY "site_settings_select_all" ON site_settings FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "site_settings_insert_all" ON site_settings FOR INSERT WITH CHECK (true)';
        EXECUTE 'CREATE POLICY "site_settings_update_all" ON site_settings FOR UPDATE USING (true)';
        EXECUTE 'CREATE POLICY "site_settings_delete_all" ON site_settings FOR DELETE USING (true)';
    END IF;
END $$;

-- ===== VERIFICATION: Check everything is set correctly =====
SELECT '✅ Buckets:' AS status;
SELECT id, name, public FROM storage.buckets WHERE id IN ('thumbnails', 'product-files');

SELECT '✅ Storage Policies:' AS status;
SELECT policyname, permissive, cmd FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname LIKE 'thumbnails%';

SELECT '✅ Products columns:' AS status;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position;

SELECT '✅ Done! All permissions fixed!' AS status;
