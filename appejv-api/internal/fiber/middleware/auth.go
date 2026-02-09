package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gofiber/fiber/v2"
)

// Profile represents user profile from database
type Profile struct {
	ID       string  `json:"id"`
	FullName *string `json:"full_name"`
	Role     string  `json:"role"`
	Phone    *string `json:"phone"`
}

// AuthRequired middleware verifies JWT token and loads user profile
func AuthRequired(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Extract token from Authorization header
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header required",
			})
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid authorization header format. Use: Bearer <token>",
			})
		}

		token := parts[1]

		// Verify token with Supabase Auth API
		userID, email, err := verifySupabaseToken(token, c.Context())
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "Invalid or expired token",
				"details": err.Error(),
			})
		}

		// Get user profile from database
		var profiles []Profile
		_, err = db.Client.From("profiles").
			Select("id, full_name, role, phone", "", false).
			Eq("id", userID).
			Limit(1, "").
			ExecuteTo(&profiles)

		if err != nil || len(profiles) == 0 {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User profile not found",
			})
		}

		profile := profiles[0]

		// Store user info in context
		c.Locals("user_id", userID)
		c.Locals("user_email", email)
		c.Locals("user_role", profile.Role)
		c.Locals("user_profile", profile)

		return c.Next()
	}
}

// verifySupabaseToken verifies JWT token using Supabase Auth API
func verifySupabaseToken(token string, ctx context.Context) (string, string, error) {
	// Call Supabase Auth API to verify token
	supabaseURL := "https://mrcmratcnlsoxctsbalt.supabase.co"
	url := fmt.Sprintf("%s/auth/v1/user", supabaseURL)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return "", "", err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY21yYXRjbmxzb3hjdHNiYWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzAxNjcsImV4cCI6MjA4NTg0NjE2N30.W87kTi4pxY8qbam72R-Jdh0SCmUiIkROdNWx8rRsTOk")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("invalid token: status %d", resp.StatusCode)
	}

	var user struct {
		ID    string `json:"id"`
		Email string `json:"email"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return "", "", err
	}

	return user.ID, user.Email, nil
}

// RoleRequired middleware checks if user has required role
func RoleRequired(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole := c.Locals("user_role")
		if userRole == nil {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "User role not found in context",
			})
		}

		role := userRole.(string)
		allowed := false
		for _, r := range roles {
			if role == r {
				allowed = true
				break
			}
		}

		if !allowed {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error":         "Insufficient permissions",
				"required_role": roles,
				"user_role":     role,
			})
		}

		return c.Next()
	}
}
