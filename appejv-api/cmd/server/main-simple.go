package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// Simple mock data for testing
type Product struct {
	ID          int     `json:"id"`
	Code        string  `json:"code"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Category    string  `json:"category"`
	Unit        string  `json:"unit"`
	Description string  `json:"description,omitempty"`
	CreatedAt   string  `json:"created_at"`
}

var mockProducts = []Product{
	{ID: 1, Code: "P001", Name: "Premium Coffee Beans", Price: 250000, Stock: 50, Category: "Coffee", Unit: "kg", Description: "High quality Arabica coffee beans", CreatedAt: "2024-01-01T00:00:00Z"},
	{ID: 2, Code: "P002", Name: "Arabica Special", Price: 350000, Stock: 30, Category: "Coffee", Unit: "kg", Description: "Special blend Arabica", CreatedAt: "2024-01-02T00:00:00Z"},
	{ID: 3, Code: "P003", Name: "Green Tea Matcha", Price: 180000, Stock: 100, Category: "Tea", Unit: "pack", Description: "Premium Japanese Matcha", CreatedAt: "2024-01-03T00:00:00Z"},
	{ID: 4, Code: "P004", Name: "Paper Cups (Large)", Price: 2000, Stock: 5000, Category: "Supplies", Unit: "pcs", Description: "Disposable paper cups", CreatedAt: "2024-01-04T00:00:00Z"},
	{ID: 5, Code: "P005", Name: "Oat Milk 1L", Price: 85000, Stock: 24, Category: "Supplies", Unit: "liter", Description: "Plant-based milk alternative", CreatedAt: "2024-01-05T00:00:00Z"},
	{ID: 6, Code: "P006", Name: "Robusta Bold", Price: 200000, Stock: 80, Category: "Coffee", Unit: "kg", Description: "Strong Robusta coffee", CreatedAt: "2024-01-06T00:00:00Z"},
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
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "appejv-api",
			"version": "1.0.0",
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Products
		v1.GET("/products", func(c *gin.Context) {
			category := c.Query("category")
			search := c.Query("search")
			
			filtered := mockProducts
			
			// Filter by category
			if category != "" {
				var temp []Product
				for _, p := range filtered {
					if p.Category == category {
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
		})

		v1.GET("/products/:id", func(c *gin.Context) {
			id := c.Param("id")
			
			for _, p := range mockProducts {
				if id == string(rune(p.ID+'0')) {
					c.JSON(200, gin.H{"data": p})
					return
				}
			}
			
			c.JSON(404, gin.H{"error": "Product not found"})
		})
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📝 Mock data: %d products", len(mockProducts))
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && containsMiddle(s, substr))
}

func containsMiddle(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
