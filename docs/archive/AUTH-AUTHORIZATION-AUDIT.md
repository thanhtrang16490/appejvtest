# Đánh Giá Hệ Thống Auth & Phân Quyền

**Ngày kiểm tra:** 9 tháng 2, 2026  
**Trạng thái:** ⚠️ **CẦN CHUẨN HÓA**

## Yêu Cầu Chuẩn

### 1. Authentication Flow
- ✅ **Supabase Auth** - Login ở client (web/mobile)
- ⚠️ **JWT Token** - Cần gửi qua `Authorization: Bearer <token>`
- ⚠️ **API Verification** - Go API cần verify JWT + role

### 2. Authorization
- ✅ **Role trong DB** - Lưu trong bảng `profiles`
- ⚠️ **API Verify Role** - Go API cần check role từ JWT
- ✅ **UI Hide/Show** - UI chỉ ẩn/hiện dựa trên role

## Hiện Trạng Hệ Thống

### ✅ Đã Có (Working)

#### 1. Supabase Auth Setup
```typescript
// appejv-app/lib/supabase/client.ts
export const createClient = () =>
    createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
```

#### 2. Login Actions
```typescript
// appejv-app/app/auth/actions.ts
export async function login(formData: FormData) {
    const supabase = await createClient()
    // Login với email/phone + password
    // Lấy role từ profiles table
    return { success: true, role: profile.role }
}
```

#### 3. Middleware Protection
```typescript
// appejv-app/middleware.ts
// ✅ Protect routes: /customer, /sales
// ✅ Check role cho /sales routes
// ✅ Redirect nếu không có quyền
```

#### 4. Role-Based UI
```typescript
// Layout components check role để show/hide
const shouldShowSidebar = user && 
    pathname.startsWith('/sales') && 
    ['sale', 'admin', 'sale_admin'].includes(role)
```

#### 5. API Client với JWT Support
```typescript
// appejv-app/lib/api/client.ts
async get<T>(endpoint: string, token?: string) {
    return this.request<T>(endpoint, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
}
```

#### 6. Go API Auth Middleware
```go
// appejv-api/internal/middleware/auth.go
func AuthRequired(db *database.Database) gin.HandlerFunc {
    // ✅ Extract Bearer token
    // ✅ Verify với Supabase
    // ✅ Get user profile + role
    // ✅ Store trong context
}

func RoleRequired(roles ...string) gin.HandlerFunc {
    // ✅ Check role từ context
    // ✅ Return 403 nếu không đủ quyền
}
```

### ⚠️ Vấn Đề Cần Sửa

#### 1. **CRITICAL: Không Gửi JWT Token từ Client**

**Vấn đề:**
```typescript
// appejv-app/lib/api/products.ts
export const productsApi = {
  async getAll(query?: ProductsQuery) {
    // ❌ KHÔNG GỬI TOKEN!
    return apiClient.get<Product[]>(`/products?...`)
  }
}
```

**Cần:**
```typescript
// Lấy session token từ Supabase
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token

// Gửi token với mọi request
return apiClient.get<Product[]>(`/products?...`, token)
```

#### 2. **Go API Middleware Chưa Được Sử Dụng**

**Vấn đề:**
```go
// appejv-api/cmd/server/main-test.go
v1.GET("/products", handlers.GetProducts(db))
// ❌ KHÔNG CÓ MIDDLEWARE AUTH!
```

**Cần:**
```go
// Public endpoints (không cần auth)
public := v1.Group("/")
{
    public.GET("/products", handlers.GetProducts(db))
}

// Protected endpoints (cần auth)
protected := v1.Group("/")
protected.Use(middleware.AuthRequired(db))
{
    protected.POST("/products", 
        middleware.RoleRequired("admin", "sale_admin"),
        handlers.CreateProduct(db))
}
```

#### 3. **API Supabase Client Sai**

**Vấn đề:**
```go
// appejv-api/internal/middleware/auth.go
user, err := db.Client.Auth.User(c.Request.Context(), token)
// ❌ API này không tồn tại trong supabase-go v0.0.4
```

**Cần:** Verify JWT bằng Supabase Admin API hoặc JWT library

## Kiến Trúc Chuẩn

