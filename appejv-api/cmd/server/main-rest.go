package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Product struct {
	ID          int     `json:"id"`
	Code        string  `json:"code"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Category    *string `json:"category"`
	Unit        *string `json:"unit"`
	Description *string `json:"description"`
	ImageURL    *string `json:"image_url"`
	CreatedAt   string  `json:"created_at"`
}

var (
	supabaseURL string
	supabaseKey string
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	supabaseURL = os.Getenv("SUPABASE_URL")
	supabaseKey = os.Getenv("SUPABASE_ANON_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_ANON_KEY must be set")
	}

	log.Printf("✓ Connected to Supabase: %s", supabaseURL)

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
			"database": "supabase",
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
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func getProducts(c *gin.Context) {
	category := c.Query("category")
	search := c.Query("search")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	// Build Supabase REST API URL
	url := fmt.Sprintf("%s/rest/v1/products", supabaseURL)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Add headers
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "count=exact")

	// Add query parameters
	q := req.URL.Query()
	q.Add("select", "*")
	q.Add("deleted_at", "is.null")
	q.Add("order", "created_at.desc")
	q.Add("limit", strconv.Itoa(limit))
	q.Add("offset", strconv.Itoa(offset))
	
	if category != "" {
		q.Add("category", "eq."+category)
	}
	
	if search != "" {
		q.Add("or", fmt.Sprintf("(name.ilike.%%%s%%,code.ilike.%%%s%%)", search, search))
	}
	
	req.URL.RawQuery = q.Encode()

	// Execute request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Parse products
	var products []Product
	if err := json.Unmarshal(body, &products); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Get count from header
	contentRange := resp.Header.Get("Content-Range")
	total := len(products)
	if contentRange != "" {
		// Parse content-range header: "0-19/100"
		var start, end, count int
		fmt.Sscanf(contentRange, "%d-%d/%d", &start, &end, &count)
		total = count
	}

	totalPages := (total + limit - 1) / limit

	c.JSON(200, gin.H{
		"data": products,
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       total,
			"total_pages": totalPages,
		},
	})
}

func getProduct(c *gin.Context) {
	id := c.Param("id")

	// Build Supabase REST API URL
	url := fmt.Sprintf("%s/rest/v1/products", supabaseURL)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Add headers
	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")

	// Add query parameters
	q := req.URL.Query()
	q.Add("select", "*")
	q.Add("id", "eq."+id)
	q.Add("deleted_at", "is.null")
	req.URL.RawQuery = q.Encode()

	// Execute request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Parse products
	var products []Product
	if err := json.Unmarshal(body, &products); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	if len(products) == 0 {
		c.JSON(404, gin.H{"error": "Không tìm thấy sản phẩm"})
		return
	}

	c.JSON(200, gin.H{"data": products[0]})
}
