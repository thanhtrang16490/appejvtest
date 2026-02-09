package handlers

import (
	"net/http"

	"github.com/appejv/appejv-api/internal/models"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// GET /api/v1/inventory
func GetInventory(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var products []models.Product
		err := db.Client.DB.From("products").
			Select("*").
			Is("deleted_at", "null").
			Order("stock", &map[string]interface{}{"ascending": true}).
			Execute(&products)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": products})
	}
}

// GET /api/v1/inventory/low-stock
func GetLowStock(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		threshold := c.DefaultQuery("threshold", "10")

		var products []models.Product
		err := db.Client.DB.From("products").
			Select("*").
			Is("deleted_at", "null").
			Lt("stock", threshold).
			Order("stock", &map[string]interface{}{"ascending": true}).
			Execute(&products)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data":      products,
			"threshold": threshold,
			"count":     len(products),
		})
	}
}

// POST /api/v1/inventory/adjust
func AdjustInventory(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			ProductID int    `json:"product_id" binding:"required"`
			Quantity  int    `json:"quantity" binding:"required"`
			Reason    string `json:"reason"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Get current product
		var product models.Product
		err := db.Client.DB.From("products").
			Select("*").
			Eq("id", req.ProductID).
			Is("deleted_at", "null").
			Single().
			Execute(&product)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy sản phẩm"})
			return
		}

		// Update stock
		newStock := product.Stock + req.Quantity
		if newStock < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Số lượng tồn kho không thể âm"})
			return
		}

		err = db.Client.DB.From("products").
			Update(map[string]interface{}{
				"stock": newStock,
			}).
			Eq("id", req.ProductID).
			Single().
			Execute(&product)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data":    product,
			"message": "Đã điều chỉnh tồn kho",
		})
	}
}
