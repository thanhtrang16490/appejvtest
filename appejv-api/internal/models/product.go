package models

import "time"

type Product struct {
	ID             int        `json:"id"`
	Code           string     `json:"code"`
	Name           string     `json:"name"`
	Slug           *string    `json:"slug,omitempty"`
	Unit           *string    `json:"unit,omitempty"`
	Stock          int        `json:"stock"`
	ImageURL       *string    `json:"image_url,omitempty"`
	Price          float64    `json:"price"`
	Category       *string    `json:"category,omitempty"`
	CategoryID     *int       `json:"category_id,omitempty"`
	Description    *string    `json:"description,omitempty"`
	Specifications *string    `json:"specifications,omitempty"`
	DeletedAt      *time.Time `json:"deleted_at,omitempty"`
	CreatedAt      time.Time  `json:"created_at"`
}

type CreateProductRequest struct {
	Code           string  `json:"code" binding:"required"`
	Name           string  `json:"name" binding:"required"`
	Unit           *string `json:"unit"`
	Stock          int     `json:"stock"`
	Price          float64 `json:"price"`
	Category       *string `json:"category"`
	CategoryID     *int    `json:"category_id"`
	Description    *string `json:"description"`
	ImageURL       *string `json:"image_url"`
	Specifications *string `json:"specifications"`
}

type UpdateProductRequest struct {
	Name           *string  `json:"name"`
	Unit           *string  `json:"unit"`
	Stock          *int     `json:"stock"`
	Price          *float64 `json:"price"`
	Category       *string  `json:"category"`
	CategoryID     *int     `json:"category_id"`
	Description    *string  `json:"description"`
	ImageURL       *string  `json:"image_url"`
	Specifications *string  `json:"specifications"`
}
