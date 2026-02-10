package com.appejv.android.core.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Customer(
    @SerialName("id")
    val id: String,
    
    @SerialName("email")
    val email: String,
    
    @SerialName("full_name")
    val fullName: String? = null,
    
    @SerialName("phone")
    val phone: String? = null,
    
    @SerialName("address")
    val address: String? = null,
    
    @SerialName("created_at")
    val createdAt: String,
    
    @SerialName("updated_at")
    val updatedAt: String? = null,
    
    @SerialName("total_orders")
    val totalOrders: Int? = 0,
    
    @SerialName("total_spent")
    val totalSpent: Double? = 0.0
)

@Serializable
data class CustomersResponse(
    @SerialName("data")
    val data: List<Customer>,
    
    @SerialName("total")
    val total: Int? = null
)

@Serializable
data class CreateCustomerRequest(
    @SerialName("email")
    val email: String,
    
    @SerialName("full_name")
    val fullName: String? = null,
    
    @SerialName("phone")
    val phone: String? = null,
    
    @SerialName("address")
    val address: String? = null,
    
    @SerialName("password")
    val password: String
)
