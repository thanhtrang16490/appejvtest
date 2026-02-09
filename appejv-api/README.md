# APPE JV API - Go Backend

REST API backend cho hệ thống quản lý bán hàng APPE JV, được xây dựng với Go, Gin framework và Supabase.

## 🚀 Tính năng

### Core API
- **Products API**: Quản lý sản phẩm (CRUD)
- **Customers API**: Quản lý khách hàng (CRUD)
- **Orders API**: Quản lý đơn hàng với tự động trừ tồn kho
- **Inventory API**: Quản lý tồn kho, cảnh báo hàng sắp hết
- **Reports API**: Báo cáo doanh thu, sản phẩm bán chạy, khách hàng VIP
- **Auth API**: Xác thực với Supabase Auth

### Security
- **CORS**: Cấu hình CORS cho phép các domain cụ thể
- **Rate Limiting**: Giới hạn 100 requests/phút mỗi IP
- **Security Headers**: CSP, HSTS, XSS Protection
- **Role-Based Access Control**: Phân quyền theo vai trò (admin, sale_admin, sale, customer)
- **JWT Authentication**: Xác thực với Supabase JWT tokens

## 📋 Yêu cầu

- Go 1.22 hoặc cao hơn
- Supabase account
- PostgreSQL database (qua Supabase)

## 🔧 Cài đặt

### 1. Clone và cài đặt dependencies

```bash
cd appejv-api
go mod download
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các giá trị trong `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=8080
GIN_MODE=debug
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4321
JWT_SECRET=your_jwt_secret
```

### 3. Chạy server

```bash
# Development mode
go run cmd/server/main.go

# Hoặc build và chạy
go build -o bin/server cmd/server/main.go
./bin/server
```

Server sẽ chạy tại `http://localhost:8080`

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication
Tất cả các protected endpoints yêu cầu header:
```
Authorization: Bearer <access_token>
```

### Endpoints

#### Auth
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/logout` - Đăng xuất
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại

#### Products
- `GET /api/v1/products` - Danh sách sản phẩm (public)
- `GET /api/v1/products/:id` - Chi tiết sản phẩm (public)
- `POST /api/v1/products` - Tạo sản phẩm (admin, sale_admin)
- `PUT /api/v1/products/:id` - Cập nhật sản phẩm (admin, sale_admin)
- `DELETE /api/v1/products/:id` - Xóa sản phẩm (admin, sale_admin)

#### Customers
- `GET /api/v1/customers` - Danh sách khách hàng (authenticated)
- `GET /api/v1/customers/:id` - Chi tiết khách hàng (authenticated)
- `POST /api/v1/customers` - Tạo khách hàng (admin, sale_admin, sale)
- `PUT /api/v1/customers/:id` - Cập nhật khách hàng (authenticated)
- `DELETE /api/v1/customers/:id` - Xóa khách hàng (admin, sale_admin)

#### Orders
- `GET /api/v1/orders` - Danh sách đơn hàng (authenticated)
- `GET /api/v1/orders/:id` - Chi tiết đơn hàng (authenticated)
- `POST /api/v1/orders` - Tạo đơn hàng (authenticated)
- `PUT /api/v1/orders/:id` - Cập nhật đơn hàng (authenticated)
- `DELETE /api/v1/orders/:id` - Xóa đơn hàng (admin, sale_admin)

#### Inventory
- `GET /api/v1/inventory` - Danh sách tồn kho (authenticated)
- `GET /api/v1/inventory/low-stock` - Sản phẩm sắp hết hàng (authenticated)
- `POST /api/v1/inventory/adjust` - Điều chỉnh tồn kho (admin, sale_admin)

#### Reports
- `GET /api/v1/reports/sales` - Báo cáo doanh số (authenticated)
- `GET /api/v1/reports/revenue` - Báo cáo doanh thu (authenticated)
- `GET /api/v1/reports/top-products` - Sản phẩm bán chạy (authenticated)
- `GET /api/v1/reports/top-customers` - Khách hàng VIP (authenticated)

### Query Parameters

#### Pagination
```
?page=1&limit=20
```

#### Filtering
```
?category=Coffee&search=arabica
?status=completed&customer_id=123
?start_date=2024-01-01&end_date=2024-12-31
```

## 🏗️ Cấu trúc dự án

```
appejv-api/
├── cmd/
│   └── server/
│       └── main.go              # Entry point
├── internal/
│   ├── config/
│   │   └── config.go            # Configuration
│   ├── handlers/
│   │   ├── auth.go              # Auth handlers
│   │   ├── products.go          # Product handlers
│   │   ├── customers.go         # Customer handlers
│   │   ├── orders.go            # Order handlers
│   │   ├── inventory.go         # Inventory handlers
│   │   └── reports.go           # Report handlers
│   ├── middleware/
│   │   ├── auth.go              # Authentication middleware
│   │   ├── cors.go              # CORS middleware
│   │   ├── ratelimit.go         # Rate limiting
│   │   └── security.go          # Security headers
│   └── models/
│       ├── product.go           # Product models
│       ├── customer.go          # Customer models
│       ├── order.go             # Order models
│       └── user.go              # User models
├── pkg/
│   └── database/
│       └── supabase.go          # Supabase client
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore
├── go.mod                       # Go modules
├── go.sum                       # Go dependencies
├── Makefile                     # Build commands
└── README.md                    # This file
```

## 🛠️ Development

### Build
```bash
make build
```

### Run
```bash
make run
```

### Test
```bash
make test
```

### Clean
```bash
make clean
```

## 🚀 Deployment

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Fly.io
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly deploy
```

### Docker
```bash
# Build image
docker build -t appejv-api .

# Run container
docker run -p 8080:8080 --env-file .env appejv-api
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `PORT` | Server port | No (default: 8080) |
| `GIN_MODE` | Gin mode (debug/release) | No (default: debug) |
| `ALLOWED_ORIGINS` | CORS allowed origins | No |
| `JWT_SECRET` | JWT secret key | Yes |

## 🔐 Security

- Rate limiting: 100 requests/minute per IP
- CORS: Chỉ cho phép các domain được cấu hình
- Authentication: JWT tokens từ Supabase
- Authorization: Role-based access control
- Security headers: CSP, HSTS, XSS Protection
- Input validation: Gin binding validation

## 📄 License

MIT License

## 👥 Authors

APPE JV Team

---

Made with ❤️ using Go and Gin
