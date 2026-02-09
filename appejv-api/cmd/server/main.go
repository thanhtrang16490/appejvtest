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

	// Set Gin mode
	gin.SetMode(cfg.GinMode)

	// Create router
	r := gin.Default()

	// Apply middleware
	r.Use(middleware.CORS(cfg.AllowedOrigins))
	r.Use(middleware.RateLimit())
	r.Use(middleware.SecurityHeaders())

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
		products := v1.Group("/products")
		{
			products.GET("", handlers.GetProducts(db))
			products.GET("/:id", handlers.GetProduct(db))
			products.POST("", middleware.AuthRequired(db), middleware.RoleRequired("admin", "sale_admin"), handlers.CreateProduct(db))
			products.PUT("/:id", middleware.AuthRequired(db), middleware.RoleRequired("admin", "sale_admin"), handlers.UpdateProduct(db))
			products.DELETE("/:id", middleware.AuthRequired(db), middleware.RoleRequired("admin", "sale_admin"), handlers.DeleteProduct(db))
		}

		// Customers
		customers := v1.Group("/customers")
		{
			customers.GET("", middleware.AuthRequired(db), handlers.GetCustomers(db))
			customers.GET("/:id", middleware.AuthRequired(db), handlers.GetCustomer(db))
			customers.POST("", middleware.AuthRequired(db), middleware.RoleRequired("admin", "sale_admin", "sale"), handlers.CreateCustomer(db))
			customers.PUT("/:id", middleware.AuthRequired(db), handlers.UpdateCustomer(db))
			customers.DELETE("/:id", middleware.AuthRequired(db), middleware.RoleRequired("admin", "sale_admin"), handlers.DeleteCustomer(db))
		}

		// Orders
		orders := v1.Group("/orders")
		{
			orders.GET("", middleware.AuthRequired(db), handlers.GetOrders(db))
			orders.GET("/:id", middleware.AuthRequired(db), handlers.GetOrder(db))
			orders.POST("", middleware.AuthRequired(db), handlers.CreateOrder(db))
			orders.PUT("/:id", middleware.AuthRequired(db), handlers.UpdateOrder(db))
			orders.DELETE("/:id", middleware.AuthRequired(db), middleware.RoleRequired("admin", "sale_admin"), handlers.DeleteOrder(db))
		}

		// Inventory
		inventory := v1.Group("/inventory")
		{
			inventory.GET("", middleware.AuthRequired(db), handlers.GetInventory(db))
			inventory.GET("/low-stock", middleware.AuthRequired(db), handlers.GetLowStock(db))
			inventory.POST("/adjust", middleware.AuthRequired(db), middleware.RoleRequired("admin", "sale_admin"), handlers.AdjustInventory(db))
		}

		// Reports
		reports := v1.Group("/reports")
		{
			reports.GET("/sales", middleware.AuthRequired(db), handlers.GetSalesReport(db))
			reports.GET("/revenue", middleware.AuthRequired(db), handlers.GetRevenueReport(db))
			reports.GET("/top-products", middleware.AuthRequired(db), handlers.GetTopProducts(db))
			reports.GET("/top-customers", middleware.AuthRequired(db), handlers.GetTopCustomers(db))
		}

		// Auth
		auth := v1.Group("/auth")
		{
			auth.POST("/login", handlers.Login(db))
			auth.POST("/logout", middleware.AuthRequired(db), handlers.Logout(db))
			auth.POST("/refresh", handlers.RefreshToken(db))
			auth.GET("/me", middleware.AuthRequired(db), handlers.GetCurrentUser(db))
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
