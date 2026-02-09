package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/appejv/appejv-api/internal/models"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// GET /api/v1/customers
func GetCustomers(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		search := c.Query("search")
		page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
		offset := (page - 1) * limit

		query := db.Client.DB.From("customers").
			Select("*", "exact").
			Is("deleted_at", "null").
			Order("created_at", &map[string]interface{}{"ascending": false})

		if search != "" {
			query = query.Or("name.ilike.%"+search+"%,code.ilike.%"+search+"%,phone.ilike.%"+search+"%", "")
		}

		query = query.Range(offset, offset+limit-1)

		var customers []models.Customer
		count, err := query.ExecuteWithCount(&customers)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		totalPages := (int(count) + limit - 1) / limit

		c.JSON(http.StatusOK, gin.H{
			"data": customers,
			"pagination": gin.H{
				"page":        page,
				"limit":       limit,
				"total":       count,
				"total_pages": totalPages,
			},
		})
	}
}

// GET /api/v1/customers/:id
func GetCustomer(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var customer models.Customer
		err := db.Client.DB.From("customers").
			Select("*").
			Eq("id", id).
			Is("deleted_at", "null").
			Single().
			Execute(&customer)

		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Không tìm thấy khách hàng"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": customer})
	}
}

// POST /api/v1/customers
func CreateCustomer(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.CreateCustomerRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var customer models.Customer
		err := db.Client.DB.From("customers").
			Insert(map[string]interface{}{
				"code":          req.Code,
				"name":          req.Name,
				"address":       req.Address,
				"phone":         req.Phone,
				"assigned_sale": req.AssignedSale,
			}).
			Single().
			Execute(&customer)

		if err != nil {
			if contains(err.Error(), "23505") {
				c.JSON(http.StatusConflict, gin.H{"error": "Mã khách hàng đã tồn tại"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"data": customer})
	}
}

// PUT /api/v1/customers/:id
func UpdateCustomer(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var req models.UpdateCustomerRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		updateData := make(map[string]interface{})
		if req.Name != nil {
			updateData["name"] = *req.Name
		}
		if req.Address != nil {
			updateData["address"] = *req.Address
		}
		if req.Phone != nil {
			updateData["phone"] = *req.Phone
		}
		if req.AssignedSale != nil {
			updateData["assigned_sale"] = *req.AssignedSale
		}

		var customer models.Customer
		err := db.Client.DB.From("customers").
			Update(updateData).
			Eq("id", id).
			Single().
			Execute(&customer)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": customer})
	}
}

// DELETE /api/v1/customers/:id
func DeleteCustomer(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var customer models.Customer
		err := db.Client.DB.From("customers").
			Update(map[string]interface{}{
				"deleted_at": time.Now().Format(time.RFC3339),
			}).
			Eq("id", id).
			Single().
			Execute(&customer)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data":    customer,
			"message": "Đã xóa khách hàng",
		})
	}
}
