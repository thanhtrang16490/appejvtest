package handlers

import (
	"net/http"

	"github.com/appejv/appejv-api/internal/models"
	"github.com/appejv/appejv-api/pkg/database"
	"github.com/gin-gonic/gin"
)

// POST /api/v1/auth/login
func Login(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Sign in with Supabase
		resp, err := db.Client.Auth.SignInWithEmailPassword(req.Email, req.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Email hoặc mật khẩu không đúng"})
			return
		}

		// Get user profile
		var profile models.Profile
		err = db.Client.DB.From("profiles").
			Select("*").
			Eq("id", resp.User.ID).
			Single().
			Execute(&profile)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Không tìm thấy thông tin người dùng"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": models.LoginResponse{
				AccessToken:  resp.AccessToken,
				RefreshToken: resp.RefreshToken,
				User:         profile,
			},
		})
	}
}

// POST /api/v1/auth/logout
func Logout(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Supabase handles logout on client side
		c.JSON(http.StatusOK, gin.H{
			"message": "Đã đăng xuất thành công",
		})
	}
}

// POST /api/v1/auth/refresh
func RefreshToken(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			RefreshToken string `json:"refresh_token" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Refresh token with Supabase
		resp, err := db.Client.Auth.RefreshUser(c.Request.Context(), req.RefreshToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token không hợp lệ"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"data": gin.H{
				"access_token":  resp.AccessToken,
				"refresh_token": resp.RefreshToken,
			},
		})
	}
}

// GET /api/v1/auth/me
func GetCurrentUser(db *database.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		userProfile, exists := c.Get("user_profile")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"data": userProfile})
	}
}
