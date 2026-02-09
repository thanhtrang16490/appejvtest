package handlers

import (
	"strconv"

	"github.com/appejv/appejv-api/internal/models"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gofiber/fiber/v2"
	"github.com/supabase-community/postgrest-go"
)

// GetProducts returns list of products (public)
func GetProducts(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		category := c.Query("category")
		search := c.Query("search")
		page, _ := strconv.Atoi(c.Query("page", "1"))
		limit, _ := strconv.Atoi(c.Query("limit", "20"))
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
		query = query.Order("created_at", &postgrest.OrderOpts{Ascending: false})

		var products []models.Product
		count, err := query.ExecuteTo(&products)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		totalPages := (int(count) + limit - 1) / limit

		return c.JSON(fiber.Map{
			"data": products,
			"pagination": fiber.Map{
				"page":        page,
				"limit":       limit,
				"total":       count,
				"total_pages": totalPages,
			},
		})
	}
}

// GetProduct returns single product (public)
func GetProduct(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")

		var products []models.Product
		_, err := db.Client.From("products").
			Select("*", "", false).
			Eq("id", id).
			Is("deleted_at", "null").
			Limit(1, "").
			ExecuteTo(&products)

		if err != nil || len(products) == 0 {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Product not found",
			})
		}

		return c.JSON(fiber.Map{
			"data": products[0],
		})
	}
}

// CreateProduct creates new product (admin only)
func CreateProduct(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var product models.Product
		if err := c.BodyParser(&product); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// TODO: Implement create logic
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"message": "Create product - TODO",
			"data":    product,
		})
	}
}

// UpdateProduct updates existing product (admin only)
func UpdateProduct(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")

		var product models.Product
		if err := c.BodyParser(&product); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// TODO: Implement update logic
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"message": "Update product - TODO",
			"id":      id,
			"data":    product,
		})
	}
}

// DeleteProduct deletes product (admin only)
func DeleteProduct(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")

		// TODO: Implement delete logic (soft delete)
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"message": "Delete product - TODO",
			"id":      id,
		})
	}
}
