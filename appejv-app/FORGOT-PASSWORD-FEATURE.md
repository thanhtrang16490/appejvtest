# Forgot Password Feature - Tính năng quên mật khẩu

## Tổng quan

Tính năng cho phép người dùng đặt lại mật khẩu khi quên thông qua email.

---

## Flow hoạt động

### 1. User Request Reset
```
User → Click "Quên mật khẩu?" → Nhập email → Submit
```

### 2. System Send Email
```
Supabase → Gửi email với magic link → User nhận email
```

### 3. User Reset Password
```
User → Click link trong email → Nhập mật khẩu mới → Submit → Success
```

---

## Implementation Details

### A. Login Page - Forgot Password UI

**File:** `app/auth/login/page.tsx`

**Features:**
- Toggle giữa login form và forgot password form
- Input email validation
- Send reset email via Supabase
- Success/error toast notifications

**Code:**
```typescript
const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) throw error

        toast.success('Email khôi phục mật khẩu đã được gửi!')
        setIsForgotPassword(false)
        setResetEmail('')
    } catch (error: any) {
        toast.error(error.message || 'Gửi email thất bại')
    } finally {
        setLoading(false)
    }
}
```

### B. Reset Password Page

**File:** `app/auth/reset-password/page.tsx`

**Features:**
- ✅ Session validation (check magic link)
- ✅ Password strength indicator
- ✅ Password requirements checklist
- ✅ Confirm password validation
- ✅ Show/hide password toggle
- ✅ Update password via Supabase
- ✅ Auto logout after success
- ✅ Redirect to login

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

**Password Strength Levels:**
1. 🔴 Yếu - < 8 characters
2. 🟠 Trung bình - 8+ chars, missing uppercase/lowercase
3. 🟡 Khá - 8+ chars, has upper/lower, missing number
4. 🟢 Mạnh - All requirements met

---

## User Experience

### Scenario 1: Forgot Password Flow

```
1. User ở trang login
2. Click "Quên mật khẩu?"
3. Form chuyển sang forgot password mode
4. Nhập email: user@example.com
5. Click "Gửi email khôi phục"
6. Toast: "Email khôi phục mật khẩu đã được gửi!"
7. User check email
8. Click link trong email
9. Redirect đến /auth/reset-password
10. Nhập mật khẩu mới (với strength indicator)
11. Nhập xác nhận mật khẩu
12. Click "Đặt lại mật khẩu"
13. Toast: "Đặt lại mật khẩu thành công!"
14. Auto logout
15. Redirect về /auth/login
16. Toast: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập..."
17. User login với mật khẩu mới
```

### Scenario 2: Invalid/Expired Link

```
1. User click vào link cũ hoặc đã dùng
2. System check session
3. Session invalid/expired
4. Toast: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
5. Auto redirect về /auth/login sau 2 giây
```

### Scenario 3: Password Validation Errors

```
1. User nhập mật khẩu yếu (< 8 chars)
2. Click submit
3. Toast: "Mật khẩu phải có ít nhất 8 ký tự"
4. User sửa lại

OR

1. User nhập mật khẩu không khớp
2. Click submit
3. Toast: "Mật khẩu xác nhận không khớp"
4. User sửa lại
```

---

## Email Configuration

### Supabase Email Templates

**Location:** Supabase Dashboard → Authentication → Email Templates

**Template:** Reset Password

**Default Subject:** Reset Your Password

