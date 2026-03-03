-- Copy and Run this in your Supabase Dashboard -> SQL Editor

-- 1. Add 'featured' column if missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 2. Add 'pricing_variants' column if missing (essential for new pricing logic)
ALTER TABLE products ADD COLUMN IF NOT EXISTS pricing_variants JSONB DEFAULT '[]'::jsonb;

-- 3. Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';
