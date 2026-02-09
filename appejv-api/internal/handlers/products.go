package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/appejv/appejv-api/internal/models"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// GET /api/v1/products
func GetProducts(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		category := c.Query("category")
		search := c.Query("search")
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset := (page - 1) * limit

		query := db.Client.DB.From("products").
			Select("*", "exact").
			Is("deleted_at", "null").
			Order("created_at", &map[string]interface{}{"ascending": false})

		if category != "" {
			query = query.Eq("category", category)
		}

		if search != "" {
			query = query.Or("name.ilike.%"+search+"%,code.ilike.%"+search+"%", "")
		}

		query = query.Range(offset, offset+limit-1)

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
func GetProduct(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var product models.Product
		err := db.Client.DB.From("products").
			Select("*").
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

// POST /api/v1/products
func CreateProduct(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.CreateProductRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var product models.Product
		err := db.Client.DB.From("products").
			Insert(map[string]interface{}{
				"code":           req.Code,
				"name":           req.Name,
				"unit":           req.Unit,
				"stock":          req.Stock,
				"price":          req.Price,
				"category":       req.Category,
				"category_id":    req.CategoryID,
				"description":    req.Description,
				"image_url":      req.ImageURL,
				"specifications": req.Specifications,
			}).
			Single().
			Execute(&product)

		if err != nil {
			if contains(err.Error(), "23505") {
				c.JSON(http.StatusConflict, gin.H{"error": "Mã sản phẩm đã tồn tại"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"data": product})
	}
}

// PUT /api/v1/products/:id
func UpdateProduct(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var req models.UpdateProductRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		updateData := make(map[string]interface{})
		if req.Name != nil {
			updateData["name"] = *req.Name
		}
		if req.Unit != nil {
			updateData["unit"] = *req.Unit
		}
		if req.Stock != nil {
			updateData["stock"] = *req.Stock
		}
		if req.Price != nil {
			updateData["price"] = *req.Price
		}
		if req.Category != nil {
			updateData["category"] = *req.Category
		}
		if req.CategoryID != nil {
			updateData["category_id"] = *req.CategoryID
		}
		if req.Description != nil {
			updateData["description"] = *req.Description
		}
		if req.ImageURL != nil {
			updateData["image_url"] = *req.ImageURL
		}
		if req.Specifications != nil {
			updateData["specifications"] = *req.Specifications
		}

		var product models.Product
		err := db.Client.DB.From("products").
			Update(updateData).
			Eq("id", id).
			Single().
			Execute(&product)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": product})
	}
}

// DELETE /api/v1/products/:id
func DeleteProduct(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var product models.Product
		err := db.Client.DB.From("products").
			Update(map[string]interface{}{
				"deleted_at": time.Now().Format(time.RFC3339),
			}).
			Eq("id", id).
			Single().
			Execute(&product)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data":    product,
			"message": "Đã xóa sản phẩm",
		})
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || containsMiddle(s, substr)))
}

func containsMiddle(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
