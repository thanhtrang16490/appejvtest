package handlers

import (
	"bytes"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gofiber/fiber/v2"
)

// RequestPasswordResetInput represents the request body for password reset
type RequestPasswordResetInput struct {
	Email string `json:"email" validate:"required,email"`
}

// generateTemporaryPassword generates a random temporary password
func generateTemporaryPassword() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const passwordLength = 8
	
	bytes := make([]byte, passwordLength)
	rand.Read(bytes)
	
	password := make([]byte, passwordLength)
	for i := 0; i < passwordLength; i++ {
		password[i] = charset[bytes[i]%byte(len(charset))]
	}
	
	// Ensure at least one uppercase, one lowercase, and one number
	password[0] = charset[26+int(bytes[0]%26)] // Uppercase
	password[1] = charset[int(bytes[1]%26)]    // Lowercase
	password[2] = charset[52+int(bytes[2]%10)] // Number
	
	return string(password)
}

// RequestPasswordReset handles password reset request
func RequestPasswordReset(db *database.Database) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var input RequestPasswordResetInput
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		supabaseURL := os.Getenv("SUPABASE_URL")
		serviceKey := os.Getenv("SUPABASE_SERVICE_KEY")

		if supabaseURL == "" || serviceKey == "" {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Cấu hình server không đầy đủ",
			})
		}

		httpClient := &http.Client{Timeout: 10 * time.Second}

		// Search user by email using Supabase Admin API
		searchURL := fmt.Sprintf("%s/auth/v1/admin/users", supabaseURL)
		searchReq, err := http.NewRequest("GET", searchURL, nil)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Không thể tạo request",
			})
		}

		searchReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", serviceKey))
		searchReq.Header.Set("apikey", serviceKey)

		searchResp, err := httpClient.Do(searchReq)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Không thể kết nối đến Supabase",
			})
		}
		defer searchResp.Body.Close()

		searchBody, _ := io.ReadAll(searchResp.Body)

		if searchResp.StatusCode != http.StatusOK {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":   "Không thể tìm kiếm user",
				"details": string(searchBody),
			})
		}

		var usersResponse struct {
			Users []struct {
				ID    string `json:"id"`
				Email string `json:"email"`
			} `json:"users"`
		}

		if err := json.Unmarshal(searchBody, &usersResponse); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Không thể parse response",
			})
		}

		// Find user with matching email
		var userID string
		for _, user := range usersResponse.Users {
			if user.Email == input.Email {
				userID = user.ID
				break
			}
		}

		if userID == "" {
			// Don't reveal if email exists or not (security)
			return c.JSON(fiber.Map{
				"message": "Nếu email tồn tại, bạn sẽ nhận được mật khẩu tạm thời qua email",
			})
		}

		// Get user profile for name
		var profiles []map[string]interface{}
		_, err = db.Client.From("profiles").
			Select("full_name", "", false).
			Eq("id", userID).
			ExecuteTo(&profiles)

		userName := "User"
		if err == nil && len(profiles) > 0 {
			if name, ok := profiles[0]["full_name"].(string); ok && name != "" {
				userName = name
			}
		}

		// Generate temporary password
		tempPassword := generateTemporaryPassword()

		// Update password in Supabase Auth
		updateURL := fmt.Sprintf("%s/auth/v1/admin/users/%s", supabaseURL, userID)
		updatePayload := map[string]interface{}{
			"password": tempPassword,
		}

		payloadBytes, err := json.Marshal(updatePayload)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Không thể tạo request",
			})
		}

		updateReq, err := http.NewRequest("PUT", updateURL, bytes.NewBuffer(payloadBytes))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Không thể tạo request",
			})
		}

		updateReq.Header.Set("Content-Type", "application/json")
		updateReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", serviceKey))
		updateReq.Header.Set("apikey", serviceKey)

		updateResp, err := httpClient.Do(updateReq)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Không thể kết nối đến Supabase",
			})
		}
		defer updateResp.Body.Close()

		updateBody, _ := io.ReadAll(updateResp.Body)

		if updateResp.StatusCode != http.StatusOK {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":   "Không thể cập nhật mật khẩu",
				"details": string(updateBody),
			})
		}

		// TODO: Send email with temporary password
		// For now, return the temporary password in response (DEV ONLY)
		return c.JSON(fiber.Map{
			"message":            "Mật khẩu tạm thời đã được gửi qua email",
			"temporary_password": tempPassword, // Remove in production
			"email":              input.Email,
			"user_name":          userName,
		})
	}
}
