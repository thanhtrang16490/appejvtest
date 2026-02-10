# Triển khai Tính năng Customer còn thiếu

## Tổng quan
Tài liệu này mô tả cách triển khai các tính năng còn thiếu cho vai trò Customer.

---

## 1. CHI TIẾT SẢN PHẨM ✅

### Tạo trang chi tiết sản phẩm
**File:** `app/(customer)/products/[id].tsx`

**Tính năng:**
- Hiển thị ảnh sản phẩm lớn
- Thông tin chi tiết (tên, giá, mô tả, tồn kho)
- Nút thêm vào giỏ hàng
- Sản phẩm liên quan
- Đánh giá và nhận xét

**Database cần:**
- Bảng `products` đã có
- Cần thêm bảng `product_reviews` (optional)

---

## 2. GIỎ HÀNG PERSISTENT ✅

### Lưu giỏ hàng vào AsyncStorage
**File:** `src/lib/cart-storage.ts`

**Tính năng:**
- Lưu giỏ hàng khi thêm/xóa sản phẩm
- Khôi phục giỏ hàng khi mở app
- Đồng bộ với server (optional)
- Clear cart sau khi đặt hàng thành công

**Implementation:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

const CART_KEY = '@appejv_cart'

export const cartStorage = {
  async save(cart: any[]) {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart))
  },
  
  async load(): Promise<any[]> {
    const data = await AsyncStorage.getItem(CART_KEY)
    return data ? JSON.parse(data) : []
  },
  
  async clear() {
    await AsyncStorage.removeItem(CART_KEY)
  }
}
```

---

## 3. LỊCH SỬ MUA HÀNG CHI TIẾT ✅

### Tạo trang chi tiết đơn hàng
**File:** `app/(customer)/orders/[id].tsx`

**Tính năng:**
- Thông tin đơn hàng (mã, ngày, trạng thái)
- Danh sách sản phẩm trong đơn
- Tổng tiền, phí ship (nếu có)
- Timeline trạng thái đơn hàng
- Nút hủy đơn (nếu còn draft/ordered)

**Database:**
- Bảng `orders` đã có
- Bảng `order_items` đã có
- Join với `products` để lấy thông tin sản phẩm

---

## 4. ĐÁNH GIÁ SẢN PHẨM ✅

### Tạo bảng reviews trong Supabase
**SQL Migration:**
```sql
CREATE TABLE product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_product_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user ON product_reviews(user_id);

-- RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
  ON product_reviews FOR SELECT
  USING (true);

-- Policy: Customers can create reviews for products they bought
CREATE POLICY "Customers can create reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = auth.uid()
        AND oi.product_id = product_reviews.product_id
        AND o.status = 'completed'
    )
  );

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON product_reviews FOR UPDATE
  USING (auth.uid() = user_id);
```

### Component đánh giá
**File:** `src/components/ProductReview.tsx`

---

## 5. WISHLIST/YÊU THÍCH ✅

### Tạo bảng wishlist
**SQL Migration:**
```sql
CREATE TABLE wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Index
CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own wishlist
CREATE POLICY "Users manage own wishlist"
  ON wishlists FOR ALL
  USING (auth.uid() = user_id);
```

### Hook quản lý wishlist
**File:** `src/hooks/useWishlist.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useWishlist() {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWishlist()
    }
  }, [user])

  const fetchWishlist = async () => {
    const { data } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user?.id)
    
    setWishlist(data?.map(w => w.product_id) || [])
    setLoading(false)
  }

  const toggle = async (productId: number) => {
    const isInWishlist = wishlist.includes(productId)
    
    if (isInWishlist) {
      await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user?.id)
        .eq('product_id', productId)
      
      setWishlist(prev => prev.filter(id => id !== productId))
    } else {
      await supabase
        .from('wishlists')
        .insert({ user_id: user?.id, product_id: productId })
      
      setWishlist(prev => [...prev, productId])
    }
  }

  return { wishlist, loading, toggle, isInWishlist: (id: number) => wishlist.includes(id) }
}
```

---

## 6. THÔNG BÁO THỰC ✅

### Tạo bảng notifications
**SQL Migration:**
```sql
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
  read BOOLEAN DEFAULT FALSE,
  data JSONB, -- Additional data (order_id, product_id, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notifications
CREATE POLICY "Users read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
```

### Hook quản lý notifications
**File:** `src/hooks/useNotifications.ts`

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchNotifications()
      subscribeToNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(50)
    
    setNotifications(data || [])
    setUnreadCount(data?.filter(n => !n.read).length || 0)
    setLoading(false)
  }

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const markAsRead = async (id: number) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
    
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user?.id)
      .eq('read', false)
    
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  }
}
```

### Cập nhật NotificationDrawer
**File:** `src/components/NotificationDrawer.tsx`

Thay thế empty state bằng danh sách notifications thực.

---

## TRIỂN KHAI ƯU TIÊN

### Phase 1 (Quan trọng nhất)
1. ✅ Chi tiết sản phẩm - Cải thiện UX
2. ✅ Giỏ hàng persistent - Tránh mất data
3. ✅ Chi tiết đơn hàng - Transparency

### Phase 2 (Quan trọng)
4. ✅ Wishlist - Engagement
5. ✅ Thông báo thực - Communication

### Phase 3 (Nice to have)
6. ✅ Đánh giá sản phẩm - Social proof

---

## CHECKLIST TRIỂN KHAI

### Database
- [ ] Tạo bảng `product_reviews`
- [ ] Tạo bảng `wishlists`
- [ ] Tạo bảng `notifications`
- [ ] Setup RLS policies
- [ ] Tạo indexes

### Backend/API
- [ ] Function tạo notification khi đơn hàng thay đổi
- [ ] Function tính average rating cho sản phẩm
- [ ] Trigger gửi notification

### Frontend
- [ ] Trang chi tiết sản phẩm `[id].tsx`
- [ ] Trang chi tiết đơn hàng `orders/[id].tsx`
- [ ] Component ProductReview
- [ ] Component WishlistButton
- [ ] Hook useWishlist
- [ ] Hook useNotifications
- [ ] Cập nhật NotificationDrawer
- [ ] Cập nhật cart với persistent storage

### Testing
- [ ] Test thêm/xóa wishlist
- [ ] Test đánh giá sản phẩm
- [ ] Test notifications real-time
- [ ] Test cart persistence
- [ ] Test chi tiết đơn hàng

---

## KẾT LUẬN

Sau khi triển khai đầy đủ các tính năng trên, Customer app sẽ có:
- ✅ Trải nghiệm mua sắm hoàn chỉnh
- ✅ Tương tác tốt hơn với sản phẩm
- ✅ Thông tin minh bạch về đơn hàng
- ✅ Engagement cao hơn với wishlist
- ✅ Communication tốt hơn với notifications

**Thời gian ước tính:** 1-2 tuần với 1 developer
