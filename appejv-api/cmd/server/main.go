package main

import (
	"log"
	"os"

	"github.com/appejv/appejv-api/internal/config"
	"github.com/appejv/appejv-api/internal/fiber/handlers"
	"github.com/appejv/appejv-api/internal/fiber/middleware"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
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

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "APPE JV API",
		ServerHeader: "Fiber",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Get CORS origins from environment or use defaults
	corsOrigins := os.Getenv("CORS_ORIGINS")
	if corsOrigins == "" {
		// Default: local development + production domains
		corsOrigins = "http://localhost:3000,http://localhost:4321,https://app.appejv.app,https://appejv.app"
	}

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins:     corsOrigins,
		AllowMethods:     "GET,POST,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
	}))

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":   "ok",
			"service":  "appejv-api",
			"version":  "1.0.0",
			"database": "supabase",
			"auth":     "jwt",
			"framework": "fiber",
		})
	})

	// API v1 routes
	v1 := app.Group("/api/v1")

	// Public endpoints (no authentication)
	public := v1.Group("/")
	{
		public.Get("/products", handlers.GetProducts(db))
		public.Get("/products/:id", handlers.GetProduct(db))
	}

	// Auth endpoints (public)
	auth := v1.Group("/auth")
	{
		auth.Post("/forgot-password", handlers.RequestPasswordReset(db))
	}

	// Protected endpoints (authentication required)
	protected := v1.Group("/")
	protected.Use(middleware.AuthRequired(db))
	{
		// Profile endpoint (all authenticated users)
		protected.Get("/profile", handlers.GetProfile())

		// Sales endpoints (sale, admin, sale_admin)
		sales := protected.Group("/")
		sales.Use(middleware.RoleRequired("sale", "admin", "sale_admin"))
		{
			// Customers
			sales.Get("/customers", handlers.GetCustomers(db))
			sales.Get("/customers/:id", handlers.GetCustomer(db))
			sales.Post("/customers", handlers.CreateCustomer(db))
			sales.Put("/customers/:id", handlers.UpdateCustomer(db))

			// Orders
			sales.Get("/orders", handlers.GetOrders(db))
			sales.Get("/orders/:id", handlers.GetOrder(db))
			sales.Post("/orders", handlers.CreateOrder(db))
			sales.Put("/orders/:id", handlers.UpdateOrder(db))
		}

		// Admin endpoints (admin, sale_admin only)
		admin := protected.Group("/")
		admin.Use(middleware.RoleRequired("admin", "sale_admin"))
		{
			admin.Post("/products", handlers.CreateProduct(db))
			admin.Put("/products/:id", handlers.UpdateProduct(db))
			admin.Delete("/products/:id", handlers.DeleteProduct(db))
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📊 Database: Supabase (%s)", cfg.SupabaseURL)
	log.Printf("🔐 Auth: JWT-based (stateless)")
	log.Printf("🛡️  Authorization: Role-based")
	log.Printf("⚡ Framework: Fiber v2")
	
	if err := app.Listen(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
