# Admin User Information & Password Reset

## Option 1: Check via Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Select project: `mrcmratcnlsoxctsbalt`

### Step 2: Check Profiles Table
1. Go to **Table Editor** → **profiles**
2. Filter by `role = 'admin'`
3. Note the `id` and `full_name`

### Step 3: Check Auth Users
1. Go to **Authentication** → **Users**
2. Find user by ID from step 2
3. Note the email address

### Step 4: Reset Password
1. Click on the user
2. Click **"Reset Password"**
3. Set new password: `admin123`
4. Or send reset email

---

## Option 2: SQL Query to Find Admin

Run this in **SQL Editor**:

```sql
-- Find all admin users
SELECT 
    p.id,
    p.role,
    p.full_name,
    p.phone,
    au.email,
    au.created_at,
    au.last_sign_in_at,
    au.email_confirmed_at
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE p.role = 'admin';
```

---

## Option 3: Reset Password via SQL

⚠️ **Warning:** This requires service_role access

```sql
-- Update password for admin user
-- Replace 'admin-user-id' with actual user ID
UPDATE auth.users
SET 
    encrypted_password = crypt('admin123', gen_salt('bf')),
    updated_at = now()
WHERE id = 'admin-user-id';
```

---

## Option 4: Create New Admin User

If no admin exists, create one:

```sql
-- 1. First, create auth user (do this in Supabase Dashboard → Authentication → Add User)
-- Email: admin@appejv.app
-- Password: admin123
-- Auto Confirm Email: Yes

-- 2. Then update profile role
UPDATE profiles
SET role = 'admin'
WHERE id = 'new-user-id-from-step-1';
```

---

## Option 5: Use Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref mrcmratcnlsoxctsbalt

# Reset password
supabase db reset --password admin123
```

---

## Common Admin Emails to Check

Based on previous setup, check these emails:
- `admin@appejv.app`
- `admin@demo.com` (if still exists)
- Any email with role='admin' in profiles table

---

## Quick Test Login

After resetting password, test at:
- **Web:** https://app.appejv.app/auth/login
- **Local:** http://localhost:3000/auth/login

**Credentials:**
- Email: [from database]
- Password: admin123

---

## Troubleshooting

### Issue: Can't find admin user
**Solution:** Create new admin user via Supabase Dashboard

### Issue: Password reset not working
**Solution:** 
1. Delete user from Authentication
2. Create new user
3. Update profile role to 'admin'

### Issue: Service role key invalid
**Solution:** Get new service role key from:
- Supabase Dashboard → Settings → API → service_role key

---

## Security Note

⚠️ **Important:** 
- Change password after first login
- Don't use 'admin123' in production
- Use strong passwords (min 12 characters)
- Enable 2FA if available

---

**Created:** 9/2/2026
**Status:** Manual steps required
