# APPE JV App (Next.js)

Hệ thống quản lý bán hàng APPE JV - phiên bản web được xây dựng lại từ đầu dựa theo cấu trúc của appejv-expo.

## Công nghệ

- **Next.js 15** - React framework với App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Backend & Authentication
- **Zustand** - State management (sẽ thêm)
- **React Query** - Data fetching (sẽ thêm)
- **Sonner** - Toast notifications

## Cấu trúc thư mục

```
appejv-app/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── sales/             # Sales pages
│   ├── admin/             # Admin pages (sẽ thêm)
│   ├── customer/          # Customer pages (sẽ thêm)
│   └── warehouse/         # Warehouse pages (sẽ thêm)
├── components/            # React components
│   └── ui/               # UI components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom hooks
├── lib/                  # Utilities
│   ├── supabase/        # Supabase clients
│   └── utils.ts         # Helper functions
└── public/              # Static assets
```

## Cài đặt

```bash
npm install
```

## Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tính năng

### Đã hoàn thành
- ✅ Authentication với Supabase
- ✅ Role-based routing
- ✅ Login page
- ✅ Basic sales dashboard

### Đang phát triển
- 🚧 Orders management
- 🚧 Customers management
- 🚧 Products management
- 🚧 Inventory management
- 🚧 Reports
- 🚧 Admin panel
- 🚧 Customer portal
- 🚧 Warehouse management

## So sánh với appejv-expo

App này được xây dựng dựa theo cấu trúc và logic của appejv-expo (React Native) nhưng cho web:

- **Giống nhau**: Architecture, data flow, business logic
- **Khác nhau**: UI framework (Next.js vs React Native), routing, styling

## Deployment

```bash
npm run build
npm start
```

Hoặc deploy lên Vercel:

```bash
vercel
```

## License

Private - APPE JV
