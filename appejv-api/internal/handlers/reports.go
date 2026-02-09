package handlers

import (
	"net/http"

	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// GET /api/v1/reports/sales
func GetSalesReport(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		startDate := c.Query("start_date")
		endDate := c.Query("end_date")

		query := db.Client.DB.From("orders").
			Select("*").
			Is("deleted_at", "null")

		if startDate != "" {
			query = query.Gte("created_at", startDate)
		}
		if endDate != "" {
			query = query.Lte("created_at", endDate)
		}

		var orders []map[string]interface{}
		err := query.Execute(&orders)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Calculate statistics
		totalOrders := len(orders)
		var totalRevenue float64
		statusCount := make(map[string]int)

		for _, order := range orders {
			if amount, ok := order["total_amount"].(float64); ok {
				totalRevenue += amount
			}
			if status, ok := order["status"].(string); ok {
				statusCount[status]++
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"data": gin.H{
				"total_orders":  totalOrders,
				"total_revenue": totalRevenue,
				"status_count":  statusCount,
				"orders":        orders,
			},
		})
	}
}

// GET /api/v1/reports/revenue
func GetRevenueReport(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		startDate := c.Query("start_date")
		endDate := c.Query("end_date")

		query := db.Client.DB.From("orders").
			Select("created_at, total_amount, status").
			Is("deleted_at", "null").
			Order("created_at", &map[string]interface{}{"ascending": true})

		if startDate != "" {
			query = query.Gte("created_at", startDate)
		}
		if endDate != "" {
			query = query.Lte("created_at", endDate)
		}

		var orders []map[string]interface{}
		err := query.Execute(&orders)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": orders})
	}
}

// GET /api/v1/reports/top-products
func GetTopProducts(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		limit := c.DefaultQuery("limit", "10")

		// This would require a more complex query with joins
		// For now, return a simple response
		var items []map[string]interface{}
		err := db.Client.DB.From("order_items").
			Select("product_id, quantity").
			Execute(&items)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Aggregate by product_id
		productSales := make(map[int]int)
		for _, item := range items {
			if productID, ok := item["product_id"].(float64); ok {
				if quantity, ok := item["quantity"].(float64); ok {
					productSales[int(productID)] += int(quantity)
				}
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"data":  productSales,
			"limit": limit,
		})
	}
}

// GET /api/v1/reports/top-customers
func GetTopCustomers(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		limit := c.DefaultQuery("limit", "10")

		var orders []map[string]interface{}
		err := db.Client.DB.From("orders").
			Select("customer_id, total_amount").
			Is("deleted_at", "null").
			Execute(&orders)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Aggregate by customer_id
		customerRevenue := make(map[int]float64)
		for _, order := range orders {
			if customerID, ok := order["customer_id"].(float64); ok {
				if amount, ok := order["total_amount"].(float64); ok {
					customerRevenue[int(customerID)] += amount
				}
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"data":  customerRevenue,
			"limit": limit,
		})
	}
}
