# User Management - Complete ✅

## Tính năng đã thêm

Admin có thể quản lý người dùng đầy đủ:
1. ✅ Thêm người dùng mới (bao gồm khách hàng)
2. ✅ Sửa thông tin người dùng
3. ✅ Sửa role người dùng (bao gồm chuyển thành khách hàng)
4. ✅ Xóa người dùng

## Chi tiết tính năng

### 1. Thêm người dùng mới (Admin only)

**Vị trí**: Trang Users → Nút "+" ở header

**Form fields**:
- Email * (required)
- Mật khẩu * (required, min 6 ký tự)
- Họ và tên * (required)
- Số điện thoại (optional)
- Vai trò * (required): **Khách hàng** / Sale / Sale Admin / Admin

**Process**:
1. Admin nhấn nút "+" ở header
2. Modal hiện lên với form
3. Điền thông tin
4. Chọn role (mặc định: Sale)
5. Nhấn "Tạo người dùng"
6. System tạo auth user và profile
7. Redirect về danh sách users

**Validation**:
- Email phải hợp lệ
- Password tối thiểu 6 ký tự
- Full name không được để trống
- Role phải được chọn

### 2. Sửa thông tin người dùng (Admin only)

**Vị trí**: User Detail Page → Nút edit ở header

**Editable fields**:
- Họ và tên
- Số điện thoại
- Địa chỉ
- **Vai trò** (**Khách hàng** / Sale / Sale Admin / Admin)

**Process**:
1. Admin vào trang chi tiết user
2. Nhấn nút edit (icon bút)
3. Form chuyển sang edit mode
4. Sửa thông tin (bao gồm role)
5. Nhấn nút save (icon checkmark)
6. System cập nhật profile

**Role selector**:
- 4 buttons: Khách hàng (xanh lá), Sale (xanh dương), Sale Admin (cam), Admin (đỏ)
- Active button có màu tương ứng
- Inactive button có màu xám
- Layout: 2 hàng x 2 cột (flexWrap)

### 3. Chuyển đổi role

**Use cases**:
- Chuyển nhân viên thành khách hàng
- Chuyển khách hàng thành nhân viên
- Thăng cấp Sale → Sale Admin → Admin
- Hạ cấp Admin → Sale Admin → Sale

**Important notes**:
- Khi chuyển từ nhân viên sang khách hàng, user sẽ mất quyền truy cập sales dashboard
- Khi chuyển từ khách hàng sang nhân viên, user sẽ có quyền truy cập sales dashboard
- Role change có hiệu lực ngay lập tức
- User phải logout và login lại để thấy giao diện mới

### 4. Xóa người dùng (Admin only)

**Vị trí**: 
- User List → Nút "Xóa người dùng" trong card
- User Detail → Nút "Xóa người dùng" ở cuối trang

**Restrictions**:
- Admin không thể xóa chính mình
- Có confirm dialog trước khi xóa

**Process**:
1. Admin nhấn nút "Xóa người dùng"
2. Confirm dialog hiện lên
3. Nhấn "Xóa" để confirm
4. System xóa profile khỏi database
5. Redirect về danh sách users

## UI Components

### Add User Modal with Customer Role
```
┌─────────────────────────────────────┐
│  Thêm người dùng mới           [X]  │
├─────────────────────────────────────┤
│  Email *                            │
│  [email@example.com            ]    │
│                                     │
│  Mật khẩu *                         │
│  [••••••••                     ]    │
│                                     │
│  Họ và tên *                        │
│  [Nguyễn Văn A                 ]    │
│                                     │
│  Số điện thoại                      │
│  [0123456789                   ]    │
│                                     │
│  Vai trò *                          │
│  [Khách hàng]  [Sale]               │
│  [Sale Admin]  [Admin]              │
│                                     │
├─────────────────────────────────────┤
│  [Hủy]         [Tạo người dùng]     │
└─────────────────────────────────────┘
```

