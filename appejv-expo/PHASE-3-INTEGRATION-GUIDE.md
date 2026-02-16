# Phase 3 - Integration Guide

## ✅ Đã tích hợp

### 1. Root Layout (_layout.tsx)
✅ Analytics initialization
✅ Deep linking initialization
✅ Offline manager integration

### 2. AuthContext
✅ Track login events
✅ Track logout events
✅ Set user properties in analytics
✅ Track authentication methods

### 3. Example Components
✅ AnimatedProductCard - Sử dụng animations + analytics + deep linking
✅ OptimisticOrderStatus - Sử dụng optimistic updates + analytics

## 🎯 Cách sử dụng trong screens

### 1. Track Screen Views

Thêm vào mỗi screen:

```typescript
import { useEffect } from 'react'
import { Analytics } from '@/lib/analytics'

export default function MyScreen() {
  useEffect(() => {
    Analytics.trackScreen('MyScreen')
  }, [])

  return <View>...</View>
}
```

Hoặc sử dụng HOC:

```typescript
import { withAnalytics } from '@/lib/analytics'

function MyScreen() {
  return <View>...</View>
}

export default withAnalytics(MyScreen, 'MyScreen')
```

### 2. Track User Actions

```typescript
import { Analytics, AnalyticsEvents } from '@/lib/analytics'

// Track button click
const handleButtonClick = () => {
  Analytics.trackAction('click', 'add_to_cart_button')
  // ... your logic
}

// Track custom event
const handlePurchase = (order) => {
  Analytics.trackEvent(AnalyticsEvents.ORDER_CREATED, {
    order_id: order.id,
    total: order.total,
    items_count: order.items.length,
  })
}
```

### 3. Sử dụng Animations

```typescript
import { useFadeIn, useSlideIn, useShake } from '@/hooks/useAnimation'
import { Animated } from 'react-native'

function MyComponent() {
  const { opacity } = useFadeIn()
  const { translateY } = useSlideIn(50)
  const { shake, translateX } = useShake()

  const handleError = () => {
    shake() // Shake on error
  }

  return (
    <Animated.View 
      style={{ 
        opacity, 
        transform: [{ translateY }, { translateX }] 
      }}
    >
      <TouchableOpacity onPress={handleError}>
        <Text>Click me</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}
```

### 4. Optimistic Updates

```typescript
import { OptimisticUpdates } from '@/lib/optimistic-updates'
import { supabase } from '@/lib/supabase'

const handleUpdate = async () => {
  const result = await OptimisticUpdates.apply(
    'unique-id',
    'operation-name',
    newData,
    oldData,
    async () => {
      // API call
      const { data, error } = await supabase
        .from('table')
        .update(newData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    }
  )

  if (result.success) {
    // Success
    Alert.alert('Thành công', 'Đã cập nhật')
  } else {
    // Error - automatic rollback
    Alert.alert('Lỗi', result.error?.message)
  }
}
```

### 5. Deep Linking

```typescript
import { createDeepLink, createUniversalLink, shareDeepLink } from '@/lib/deep-linking'

// Create deep link
const link = createDeepLink('sales/customers', { id: '123' })
// 'appejv://sales/customers/123'

// Create universal link
const universalLink = createUniversalLink('sales/customers', { id: '123' })
// 'https://appejv.com/sales/customers/123'

// Share link
const handleShare = async () => {
  const success = await shareDeepLink(
    'sales/customers',
    { id: '123' },
    'Xem khách hàng này'
  )

  if (success) {
    Alert.alert('Đã chia sẻ')
  }
}
```

## 📱 Screens cần integrate

### Priority 1 (High)
- [ ] (sales)/dashboard.tsx - Track screen view, track actions
- [ ] (sales)/customers/index.tsx - Track screen, add animations
- [ ] (sales)/orders/index.tsx - Track screen, optimistic updates
- [ ] (sales)/selling.tsx - Track add to cart, checkout events
- [ ] (customer)/products.tsx - Use AnimatedProductCard
- [ ] (customer)/orders/index.tsx - Use OptimisticOrderStatus

### Priority 2 (Medium)
- [ ] (admin)/dashboard.tsx - Track screen view
- [ ] (warehouse)/dashboard.tsx - Track screen view
- [ ] (auth)/login.tsx - Already tracked in AuthContext
- [ ] All detail screens - Add deep linking share buttons

### Priority 3 (Low)
- [ ] Settings screens - Track preference changes
- [ ] Profile screens - Track profile updates
- [ ] Search screens - Track search queries

## 🔧 Configuration

### 1. app.json - Deep Linking

Thêm vào `app.json`:

```json
{
  "expo": {
    "scheme": "appejv",
    "ios": {
      "bundleIdentifier": "com.appejv.app",
      "associatedDomains": ["applinks:appejv.com"]
    },
    "android": {
      "package": "com.appejv.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "appejv.com"
            },
            {
              "scheme": "appejv"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### 2. Analytics Backend (Optional)

Nếu muốn gửi analytics đến backend:

```typescript
// src/lib/analytics.ts
// Uncomment và configure:

private static async sendToBackend(event: AnalyticsEvent) {
  try {
    await fetch('https://your-analytics-api.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error('Failed to send analytics:', error)
  }
}
```

## 📊 Testing Integration

### 1. Test Analytics
```bash
# Check console logs
# Should see: "Analytics: Event tracked - screen_view"
```

### 2. Test Deep Linking
```bash
# iOS Simulator
xcrun simctl openurl booted "appejv://sales/customers/123"

# Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "appejv://sales/customers/123"
```

### 3. Test Animations
- Mở app và xem fade-in effects
- Trigger shake animation on errors
- Check smooth transitions

### 4. Test Optimistic Updates
- Turn off network
- Try updating order status
- Should see immediate UI update
- Turn on network - should sync

## ✅ Checklist

### Setup
- [x] Analytics initialized in _layout.tsx
- [x] Deep linking initialized in _layout.tsx
- [x] AuthContext integrated with analytics
- [x] Example components created

### Next Steps
- [ ] Add screen tracking to all screens
- [ ] Add event tracking to important actions
- [ ] Replace existing product cards with AnimatedProductCard
- [ ] Use OptimisticOrderStatus in order screens
- [ ] Configure app.json for deep linking
- [ ] Test all integrations

## 🎉 Benefits

### User Experience
- ✅ Smooth animations throughout app
- ✅ Instant feedback with optimistic updates
- ✅ Easy sharing with deep links
- ✅ Better perceived performance

### Developer Experience
- ✅ Easy to track user behavior
- ✅ Reusable animation hooks
- ✅ Simple optimistic update API
- ✅ Automatic error handling

### Business
- ✅ Data-driven decisions with analytics
- ✅ Better user engagement tracking
- ✅ Improved conversion tracking
- ✅ Marketing campaign support (deep links)

## 📞 Support

Nếu gặp vấn đề:
1. Check PHASE-3-FINAL.md
2. Review example components
3. Check console logs
4. Review test files for usage examples
