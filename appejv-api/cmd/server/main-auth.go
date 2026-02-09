package main

import (
	"log"
	"os"

	"github.com/appejv/appejv-api/internal/config"
	"github.com/appejv/appejv-api/internal/handlers"
	"github.com/appejv/appejv-api/internal/middleware"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize Supabase client
	db := database.NewSupabaseClient(cfg)
	log.Println("✓ Connected to Supabase")

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

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
			"status":   "ok",
			"service":  "appejv-api",
			"version":  "1.0.0",
			"database": "supabase",
			"auth":     "enabled",
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Public endpoints (no authentication required)
		public := v1.Group("/")
		{
			public.GET("/products", handlers.GetProductsSimple(db))
			public.GET("/products/:id", handlers.GetProductSimple(db))
		}

		// Protected endpoints (authentication required)
		protected := v1.Group("/")
		protected.Use(middleware.AuthRequired(db))
		{
			// Customer endpoints (all authenticated users)
			protected.GET("/profile", func(c *gin.Context) {
				profile, _ := c.Get("user_profile")
				c.JSON(200, gin.H{"data": profile})
			})

			// Sales endpoints (sale, admin, sale_admin)
			sales := protected.Group("/")
			sales.Use(middleware.RoleRequired("sale", "admin", "sale_admin"))
			{
				// Customers
				sales.GET("/customers", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Get customers - TODO"})
				})
				sales.POST("/customers", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Create customer - TODO"})
				})

				// Orders
				sales.GET("/orders", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Get orders - TODO"})
				})
				sales.POST("/orders", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Create order - TODO"})
				})
			}

			// Admin endpoints (admin, sale_admin only)
			admin := protected.Group("/")
			admin.Use(middleware.RoleRequired("admin", "sale_admin"))
			{
				admin.POST("/products", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Create product - TODO"})
				})
				admin.PUT("/products/:id", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Update product - TODO"})
				})
				admin.DELETE("/products/:id", func(c *gin.Context) {
					c.JSON(200, gin.H{"message": "Delete product - TODO"})
				})
			}
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📊 Using Supabase: %s", cfg.SupabaseURL)
	log.Printf("🔐 Authentication: ENABLED")
	log.Printf("🛡️  Authorization: ENABLED")
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
