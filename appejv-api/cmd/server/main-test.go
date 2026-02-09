package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/appejv/appejv-api/internal/config"
	"github.com/appejv/appejv-api/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/supabase-community/postgrest-go"
	"github.com/supabase-community/supabase-go"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize Supabase client
	client, err := supabase.NewClient(cfg.SupabaseURL, cfg.SupabaseAnonKey, &supabase.ClientOptions{})
	if err != nil {
		log.Fatal("Failed to create Supabase client:", err)
	}
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
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Products endpoints
		v1.GET("/products", func(c *gin.Context) {
			category := c.Query("category")
			search := c.Query("search")
			page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
			limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
			offset := (page - 1) * limit

			// Build query
			query := client.From("products").Select("*", "", false)
			
			// Filter deleted
			query = query.Is("deleted_at", "null")
			
			// Filter by category
			if category != "" {
				query = query.Eq("category", category)
			}
			
			// Search
			if search != "" {
				query = query.Or("name.ilike.%"+search+"%,code.ilike.%"+search+"%", "")
			}
			
			// Pagination
			query = query.Range(offset, offset+limit-1, "")
			
			// Order
			query = query.Order("created_at", &postgrest.OrderOpts{Ascending: false})

			var products []models.Product
			count, err := query.ExecuteTo(&products)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			totalPages := (int(count) + limit - 1) / limit

			c.JSON(http.StatusOK, gin.H{
				"data": products,
				"pagination": gin.H{
					"page":        page,
					"limit":       limit,
					"total":       count,
					"total_pages": totalPages,
				},
			})
		})

		v1.GET("/products/:id", func(c *gin.Context) {
			id := c.Param("id")

			var products []models.Product
			_, err := client.From("products").
				Select("*", "", false).
				Eq("id", id).
				Is("deleted_at", "null").
				Limit(1, "").
				ExecuteTo(&products)

			if err != nil || len(products) == 0 {
				c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy sản phẩm"})
				return
			}

			c.JSON(http.StatusOK, gin.H{"data": products[0]})
		})
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
