package models

import "time"

type Order struct {
	ID          int        `json:"id"`
	CustomerID  int        `json:"customer_id"`
	SaleID      string     `json:"sale_id"`
	Status      string     `json:"status"`
	TotalAmount float64    `json:"total_amount"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

type OrderItem struct {
	ID           int     `json:"id"`
	OrderID      int     `json:"order_id"`
	ProductID    int     `json:"product_id"`
	Quantity     int     `json:"quantity"`
	PriceAtOrder float64 `json:"price_at_order"`
}

type CreateOrderRequest struct {
	CustomerID int               `json:"customer_id" binding:"required"`
	Items      []OrderItemCreate `json:"items" binding:"required,min=1"`
}

type OrderItemCreate struct {
	ProductID int `json:"product_id" binding:"required"`
	Quantity  int `json:"quantity" binding:"required,min=1"`
}

type UpdateOrderRequest struct {
	Status *string `json:"status"`
}

type OrderWithDetails struct {
	Order
	Customer     Customer      `json:"customer"`
	Items        []OrderItem   `json:"items"`
	ItemProducts []Product     `json:"item_products"`
}
