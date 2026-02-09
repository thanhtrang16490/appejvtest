package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// GetProfile returns current user profile
func GetProfile() fiber.Handler {
	return func(c *fiber.Ctx) error {
		profile := c.Locals("user_profile")
		if profile == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User profile not found",
			})
		}

		return c.JSON(fiber.Map{
			"data": profile,
		})
	}
}
