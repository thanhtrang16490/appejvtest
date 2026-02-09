package handlers

import (
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gofiber/fiber/v2"
)

// GetCustomers returns list of customers (sales only)
func GetCustomers(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// TODO: Implement get customers logic
		return c.JSON(fiber.Map{
			"message": "Get customers - TODO",
			"user_id": c.Locals("user_id"),
			"role":    c.Locals("user_role"),
		})
	}
}

// GetCustomer returns single customer (sales only)
func GetCustomer(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		return c.JSON(fiber.Map{
			"message": "Get customer - TODO",
			"id":      id,
		})
	}
}

// CreateCustomer creates new customer (sales only)
func CreateCustomer(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"message": "Create customer - TODO",
		})
	}
}

// UpdateCustomer updates existing customer (sales only)
func UpdateCustomer(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id := c.Params("id")
		return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{
			"message": "Update customer - TODO",
			"id":      id,
		})
	}
}
