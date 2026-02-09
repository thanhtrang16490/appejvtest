# Setup Guide - APPE JV Go API

## Bước 1: Cài đặt Go

### macOS
```bash
brew install go
```

### Linux
```bash
wget https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

### Windows
Download từ: https://go.dev/dl/

## Bước 2: Kiểm tra cài đặt

```bash
go version
# Kết quả: go version go1.22.0 darwin/amd64
```

## Bước 3: Cài đặt dependencies

```bash
cd appejv-api
go mod download
```

## Bước 4: Cấu hình môi trường

File `.env` đã được tạo sẵn với thông tin Supabase. Kiểm tra:

```bash
cat .env
```

## Bước 5: Chạy server

```bash
# Từ thư mục appejv-api
go run cmd/server/main.go

# Hoặc từ root monorepo
npm run dev:api
```

Server sẽ chạy tại: http://localhost:8080

## Bước 6: Test API

### Test Health Check
```bash
curl http://localhost:8080/health
```

### Test với script
```bash
./test-api.sh
```

## Bước 7: Chạy tất cả services

Từ root monorepo:

```bash
npm run dev:all
```

Sẽ chạy:
- appejv-web (Astro) - http://localhost:4321
- appejv-app (Next.js) - http://localhost:3000
- appejv-api (Go) - http://localhost:8080

## Troubleshooting

### Lỗi: "go: command not found"
→ Go chưa được cài đặt hoặc chưa thêm vào PATH

### Lỗi: "cannot find package"
→ Chạy: `go mod download`

### Lỗi: "port 8080 already in use"
→ Đổi PORT trong .env hoặc kill process đang dùng port 8080:
```bash
lsof -ti:8080 | xargs kill -9
```

### Lỗi: "Failed to initialize Supabase client"
→ Kiểm tra SUPABASE_URL và SUPABASE_ANON_KEY trong .env

## Development Tips

### Hot Reload
Cài đặt Air cho hot reload:
```bash
go install github.com/cosmtrek/air@latest
air
```

### Format Code
```bash
go fmt ./...
```

### Build Binary
```bash
go build -o bin/server cmd/server/main.go
./bin/server
```

## API Endpoints

Xem chi tiết trong [README.md](./README.md)

### Quick Test với curl

```bash
# Get products
curl http://localhost:8080/api/v1/products

# Login (use real credentials from Supabase)
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'

# Get customers (cần token)
curl http://localhost:8080/api/v1/customers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. ✅ API đã chạy
2. Test với Postman hoặc curl
3. Kết nối từ appejv-app (Next.js)
4. Kết nối từ appejv-web (Astro)
5. Deploy lên Railway/Fly.io

---

Happy coding! 🚀
