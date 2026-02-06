# Hướng dẫn Soft Delete

## ✅ Đã triển khai

Hệ thống soft delete đã được triển khai đầy đủ cho các bảng:
- **products** - Sản phẩm
- **customers** - Khách hàng  
- **orders** - Đơn hàng
- **profiles** - Hồ sơ người dùng

## 🔧 Cách hoạt động

### 1. Database Schema
Mỗi bảng có thêm cột `deleted_at`:
```sql
deleted_at TIMESTAMPTZ DEFAULT NULL
```

- `NULL` = bản ghi đang hoạt động
- `NOT NULL` = bản ghi đã bị xóa (soft delete)

### 2. Server Actions (app/sales/actions.ts)

**Xóa khách hàng:**
```typescript
export async function deleteCustomer(id: string) {
    // Soft delete: set deleted_at timestamp
    const { error } = await (supabase.from('customers') as any)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
    
    return { success: !error, error: error?.message }
}
```

**Xóa sản phẩm:**
```typescript
export async function deleteProduct(id: number) {
    // Soft delete: set deleted_at timestamp
    const { error } = await (supabase.from('products') as any)
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
    
    return { success: !error, error: error?.message }
}
```

### 3. Queries - Luôn filter deleted_at

**Tất cả queries phải thêm `.is('deleted_at', null)`:**

**Customers:**
```typescript
// app/sales/customers/page.tsx
const { data } = await supabase
    .from('customers')
    .select('*')
    .is('deleted_at', null) // ✅ Filter soft-deleted
    .order('name')

// app/sales/customers/[id]/page.tsx
const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null) // ✅ Filter soft-deleted
    .single()
```

**Products:**
```typescript
// app/sales/inventory/page.tsx
const { data } = await supabase
    .from('products')
    .select('*')
    .is('deleted_at', null) // ✅ Filter soft-deleted
    .order('name')

// app/san-pham/page.tsx (public)
let query = supabase
    .from('products')
    .select('*')
    .is('deleted_at', null) // ✅ Filter soft-deleted

// app/san-pham/[slug]/page.tsx (public)
const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null) // ✅ Filter soft-deleted
    .single()
```

**Orders:**
```typescript
// app/sales/orders/page.tsx
let query = supabase
    .from('orders')
    .select('*, customers(name), profiles!orders_sale_id_fkey(full_name)')
    .is('deleted_at', null) // ✅ Filter soft-deleted
```

## 📋 Checklist triển khai

### ✅ Database
- [x] Thêm cột `deleted_at` vào products, customers, orders, profiles
- [x] Tạo helper functions: `soft_delete_*`, `restore_*`
- [x] Tạo views: `active_products`, `active_customers`, `active_orders`, `active_profiles`
- [x] Tạo triggers ngăn update records đã xóa
- [x] Tạo indexes cho `deleted_at`
- [x] Tạo cleanup functions

### ✅ Server Actions
- [x] `deleteCustomer()` - Sử dụng soft delete
- [x] `deleteProduct()` - Sử dụng soft delete
- [x] Loại bỏ hard delete logic

### ✅ Queries
- [x] `app/sales/customers/page.tsx` - Filter deleted_at
- [x] `app/sales/customers/[id]/page.tsx` - Filter deleted_at
- [x] `app/sales/inventory/page.tsx` - Filter deleted_at
- [x] `app/sales/inventory/[id]/page.tsx` - Filter deleted_at
- [x] `app/san-pham/page.tsx` - Filter deleted_at
- [x] `app/san-pham/[slug]/page.tsx` - Filter deleted_at
- [x] `app/sales/orders/page.tsx` - Filter deleted_at

## 🎯 Lợi ích

1. **An toàn dữ liệu**: Không mất dữ liệu vĩnh viễn
2. **Khôi phục dễ dàng**: Có thể restore bằng SQL
3. **Audit trail**: Biết được khi nào bản ghi bị xóa
4. **Compliance**: Đáp ứng yêu cầu lưu trữ dữ liệu

## 🔄 Khôi phục dữ liệu

