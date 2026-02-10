package com.appejv.android.core.network

import com.appejv.android.core.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    // Auth
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @POST("auth/logout")
    suspend fun logout(): Response<Unit>
    
    // Products
    @GET("products")
    suspend fun getProducts(
        @Query("page") page: Int? = null,
        @Query("limit") limit: Int? = null,
        @Query("category_id") categoryId: Int? = null
    ): Response<ProductsResponse>
    
    @GET("products/{id}")
    suspend fun getProduct(@Path("id") id: Int): Response<Product>
    
    // Orders
    @GET("orders")
    suspend fun getOrders(
        @Query("status") status: String? = null,
        @Query("page") page: Int? = null,
        @Query("limit") limit: Int? = null
    ): Response<OrdersResponse>
    
    @GET("orders/{id}")
    suspend fun getOrder(@Path("id") id: Int): Response<Order>
    
    @POST("orders")
    suspend fun createOrder(@Body request: CreateOrderRequest): Response<Order>
    
    @PATCH("orders/{id}")
    suspend fun updateOrder(
        @Path("id") id: Int,
        @Body updates: Map<String, Any>
    ): Response<Order>
    
    // Profile
    @GET("profile")
    suspend fun getProfile(): Response<User>
    
    @PATCH("profile")
    suspend fun updateProfile(@Body updates: Map<String, Any>): Response<User>
    
    // Customers
    @GET("customers")
    suspend fun getCustomers(
        @Query("page") page: Int? = null,
        @Query("limit") limit: Int? = null
    ): Response<CustomersResponse>
    
    @GET("customers/{id}")
    suspend fun getCustomer(@Path("id") id: String): Response<Customer>
    
    @POST("customers")
    suspend fun createCustomer(@Body request: CreateCustomerRequest): Response<Customer>
    
    @PATCH("customers/{id}")
    suspend fun updateCustomer(
        @Path("id") id: String,
        @Body updates: Map<String, Any>
    ): Response<Customer>
    
    @DELETE("customers/{id}")
    suspend fun deleteCustomer(@Path("id") id: String): Response<Unit>
}
