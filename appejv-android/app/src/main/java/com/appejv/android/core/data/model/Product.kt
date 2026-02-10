package com.appejv.android.core.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Product(
    @SerialName("id")
    val id: Int,
    
    @SerialName("code")
    val code: String,
    
    @SerialName("name")
    val name: String,
    
    @SerialName("slug")
    val slug: String? = null,
    
    @SerialName("unit")
    val unit: String? = null,
    
    @SerialName("stock")
    val stock: Int,
    
    @SerialName("image_url")
    val imageUrl: String? = null,
    
    @SerialName("price")
    val price: Double,
    
    @SerialName("category")
    val category: String? = null,
    
    @SerialName("category_id")
    val categoryId: Int? = null,
    
    @SerialName("description")
    val description: String? = null,
    
    @SerialName("specifications")
    val specifications: String? = null,
    
    @SerialName("created_at")
    val createdAt: String? = null
)

@Serializable
data class ProductsResponse(
    @SerialName("data")
    val data: List<Product>,
    
    @SerialName("total")
    val total: Int? = null
)