### Khôi phục thủ công (SQL)
```sql
-- Khôi phục 1 khách hàng
UPDATE customers 
SET deleted_at = NULL 
WHERE id = 123;

-- Khôi phục 1 sản phẩm
UPDATE products 
SET deleted_at = NULL 
WHERE id = 456;

-- Xem các bản ghi đã xóa
SELECT * FROM customers WHERE deleted_at IS NOT NULL;
SELECT * FROM products WHERE deleted_at IS NOT NULL;
```

### Sử dụng helper functions
```sql
-- Khôi phục khách hàng
SELECT restore_customer(123);

-- Khôi phục sản phẩm
SELECT restore_product(456);
```

## 🧹 Dọn dẹp dữ liệu cũ

### Xóa vĩnh viễn records đã xóa > 90 ngày
```sql
-- Cleanup customers
SELECT cleanup_old_deleted_customers();

-- Cleanup products
SELECT cleanup_old_deleted_products();

-- Cleanup orders
SELECT cleanup_old_deleted_orders();

-- Cleanup profiles
SELECT cleanup_old_deleted_profiles();
```

### Setup Cron Job (Optional)
Trong Supabase Dashboard > Database > Cron Jobs:
```sql
-- Chạy cleanup mỗi tuần
SELECT cron.schedule(
    'cleanup-deleted-records',
    '0 0 * * 0', -- Chủ nhật hàng tuần
    $$
    SELECT cleanup_old_deleted_customers();
    SELECT cleanup_old_deleted_products();
    SELECT cleanup_old_deleted_orders();
    SELECT cleanup_old_deleted_profiles();
    $$
);
```

## 🔍 Views có sẵn

### active_products
Chỉ sản phẩm đang hoạt động:
```sql
SELECT * FROM active_products;
```

### active_customers
Chỉ khách hàng đang hoạt động:
```sql
SELECT * FROM active_customers;
```

### active_orders
Chỉ đơn hàng đang hoạt động:
```sql
SELECT * FROM active_orders;
```

### active_profiles
Chỉ profiles đang hoạt động:
```sql
SELECT * FROM active_profiles;
```

## ⚠️ Lưu ý quan trọng

### 1. Luôn filter deleted_at trong queries
```typescript
// ❌ SAI - Không filter
const { data } = await supabase.from('customers').select('*')

// ✅ ĐÚNG - Filter soft-deleted
const { data } = await supabase
    .from('customers')
    .select('*')
    .is('deleted_at', null)
```

### 2. Không hard delete trừ khi cần thiết
```typescript
// ❌ Tránh hard delete
await supabase.from('customers').delete().eq('id', id)

// ✅ Sử dụng soft delete
await supabase.from('customers')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
```

### 3. Triggers tự động
Database có triggers ngăn update records đã xóa:
```sql
-- Trigger sẽ raise exception nếu cố update record đã xóa
-- Phải restore trước khi update
```

## 🐛 Troubleshooting

### Vẫn thấy records đã xóa?
Kiểm tra query có filter `deleted_at`:
```typescript
.is('deleted_at', null)
```

### Không thể update record?
Record có thể đã bị soft delete. Restore trước:
```sql
UPDATE customers SET deleted_at = NULL WHERE id = 123;
```

### Muốn xem records đã xóa?
```sql
SELECT * FROM customers WHERE deleted_at IS NOT NULL;
```

## 📊 Thống kê

### Đếm records active vs deleted
```sql
-- Customers
SELECT 
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as active,
    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted
FROM customers;

-- Products
SELECT 
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as active,
    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted
FROM products;
```

## ✅ Kết luận

Soft delete đã được triển khai đầy đủ:
- ✅ Database schema updated
- ✅ Server actions sử dụng soft delete
- ✅ Tất cả queries filter `deleted_at`
- ✅ Helper functions và views
- ✅ Triggers bảo vệ data integrity

Hệ thống giờ đây an toàn hơn và dữ liệu có thể khôi phục khi cần!

## Tổng quan

Soft delete cho phép "xóa" dữ liệu mà không thực sự xóa khỏi database. Dữ liệu được đánh dấu là đã xóa bằng timestamp `deleted_at`.

## Lợi ích

1. **Audit Trail**: Giữ lại lịch sử đầy đủ
2. **Data Recovery**: Khôi phục dễ dàng nếu xóa nhầm
3. **Referential Integrity**: Tránh lỗi foreign key
4. **Compliance**: Đáp ứng yêu cầu pháp lý
5. **Analytics**: Phân tích dữ liệu lịch sử

