# Hướng dẫn Cài đặt và Phát triển

## Yêu cầu Hệ thống

- Node.js >= 18.x
- npm hoặc yarn
- Expo CLI
- iOS Simulator (cho macOS) hoặc Android Studio (cho Android)

## Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd appejv-expo
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường:
- `EXPO_PUBLIC_SUPABASE_URL`: URL của Supabase project
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Anon key của Supabase

### 3. Cài đặt Husky (pre-commit hooks)

```bash
npx husky install
chmod +x .husky/pre-commit
```

## Chạy Ứng dụng

### Development

```bash
# Chạy trên iOS
npm run ios

# Chạy trên Android
npm run android

# Chạy trên web
npm run web

# Chạy với Expo Go
npm start
```

### Testing

```bash
# Chạy tất cả tests
npm test

# Chạy tests với watch mode
npm run test:watch

# Chạy tests với coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run type-check
```

## Cấu trúc Dự án

```
appejv-expo/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth screens
│   ├── (admin)/           # Admin screens
│   ├── (sales)/           # Sales screens
│   ├── (customer)/        # Customer screens
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities & helpers
│   │   ├── supabase.ts
│   │   ├── validation.ts
│   │   ├── error-tracking.ts
│   │   ├── offline-manager.ts
│   │   ├── api-helpers.ts
│   │   └── performance.ts
│   ├── constants/         # App constants
│   │   ├── colors.ts
│   │   ├── layout.ts
│   │   └── index.ts
│   └── types/             # TypeScript types
├── __tests__/             # Test files
└── assets/                # Images, fonts, etc.
```

## Quy tắc Phát triển

### 1. Code Style

- Sử dụng TypeScript cho tất cả code mới
- Follow ESLint rules
- Format code với Prettier trước khi commit
- Viết JSDoc comments cho functions/components phức tạp

### 2. Component Guidelines

```typescript
// ✅ Good: Functional component với TypeScript
interface ButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
}

export function Button({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  )
}

// ❌ Bad: Inline styles, no types
export function Button(props) {
  return (
    <TouchableOpacity style={{ padding: 10 }} onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  )
}
```

### 3. State Management

- Sử dụng React Query cho server state
- Sử dụng Zustand cho global client state
- Sử dụng useState/useReducer cho local component state

### 4. Error Handling

```typescript
import { ErrorTracker, withErrorHandling } from '@/lib/error-tracking'

// Wrap async functions
const fetchData = withErrorHandling(async () => {
  const response = await api.getData()
  return response
}, 'fetchData')

// Manual error tracking
try {
  await someOperation()
} catch (error) {
  ErrorTracker.error(error, 'someOperation')
  throw error
}
```

### 5. API Calls

```typescript
import { apiCall } from '@/lib/api-helpers'

// Với offline support
const result = await apiCall(
  () => supabase.from('products').select('*'),
  {
    offlineAction: 'fetch_products',
    offlineData: { timestamp: Date.now() },
    context: 'ProductList.fetchProducts'
  }
)

if (result.error) {
  Alert.alert('Lỗi', result.error)
  return
}

// Use result.data
```

### 6. Performance

```typescript
import { performanceMonitor } from '@/lib/performance'

// Đo performance của async operation
const data = await performanceMonitor.measure('fetchProducts', async () => {
  return await fetchProducts()
})

// Hoặc manual
performanceMonitor.start('renderList')
// ... render logic
performanceMonitor.end('renderList')
```

### 7. Testing

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native'

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<Button title="Click me" onPress={onPress} />)
    
    fireEvent.press(getByText('Click me'))
    
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
```

## Git Workflow

### Branch Naming

- `feature/ten-tinh-nang` - Tính năng mới
- `fix/ten-bug` - Sửa bug
- `refactor/ten-phan` - Refactor code
- `test/ten-test` - Thêm tests

### Commit Messages

```
feat: thêm tính năng đăng nhập bằng số điện thoại
fix: sửa lỗi hiển thị danh sách sản phẩm
refactor: tối ưu hóa AuthContext
test: thêm tests cho validation
docs: cập nhật README
```

### Pre-commit Hooks

Husky sẽ tự động chạy:
1. ESLint để check code quality
2. Prettier để format code
3. Type check với TypeScript

Nếu có lỗi, commit sẽ bị reject. Fix lỗi trước khi commit lại.

## Troubleshooting

### Metro bundler cache issues

```bash
npm run reset
```

### iOS build issues

```bash
cd ios && pod install && cd ..
```

### Android build issues

```bash
cd android && ./gradlew clean && cd ..
```

### Test failures

```bash
# Clear Jest cache
npm test -- --clearCache

# Run specific test
npm test -- Button.test.tsx
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
