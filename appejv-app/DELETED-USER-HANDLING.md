# Deleted User Handling - Xử lý người dùng bị xóa

## Tổng quan

Hệ thống tự động phát hiện và xử lý trường hợp người dùng bị xóa hoặc vô hiệu hóa, đảm bảo an toàn và trải nghiệm người dùng tốt.

## Các trường hợp xử lý

### 1. User bị xóa khỏi database
- Profile trong bảng `profiles` bị xóa
- Auth user vẫn tồn tại trong Supabase Auth

### 2. User bị vô hiệu hóa
- Profile tồn tại nhưng không có quyền truy cập
- Session không hợp lệ

## Cơ chế hoạt động

### A. Middleware Level (Server-side)

**File:** `lib/supabase/middleware.ts`

```typescript
// Kiểm tra profile khi user đã authenticated
if (user) {
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user.id)
        .single()

    // Nếu profile không tồn tại -> user bị xóa
    if (!profile || profileError) {
        // Log audit event
        logAuditEvent({
            eventType: AuditEventType.UNAUTHORIZED_ACCESS,
            userId: user.id,
            errorMessage: 'User profile deleted or not found'
        })

        // Sign out user
        await supabase.auth.signOut()

        // Redirect với message
        return NextResponse.redirect('/auth/login?message=account_deleted')
    }
}
```

**Khi nào chạy:**
- Mỗi request đến protected routes (`/customer/*`, `/sales/*`)
- Trước khi render page

**Kết quả:**
- Auto logout
- Redirect về login page với thông báo
- Clear tất cả cookies

### B. API Client Level (Client-side)

**File:** `lib/api/client.ts`

```typescript
// Trong request method
if (response.status === 401 || response.status === 403) {
    const isValid = await validateUserSession()
    
    if (!isValid) {
        // User was deleted - auto logout
        return { error: 'User account deleted or disabled' }
    }
}
```

**Khi nào chạy:**
- Khi API trả về 401 Unauthorized
- Khi API trả về 403 Forbidden

**Kết quả:**
- Kiểm tra session validity
- Nếu user bị xóa -> auto logout và redirect

### C. Session Validation (Utility)

**File:** `lib/auth/session-handler.ts`

#### 1. `validateUserSession()`
Kiểm tra session có còn hợp lệ không

```typescript
const isValid = await validateUserSession()
if (!isValid) {
    // User was deleted or session invalid
}
```

#### 2. `handleDeletedUser()`
Xử lý khi phát hiện user bị xóa

```typescript
await handleDeletedUser()
// -> Sign out
// -> Show toast error
// -> Redirect to login
```

#### 3. `withSessionValidation()`
Wrapper cho API calls với auto validation

```typescript
const data = await withSessionValidation(async () => {
    return await someApiCall()
})
```

## Flow xử lý

### Scenario 1: User đang dùng app, admin xóa account

```
1. User đang ở trang /sales/orders
2. Admin xóa profile của user trong database
3. User click vào một link hoặc refresh page
4. Middleware chạy:
   - Phát hiện profile không tồn tại
   - Sign out user
   - Redirect về /auth/login?message=account_deleted
5. Login page hiển thị:
   "Tài khoản của bạn đã bị xóa hoặc vô hiệu hóa. 
    Vui lòng liên hệ quản trị viên."
```

### Scenario 2: User đang dùng app, gọi API

```
1. User đang ở trang /sales/customers
2. Admin xóa profile của user
3. User click "Tạo khách hàng mới"
4. API call được gửi đi
5. API trả về 401 Unauthorized
6. API Client:
   - Phát hiện 401
   - Validate session
   - Phát hiện profile không tồn tại
   - Call handleDeletedUser()
   - Auto logout và redirect
7. Toast hiển thị thông báo lỗi
```

### Scenario 3: User refresh page

```
1. User refresh page /customer/dashboard
2. Middleware chạy trước khi render
3. Kiểm tra user và profile
4. Nếu profile bị xóa:
   - Không render page
   - Auto logout
   - Redirect ngay lập tức
```

## Login Page Message

**File:** `app/auth/login/page.tsx`

```typescript
useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'account_deleted') {
        toast.error('Tài khoản của bạn đã bị xóa hoặc vô hiệu hóa. 
                     Vui lòng liên hệ quản trị viên.')
    }
}, [searchParams])
```

## Audit Logging

Mọi trường hợp phát hiện user bị xóa đều được log:

```typescript
logAuditEvent({
    eventType: AuditEventType.UNAUTHORIZED_ACCESS,
    userId: user.id,
    userEmail: user.email,
    ipAddress: getClientIP(request),
    resource: request.nextUrl.pathname,
    success: false,
    errorMessage: 'User profile deleted or not found',
    metadata: { profileError: profileError?.message }
})
```

## Testing

### Test Case 1: Xóa user trong database

```sql
-- Xóa profile
DELETE FROM profiles WHERE id = 'user-id';

-- User sẽ bị logout tự động khi:
-- 1. Refresh page
-- 2. Navigate to another page
-- 3. Call API
```

### Test Case 2: Simulate 401 response

```typescript
// Mock API response
fetch.mockResolvedValue({
    status: 401,
    json: async () => ({ error: 'Unauthorized' })
})

// Kết quả: Auto logout và redirect
```

## Best Practices

### 1. Không xóa trực tiếp trong Supabase Auth
```typescript
// ❌ BAD: Chỉ xóa auth user
await supabase.auth.admin.deleteUser(userId)

// ✅ GOOD: Xóa profile trước (có trigger xóa auth user)
await supabase.from('profiles').delete().eq('id', userId)
```

### 2. Soft delete thay vì hard delete
```typescript
// ✅ BETTER: Vô hiệu hóa thay vì xóa
await supabase
    .from('profiles')
    .update({ is_active: false, deleted_at: new Date() })
    .eq('id', userId)
```

### 3. Thông báo cho user trước khi xóa
```typescript
// Gửi email thông báo
await sendEmail({
    to: user.email,
    subject: 'Tài khoản sẽ bị xóa',
    body: 'Tài khoản của bạn sẽ bị xóa sau 7 ngày...'
})
```

## Security Considerations

1. **Immediate logout**: User bị logout ngay lập tức khi phát hiện
2. **Clear cookies**: Tất cả cookies được xóa
3. **Audit logging**: Mọi truy cập bất thường được log
4. **No data exposure**: Không hiển thị thông tin nhạy cảm trong error message

## Troubleshooting

### Issue: User không bị logout sau khi xóa

**Nguyên nhân:**
- Middleware không chạy (static page)
- Cache browser

**Giải pháp:**
```typescript
// Force revalidation
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

### Issue: Toast không hiển thị

**Nguyên nhân:**
- Redirect quá nhanh
- Sonner chưa mount

**Giải pháp:**
```typescript
// Delay redirect một chút
setTimeout(() => {
    window.location.href = '/auth/login?message=account_deleted'
}, 100)
```

## Related Files

- `lib/supabase/middleware.ts` - Middleware validation
- `lib/api/client.ts` - API error handling
- `lib/auth/session-handler.ts` - Session utilities
- `app/auth/login/page.tsx` - Login with message
- `lib/security/audit.ts` - Audit logging

---

**Last Updated:** 9/2/2026  
**Status:** ✅ Implemented and tested
