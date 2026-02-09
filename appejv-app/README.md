# APPE JV App - Sales Management System

Internal sales management application for APPE JV team. Built with Next.js 15, React Query, and Go API backend.

## 🎯 Purpose

This is the **internal sales management app** for APPE JV staff. For the public website, see [appejv-web](../appejv-web).

## 🚀 Features

### Sales Staff Features
- **Order Management**: Create, track, and manage orders
- **Customer Management**: Manage customer information and history
- **Inventory Tracking**: Real-time inventory monitoring
- **Sales Reports**: Revenue and performance analytics
- **Team Management**: For sales admins to manage their team

### Customer Portal Features
- **Order Tracking**: View order history and status
- **Account Management**: Update profile and preferences
- **Order Placement**: Place orders through customer portal

## 🏗️ Architecture

```
appejv-app (Next.js)
    ↓
appejv-api (Go)
    ↓
Supabase (PostgreSQL + Auth)
```

## 📋 Prerequisites

- Node.js >= 20.9.0
- npm >= 10.0.0
- Go API running on port 8080

## 🔧 Installation

```bash
cd appejv-app
npm install
```

## ⚙️ Configuration

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Development Mode (optional)
NEXT_PUBLIC_SKIP_AUTH=false
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

App runs on: http://localhost:3000

## 📁 Project Structure

```
appejv-app/
├── app/
│   ├── auth/              # Authentication pages
│   ├── sales/             # Sales staff routes
│   │   ├── orders/        # Order management
│   │   ├── customers/     # Customer management
│   │   ├── inventory/     # Inventory tracking
│   │   ├── reports/       # Sales reports
│   │   ├── selling/       # POS interface
│   │   └── users/         # Team management
│   └── customer/          # Customer portal routes
│       ├── dashboard/     # Customer dashboard
│       ├── orders/        # Order history
│       └── account/       # Account settings
├── components/
│   ├── layout/            # Layout components
│   ├── sales/             # Sales components
│   ├── customer/          # Customer components
│   ├── loading/           # Loading states
│   └── ui/                # UI components (shadcn/ui)
├── lib/
│   ├── api/               # API client & services
│   ├── hooks/             # React Query hooks
│   ├── supabase/          # Supabase client
│   └── store/             # State management
└── types/
    └── database.types.ts  # Database types
```

## 🔐 Authentication

### Staff Login
- URL: `/auth/login`
- Roles: `sale`, `sale_admin`, `admin`

### Customer Login
- URL: `/auth/customer-login`
- Role: `customer`

### Development Mode
Set `NEXT_PUBLIC_SKIP_AUTH=true` to bypass authentication during development.

## 📚 API Integration

This app uses the Go API backend. See [API Integration Guide](./API-INTEGRATION.md) for details.

### Available Hooks

```typescript
// Products
import { useProducts, useProduct, useCreateProduct } from '@/lib/hooks'

// Customers
import { useCustomers, useCustomer, useCreateCustomer } from '@/lib/hooks'

// Orders
import { useOrders, useOrder, useCreateOrder } from '@/lib/hooks'

// Inventory
import { useInventory, useLowStock, useAdjustInventory } from '@/lib/hooks'

// Reports
import { useSalesReport, useRevenueReport } from '@/lib/hooks'
```

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) and Tailwind CSS.

## 🔗 Related Projects

- **appejv-web**: Public website (Astro) - [../appejv-web](../appejv-web)
- **appejv-api**: Go API backend - [../appejv-api](../appejv-api)

## 📝 Routes

### Sales Routes (Protected)
- `/sales` - Sales dashboard
- `/sales/orders` - Order management
- `/sales/customers` - Customer management
- `/sales/inventory` - Inventory tracking
- `/sales/reports` - Sales reports
- `/sales/selling` - Create new order (POS)
- `/sales/users` - Team management (admin only)

### Customer Routes (Protected)
- `/customer/dashboard` - Customer dashboard
- `/customer/orders` - Order history
- `/customer/account` - Account settings

### Auth Routes (Public)
- `/auth/login` - Staff login
- `/auth/customer-login` - Customer login

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Railway
```bash
railway up
```

### Environment Variables
Make sure to set all required environment variables in your deployment platform.

## 📄 License

MIT License

## 👥 Authors

APPE JV Team

---

Made with ❤️ for APPE JV Vietnam
