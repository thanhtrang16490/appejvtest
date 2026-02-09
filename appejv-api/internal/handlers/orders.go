package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/appejv/appejv-api/internal/models"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// GET /api/v1/orders
func GetOrders(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		status := c.Query("status")
		customerID := c.Query("customer_id")
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset := (page - 1) * limit

		query := db.Client.DB.From("orders").
			Select("*", "exact").
			Is("deleted_at", "null").
			Order("created_at", &map[string]interface{}{"ascending": false})

		if status != "" {
			query = query.Eq("status", status)
		}

		if customerID != "" {
			query = query.Eq("customer_id", customerID)
		}

		query = query.Range(offset, offset+limit-1)

		var orders []models.Order
		count, err := query.ExecuteWithCount(&orders)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		totalPages := (int(count) + limit - 1) / limit

		c.JSON(http.StatusOK, gin.H{
			"data": orders,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       count,
				"total_pages": totalPages,
			},
		})
	}
}

// GET /api/v1/orders/:id
func GetOrder(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var order models.Order
		err := db.Client.DB.From("orders").
			Select("*").
			Eq("id", id).
			Is("deleted_at", "null").
			Single().
			Execute(&order)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy đơn hàng"})
			return
		}

		// Get order items
		var items []models.OrderItem
		err = db.Client.DB.From("order_items").
			Select("*").
			Eq("order_id", id).
			Execute(&items)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": gin.H{
				"order": order,
				"items": items,
			},
		})
	}
}

// POST /api/v1/orders
func CreateOrder(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, _ := c.Get("user_id")

		var req models.CreateOrderRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Calculate total and validate stock
		var totalAmount float64
		var products []models.Product

		for _, item := range req.Items {
			var product models.Product
			err := db.Client.DB.From("products").
				Select("*").
				Eq("id", item.ProductID).
				Is("deleted_at", "null").
				Single().
				Execute(&product)

			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Sản phẩm không tồn tại"})
				return
			}

			if product.Stock < item.Quantity {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Không đủ hàng trong kho cho sản phẩm: " + product.Name,
				})
				return
			}

			totalAmount += product.Price * float64(item.Quantity)
			products = append(products, product)
		}

		// Create order
		var order models.Order
		err := db.Client.DB.From("orders").
			Insert(map[string]interface{}{
				"customer_id":  req.CustomerID,
				"sale_id":      userID,
				"status":       "pending",
				"total_amount": totalAmount,
			}).
			Single().
			Execute(&order)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Create order items and update stock
		for i, item := range req.Items {
			product := products[i]

			// Insert order item
			var orderItem models.OrderItem
			err = db.Client.DB.From("order_items").
				Insert(map[string]interface{}{
					"order_id":       order.ID,
					"product_id":     item.ProductID,
					"quantity":       item.Quantity,
					"price_at_order": product.Price,
				}).
				Single().
				Execute(&orderItem)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			// Update product stock
			newStock := product.Stock - item.Quantity
			err = db.Client.DB.From("products").
				Update(map[string]interface{}{
					"stock": newStock,
				}).
				Eq("id", item.ProductID).
				Execute(nil)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}

		c.JSON(http.StatusCreated, gin.H{
			"data":    order,
			"message": "Đã tạo đơn hàng thành công",
		})
	}
}

// PUT /api/v1/orders/:id
func UpdateOrder(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var req models.UpdateOrderRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		updateData := make(map[string]interface{})
		if req.Status != nil {
			updateData["status"] = *req.Status
		}

		var order models.Order
		err := db.Client.DB.From("orders").
			Update(updateData).
			Eq("id", id).
			Single().
			Execute(&order)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": order})
	}
}

// DELETE /api/v1/orders/:id
func DeleteOrder(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var order models.Order
		err := db.Client.DB.From("orders").
			Update(map[string]interface{}{
				"deleted_at": time.Now().Format(time.RFC3339),
			}).
			Eq("id", id).
			Single().
			Execute(&order)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data":    order,
			"message": "Đã xóa đơn hàng",
		})
	}
}