```
┌─────────────────────────────────────────────────────┐
│                   Browser/Mobile                    │
│                                                     │
│  1. Login với Supabase Auth                         │
│  2. Nhận JWT access_token                           │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Authorization: Bearer <JWT>
                     ▼
┌─────────────────────────────────────────────────────┐
│              Next.js App (Port 3000)                │
│                                                     │
│  - Lấy session.access_token từ Supabase            │
│  - Gửi token với mọi API request                   │
│  - UI hide/show dựa trên role (client-side)        │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Authorization: Bearer <JWT>
                     ▼
┌─────────────────────────────────────────────────────┐
│           Go API Server (Port 8081)                 │
│                                                     │
│  1. Extract JWT từ Authorization header            │
│  2. Verify JWT với Supabase                        │
│  3. Decode JWT → user_id                           │
│  4. Query profiles table → role                    │
│  5. Check role permissions                         │
│  6. Return 401/403 nếu không hợp lệ                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                  Supabase                           │
│                                                     │
│  - auth.users (JWT issuer)                         │
│  - profiles (role storage)                         │
│  - Verify JWT signature                            │
└─────────────────────────────────────────────────────┘
```

## Roles Định Nghĩa

```typescript
type Role = 'customer' | 'sale' | 'admin' | 'sale_admin'
```

### Permissions Matrix

| Endpoint | customer | sale | admin | sale_admin |
|----------|----------|------|-------|------------|
| GET /products | ✅ | ✅ | ✅ | ✅ |
| POST /products | ❌ | ❌ | ✅ | ✅ |
| PUT /products | ❌ | ❌ | ✅ | ✅ |
| DELETE /products | ❌ | ❌ | ✅ | ❌ |
| GET /customers | ❌ | ✅ | ✅ | ✅ |
| POST /customers | ❌ | ✅ | ✅ | ✅ |
| GET /orders | Own | Assigned | ✅ | ✅ |
| POST /orders | ✅ | ✅ | ✅ | ✅ |
| GET /reports | ❌ | Own | ✅ | ✅ |

## Cần Làm Gì

### Phase 1: Fix Client-Side (Priority: HIGH)

#### 1.1. Tạo Auth Helper
```typescript
// appejv-app/lib/auth/token.ts
import { createClient } from '@/lib/supabase/client'

export async function getAccessToken(): Promise<string | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}
```

#### 1.2. Update API Calls
```typescript
// appejv-app/lib/api/products.ts
import { getAccessToken } from '@/lib/auth/token'

export const productsApi = {
  async getAll(query?: ProductsQuery) {
    const token = await getAccessToken()
    return apiClient.get<Product[]>(`/products?...`, token)
  },
  
  async create(data: CreateProductData) {
    const token = await getAccessToken()
    if (!token) throw new Error('Not authenticated')
    return apiClient.post<Product>('/products', data, token)
  }
}
```

#### 1.3. Update React Query Hooks
```typescript
// appejv-app/lib/hooks/useProducts.ts
export function useProducts(query?: ProductsQuery) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: async () => {
      const response = await productsApi.getAll(query)
      if (response.error) throw new Error(response.error)
      return response.data
    }
  })
}
```

### Phase 2: Fix Go API (Priority: HIGH)

#### 2.1. Implement JWT Verification
```go
// appejv-api/internal/middleware/auth.go
import (
    "github.com/golang-jwt/jwt/v5"
)

func AuthRequired(db *database.Database) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Extract token
        token := extractToken(c)
        
        // 2. Verify JWT signature với Supabase public key
        claims, err := verifySupabaseJWT(token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        
        // 3. Get user_id từ claims
        userID := claims["sub"].(string)
        
        // 4. Query role từ profiles
        var profile Profile
        err = db.Client.From("profiles").
            Select("*").
            Eq("id", userID).
            Single().
            ExecuteTo(&profile)
            
        // 5. Store trong context
        c.Set("user_id", userID)
        c.Set("user_role", profile.Role)
        c.Next()
    }
}
```

#### 2.2. Apply Middleware
```go
// appejv-api/cmd/server/main.go
v1 := r.Group("/api/v1")

// Public endpoints
public := v1.Group("/")
{
    public.GET("/products", handlers.GetProducts(db))
    public.GET("/products/:id", handlers.GetProduct(db))
}

// Protected endpoints
protected := v1.Group("/")
protected.Use(middleware.AuthRequired(db))
{
    // Admin only
    admin := protected.Group("/")
    admin.Use(middleware.RoleRequired("admin", "sale_admin"))
    {
        admin.POST("/products", handlers.CreateProduct(db))
        admin.PUT("/products/:id", handlers.UpdateProduct(db))
    }
    
    // Sales + Admin
    sales := protected.Group("/")
    sales.Use(middleware.RoleRequired("sale", "admin", "sale_admin"))
    {
        sales.GET("/customers", handlers.GetCustomers(db))
        sales.POST("/orders", handlers.CreateOrder(db))
    }
}
```

