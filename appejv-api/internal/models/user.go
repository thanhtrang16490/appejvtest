package models

import "time"

type Profile struct {
	ID        string     `json:"id"`
	FullName  *string    `json:"full_name,omitempty"`
	Role      string     `json:"role"`
	Phone     *string    `json:"phone,omitempty"`
	ManagerID *string    `json:"manager_id,omitempty"`
	AvatarURL *string    `json:"avatar_url,omitempty"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken  string  `json:"access_token"`
	RefreshToken string  `json:"refresh_token"`
	User         Profile `json:"user"`
}
