package models

import "time"

type Customer struct {
	ID           int        `json:"id"`
	Code         string     `json:"code"`
	Name         string     `json:"name"`
	Address      *string    `json:"address,omitempty"`
	Phone        *string    `json:"phone,omitempty"`
	AssignedSale *string    `json:"assigned_sale,omitempty"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

type CreateCustomerRequest struct {
	Code         string  `json:"code" binding:"required"`
	Name         string  `json:"name" binding:"required"`
	Address      *string `json:"address"`
	Phone        *string `json:"phone"`
	AssignedSale *string `json:"assigned_sale"`
}

type UpdateCustomerRequest struct {
	Name         *string `json:"name"`
	Address      *string `json:"address"`
	Phone        *string `json:"phone"`
	AssignedSale *string `json:"assigned_sale"`
}
