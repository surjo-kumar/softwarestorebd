-- Update site_name in site_settings table
-- Run this in your Supabase SQL Editor

UPDATE site_settings 
SET value = 'Software Store' 
WHERE key = 'site_name';

-- If the record doesn't exist, insert it
INSERT INTO site_settings (key, value)
SELECT 'site_name', 'Software Store'
WHERE NOT EXISTS (
    SELECT 1 FROM site_settings WHERE key = 'site_name'
);
