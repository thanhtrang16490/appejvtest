# Tính năng Thông báo (Notifications)

## Tổng quan
Đã thêm hệ thống thông báo real-time cho ứng dụng Expo, tương tự như web app (appejv-app).

## Component

### NotificationButton
Component hiển thị icon thông báo với badge số lượng chưa đọc và modal danh sách thông báo.

**Location**: `src/components/NotificationButton.tsx`

**Props**:
- `userId?: string` - ID của user để fetch notifications

**Features**:
- ✅ Real-time updates với Supabase subscriptions
- ✅ Badge hiển thị số thông báo chưa đọc
- ✅ Modal full-screen với tabs (Tất cả / Chưa đọc)
- ✅ Mark as read khi click vào notification
- ✅ Mark all as read button
- ✅ Delete individual notification
- ✅ Icon và màu sắc theo type (success, warning, error, info)
- ✅ Icon theo category (order, inventory, customer, system)
- ✅ Format thời gian tự động (vừa xong, 5 phút trước, etc.)
- ✅ Empty states
- ✅ Loading states

## Database Schema

Bảng `notifications` cần có cấu trúc:

```sql
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null check (type in ('info', 'success', 'warning', 'error')),
  category text not null check (category in ('order', 'inventory', 'customer', 'system')),
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Index for performance
create index notifications_user_id_idx on notifications(user_id);
create index notifications_created_at_idx on notifications(created_at desc);
create index notifications_read_idx on notifications(read);

-- RLS policies
alter table notifications enable row level security;

create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on notifications for delete
  using (auth.uid() = user_id);
```

## Usage

### 1. Import component
```typescript
import NotificationButton from '../../src/components/NotificationButton'
import { useAuth } from '../../src/contexts/AuthContext'
```

### 2. Add to header
```typescript
const { user } = useAuth()

<View style={styles.headerActions}>
  <NotificationButton userId={user?.id} />
  <TouchableOpacity onPress={() => router.push('/menu')}>
    <Ionicons name="menu" size={24} />
  </TouchableOpacity>
</View>
```

### 3. Style header actions
```typescript
headerActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
}
```

## Notification Types

### Type (Màu sắc)
- `info` - Xanh dương (#175ead)
- `success` - Xanh lá (#10b981)
- `warning` - Vàng (#f59e0b)
- `error` - Đỏ (#ef4444)

### Category (Icon)
- `order` - 🛒 Cart icon
- `inventory` - 📦 Cube icon
- `customer` - 👥 People icon
- `system` - ℹ️ Info icon

## Creating Notifications

### From Backend/API
```typescript
await supabase
  .from('notifications')
  .insert({
    user_id: userId,
    title: 'Đơn hàng mới',
    message: 'Bạn có đơn hàng mới từ khách hàng ABC',
    type: 'info',
    category: 'order'
  })
```

### From Client (if allowed by RLS)
```typescript
import { supabase } from '../lib/supabase'

const createNotification = async (userId: string) => {
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title: 'Sản phẩm sắp hết',
      message: 'Sản phẩm XYZ chỉ còn 5 trong kho',
      type: 'warning',
      category: 'inventory'
    })
}
```

## Real-time Updates

Component tự động subscribe đến changes trong bảng notifications:

```typescript
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    () => {
      fetchNotifications() // Auto refresh
    }
  )
  .subscribe()
```

## UI/UX Features

### Badge
- Hiển thị số thông báo chưa đọc
- Màu đỏ (#ef4444)
- Hiển thị "9+" nếu > 9

### Modal
- Full-screen slide animation
- Gradient header (xanh dương)
- 2 tabs: Tất cả / Chưa đọc
- Pull-to-refresh (có thể thêm)
- Smooth scroll

### Notification Item
- Background khác nhau cho đã đọc/chưa đọc
- Icon với màu theo type
- Dot xanh cho chưa đọc
- Delete button (hiện khi hover/press)
- Relative time (vừa xong, 5 phút trước, etc.)

## Dependencies

Không cần thêm dependencies mới. Component sử dụng helper function tự viết để format time.

## Files Modified

1. `src/components/NotificationButton.tsx` - Component chính
2. `app/(sales)/dashboard.tsx` - Thêm notification button vào header

## Next Steps

### Tích hợp vào các trang khác
Thêm NotificationButton vào header của:
- ✅ Dashboard
- ⬜ Orders
- ⬜ Reports
- ⬜ Customers
- ⬜ Inventory

### Tạo notifications tự động
- Đơn hàng mới
- Sản phẩm sắp hết hàng
- Khách hàng mới
- Cập nhật đơn hàng
- Lỗi hệ thống

### Cải tiến
- Push notifications (Expo Notifications)
- Sound/vibration
- Deep linking đến chi tiết
- Filter theo category
- Search notifications
- Pagination cho danh sách dài

## Testing

1. Tạo notification test:
```sql
insert into notifications (user_id, title, message, type, category)
values (
  'your-user-id',
  'Test Notification',
  'This is a test message',
  'info',
  'system'
);
```

2. Kiểm tra:
- Badge hiển thị đúng số
- Click vào icon mở modal
- Tabs hoạt động
- Mark as read
- Delete notification
- Real-time updates

## Troubleshooting

### Không thấy notifications
- Kiểm tra RLS policies
- Kiểm tra userId đúng
- Kiểm tra console logs

### Real-time không hoạt động
- Kiểm tra Supabase realtime enabled
- Kiểm tra subscription channel
- Kiểm tra network connection

### Badge không update
- Kiểm tra fetchNotifications được gọi
- Kiểm tra state updates
- Kiểm tra useEffect dependencies
