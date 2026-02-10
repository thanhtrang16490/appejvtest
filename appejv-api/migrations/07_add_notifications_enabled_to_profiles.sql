-- Add notifications_enabled column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true;

-- Add comment
COMMENT ON COLUMN profiles.notifications_enabled IS 'Whether user wants to receive system notifications';

-- Update existing rows to have notifications enabled by default
UPDATE profiles 
SET notifications_enabled = true 
WHERE notifications_enabled IS NULL;