### Phase 3: Testing (Priority: MEDIUM)

#### 3.1. Test Auth Flow
```bash
# 1. Login và lấy token
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@demo.com","password":"password"}'

# 2. Test với token
TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl http://localhost:8081/api/v1/products \
  -H "Authorization: Bearer $TOKEN"

# 3. Test without token (should fail)
curl http://localhost:8081/api/v1/products

# 4. Test wrong role (should fail)
curl -X POST http://localhost:8081/api/v1/products \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{"name":"Test"}'
```

#### 3.2. Test Script
```bash
#!/bin/bash
# test-auth.sh

echo "Testing Authentication & Authorization"

# Test 1: Public endpoint (no auth)
echo "1. Public endpoint (should work)"
curl -s http://localhost:8081/api/v1/products | jq .

# Test 2: Protected endpoint without token
echo "2. Protected endpoint without token (should fail)"
curl -s http://localhost:8081/api/v1/customers | jq .

# Test 3: Protected endpoint with valid token
echo "3. Protected endpoint with token (should work)"
curl -s http://localhost:8081/api/v1/customers \
  -H "Authorization: Bearer $TOKEN" | jq .

# Test 4: Admin endpoint with customer token
echo "4. Admin endpoint with customer token (should fail)"
curl -s -X POST http://localhost:8081/api/v1/products \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{"name":"Test"}' | jq .
```

## Security Best Practices

### 1. JWT Token Storage
- ✅ **httpOnly cookies** - Supabase SSR đã handle
- ✅ **Secure flag** - HTTPS only
- ✅ **SameSite** - CSRF protection

### 2. Token Expiration
- ✅ **Access token:** 1 hour (Supabase default)
- ✅ **Refresh token:** 30 days
- ✅ **Auto refresh** - Middleware handle

### 3. API Security
- ✅ **CORS** - Configured
- ✅ **Rate limiting** - Implemented
- ✅ **Audit logs** - Implemented
- ⚠️ **JWT verification** - Cần implement

### 4. Role Verification
- ❌ **Client-side only** - KHÔNG AN TOÀN
- ✅ **Server-side** - Cần implement
- ✅ **Database-driven** - Đã có

## Checklist Chuẩn Hóa

### Client (Next.js App)
- [ ] Tạo `lib/auth/token.ts` helper
- [ ] Update tất cả API calls gửi token
- [ ] Update React Query hooks
- [ ] Test login flow
- [ ] Test token refresh

### Server (Go API)
- [ ] Implement JWT verification
- [ ] Apply AuthRequired middleware
- [ ] Apply RoleRequired middleware
- [ ] Update all protected endpoints
- [ ] Test với Postman/curl

### Testing
- [ ] Tạo test script
- [ ] Test public endpoints
- [ ] Test protected endpoints
- [ ] Test role permissions
- [ ] Test token expiration

### Documentation
- [ ] Update API documentation
- [ ] Document authentication flow
- [ ] Document role permissions
- [ ] Create troubleshooting guide

## Kết Luận

### Hiện Trạng
- ✅ **Infrastructure:** Supabase Auth setup tốt
- ✅ **UI Protection:** Middleware và role check
- ⚠️ **API Security:** Chưa verify JWT
- ❌ **Token Flow:** Không gửi token từ client

### Mức Độ Nghiêm Trọng
🔴 **CRITICAL** - API không verify JWT = không có security thực sự

### Ưu Tiên
1. **HIGH:** Implement JWT verification trong Go API
2. **HIGH:** Gửi token từ client
3. **MEDIUM:** Apply middleware cho tất cả endpoints
4. **LOW:** Testing và documentation

### Thời Gian Ước Tính
- Phase 1 (Client): 2-3 giờ
- Phase 2 (Server): 3-4 giờ
- Phase 3 (Testing): 1-2 giờ
- **Total:** 6-9 giờ

---

**Prepared by:** Kiro AI  
**Date:** 9/2/2026  
**Status:** ⚠️ Needs Immediate Action
