-- Database Fix Script v2
-- Run this in Supabase SQL Editor to attempt to fix all missing columns

-- 1. Slug
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products (slug);

-- 2. Featured
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 3. Pricing Variants
ALTER TABLE products ADD COLUMN IF NOT EXISTS pricing_variants JSONB DEFAULT '[]'::jsonb;

-- 4. Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';
