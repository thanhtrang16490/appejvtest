# APPE JV - Sales Order Management System

A modern, mobile-first sales order management system built with Next.js 15, Supabase, and TypeScript. Features comprehensive security, role-based access control, and a beautiful Vietnamese interface.

## 🚀 Features

### Core Functionality
- **Mobile-First Design**: Optimized for mobile devices with responsive layouts
- **Role-Based Access Control**: Separate interfaces for customers, sales staff, and administrators
- **Real-time Updates**: Live data synchronization with Supabase
- **Vietnamese Interface**: Complete Vietnamese localization

### Customer Features
- Product catalog browsing
- Shopping cart management
- Order placement and tracking
- Account management
- Order history

### Sales Features
- Sales dashboard with analytics
- Order management (create, view, update)
- Customer management
- Inventory tracking
- Sales reports
- Point-of-sale interface
- Team management (for sales admins)

### Security Features
- **Rate Limiting**: Prevents abuse with configurable rate limits
- **Security Headers**: CSP, HSTS, XSS protection, and more
- **Input Validation**: Comprehensive input sanitization
- **CSRF Protection**: Token-based CSRF prevention
- **Audit Logging**: Security event logging for compliance
- **Role-Based Authorization**: Fine-grained access control
- **Session Management**: Secure session handling with Supabase Auth

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Icons**: Lucide React

## 📁 Project Structure

```
appejvtest/
├── app/
│   ├── (public)/           # Public routes
│   │   ├── page.tsx        # Homepage
│   │   ├── catalog/        # Product catalog
│   │   └── auth/           # Authentication pages
│   ├── customer/           # Customer routes (protected)
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── account/
│   │   ├── profile/
│   │   ├── checkout/
│   │   └── more/
│   └── sales/              # Sales routes (role-protected)
│       ├── page.tsx        # Sales dashboard
│       ├── orders/
│       ├── customers/
│       ├── inventory/
│       ├── selling/        # POS interface
│       ├── reports/
│       └── users/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   ├── customer/           # Customer-specific components
│   └── sales/              # Sales-specific components
├── lib/
│   ├── supabase/           # Supabase client configuration
│   ├── security/           # Security utilities
│   │   ├── rate-limit.ts
│   │   ├── headers.ts
│   │   ├── validation.ts
│   │   ├── csrf.ts
│   │   ├── audit.ts
│   │   ├── api-handler.ts
│   │   └── config.ts
│   ├── store/              # State management
│   └── utils.ts            # Utility functions
└── types/
    └── database.types.ts   # Database type definitions
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/thanhtrang16490/appejvtest.git
cd appejvtest
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up the database**

Run the SQL migrations in your Supabase project to create the necessary tables:
- `profiles` - User profiles with roles
- `customers` - Customer information
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Order line items

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Security

This project implements multiple layers of security:

### Authentication & Authorization
- Supabase Auth for user authentication
- Role-based access control (customer, sale, sale_admin, admin)
- Protected routes with middleware
- Session management with secure cookies

### API Security
- Rate limiting on all API routes
- Input validation and sanitization
- CSRF protection
- Secure API handler wrapper

### HTTP Security
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- XSS Protection headers
- Clickjacking prevention
- MIME type sniffing prevention

### Audit & Monitoring
- Security event logging
- Unauthorized access tracking
- Rate limit violation logging
- Suspicious activity detection

## 🎨 UI/UX Features

- **Mobile-First Design**: Optimized for touch interfaces
- **Gradient Backgrounds**: Beautiful purple-to-blue gradients
- **Smooth Animations**: Slide-in drawers and transitions
- **Hide/Show Headers**: Headers hide on scroll for more screen space
- **Bottom Navigation**: Easy thumb-reach navigation on mobile
- **Desktop Sidebar**: Full navigation sidebar on larger screens
- **Notification System**: Real-time notifications with badges
- **Drawer Menus**: Slide-out menus for additional options

## 📱 Routes

### Public Routes
- `/` - Homepage
- `/catalog` - Product catalog
- `/catalog/[id]` - Product details
- `/auth/login` - Staff login
- `/auth/customer-login` - Customer login

### Customer Routes (Protected)
- `/customer/dashboard` - Customer dashboard
- `/customer/orders` - Order history
- `/customer/orders/[id]` - Order details
- `/customer/account` - Account settings
- `/customer/profile` - User profile
- `/customer/checkout` - Checkout page
- `/customer/more` - Additional options

### Sales Routes (Role-Protected)
- `/sales` - Sales dashboard
- `/sales/orders` - Order management
- `/sales/selling` - Create new order (selling page)
- `/sales/customers` - Customer management
- `/sales/inventory` - Inventory management
- `/sales/selling` - Point-of-sale interface
- `/sales/reports` - Sales reports
- `/sales/users` - User management (admin only)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Thanh Trang** - Initial work - [thanhtrang16490](https://github.com/thanhtrang16490)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

For support, email info@appejv.com or call 1900 4512.

---

Made with ❤️ by APPE JV Team
