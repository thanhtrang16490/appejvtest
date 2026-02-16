# Quick Reference Guide

Hướng dẫn nhanh sử dụng các utilities và patterns trong dự án.

## Error Tracking

### Import
```typescript
import { ErrorTracker, withErrorHandling, handleApiError } from '@/lib/error-tracking'
```

### Sử dụng cơ bản
```typescript
// Log error
try {
  await riskyOperation()
} catch (error) {
  ErrorTracker.error(error, 'ComponentName.functionName')
}

// Log warning
ErrorTracker.warning('Something might be wrong', 'ComponentName')

// Log info
ErrorTracker.info('User logged in', 'AuthContext')

// Set user context
ErrorTracker.setUser({ id: '123', email: 'user@example.com' })

// Clear user context
ErrorTracker.clearUser()
```

### Wrap async functions
```typescript
const fetchData = withErrorHandling(async () => {
  const response = await api.getData()
  return response
}, 'fetchData')

// Sử dụng
const data = await fetchData()
```

### Handle API errors
```typescript
try {
  await supabase.from('products').insert(data)
} catch (error) {
  const { error: errorMessage, status } = handleApiError(error)
  Alert.alert('Lỗi', errorMessage)
}
```

## API Helpers

### Import
```typescript
import { apiCall, retryApiCall } from '@/lib/api-helpers'
```

### API call với error handling
```typescript
const result = await apiCall(
  () => supabase.from('products').select('*'),
  {
    context: 'ProductList.fetchProducts'
  }
)

if (result.error) {
  Alert.alert('Lỗi', result.error)
  return
}

const products = result.data
```

### API call với offline support
```typescript
const result = await apiCall(
  () => supabase.from('orders').insert(orderData),
  {
    offlineAction: 'create_order',
    offlineData: orderData,
    context: 'OrderForm.createOrder'
  }
)
```

### Retry failed API calls
```typescript
const data = await retryApiCall(
  () => supabase.from('products').select('*'),
  3,  // max retries
  1000  // delay in ms
)
```

## Offline Manager

### Import
```typescript
import { OfflineManager } from '@/lib/offline-manager'
```

### Thêm action vào queue
```typescript
await OfflineManager.addToQueue('create_order', {
  product_id: '123',
  quantity: 2,
  customer_id: 'abc'
})
```

### Lấy queue
```typescript
const queue = await OfflineManager.getQueue()
console.log(`${queue.length} actions pending`)
```

### Check network status
```typescript
const isOnline = await OfflineManager.isOnline()
if (!isOnline) {
  Alert.alert('Offline', 'Bạn đang offline')
}
```

### Process queue manually
```typescript
await OfflineManager.processQueue()
```

## Performance Monitoring

### Import
```typescript
import { performanceMonitor, withPerformanceTracking } from '@/lib/performance'
```

### Đo performance của async operation
```typescript
const data = await performanceMonitor.measure('fetchProducts', async () => {
  return await fetchProducts()
})
```

### Manual timing
```typescript
performanceMonitor.start('renderList')
// ... render logic
performanceMonitor.end('renderList')  // Logs: ⏱️ renderList: 123ms
```

### Track component performance
```typescript
export default withPerformanceTracking(MyComponent, 'MyComponent')
```

## Validation

### Import
```typescript
import { validators, validateField } from '@/lib/validation'
```

### Validate email
```typescript
const result = validators.email(email)
if (!result.isValid) {
  Alert.alert('Lỗi', result.error)
}
```

### Validate phone
```typescript
const result = validators.phone(phone)
if (!result.isValid) {
  setError(result.error)
}
```

### Validate với rules
```typescript
const result = validateField(value, [
  { required: true, message: 'Tên là bắt buộc' },
  { minLength: 3, message: 'Tên phải có ít nhất 3 ký tự' },
  { maxLength: 50, message: 'Tên không được quá 50 ký tự' }
])
```

### Custom validation
```typescript
const result = validateField(value, [
  {
    custom: (val) => val.startsWith('VN'),
    message: 'Mã phải bắt đầu bằng VN'
  }
])
```

## Constants