## Các bảng có Soft Delete

| Bảng | Mục đích | Ví dụ |
|------|----------|-------|
| `products` | Sản phẩm ngừng kinh doanh | Sản phẩm hết hàng vĩnh viễn |
| `customers` | Khách hàng không hoạt động | Khách hàng chuyển đi |
| `profiles` | User bị vô hiệu hóa | Nhân viên nghỉ việc |
| `orders` | Đơn hàng bị xóa | Đơn spam, test |

## Cách sử dụng

### 1. Query dữ liệu (Chỉ lấy active)

```typescript
// ❌ SAI - Lấy cả deleted
const { data } = await supabase
    .from('products')
    .select('*')

// ✅ ĐÚNG - Chỉ lấy active
const { data } = await supabase
    .from('products')
    .select('*')
    .is('deleted_at', null)

// Hoặc dùng view
const { data } = await supabase
    .from('active_products')
    .select('*')
```

### 2. Soft Delete (Đánh dấu xóa)

```typescript
// Cách 1: Update trực tiếp
const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', productId)

// Cách 2: Dùng function (khuyến nghị)
const { data, error } = await supabase
    .rpc('soft_delete_product', { p_product_id: productId })
```

### 3. Restore (Khôi phục)

```typescript
// Cách 1: Update trực tiếp
const { error } = await supabase
    .from('products')
    .update({ deleted_at: null })
    .eq('id', productId)

// Cách 2: Dùng function (khuyến nghị)
const { data, error } = await supabase
    .rpc('restore_product', { p_product_id: productId })
```

### 4. Hard Delete (Xóa vĩnh viễn)

```typescript
// Chỉ admin mới được hard delete
const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
```

## Helper Functions

### Products

```sql
-- Soft delete
SELECT soft_delete_product(123);

-- Restore
SELECT restore_product(123);
```

### Customers

```sql
-- Soft delete
SELECT soft_delete_customer(456);

-- Restore
SELECT restore_customer(456);
```

### Profiles

```sql
-- Soft delete (disable user)
SELECT soft_delete_profile('uuid-here');

-- Restore (enable user)
SELECT restore_profile('uuid-here');
```

## Views cho Active Records

```sql
-- Chỉ lấy products active
SELECT * FROM active_products;

-- Chỉ lấy customers active
SELECT * FROM active_customers;

-- Chỉ lấy profiles active
SELECT * FROM active_profiles;

-- Chỉ lấy orders active
SELECT * FROM active_orders;
```

## Cleanup Old Deleted Records

```sql
-- Xóa vĩnh viễn products đã soft delete > 90 ngày
SELECT cleanup_old_deleted_products(90);

-- Xóa vĩnh viễn customers đã soft delete > 90 ngày
SELECT cleanup_old_deleted_customers(90);
```

## Best Practices

### 1. Luôn filter deleted_at trong queries

```typescript
// ❌ BAD
const products = await supabase.from('products').select('*')

// ✅ GOOD
const products = await supabase
    .from('products')
    .select('*')
    .is('deleted_at', null)
```

### 2. Dùng views cho đơn giản

```typescript
// ✅ BETTER
const products = await supabase
    .from('active_products')
    .select('*')
```

### 3. Hiển thị trạng thái trong UI

```typescript
// Hiển thị badge "Đã xóa" cho deleted records
{product.deleted_at && (
    <Badge variant="destructive">Đã xóa</Badge>
)}
```

### 4. Thêm filter "Hiển thị đã xóa"

```typescript
const [showDeleted, setShowDeleted] = useState(false)

const query = supabase.from('products').select('*')

if (!showDeleted) {
    query.is('deleted_at', null)
}
```

### 5. Confirm trước khi hard delete

```typescript
const handleHardDelete = async () => {
    if (!confirm('Xóa vĩnh viễn? Không thể khôi phục!')) {
        return
    }
    
    await supabase.from('products').delete().eq('id', id)
}
```

## Cập nhật Code hiện tại

### 1. Products (Inventory)

