package handlers

import (
	"net/http"
	"strconv"

	"github.com/appejv/appejv-api/internal/models"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// GET /api/v1/products
func GetProductsSimple(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		category := c.Query("category")
		search := c.Query("search")
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset := (page - 1) * limit

		// Build query
		query := db.Client.From("products").Select("*", "", false)
		
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
		query = query.Order("created_at", "desc", false)

		var products []models.Product
		count, err := query.ExecuteWithCount(&products)
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
	}
}

// GET /api/v1/products/:id
func GetProductSimple(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var product models.Product
		err := db.Client.From("products").
			Select("*", "", false).
			Eq("id", id).
			Is("deleted_at", "null").
			Single().
			Execute(&product)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy sản phẩm"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": product})
	}
}