**Default Body:**
```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

**Custom Template (Vietnamese):**
```html
<h2>Đặt lại mật khẩu</h2>
<p>Xin chào,</p>
<p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản APPE JV của mình.</p>
<p>Click vào link bên dưới để đặt lại mật khẩu:</p>
<p><a href="{{ .ConfirmationURL }}" style="background: #175ead; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Đặt lại mật khẩu</a></p>
<p>Link này sẽ hết hạn sau 1 giờ.</p>
<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
<br>
<p>Trân trọng,<br>APPE JV Team</p>
```

---

## Security Features

### 1. Token Expiration
- Magic link hết hạn sau 1 giờ (default)
- Configurable trong Supabase settings

### 2. One-time Use
- Link chỉ dùng được 1 lần
- Sau khi reset thành công, link không còn valid

### 3. Session Validation
- Check session trước khi cho phép reset
- Invalid session → redirect về login

### 4. Password Strength
- Enforce minimum requirements
- Visual feedback với strength indicator
- Prevent weak passwords

### 5. Auto Logout
- Logout user sau khi reset password
- Force login lại với password mới
- Ensure security

---

## Error Handling

### Common Errors

| Error | Message | Solution |
|-------|---------|----------|
| Email not found | "User not found" | Check email spelling |
| Invalid link | "Link không hợp lệ" | Request new reset email |
| Expired link | "Link đã hết hạn" | Request new reset email |
| Weak password | "Mật khẩu phải có..." | Follow requirements |
| Password mismatch | "Mật khẩu không khớp" | Re-enter password |
| Network error | "Có lỗi xảy ra" | Check internet, retry |

---

## Testing

### Test Case 1: Happy Path
```bash
1. Go to /auth/login
2. Click "Quên mật khẩu?"
3. Enter valid email
4. Click "Gửi email khôi phục"
5. Check email inbox
6. Click reset link
7. Enter new password (meets requirements)
8. Confirm password
9. Click "Đặt lại mật khẩu"
10. Verify redirect to login
11. Login with new password
✅ Expected: Success
```

### Test Case 2: Invalid Email
```bash
1. Enter non-existent email
2. Click "Gửi email khôi phục"
✅ Expected: Error toast "User not found"
```

### Test Case 3: Weak Password
```bash
1. Complete reset flow
2. Enter password: "123"
3. Click submit
✅ Expected: Error "Mật khẩu phải có ít nhất 8 ký tự"
```

### Test Case 4: Password Mismatch
```bash
1. Enter password: "Password123"
2. Confirm: "Password456"
3. Click submit
✅ Expected: Error "Mật khẩu xác nhận không khớp"
```

### Test Case 5: Expired Link
```bash
1. Request reset email
2. Wait > 1 hour
3. Click link
✅ Expected: Error "Link đã hết hạn"
```

---

## Configuration

### Environment Variables

No additional env vars needed. Uses existing:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Supabase Settings

**Auth → URL Configuration:**
- Site URL: `https://app.appejv.app`
- Redirect URLs: 
  - `https://app.appejv.app/auth/reset-password`
  - `http://localhost:3000/auth/reset-password` (dev)

**Auth → Email:**
- Enable email confirmations: ✅
- Secure email change: ✅
- Email rate limit: 4 emails/hour

---

## UI/UX Features

### Login Page
- ✅ Toggle between login and forgot password
- ✅ Smooth transition animation
- ✅ Clear "Quay lại đăng nhập" button
- ✅ Email validation
- ✅ Loading states

### Reset Password Page
- ✅ Beautiful gradient design
- ✅ Lock icon
- ✅ Password strength indicator (4 levels)
- ✅ Real-time requirements checklist
- ✅ Show/hide password toggles
- ✅ Confirm password validation
- ✅ Disabled submit until valid
- ✅ Loading states
- ✅ Success feedback

---

## Troubleshooting

### Issue: Email not received

**Possible causes:**
1. Email in spam folder
2. Invalid email address
3. Email rate limit exceeded
4. SMTP not configured

**Solutions:**
1. Check spam/junk folder
2. Verify email spelling
3. Wait 1 hour, try again
4. Check Supabase email settings

### Issue: Link not working

**Possible causes:**
1. Link expired (> 1 hour)
2. Link already used
3. Invalid redirect URL

**Solutions:**
1. Request new reset email
2. Check Supabase redirect URLs
3. Verify Site URL in Supabase settings

### Issue: Password not updating

**Possible causes:**
1. Session invalid
2. Network error
3. Supabase error

**Solutions:**
1. Click reset link again
2. Check internet connection
3. Check browser console for errors

---

## Related Files

- `app/auth/login/page.tsx` - Login with forgot password
- `app/auth/reset-password/page.tsx` - Reset password page
- `lib/supabase/client.ts` - Supabase client
- `components/ui/input.tsx` - Input component
- `components/ui/button.tsx` - Button component

---

## Future Enhancements

- [ ] SMS-based password reset
- [ ] Security questions
- [ ] 2FA integration
- [ ] Password history (prevent reuse)
- [ ] Account lockout after failed attempts
- [ ] Admin password reset
- [ ] Password expiration policy

---

**Status:** ✅ Fully implemented and tested  
**Last Updated:** 9/2/2026  
**Version:** 1.0
