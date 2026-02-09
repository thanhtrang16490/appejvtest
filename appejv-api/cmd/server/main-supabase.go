package main

import (
	"log"
	"os"

	"github.com/appejv/appejv-api/internal/config"
	"github.com/appejv/appejv-api/internal/handlers"
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
		
		// Allow all origins for now (you can restrict this later)
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
			"status":  "ok",
			"service": "appejv-api",
			"version": "1.0.0",
			"database": "supabase",
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Products (public endpoints)
		products := v1.Group("/products")
		{
			products.GET("", handlers.GetProductsSimple(db))
			products.GET("/:id", handlers.GetProductSimple(db))
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📊 Using Supabase: %s", cfg.SupabaseURL)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
