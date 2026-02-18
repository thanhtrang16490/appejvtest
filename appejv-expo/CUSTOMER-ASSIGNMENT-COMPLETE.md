# Hoàn thiện chức năng gán khách hàng cho nhân viên

## Tổng quan
Đã kiểm tra và hoàn thiện chức năng gán khách hàng cho nhân viên bán hàng trong appejv-expo.

## Các thay đổi đã thực hiện

### 1. Trang gán khách hàng hàng loạt
**Files:** 
- `app/(sales)/customers/assign.tsx`
- `app/(sales-pages)/customers/assign.tsx`

**Cập nhật:**
- ✅ Chỉ hiển thị khách hàng chưa được gán (`assigned_to IS NULL`)
- ✅ Cho phép chọn nhiều khách hàng cùng lúc
- ✅ Gán hàng loạt cho một nhân viên
- ✅ Admin thấy tất cả nhân viên sale
- ✅ Sale_admin chỉ thấy nhân viên trong team của mình

**Trước:**
```typescript
const { data: customersData } = await supabase
  .from('customers')
  .select('*')
  .order('full_name', { ascending: true })
```

**Sau:**
```typescript
const { data: customersData } = await supabase
  .from('customers')
  .select('*')
  .is('assigned_to', null)  // Chỉ lấy khách hàng chưa gán
  .order('full_name', { ascending: true })
```

### 2. Trang chi tiết khách hàng
**Files:**
- `app/(sales)/customers/[id].tsx`
- `app/(sales-pages)/customers/[id].tsx`

**Chức năng có sẵn:**
- ✅ Admin và sale_admin có thể gán lại khách hàng cho nhân viên khác
- ✅ Dropdown hiển thị danh sách nhân viên sale
- ✅ Sale_admin chỉ thấy nhân viên trong team
- ✅ Admin thấy tất cả nhân viên sale
- ✅ Có option "Chưa gán" để bỏ gán

### 3. Danh sách khách hàng
**Files:**
- `app/(sales)/customers/index.tsx`
- `app/(sales-pages)/customers/index.tsx`

**Chức năng có sẵn:**
- ✅ Hiển thị thông tin nhân viên phụ trách
- ✅ Tab "Của tôi": Khách hàng được gán cho user hiện tại
- ✅ Tab "Team": Khách hàng của team members
- ✅ Tab "Tất cả": Tất cả khách hàng (admin only)

### 4. Thêm khách hàng mới
**Files:**
- `app/(sales)/customers/add.tsx`
- `app/(sales-pages)/customers/add.tsx`

**Chức năng có sẵn:**
- ✅ Tự động gán khách hàng mới cho người tạo
- ✅ Set `assigned_to` = user ID khi tạo

## Quy trình gán khách hàng

### Cách 1: Gán hàng loạt (Assign page)
1. Admin/Sale_admin vào menu "Gán khách hàng"
2. Chọn nhân viên muốn gán
3. Chọn một hoặc nhiều khách hàng chưa được gán
4. Nhấn "Gán X khách hàng"

### Cách 2: Gán từng khách hàng (Detail page)
1. Admin/Sale_admin vào chi tiết khách hàng
2. Nhấn "Sửa"
3. Chọn "Sale phụ trách" từ dropdown
4. Nhấn "Lưu"

### Cách 3: Tự động khi tạo mới
- Khách hàng mới tự động được gán cho người tạo

## Phân quyền

### Admin
- Xem tất cả khách hàng
- Gán khách hàng cho bất kỳ nhân viên sale nào
- Bỏ gán khách hàng

### Sale_admin
- Xem khách hàng của mình và team
- Gán khách hàng cho nhân viên trong team
- Bỏ gán khách hàng của team

### Sale
- Xem khách hàng được gán cho mình
- Không thể gán/bỏ gán khách hàng

## Database Schema

### Table: customers
```sql
- id: uuid (PK)
- full_name: text
- phone: text
- email: text
- address: text
- assigned_to: uuid (FK -> profiles.id)
- created_at: timestamp
```

### Foreign Key
```sql
customers.assigned_to -> profiles.id
```

## Trạng thái hoàn thành
✅ Chức năng gán khách hàng đã hoàn thiện
✅ Chỉ hiển thị khách hàng chưa gán trong trang assign
✅ Có thể gán lại khách hàng trong trang chi tiết
✅ Phân quyền đúng theo role
✅ UI/UX rõ ràng và dễ sử dụng
