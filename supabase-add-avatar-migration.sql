-- Migration: Add avatar_url column to profiles and customers tables

-- Step 1: Add avatar_url column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 2: Add avatar_url column to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 3: Add comments
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image stored in Supabase Storage';
COMMENT ON COLUMN customers.avatar_url IS 'URL to customer avatar image stored in Supabase Storage';

-- Step 4: Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('profiles', 'customers')
AND column_name = 'avatar_url';

-- Note: You need to create a storage bucket named 'avatars' in Supabase Storage
-- with the following settings:
-- - Public: true (for public access to avatars)
-- - File size limit: 2MB
-- - Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp
