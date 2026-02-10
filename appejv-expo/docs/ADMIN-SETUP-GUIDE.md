# Hướng dẫn cài đặt tính năng Admin

## 🚀 Bước 1: Cài đặt dependencies

```bash
cd appejv-expo
npm install
```

Các package mới đã được thêm:
- `expo-file-system`: Để đọc/ghi file
- `expo-sharing`: Để chia sẻ file export

## 🗄️ Bước 2: Tạo table Categories trong Supabase

### Cách 1: Sử dụng Supabase Dashboard

1. Truy cập Supabase Dashboard: https://app.supabase.com
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Copy nội dung file `migrations/create_categories_table.sql`
5. Paste vào editor và nhấn **Run**

### Cách 2: Sử dụng Supabase CLI

```bash
# Nếu đã cài Supabase CLI
supabase db push migrations/create_categories_table.sql
```

### Cách 3: Chạy trực tiếp từ code

```typescript
// Chạy một lần trong app
import { supabase } from './src/lib/supabase'

const createCategoriesTable = async () => {
  const sql = `
    -- Copy nội dung từ migrations/create_categories_table.sql
  `
  
  const { error } = await supabase.rpc('exec_sql', { sql })
  if (error) console.error('Error:', error)
  else console.log('Categories table created!')
}
```

## 📱 Bước 3: Chạy app

```bash
# Clear cache và restart
npm run reset

# Hoặc
npx expo start --clear
```

## 🔐 Bước 4: Test với tài khoản Admin

### Tạo tài khoản Admin (nếu chưa có)

```sql
-- Trong Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Đăng nhập và test

1. Mở app
2. Đăng nhập với tài khoản admin
3. Nhấn icon **Menu** ở góc trên
4. Kiểm tra các tính năng mới:
   - ✅ Phân tích dữ liệu
   - ✅ Quản lý danh mục
   - ✅ Xuất dữ liệu
   - ✅ Cài đặt hệ thống

## 🎯 Các tính năng mới

### 1. Analytics (Phân tích dữ liệu)
**Đường dẫn:** Menu > Phân tích dữ liệu

**Chức năng:**
- Xem doanh thu theo thời gian (7 ngày/tháng/năm)
- So sánh với kỳ trước
- Top sản phẩm bán chạy
- Thống kê đơn hàng và khách hàng

**Test:**
```typescript
1. Chọn "Tháng này"
2. Kiểm tra metrics hiển thị đúng
3. Xem % tăng/giảm so với tháng trước
4. Scroll xuống xem top products
```

### 2. Categories (Quản lý danh mục)
**Đường dẫn:** Menu > Quản lý danh mục

**Chức năng:**
- Xem danh sách danh mục
- Tìm kiếm
- Tạo mới
- Chỉnh sửa
- Xóa

**Test:**
```typescript
1. Nhấn "+" để tạo danh mục mới
2. Nhập tên: "Test Category"
3. Nhập mô tả: "This is a test"
4. Nhấn "Tạo mới"
5. Kiểm tra danh mục xuất hiện trong list
6. Nhấn icon bút để edit
7. Nhấn icon thùng rác để xóa
```

### 3. Export Data (Xuất dữ liệu)
**Đường dẫn:** Menu > Xuất dữ liệu

**Chức năng:**
- Xuất đơn hàng
- Xuất khách hàng
- Xuất sản phẩm
- Xuất tất cả

**Test:**
```typescript
1. Nhấn "Đơn hàng"
2. Chờ export hoàn tất
3. Chọn app để chia sẻ (Email, Drive, etc.)
4. Mở file CSV bằng Excel
5. Kiểm tra tiếng Việt hiển thị đúng
```

### 4. Settings (Cài đặt hệ thống)
**Đường dẫn:** Menu > Cài đặt hệ thống (Admin only)

**Chức năng:**
- Thông tin công ty
- Cài đặt kinh doanh
- Thông báo
- Quy trình đơn hàng

**Test:**
```typescript
1. Cập nhật tên công ty
2. Thay đổi thuế VAT
3. Bật/tắt thông báo
4. Nhấn "Lưu cài đặt"
5. Kiểm tra thông báo thành công
```

## 🐛 Troubleshooting

### Lỗi: "Table categories does not exist"
**Giải pháp:** Chạy migration SQL trong Supabase Dashboard

### Lỗi: "Permission denied for table categories"
**Giải pháp:** Kiểm tra RLS policies đã được tạo đúng

### Lỗi: "Sharing is not available"
**Giải pháp:** 
- Kiểm tra đã cài `expo-sharing`
- Test trên thiết bị thật (không phải simulator)

### Lỗi: "Cannot read property 'role' of null"
**Giải pháp:** 
- Đảm bảo đã đăng nhập
- Kiểm tra profile có role = 'admin' hoặc 'sale_admin'

### Export CSV không hiển thị tiếng Việt
**Giải pháp:**
- File đã có BOM UTF-8
- Mở bằng Excel: Data > From Text/CSV > chọn UTF-8
- Hoặc dùng Google Sheets (tự động detect UTF-8)

## 📊 Kiểm tra dữ liệu

### Kiểm tra categories
```sql
SELECT * FROM categories;
```

### Kiểm tra permissions
```sql
SELECT * FROM profiles WHERE role IN ('admin', 'sale_admin');
```

### Kiểm tra orders cho analytics
```sql
SELECT 
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value
FROM orders
WHERE status = 'completed'
AND created_at >= NOW() - INTERVAL '30 days';
```

## 🎨 Customization

### Thay đổi màu sắc
Tất cả màu được định nghĩa inline trong styles. Tìm và thay thế:
- Primary: `#175ead`
- Success: `#10b981`
- Warning: `#f59e0b`
- Danger: `#ef4444`

### Thêm field vào Settings
Edit `app/(sales)/settings.tsx`:
```typescript
const [settings, setSettings] = useState({
  // ... existing fields
  newField: 'default value'
})
```

### Thêm export format mới
Edit `src/lib/export.ts`:
```typescript
export const exportToExcel = async (data: any) => {
  // Implement Excel export
}
```

## 📝 Next Steps

### Tính năng có thể thêm:

1. **Bulk Operations**
   - Bulk delete orders
   - Bulk update prices
   - Bulk assign customers

2. **Advanced Charts**
   - Line charts cho revenue
   - Pie charts cho categories
   - Bar charts cho sales by user

3. **Scheduled Reports**
   - Daily/weekly/monthly reports
   - Email automation
   - PDF generation

4. **Settings Database**
   - Lưu settings vào Supabase
   - Sync across devices
   - Version history

## ✅ Checklist

- [ ] Cài đặt dependencies
- [ ] Tạo table categories
- [ ] Test với tài khoản admin
- [ ] Test analytics
- [ ] Test categories CRUD
- [ ] Test export CSV
- [ ] Test settings
- [ ] Kiểm tra permissions
- [ ] Test trên iOS
- [ ] Test trên Android

## 🎉 Hoàn thành!

Sau khi hoàn tất các bước trên, app của bạn đã có đầy đủ tính năng admin:
- ✅ Dashboard analytics
- ✅ Categories management
- ✅ Data export
- ✅ System settings

Chúc bạn thành công! 🚀
