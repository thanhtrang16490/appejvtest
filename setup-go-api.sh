#!/bin/bash

# Setup Go API Project
# Run this from the monorepo root directory (appejv/)

set -e

echo "🔧 Setting up appejv-api (Go)..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "appejv-app" ]; then
    echo "❌ Error: Please run this script from the monorepo root (appejv/)"
    exit 1
fi

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Error: Go is not installed. Please install Go >= 1.21"
    echo "   Visit: https://go.dev/doc/install"
    exit 1
fi

echo "✅ Go version: $(go version)"
echo ""

# Create directory structure
echo "📁 Step 1: Creating directory structure..."
mkdir -p appejv-api/cmd/server
mkdir -p appejv-api/internal/handlers
mkdir -p appejv-api/internal/models
mkdir -p appejv-api/internal/services
mkdir -p appejv-api/internal/middleware
mkdir -p appejv-api/pkg/database
mkdir -p appejv-api/pkg/utils
mkdir -p appejv-api/config

cd appejv-api

# Initialize Go module
echo "📦 Step 2: Initializing Go module..."
go mod init github.com/yourusername/appejv-api

# Install dependencies
echo "📦 Step 3: Installing dependencies..."
go get github.com/gin-gonic/gin
go get github.com/supabase-community/supabase-go
go get github.com/joho/godotenv

# Create main server file
echo "📝 Step 4: Creating main server file..."
cat > cmd/server/main.go << 'EOF'
package main

import (
    "log"
    "os"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func main() {
    // Load environment variables
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, using system environment variables")
    }

    // Get port from environment or use default
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // Create Gin router
    r := gin.Default()

    // CORS middleware
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }
        
        c.Next()
    })

    // Health check endpoint
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "status":  "ok",
            "message": "APPE JV API is running",
            "version": "1.0.0",
        })
    })

    // API v1 routes
    v1 := r.Group("/api/v1")
    {
        // Orders endpoints
        orders := v1.Group("/orders")
        {
            orders.GET("", func(c *gin.Context) {
                c.JSON(200, gin.H{
                    "message": "List orders",
                    "data":    []interface{}{},
                })
            })
            
            orders.GET("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Get order",
                    "id":      id,
                })
            })
            
            orders.POST("", func(c *gin.Context) {
                c.JSON(201, gin.H{
                    "message": "Create order",
                })
            })
            
            orders.PUT("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Update order",
                    "id":      id,
                })
            })
            
            orders.DELETE("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Delete order",
                    "id":      id,
                })
            })
        }

        // Customers endpoints
        customers := v1.Group("/customers")
        {
            customers.GET("", func(c *gin.Context) {
                c.JSON(200, gin.H{
                    "message": "List customers",
                    "data":    []interface{}{},
                })
            })
            
            customers.GET("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Get customer",
                    "id":      id,
                })
            })
            
            customers.POST("", func(c *gin.Context) {
                c.JSON(201, gin.H{
                    "message": "Create customer",
                })
            })
            
            customers.PUT("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Update customer",
                    "id":      id,
                })
            })
            
            customers.DELETE("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Delete customer",
                    "id":      id,
                })
            })
        }

        // Products endpoints
        products := v1.Group("/products")
        {
            products.GET("", func(c *gin.Context) {
                c.JSON(200, gin.H{
                    "message": "List products",
                    "data":    []interface{}{},
                })
            })
            
            products.GET("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Get product",
                    "id":      id,
                })
            })
            
            products.POST("", func(c *gin.Context) {
                c.JSON(201, gin.H{
                    "message": "Create product",
                })
            })
            
            products.PUT("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Update product",
                    "id":      id,
                })
            })
            
            products.DELETE("/:id", func(c *gin.Context) {
                id := c.Param("id")
                c.JSON(200, gin.H{
                    "message": "Delete product",
                    "id":      id,
                })
            })
        }

        // Reports endpoints
        reports := v1.Group("/reports")
        {
            reports.GET("/sales", func(c *gin.Context) {
                c.JSON(200, gin.H{
                    "message": "Sales report",
                    "data":    gin.H{},
                })
            })
            
            reports.GET("/revenue", func(c *gin.Context) {
                c.JSON(200, gin.H{
                    "message": "Revenue report",
                    "data":    gin.H{},
                })
            })
            
            reports.GET("/inventory", func(c *gin.Context) {
                c.JSON(200, gin.H{
                    "message": "Inventory report",
                    "data":    gin.H{},
                })
            })
        }
    }

    // Start server
    log.Printf("🚀 Starting APPE JV API server on port %s", port)
    log.Printf("📚 API Documentation: http://localhost:%s/health", port)
    
    if err := r.Run(":" + port); err != nil {
        log.Fatal("Failed to start server:", err)
    }
}
EOF

# Create .env file
echo "📝 Step 5: Creating .env file..."
cat > .env << 'EOF'
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
EOF

# Create .gitignore
echo "📝 Step 6: Creating .gitignore..."
cat > .gitignore << 'EOF'
# Binaries
bin/
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary
*.test

# Output of the go coverage tool
*.out

# Dependency directories
vendor/

# Go workspace file
go.work

# Environment variables
.env
.env.local

# IDE
.vscode/
.idea/
EOF

# Create README
echo "📝 Step 7: Creating README..."
cat > README.md << 'EOF'
# APPE JV API

Backend API server built with Go and Gin framework.

## Features

- RESTful API endpoints
- CORS support
- Health check endpoint
- Supabase integration ready

## Development

```bash
# Run server
go run cmd/server/main.go

# Or use the npm script from root
cd ..
npm run dev:api
```

Visit http://localhost:8080/health

## Build

```bash
# Build binary
go build -o bin/server cmd/server/main.go

# Run binary
./bin/server
```

## API Endpoints

### Health Check
- `GET /health` - Health check

### Orders
- `GET /api/v1/orders` - List all orders
- `GET /api/v1/orders/:id` - Get order by ID
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id` - Update order
- `DELETE /api/v1/orders/:id` - Delete order

### Customers
- `GET /api/v1/customers` - List all customers
- `GET /api/v1/customers/:id` - Get customer by ID
- `POST /api/v1/customers` - Create new customer
- `PUT /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Delete customer

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Reports
- `GET /api/v1/reports/sales` - Sales report
- `GET /api/v1/reports/revenue` - Revenue report
- `GET /api/v1/reports/inventory` - Inventory report

## Environment Variables

```env
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Tech Stack

- Go 1.21+
- Gin Web Framework
- Supabase Go Client
- godotenv

## Project Structure

```
appejv-api/
├── cmd/
│   └── server/
│       └── main.go          # Main entry point
├── internal/
│   ├── handlers/            # HTTP handlers
│   ├── models/              # Data models
│   ├── services/            # Business logic
│   └── middleware/          # Middleware functions
├── pkg/
│   ├── database/            # Database utilities
│   └── utils/               # Helper functions
├── config/                  # Configuration files
├── .env                     # Environment variables
├── go.mod                   # Go module file
└── README.md                # This file
```

## Next Steps

1. Implement Supabase integration
2. Add authentication middleware
3. Implement business logic in services
4. Add request validation
5. Add logging
6. Add tests
EOF

cd ..

echo ""
echo "✅ appejv-api setup completed!"
echo ""
echo "🚀 To start development:"
echo "   cd appejv-api"
echo "   go run cmd/server/main.go"
echo ""
echo "📚 API Documentation: http://localhost:8080/health"
echo ""
echo "📝 Next steps:"
echo "   1. Update .env with your Supabase credentials"
echo "   2. Implement Supabase integration"
echo "   3. Add authentication middleware"
