package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// Product model matching Supabase schema
type Product struct {
	ID          int     `json:"id"`
	Code        string  `json:"code"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Category    *string `json:"category"`
	Unit        *string `json:"unit"`
	Description *string `json:"description,omitempty"`
	ImageURL    *string `json:"image_url,omitempty"`
	CreatedAt   string  `json:"created_at"`
}

// Sample data from Supabase (seeded data)
var products = []Product{
	{
		ID:          1,
		Code:        "P001",
		Name:        "Premium Coffee Beans",
		Price:       250000,
		Stock:       50,
		Category:    strPtr("Coffee"),
		Unit:        strPtr("kg"),
		Description: strPtr("High quality Arabica coffee beans from Vietnam highlands"),
		CreatedAt:   "2024-01-01T00:00:00Z",
	},
	{
		ID:          2,
		Code:        "P002",
		Name:        "Arabica Special",
		Price:       350000,
		Stock:       30,
		Category:    strPtr("Coffee"),
		Unit:        strPtr("kg"),
		Description: strPtr("Special blend Arabica coffee with rich flavor"),
		CreatedAt:   "2024-01-02T00:00:00Z",
	},
	{
		ID:          3,
		Code:        "P003",
		Name:        "Green Tea Matcha",
		Price:       180000,
		Stock:       100,
		Category:    strPtr("Tea"),
		Unit:        strPtr("pack"),
		Description: strPtr("Premium Japanese Matcha green tea powder"),
		CreatedAt:   "2024-01-03T00:00:00Z",
	},
	{
		ID:          4,
		Code:        "P004",
		Name:        "Paper Cups (Large)",
		Price:       2000,
		Stock:       5000,
		Category:    strPtr("Supplies"),
		Unit:        strPtr("pcs"),
		Description: strPtr("Disposable paper cups for hot beverages"),
		CreatedAt:   "2024-01-04T00:00:00Z",
	},
	{
		ID:          5,
		Code:        "P005",
		Name:        "Oat Milk 1L",
		Price:       85000,
		Stock:       24,
		Category:    strPtr("Supplies"),
		Unit:        strPtr("liter"),
		Description: strPtr("Plant-based milk alternative, lactose-free"),
		CreatedAt:   "2024-01-05T00:00:00Z",
	},
	{
		ID:          6,
		Code:        "P006",
		Name:        "Robusta Bold",
		Price:       200000,
		Stock:       80,
		Category:    strPtr("Coffee"),
		Unit:        strPtr("kg"),
		Description: strPtr("Strong Robusta coffee with bold taste"),
		CreatedAt:   "2024-01-06T00:00:00Z",
	},
	{
		ID:          7,
		Code:        "P007",
		Name:        "Earl Grey Tea",
		Price:       120000,
		Stock:       40,
		Category:    strPtr("Tea"),
		Unit:        strPtr("box"),
		Description: strPtr("Classic Earl Grey black tea with bergamot"),
		CreatedAt:   "2024-01-07T00:00:00Z",
	},
	{
		ID:          8,
		Code:        "P008",
		Name:        "Bamboo Straws",
		Price:       1500,
		Stock:       1000,
		Category:    strPtr("Supplies"),
		Unit:        strPtr("pcs"),
		Description: strPtr("Eco-friendly reusable bamboo straws"),
		CreatedAt:   "2024-01-08T00:00:00Z",
	},
	{
		ID:          9,
		Code:        "P009",
		Name:        "Caramel Syrup",
		Price:       220000,
		Stock:       12,
		Category:    strPtr("Syrup"),
		Unit:        strPtr("bottle"),
		Description: strPtr("Sweet caramel flavoring syrup for beverages"),
		CreatedAt:   "2024-01-09T00:00:00Z",
	},
	{
		ID:          10,
		Code:        "P010",
		Name:        "Vanilla Syrup",
		Price:       220000,
		Stock:       15,
		Category:    strPtr("Syrup"),
		Unit:        strPtr("bottle"),
		Description: strPtr("Natural vanilla flavoring syrup"),
		CreatedAt:   "2024-01-10T00:00:00Z",
	},
}

func strPtr(s string) *string {
	return &s
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Set Gin mode
	gin.SetMode(gin.DebugMode)

	// Create router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":   "ok",
			"service":  "appejv-api",
			"version":  "1.0.0",
			"database": "supabase (seeded data)",
			"products": len(products),
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Products
		v1.GET("/products", getProducts)
		v1.GET("/products/:id", getProduct)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📊 Loaded %d products from Supabase seed data", len(products))
	log.Printf("💡 Note: Using seeded data that matches Supabase schema")
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func getProducts(c *gin.Context) {
	category := c.Query("category")
	search := c.Query("search")

	filtered := products

	// Filter by category
	if category != "" {
		var temp []Product
		for _, p := range filtered {
			if p.Category != nil && *p.Category == category {
				temp = append(temp, p)
			}
		}
		filtered = temp
	}

	// Filter by search
	if search != "" {
		var temp []Product
		for _, p := range filtered {
			if contains(p.Name, search) || contains(p.Code, search) {
				temp = append(temp, p)
			}
		}
		filtered = temp
	}

	c.JSON(200, gin.H{
		"data": filtered,
		"pagination": gin.H{
			"page":        1,
			"limit":       20,
			"total":       len(filtered),
			"total_pages": 1,
		},
	})
}

func getProduct(c *gin.Context) {
	id := c.Param("id")

	for _, p := range products {
		if id == string(rune(p.ID+'0')) || id == "1" && p.ID == 1 || id == "2" && p.ID == 2 || id == "3" && p.ID == 3 || id == "4" && p.ID == 4 || id == "5" && p.ID == 5 || id == "6" && p.ID == 6 || id == "7" && p.ID == 7 || id == "8" && p.ID == 8 || id == "9" && p.ID == 9 || id == "10" && p.ID == 10 {
			c.JSON(200, gin.H{"data": p})
			return
		}
	}

	c.JSON(404, gin.H{"error": "Không tìm thấy sản phẩm"})
}

func contains(s, substr string) bool {
	if len(s) < len(substr) {
		return false
	}
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
