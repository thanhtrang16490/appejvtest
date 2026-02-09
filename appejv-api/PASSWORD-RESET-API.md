# Password Reset API Documentation

## Overview

API endpoints để xử lý khôi phục mật khẩu qua backend thay vì Supabase magic link.

---

## Endpoints

### 1. Request Password Reset

**POST** `/api/v1/auth/forgot-password`

Request để gửi email khôi phục mật khẩu.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response Success (200):**
```json
{
  "message": "Email khôi phục mật khẩu đã được gửi",
  "token": "abc123..." // Only in development
}
```

**Response Error (400):**
```json
{
  "error": "Invalid email format"
}
```

---

### 2. Verify Reset Token

**POST** `/api/v1/auth/verify-reset-token`

Kiểm tra xem token có hợp lệ không.

**Request Body:**
```json
{
  "token": "abc123..."
}
```

**Response Success (200):**
```json
{
  "valid": true,
  "message": "Token hợp lệ"
}
```

**Response Error (400):**
```json
{
  "error": "Token không hợp lệ hoặc đã hết hạn",
  "valid": false
}
```

---

### 3. Reset Password

**POST** `/api/v1/auth/reset-password`

Đặt lại mật khẩu với token hợp lệ.

**Request Body:**
```json
{
  "token": "abc123...",
  "password": "NewPassword123"
}
```

**Response Success (200):**
```json
{
  "message": "Mật khẩu đã được đặt lại thành công",
  "user_id": "user-uuid"
}
```

**Response Error (400):**
```json
{
  "error": "Token không hợp lệ hoặc đã hết hạn"
}
```

---

## Database Schema

### Table: `password_reset_tokens`

```sql
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id` - Primary key
- `user_id` - Reference to auth.users
- `token` - Unique reset token (64 chars hex)
- `expires_at` - Token expiration time (1 hour from creation)
- `used` - Whether token has been used
- `used_at` - When token was used
- `created_at` - When token was created

---

## Setup Instructions

### 1. Run Migration

```bash
# Connect to Supabase and run migration
psql $DATABASE_URL < migrations/create_password_reset_tokens.sql
```

Or via Supabase Dashboard:
1. Go to SQL Editor
2. Paste content from `migrations/create_password_reset_tokens.sql`
3. Run query

### 2. Configure Email (Optional)

For production, integrate email service:
- SendGrid
- AWS SES
- Mailgun
- SMTP

Update `password_reset.go` to send actual emails.

---

## Testing

### Test Flow

```bash
# 1. Request password reset
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Response will include token (dev only)
# {"message":"...","token":"abc123..."}

# 2. Verify token
curl -X POST http://localhost:8080/api/v1/auth/verify-reset-token \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123..."}'

# 3. Reset password
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123...","password":"NewPassword123"}'
```

---

## Security Features

### Token Generation
- 32 bytes random data
- Hex encoded (64 characters)
- Cryptographically secure

### Token Expiration
- Default: 1 hour
- Configurable in code
- Auto cleanup of expired tokens

### One-time Use
- Token marked as `used` after reset
- Cannot be reused

### Rate Limiting
- Should add rate limiting on forgot-password endpoint
- Prevent abuse/spam

### Email Obfuscation
- Don't reveal if email exists
- Same response for existing/non-existing emails

---

## Frontend Integration

### Update forgot-password page

```typescript
// app/auth/forgot-password/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })

        const data = await response.json()
        
        if (response.ok) {
            toast.success('Email khôi phục đã được gửi!')
            // In dev, you can use data.token for testing
            if (data.token) {
                router.push(`/auth/reset-password?token=${data.token}`)
            }
        } else {
            toast.error(data.error || 'Có lỗi xảy ra')
        }
    } catch (error) {
        toast.error('Không thể kết nối đến server')
    } finally {
        setLoading(false)
    }
}
```

### Update reset-password page

```typescript
// app/auth/reset-password/page.tsx
useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
        verifyToken(token)
    }
}, [])

const verifyToken = async (token: string) => {
    const response = await fetch(`${API_URL}/auth/verify-reset-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })

    const data = await response.json()
    
    if (data.valid) {
        setIsValidToken(true)
    } else {
        toast.error('Token không hợp lệ')
        router.push('/auth/login')
    }
}

const handleSubmit = async (e: React.FormEvent) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
    })

    const data = await response.json()
    
    if (response.ok) {
        toast.success('Đặt lại mật khẩu thành công!')
        router.push('/auth/login')
    } else {
        toast.error(data.error)
    }
}
```

---

## Production Checklist

- [ ] Run database migration
- [ ] Configure email service
- [ ] Remove token from API response
- [ ] Add rate limiting
- [ ] Add logging/monitoring
- [ ] Test email delivery
- [ ] Test token expiration
- [ ] Test security (SQL injection, etc.)
- [ ] Add CAPTCHA on forgot-password form
- [ ] Setup email templates

---

## Email Template Example

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Đặt lại mật khẩu - APPE JV</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://app.appejv.app/appejv-logo.png" alt="APPE JV" style="width: 80px;">
        <h1 style="color: #175ead; margin-top: 20px;">Đặt lại mật khẩu</h1>
    </div>
    
    <p>Xin chào,</p>
    
    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản APPE JV của mình.</p>
    
    <p>Click vào nút bên dưới để đặt lại mật khẩu:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://app.appejv.app/auth/reset-password?token={{TOKEN}}" 
           style="background: #175ead; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Đặt lại mật khẩu
        </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
        Link này sẽ hết hạn sau 1 giờ.
    </p>
    
    <p style="color: #666; font-size: 14px;">
        Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px; text-align: center;">
        © 2026 APPE JV. All rights reserved.
    </p>
</body>
</html>
```

---

**Status:** ✅ API implemented, ready for frontend integration  
**Last Updated:** 9/2/2026
