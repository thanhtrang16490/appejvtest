# Getting Started - APPE JV App

## 🚀 Quick Start

### 1. Cài đặt dependencies

```bash
cd appejv-app
npm install
```

### 2. Setup environment variables

File `.env.local` đã được tạo với Supabase credentials.

### 3. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

### 4. Login

Sử dụng tài khoản Supabase hiện có để đăng nhập.

## 📁 Cấu trúc Project

```
appejv-app/
├── app/                      # Next.js App Router
│   ├── auth/login/          # Login page
│   ├── sales/               # Sales pages
│   ├── layout.tsx           # Root layout với AuthProvider
│   └── page.tsx             # Home page (routing logic)
│
├── components/              # React components
│   └── ui/                 # UI components (sẽ thêm)
│
├── contexts/               # React contexts
│   └── AuthContext.tsx    # Authentication & user state
│
├── hooks/                  # Custom hooks (sẽ thêm)
│
├── lib/                    # Utilities & helpers
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   └── server.ts      # Server Supabase client
│   └── utils.ts           # Helper functions (cn, formatCurrency)
│
└── public/                 # Static assets
    └── appejv-logo.png    # Logo
```

## 🎨 Design System

### Colors

- Primary: `#175ead` (blue)
- Background: `#f0f9ff` (light blue)
- Success: `#10b981` (green)
- Error: `#ef4444` (red)
- Warning: `#f59e0b` (amber)

### Typography

- Font: Inter (Google Fonts)
- Headings: font-bold
- Body: font-normal

### Spacing

- Container padding: `px-4`
- Section spacing: `py-8`
- Card padding: `p-6` hoặc `p-8`

## 🔐 Authentication Flow

1. User truy cập `/` → redirect đến `/auth/login` nếu chưa login
2. User login → fetch profile từ Supabase
3. Route based on role:
   - `admin` → `/admin`
   - `sale_admin`, `sale` → `/sales`
   - `warehouse` → `/warehouse`
   - `customer` → `/customer`

## 📊 Data Fetching

### Client Components

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data } = await supabase.from('orders').select('*')
```

### Server Components

```tsx
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data } = await supabase.from('orders').select('*')
```

## 🛠️ Development Tips

### 1. Tham khảo appejv-expo

Khi implement features mới, xem cách appejv-expo làm:

```bash
# Xem orders page trong expo
cat ../appejv-expo/app/(sales)/orders/index.tsx

# Xem hooks trong expo
cat ../appejv-expo/src/hooks/useOrdersQuery.ts
```

### 2. Sử dụng TypeScript

Luôn define types cho data:

```tsx
interface Order {
  id: number
  status: string
  total_amount: number
  created_at: string
  customer_id?: string
}
```

### 3. Error Handling

Luôn handle errors:

```tsx
try {
  const { data, error } = await supabase.from('orders').select('*')
  if (error) throw error
  // Use data
} catch (error) {
  console.error(error)
  toast.error('Có lỗi xảy ra')
}
```

### 4. Loading States

Luôn show loading state:

```tsx
const [loading, setLoading] = useState(true)

if (loading) {
  return <div>Đang tải...</div>
}
```

## 🚀 Next Steps

1. Xem `TODO.md` để biết roadmap
2. Implement Sales Orders page đầu tiên
3. Tạo UI components library
4. Add React Query cho data fetching
5. Implement remaining pages

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)

## 🐛 Troubleshooting

### Port đã được sử dụng

```bash
# Kill process trên port 3000
lsof -ti:3000 | xargs kill -9

# Hoặc chạy trên port khác
npm run dev -- -p 3001
```

### Supabase connection error

- Check `.env.local` có đúng credentials không
- Verify Supabase project đang chạy
- Check network connection

### Build errors

```bash
# Clear cache và rebuild
rm -rf .next
npm run build
```

## 💡 Tips

- Sử dụng `cn()` utility để merge Tailwind classes
- Sử dụng `formatCurrency()` để format tiền VND
- Sử dụng `toast` từ Sonner cho notifications
- Tham khảo expo code khi không chắc chắn về logic
