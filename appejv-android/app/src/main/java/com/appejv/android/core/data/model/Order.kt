package com.appejv.android.core.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Order(
    @SerialName("id")
    val id: Int,
    
    @SerialName("customer_id")
    val customerId: String? = null,
    
    @SerialName("sale_id")
    val saleId: String,
    
    @SerialName("status")
    val status: String,
    
    @SerialName("total_amount")
    val totalAmount: Double,
    
    @SerialName("created_at")
    val createdAt: String,
    
    @SerialName("updated_at")
    val updatedAt: String? = null,
    
    @SerialName("items")
    val items: List<OrderItem>? = null
)

@Serializable
data class OrderItem(
    @SerialName("id")
    val id: Int,
    
    @SerialName("order_id")
    val orderId: Int,
    
    @SerialName("product_id")
    val productId: Int,
    
    @SerialName("quantity")
    val quantity: Int,
    
    @SerialName("price_at_order")
    val priceAtOrder: Double,
    
    @SerialName("product")
    val product: Product? = null
)

@Serializable
data class OrdersResponse(
    @SerialName("data")
    val data: List<Order>,
    
    @SerialName("total")
    val total: Int? = null
)

@Serializable
data class CreateOrderRequest(
    @SerialName("customer_id")
    val customerId: String? = null,
    
    @SerialName("items")
    val items: List<CreateOrderItem>
)

@Serializable
data class CreateOrderItem(
    @SerialName("product_id")
    val productId: Int,
    
    @SerialName("quantity")
    val quantity: Int,
    
    @SerialName("price_at_order")
    val priceAtOrder: Double
)
