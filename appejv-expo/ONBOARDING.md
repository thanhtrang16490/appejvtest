# Welcome to APPE JV! 👋

Chào mừng bạn đến với team! Đây là hướng dẫn để bạn bắt đầu nhanh chóng.

## 📚 Bước 1: Đọc Documentation (30 phút)

### Must Read (Ưu tiên cao)
1. **README.md** - Tổng quan dự án
2. **PROJECT-SUMMARY.md** - Tóm tắt project
3. **ROADMAP.md** - Kế hoạch phát triển

### Should Read (Quan trọng)
4. **QUICK-START-PHASE-3.md** - Quick start với features mới
5. **INTEGRATION-COMPLETE.md** - Integration summary
6. **SETUP-GUIDE.md** - Hướng dẫn setup

### Nice to Read (Tham khảo)
7. **PHASE-1-2-COMPLETE.md** - Phase 1 & 2 summary
8. **PHASE-3-DONE.md** - Phase 3 summary
9. **QUICK-REFERENCE.md** - Quick reference

## 🛠️ Bước 2: Setup Environment (30 phút)

### Prerequisites
```bash
# Check versions
node --version  # >= 18
npm --version   # >= 9
```

### Installation
```bash
# 1. Clone repository
git clone <repository-url>
cd appejv-expo

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local với Supabase credentials

# 4. Start development server
npm start
```

### Verify Setup
```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check
```

## 📱 Bước 3: Run App (15 phút)

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## 🏗️ Bước 4: Understand Architecture (1 giờ)

### Project Structure
```
appejv-expo/
├── app/                    # Screens (Expo Router)
│   ├── (auth)/            # Auth screens
│   ├── (sales)/           # Sales screens
│   ├── (customer)/        # Customer screens
│   ├── (admin)/           # Admin screens
│   └── (warehouse)/       # Warehouse screens
│
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities & services
│   ├── types/             # TypeScript types
│   └── constants/         # Constants
│
└── assets/                # Static assets
```

### Key Concepts

#### 1. Routing (Expo Router)
```typescript
// File-based routing
app/(sales)/dashboard.tsx → /sales/dashboard
app/(sales)/customers/[id].tsx → /sales/customers/:id
```

#### 2. State Management
```typescript
// Global state: Zustand
// Server state: React Query
// Local state: useState/useReducer
// Auth state: Context API
```

#### 3. Data Fetching
```typescript
// Use React Query
const { data, isLoading } = useQuery({
  queryKey: ['customers'],
  queryFn: fetchCustomers,
})
```

#### 4. Authentication
```typescript
// Use AuthContext
const { user, signIn, signOut } = useAuth()
```

## 🎯 Bước 5: First Task (2 giờ)

### Easy Tasks (Bắt đầu với)
1. **Add screen tracking** - Thêm Analytics.trackScreen() vào một screen
2. **Fix a typo** - Sửa lỗi chính tả trong UI
3. **Add a test** - Viết test cho một utility function
4. **Update documentation** - Cải thiện một doc file

### Example: Add Screen Tracking
```typescript
// app/(sales)/customers/index.tsx
import { useEffect } from 'react'
import { Analytics } from '@/lib/analytics'

export default function CustomersScreen() {
  useEffect(() => {
    Analytics.trackScreen('Customers')
  }, [])

  return <View>...</View>
}
```

## 📖 Bước 6: Learn Key Features (2 giờ)

### 1. Analytics
```typescript
import { Analytics, AnalyticsEvents } from '@/lib/analytics'

// Track event
Analytics.trackEvent(AnalyticsEvents.BUTTON_CLICKED, {
  button_name: 'add_customer',
})
```

### 2. Animations
```typescript
import { useFadeIn } from '@/hooks/useAnimation'

const { opacity } = useFadeIn()

<Animated.View style={{ opacity }}>
  ...
</Animated.View>
```

### 3. Optimistic Updates
```typescript
import { OptimisticUpdates } from '@/lib/optimistic-updates'

await OptimisticUpdates.apply(
  'order-123',
  'update',
  newData,
  oldData,
  apiCall
)
```

### 4. Deep Linking
```typescript
import { createDeepLink } from '@/lib/deep-linking'

const link = createDeepLink('sales/customers', { id: '123' })
```

## 🔧 Bước 7: Development Workflow

### Daily Workflow
```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-feature

# 3. Make changes
# ... code ...

# 4. Run tests
npm test

# 5. Lint & format
npm run lint:fix
npm run format

# 6. Commit (pre-commit hooks will run)
git add .
git commit -m "feat: add my feature"

# 7. Push
git push origin feature/my-feature

# 8. Create PR
```

### Code Style
- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write JSDoc comments
- Add tests for new features

### Git Commit Messages
```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

## 🧪 Bước 8: Testing

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific test
npm test -- --testPathPattern="analytics"
```

### Write Tests
```typescript
// src/lib/__tests__/my-util.test.ts
describe('myUtil', () => {
  it('should work correctly', () => {
    expect(myUtil()).toBe(expected)
  })
})
```

## 🐛 Bước 9: Debugging

### Console Logs
```typescript
console.log('Debug:', data)
console.error('Error:', error)
```

### React Native Debugger
```bash
# Install
brew install --cask react-native-debugger

# Open
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Expo Dev Tools
```bash
# Press 'd' in terminal to open dev menu
# Press 'j' to open debugger
```

## 📚 Bước 10: Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Supabase Docs](https://supabase.com/docs)

### Internal Docs
- README.md - Main documentation
- QUICK-REFERENCE.md - Quick reference
- PHASE-*-*.md - Feature documentation

### Team
- Ask questions in team chat
- Review PRs
- Pair programming sessions
- Weekly sync meetings

## ✅ Checklist

### Day 1
- [ ] Read README.md
- [ ] Setup environment
- [ ] Run app successfully
- [ ] Understand project structure
- [ ] Complete first task

### Week 1
- [ ] Read all must-read docs
- [ ] Understand architecture
- [ ] Learn key features
- [ ] Submit first PR
- [ ] Attend team meeting

### Month 1
- [ ] Comfortable with codebase
- [ ] Can work independently
- [ ] Contributed multiple PRs
- [ ] Helped other team members
- [ ] Understand business logic

## 🎯 Goals

### Short-term (1 month)
- Understand codebase
- Complete assigned tasks
- Write quality code
- Follow best practices

### Mid-term (3 months)
- Work independently
- Contribute to architecture
- Mentor new members
- Improve processes

### Long-term (6 months)
- Expert in codebase
- Lead features
- Technical decisions
- Team leadership

## 💡 Tips

### Do's ✅
- Ask questions
- Read documentation
- Write tests
- Follow conventions
- Review code
- Share knowledge

### Don'ts ❌
- Skip documentation
- Ignore linter errors
- Skip tests
- Break conventions
- Work in isolation
- Assume knowledge

## 🆘 Getting Help

### When Stuck
1. Check documentation
2. Search codebase
3. Review similar code
4. Ask team members
5. Google/Stack Overflow

### Who to Ask
- **Architecture:** Tech lead
- **Features:** Product owner
- **Bugs:** QA team
- **DevOps:** DevOps engineer
- **General:** Any team member

## 🎉 Welcome Aboard!

You're now ready to start contributing! 

Remember:
- Take your time to learn
- Ask questions
- Have fun coding
- We're here to help

**Let's build something amazing together!** 🚀

---

**Questions?** Ask in team chat or create an issue.

**Feedback?** Help us improve this onboarding guide!