```typescript
// File: app/sales/inventory/page.tsx

// Thêm filter
const fetchProducts = async () => {
    const { data } = await supabase
        .from('products')
        .select('*')
        .is('deleted_at', null) // ← Thêm dòng này
        .order('name')
    
    setProducts(data || [])
}

// Soft delete thay vì hard delete
const handleDelete = async (id: number) => {
    await supabase.rpc('soft_delete_product', { p_product_id: id })
    fetchProducts()
}
```

### 2. Customers

```typescript
// File: app/sales/customers/page.tsx

// Thêm filter
const fetchCustomers = async () => {
    const { data } = await supabase
        .from('customers')
        .select('*')
        .is('deleted_at', null) // ← Thêm dòng này
        .order('name')
    
    setCustomers(data || [])
}

// Soft delete
const handleDelete = async (id: number) => {
    await supabase.rpc('soft_delete_customer', { p_customer_id: id })
    fetchCustomers()
}
```

### 3. Orders

```typescript
// File: app/sales/orders/page.tsx

// Thêm filter
const fetchOrders = async () => {
    const { data } = await supabase
        .from('orders')
        .select('*')
        .is('deleted_at', null) // ← Thêm dòng này
        .order('created_at', { ascending: false })
    
    setOrders(data || [])
}
```

### 4. Users (Profiles)

```typescript
// File: app/sales/users/page.tsx

// Thêm filter
const fetchUsers = async () => {
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .is('deleted_at', null) // ← Thêm dòng này
        .order('full_name')
    
    setUsers(data || [])
}

// Disable user (soft delete)
const handleDisableUser = async (userId: string) => {
    await supabase.rpc('soft_delete_profile', { p_user_id: userId })
    fetchUsers()
}
```

## UI Components

### Delete Button với Restore

```typescript
function DeleteButton({ item, onDelete, onRestore }) {
    if (item.deleted_at) {
        return (
            <Button 
                variant="outline" 
                onClick={() => onRestore(item.id)}
            >
                <RotateCcw className="w-4 h-4 mr-2" />
                Khôi phục
            </Button>
        )
    }
    
    return (
        <Button 
            variant="destructive" 
            onClick={() => onDelete(item.id)}
        >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
        </Button>
    )
}
```

### Filter Toggle

```typescript
function DataTable() {
    const [showDeleted, setShowDeleted] = useState(false)
    
    return (
        <>
            <div className="flex items-center gap-2 mb-4">
                <Switch 
                    checked={showDeleted}
                    onCheckedChange={setShowDeleted}
                />
                <Label>Hiển thị đã xóa</Label>
            </div>
            
            {/* Table content */}
        </>
    )
}
```

## Migration Checklist

- [ ] Chạy migration: `supabase-add-soft-delete-migration.sql`
- [ ] Verify columns added: `deleted_at` trong 4 bảng
- [ ] Test soft delete functions
- [ ] Test restore functions
- [ ] Cập nhật tất cả queries thêm `.is('deleted_at', null)`
- [ ] Thêm UI cho restore
- [ ] Thêm filter "Hiển thị đã xóa"
- [ ] Test end-to-end
- [ ] Document cho team

## Troubleshooting

### Lỗi: Vẫn thấy deleted records

**Nguyên nhân**: Query chưa filter `deleted_at`

**Giải pháp**: Thêm `.is('deleted_at', null)` vào query

### Lỗi: Không restore được

**Nguyên nhân**: Trigger prevent update

**Giải pháp**: Dùng function `restore_*` thay vì update trực tiếp

### Lỗi: Foreign key constraint

**Nguyên nhân**: Đang hard delete record có liên kết

**Giải pháp**: Dùng soft delete thay vì hard delete

## Monitoring

```sql
-- Xem số lượng deleted records
SELECT 
    'products' as table_name,
    COUNT(*) as deleted_count
FROM products 
WHERE deleted_at IS NOT NULL

UNION ALL

SELECT 
    'customers',
    COUNT(*)
FROM customers 
WHERE deleted_at IS NOT NULL

UNION ALL

SELECT 
    'profiles',
    COUNT(*)
FROM profiles 
WHERE deleted_at IS NOT NULL;

-- Xem deleted records cũ nhất
SELECT 
    'products' as table_name,
    id,
    name,
    deleted_at,
    NOW() - deleted_at as age
FROM products 
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at ASC
LIMIT 10;
```

---

**Ngày tạo**: 2026-02-07
**Version**: 1.0.0
