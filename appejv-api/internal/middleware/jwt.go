package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// SupabaseJWTClaims represents the claims in a Supabase JWT
type SupabaseJWTClaims struct {
	Sub   string `json:"sub"`   // User ID
	Email string `json:"email"` // User email
	Role  string `json:"role"`  // Database role (not user role)
	Aud   string `json:"aud"`   // Audience
	Exp   int64  `json:"exp"`   // Expiration time
	Iat   int64  `json:"iat"`   // Issued at
}

// Profile represents user profile from database
type Profile struct {
	ID       string  `json:"id"`
	FullName *string `json:"full_name"`
	Role     string  `json:"role"`
	Phone    *string `json:"phone"`
}

// AuthRequired middleware verifies JWT token and loads user profile
func AuthRequired(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		token := parts[1]

		// Verify token with Supabase Auth API
		userID, email, err := verifySupabaseToken(token, c.Request.Context())
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token", "details": err.Error()})
			c.Abort()
			return
		}

		// Get user profile from database
		var profiles []Profile
		_, err = db.Client.From("profiles").
			Select("id, full_name, role, phone", "", false).
			Eq("id", userID).
			Limit(1, "").
			ExecuteTo(&profiles)

		if err != nil || len(profiles) == 0 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User profile not found"})
			c.Abort()
			return
		}

		profile := profiles[0]

		// Store user info in context
		c.Set("user_id", userID)
		c.Set("user_email", email)
		c.Set("user_role", profile.Role)
		c.Set("user_profile", profile)

		c.Next()
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
func RoleRequired(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "User role not found"})
			c.Abort()
			return
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
			c.JSON(http.StatusForbidden, gin.H{
				"error":         "Insufficient permissions",
				"required_role": roles,
				"user_role":     role,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
