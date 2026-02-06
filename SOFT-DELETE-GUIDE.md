# Hướng dẫn Soft Delete

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