### Edit Role in User Detail (4 options)
```
┌─────────────────────────────────────┐
│  ← Chi tiết người dùng          ✓   │
├─────────────────────────────────────┤
│  [Profile Card]                     │
│                                     │
│  Họ và tên                          │
│  [Nguyễn Văn A                 ]    │
│                                     │
│  Số điện thoại                      │
│  [0123456789                   ]    │
│                                     │
│  Địa chỉ                            │
│  [Hà Nội                       ]    │
│                                     │
│  Vai trò                            │
│  [Khách hàng]  [Sale]               │
│  [Sale Admin]  [Admin]              │
│                                     │
│  [Hủy]                              │
└─────────────────────────────────────┘
```

## Role Colors

- **Khách hàng** (Customer): 🟢 Green (#10b981)
- **Sale**: 🔵 Blue (#175ead)
- **Sale Admin**: 🟠 Orange (#f59e0b)
- **Admin**: 🔴 Red (#ef4444)

## API Calls

### Create User
```typescript
// 1. Create auth user
const { data: authData, error: authError } = await supabase.auth.signUp({
  email: newUser.email,
  password: newUser.password,
  options: {
    data: {
      full_name: newUser.full_name,
      phone: newUser.phone,
    }
  }
})

// 2. Update profile with role
const { error: profileError } = await supabase
  .from('profiles')
  .update({
    full_name: newUser.full_name,
    phone: newUser.phone,
    role: newUser.role,
  })
  .eq('id', authData.user.id)
```

### Update User (including role)
```typescript
const { error } = await supabase
  .from('profiles')
  .update({
    full_name: editedData.full_name,
    phone: editedData.phone,
    address: editedData.address,
    role: editedData.role, // ← New: can update role
  })
  .eq('id', userId)
```

### Delete User
```typescript
const { error } = await supabase
  .from('profiles')
  .delete()
  .eq('id', userId)
```

## Permissions

### Admin
- ✅ View all users (including customers)
- ✅ Create new users (any role)
- ✅ Edit all user info (including role)
- ✅ Convert staff to customer and vice versa
- ✅ Delete users (except self)

### Sale Admin
- ✅ View team members only
- ❌ Cannot create users
- ❌ Cannot edit users
- ❌ Cannot delete users

### Sale
- ❌ Cannot access user management

## Testing

### Test Cases
1. ✅ Admin can create new customer
2. ✅ Admin can create new staff (sale/sale_admin/admin)
3. ✅ Admin can convert staff to customer
4. ✅ Admin can convert customer to staff
5. ✅ Admin can edit user role
6. ✅ Admin can edit user info
7. ✅ Admin can delete user (not self)
8. ✅ Admin cannot delete self
9. ✅ Sale Admin can only view team
10. ✅ Sale cannot access page
11. ✅ Form validation works
12. ✅ Modal opens/closes correctly
13. ✅ Role selector works correctly (4 options)
14. ✅ Role colors display correctly

### Sample Test Flow - Create Customer
```bash
# 1. Login as Admin
# 2. Go to Users page
# 3. Click "+" button
# 4. Fill form:
#    - Email: customer@example.com
#    - Password: 123456
#    - Name: Nguyễn Văn A
#    - Phone: 0123456789
#    - Role: Khách hàng (green button)
# 5. Click "Tạo người dùng"
# 6. Verify user appears in list with green badge
# 7. User can login and see customer dashboard
```

### Sample Test Flow - Convert to Customer
```bash
# 1. Login as Admin
# 2. Go to Users page
# 3. Click on a Sale user
# 4. Click edit button
# 5. Change role from "Sale" to "Khách hàng"
# 6. Click save
# 7. Verify role updated to Customer
# 8. User must logout and login again
# 9. User now sees customer dashboard instead of sales
```

## Files Modified
- `appejv-expo/app/(sales)/users/index.tsx` - Added create user modal
- `appejv-expo/app/(sales)/users/[id].tsx` - Added role editor

## Security Notes
- Only Admin can create/edit/delete users
- Password must be at least 6 characters
- Email must be unique (enforced by Supabase Auth)
- Cannot delete self (prevents lockout)
- Role changes take effect immediately

## Future Enhancements
- [ ] Assign manager when creating user
- [ ] Bulk user import
- [ ] User activity logs
- [ ] Password reset for users
- [ ] Disable user instead of delete
- [ ] Email verification
