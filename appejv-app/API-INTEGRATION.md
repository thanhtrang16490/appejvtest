# API Integration Guide - appejv-app với Go API

## ✅ Đã hoàn thành

### 1. API Client Setup
- ✅ `lib/api/client.ts` - Base API client với timeout, error handling
- ✅ Environment variables configuration

### 2. API Services
- ✅ `lib/api/auth.ts` - Authentication (login, logout, refresh, me)
- ✅ `lib/api/products.ts` - Products CRUD
- ✅ `lib/api/customers.ts` - Customers CRUD
- ✅ `lib/api/orders.ts` - Orders CRUD
- ✅ `lib/api/inventory.ts` - Inventory management
- ✅ `lib/api/reports.ts` - Reports (sales, revenue, top products/customers)
- ✅ `lib/api/index.ts` - Export all services

### 3. React Hooks (React Query)
- ✅ `lib/hooks/useProducts.ts` - Products hooks
- ✅ `lib/hooks/useOrders.ts` - Orders hooks

## 🔧 Configuration

### Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000
```

## 📚 Usage Examples

### 1. Using API Services Directly

```typescript
import { productsApi, authApi } from '@/lib/api'

// Get products (public)
const response = await productsApi.getAll({ page: 1, limit: 20 })
if (response.data) {
  console.log(response.data) // Product[]
}

// Login
const loginResponse = await authApi.login({
  email: 'sale@demo.com',
  password: 'demo123'
})
if (loginResponse.data) {
  const { access_token, user } = loginResponse.data
}

// Create order (with token)
const orderResponse = await ordersApi.create(
  {
    customer_id: 1,
    items: [
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 1 }
    ]
  },
  access_token
)
```

### 2. Using React Hooks (Recommended)

```typescript
'use client'

import { useProducts, useCreateProduct } from '@/lib/hooks/useProducts'
import { useOrders, useCreateOrder } from '@/lib/hooks/useOrders'

function ProductsPage() {
  // Fetch products
  const { data, isLoading, error } = useProducts({ page: 1, limit: 20 })
  
  // Create product mutation
  const createProduct = useCreateProduct()
  
  const handleCreate = async () => {
    const result = await createProduct.mutateAsync({
      code: 'P001',
      name: 'New Product',
      price: 100000,
      stock: 50
    })
    
    if (result.data) {
      console.log('Created:', result.data)
    }
  }
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {data?.data?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={handleCreate}>Create Product</button>
    </div>
  )
}
```

### 3. Server Components (Next.js)

```typescript
import { productsApi } from '@/lib/api'

export default async function ProductsPage() {
  const response = await productsApi.getAll({ page: 1, limit: 20 })
  
  if (!response.data) {
    return <div>Failed to load products</div>
  }
  
  return (
    <div>
      {response.data.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

## 🔐 Authentication Flow

### 1. Login với Go API
```typescript
import { authApi } from '@/lib/api'

const response = await authApi.login({
  email: 'sale@demo.com',
  password: 'demo123'
})

if (response.data) {
  const { access_token, refresh_token, user } = response.data
  // Store tokens (localStorage, cookies, etc.)
}
```

### 2. Sử dụng token trong requests
```typescript
// Hooks tự động lấy token từ Supabase session
const createOrder = useCreateOrder()
await createOrder.mutateAsync(orderData)

// Hoặc manual với API services
const { data: { session } } = await supabase.auth.getSession()
const response = await ordersApi.create(orderData, session.access_token)
```

### 3. Refresh token
```typescript
const response = await authApi.refresh({
  refresh_token: stored_refresh_token
})

if (response.data) {
  const { access_token, refresh_token } = response.data
  // Update stored tokens
}
```

## 📊 API Response Format

### Success Response
```typescript
{
  data: T,                    // Response data
  pagination?: {              // For list endpoints
    page: number,
    limit: number,
    total: number,
    total_pages: number
  }
}
```

### Error Response
```typescript
{
  error: string,              // Error message
  message?: string            // Additional message
}
```

## 🎯 Next Steps

### Phase 2.1: Update Existing Pages
- [ ] Update `/sales/orders` to use Go API
- [ ] Update `/sales/customers` to use Go API
- [ ] Update `/sales/inventory` to use Go API
- [ ] Update `/sales/reports` to use Go API

### Phase 2.2: Create Missing Hooks
- [ ] `useCustomers.ts` - Customers hooks
- [ ] `useInventory.ts` - Inventory hooks
- [ ] `useReports.ts` - Reports hooks

### Phase 2.3: Testing
- [ ] Test all CRUD operations
- [ ] Test authentication flow
- [ ] Test error handling
- [ ] Test pagination

### Phase 2.4: Optimization
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add optimistic updates
- [ ] Add caching strategies

## 🐛 Troubleshooting

### API not responding
```bash
# Check if Go API is running
curl http://localhost:8080/health

# Start Go API
npm run dev:api
```

### CORS errors
- Go API đã cấu hình CORS cho `http://localhost:3000`
- Check `appejv-api/.env` - `ALLOWED_ORIGINS`

### Authentication errors
- Check token validity
- Check user role permissions
- Check Supabase session

### Timeout errors
- Increase `NEXT_PUBLIC_API_TIMEOUT` in `.env.local`
- Default: 30000ms (30 seconds)

## 📝 Notes

- API client tự động thêm `Authorization: Bearer <token>` header
- Tất cả requests có timeout 30 seconds
- React Query tự động cache và refetch data
- Mutations tự động invalidate related queries
- Error handling được xử lý ở API client level

---

**Status**: ✅ API Integration Complete  
**Next**: Update existing pages to use Go API
