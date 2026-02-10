package com.appejv.android.core.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class User(
    @SerialName("id")
    val id: String,
    
    @SerialName("email")
    val email: String,
    
    @SerialName("full_name")
    val fullName: String? = null,
    
    @SerialName("role")
    val role: String,
    
    @SerialName("phone")
    val phone: String? = null,
    
    @SerialName("avatar_url")
    val avatarUrl: String? = null,
    
    @SerialName("created_at")
    val createdAt: String? = null
)

@Serializable
data class LoginRequest(
    @SerialName("email")
    val email: String,
    
    @SerialName("password")
    val password: String
)

@Serializable
data class LoginResponse(
    @SerialName("access_token")
    val accessToken: String,
    
    @SerialName("refresh_token")
    val refreshToken: String,
    
    @SerialName("user")
    val user: User
)
