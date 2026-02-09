# ✅ Admin User Found!

## Admin User Information

**User ID:** `6eea9c0a-89c5-451d-9ee3-7146a2682539`  
**Name:** Tráng  
**Phone:** +94947776662  
**Role:** admin  
**Created:** 2/5/2026, 4:34:26 PM

---

## 🔐 Get Email & Reset Password

### Step 1: Get Email Address

Run this SQL in **Supabase Dashboard → SQL Editor**:

```sql
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    email_confirmed_at
FROM auth.users 
WHERE id = '6eea9c0a-89c5-451d-9ee3-7146a2682539';
```

### Step 2: Reset Password to `admin123`

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to **Authentication** → **Users**
2. Search for user ID: `6eea9c0a-89c5-451d-9ee3-7146a2682539`
3. Click on the user
4. Click **"Send Password Reset Email"** or **"Reset Password"**
5. Set password to: `admin123`

**Option B: Via SQL (Requires service_role)**
```sql
-- Reset password to 'admin123'
UPDATE auth.users
SET 
    encrypted_password = crypt('admin123', gen_salt('bf')),
    updated_at = now()
WHERE id = '6eea9c0a-89c5-451d-9ee3-7146a2682539';
```

---

## 🧪 Test Login

After resetting password:

**Production:**
- URL: https://app.appejv.app/auth/login
- Email: [from Step 1]
- Password: admin123

**Local:**
- URL: http://localhost:3000/auth/login
- Email: [from Step 1]
- Password: admin123

---

## 📝 Quick Reference

```
User ID: 6eea9c0a-89c5-451d-9ee3-7146a2682539
Name: Tráng
Phone: +94947776662
Role: admin
Password: admin123 (after reset)
```

---

## ⚠️ Security Reminder

After successful login:
1. ✅ Change password to something stronger
2. ✅ Use at least 12 characters
3. ✅ Include uppercase, lowercase, numbers, symbols
4. ✅ Don't share credentials

---

**Status:** Admin user found, password reset pending  
**Date:** 9/2/2026
