# Cài đặt Nhanh

Hướng dẫn cài đặt nhanh các cải tiến mới cho appejv-expo.

## ⚡ Quick Start (5 phút)

```bash
# 1. Cài đặt dependencies mới
cd appejv-expo
npm install

# 2. Setup git hooks
npx husky install
chmod +x .husky/pre-commit

# 3. Verify installation
npm test
npm run lint
npm run type-check

# 4. Chạy app
npm start
```

## ✅ Checklist

- [ ] Dependencies đã cài đặt (`npm install`)
- [ ] Husky đã setup (`npx husky install`)
- [ ] Pre-commit hook có quyền execute (`chmod +x .husky/pre-commit`)
- [ ] Tests chạy thành công (`npm test`)
- [ ] Lint không có errors (`npm run lint`)
- [ ] Type check pass (`npm run type-check`)
- [ ] App chạy được (`npm start`)

## 📚 Đọc tiếp

Sau khi cài đặt xong, đọc các tài liệu sau:

1. **TOM-TAT-CAI-TIEN.md** - Tổng quan về các cải tiến
2. **QUICK-REFERENCE.md** - Cách sử dụng utilities mới
3. **MIGRATION-CHECKLIST.md** - Checklist để migrate code cũ
4. **SETUP-GUIDE.md** - Hướng dẫn chi tiết

## 🚀 Bắt đầu sử dụng

### 1. API Calls

**Cũ:**
```typescript
const { data, error } = await supabase.from('products').select('*')
if (error) Alert.alert('Lỗi', error.message)
```

**Mới:**
```typescript
import { apiCall } from '@/lib/api-helpers'

const result = await apiCall(
  () => supabase.from('products').select('*'),
  { context: 'ProductList.fetch' }
)
if (result.error) Alert.alert('Lỗi', result.error)
```

### 2. Error Tracking

```typescript
import { ErrorTracker } from '@/lib/error-tracking'

try {
  await operation()
} catch (error) {
  ErrorTracker.error(error, 'Component.function')
}
```

### 3. Constants

```typescript
import { SPACING, COLORS } from '@/constants'

<View style={{
  padding: SPACING.md,
  backgroundColor: COLORS.primary
}}>
```

### 4. Validation

```typescript
import { validators } from '@/lib/validation'

const result = validators.email(email)
if (!result.isValid) setError(result.error)
```

## 🔧 Commands mới

```bash
# Testing
npm test                 # Chạy tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Linting
npm run lint             # Check code
npm run lint:fix         # Fix issues

# Formatting
npm run format           # Format code
npm run format:check     # Check formatting

# Type checking
npm run type-check       # Check types
```

## 💡 Tips

1. **Pre-commit hook** sẽ tự động lint và format code
2. **Commit sẽ bị reject** nếu có lỗi lint hoặc type
3. **Fix errors** trước khi commit:
   ```bash
   npm run lint:fix
   npm run format
   ```
4. **Đọc QUICK-REFERENCE.md** để biết cách dùng utilities

## ⚠️ Lưu ý

- Không xóa file `.husky/pre-commit`
- Không skip pre-commit hook (trừ khi thực sự cần)
- Chạy `npm test` trước khi push code
- Đọc error messages từ ESLint và TypeScript

## 🆘 Gặp vấn đề?

### Pre-commit hook không chạy

```bash
npx husky install
chmod +x .husky/pre-commit
```

### Tests fail

```bash
npm test -- --clearCache
npm install
npm test
```

### Lint errors

```bash
npm run lint:fix
npm run format
```

### Metro bundler issues

```bash
npm run reset
```

## 📞 Cần hỗ trợ?

1. Đọc `TOM-TAT-CAI-TIEN.md`
2. Xem `QUICK-REFERENCE.md`
3. Check `SETUP-GUIDE.md`
4. Liên hệ team

---

**Chúc bạn code vui vẻ! 🎉**