### Colors
```typescript
import { COLORS, getRoleColor, getStatusColor } from '@/constants/colors'

// Sử dụng colors
<View style={{ backgroundColor: COLORS.primary }}>

// Get role color
const roleColor = getRoleColor('admin')  // '#FF6B6B'

// Get status color
const statusColor = getStatusColor('completed')  // '#51CF66'
```

### Layout
```typescript
import { SPACING, SIZES, RADIUS } from '@/constants/layout'

// Spacing
<View style={{ padding: SPACING.md }}>  // 16

// Sizes
<Icon size={SIZES.icon.md} />  // 24

// Border radius
<View style={{ borderRadius: RADIUS.md }}>  // 8
```

### App Constants
```typescript
import { API_CONFIG, PAGINATION, CACHE_KEYS } from '@/constants'

// API timeout
fetch(url, { timeout: API_CONFIG.TIMEOUT })

// Pagination
const limit = PAGINATION.DEFAULT_PAGE_SIZE  // 20

// Cache keys
const cacheKey = CACHE_KEYS.PRODUCTS
```

## Testing

### Component Testing
```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native'

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button title="Click me" />)
    expect(getByText('Click me')).toBeTruthy()
  })

  it('should call onPress', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Button title="Click" onPress={onPress} />)
    
    fireEvent.press(getByText('Click'))
    
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should handle async operations', async () => {
    const { getByText } = render(<AsyncComponent />)
    
    await waitFor(() => {
      expect(getByText('Loaded')).toBeTruthy()
    })
  })
})
```

### Mock Supabase
```typescript
// Đã được setup trong jest.setup.js
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
    insert: jest.fn().mockResolvedValue({ data: {}, error: null }),
  }))
}
```

## Common Patterns

### Form với validation
```typescript
const [email, setEmail] = useState('')
const [error, setError] = useState('')

const handleSubmit = async () => {
  // Validate
  const validation = validators.email(email)
  if (!validation.isValid) {
    setError(validation.error)
    return
  }

  // API call với error handling
  const result = await apiCall(
    () => supabase.auth.signInWithPassword({ email, password }),
    { context: 'LoginForm.handleSubmit' }
  )

  if (result.error) {
    Alert.alert('Lỗi', result.error)
    return
  }

  // Success
  navigation.navigate('Home')
}
```

### List với pagination
```typescript
import { PAGINATION } from '@/constants'

const [page, setPage] = useState(1)
const [products, setProducts] = useState([])

const fetchProducts = async () => {
  const from = (page - 1) * PAGINATION.DEFAULT_PAGE_SIZE
  const to = from + PAGINATION.DEFAULT_PAGE_SIZE - 1

  const result = await apiCall(
    () => supabase
      .from('products')
      .select('*')
      .range(from, to),
    { context: 'ProductList.fetchProducts' }
  )

  if (result.data) {
    setProducts(result.data)
  }
}
```

### Offline-first form
```typescript
const handleSubmit = async () => {
  const result = await apiCall(
    () => supabase.from('orders').insert(orderData),
    {
      offlineAction: 'create_order',
      offlineData: orderData,
      context: 'OrderForm.submit'
    }
  )

  if (result.error) {
    // Nếu offline, action đã được queue
    if (result.status === 0) {
      Alert.alert('Offline', 'Đơn hàng sẽ được tạo khi có mạng')
      navigation.goBack()
    } else {
      Alert.alert('Lỗi', result.error)
    }
    return
  }

  Alert.alert('Thành công', 'Đơn hàng đã được tạo')
  navigation.goBack()
}
```

## Tips & Best Practices

1. **Luôn validate input trước khi gửi API**
2. **Sử dụng apiCall wrapper cho tất cả API calls**
3. **Log errors với context rõ ràng**
4. **Sử dụng constants thay vì hardcode values**
5. **Viết tests cho business logic quan trọng**
6. **Đo performance cho operations phức tạp**
7. **Handle offline scenarios cho user actions quan trọng**
8. **Set user context trong ErrorTracker sau khi login**
9. **Clear user context khi logout**
10. **Sử dụng TypeScript types cho tất cả functions**
