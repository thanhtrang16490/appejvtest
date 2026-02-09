package handlers

import (
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gofiber/fiber/v2"
)

// GetOrders returns list of orders (sales only)
func GetOrders(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Get orders - TODO",
			"user_id": c.Locals("user_id"),
			"role":    c.Locals("user_role"),
		})
	}
}

// GetOrder returns single order (sales only)
func GetOrder(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		return c.JSON(fiber.Map{
			"message": "Get order - TODO",
			"id":      id,
		})
	}
}

// CreateOrder creates new order (sales only)
func CreateOrder(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"message": "Create order - TODO",
		})
	}
}

// UpdateOrder updates existing order (sales only)
func UpdateOrder(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"message": "Update order - TODO",
			"id":      id,
		})
	}
}
