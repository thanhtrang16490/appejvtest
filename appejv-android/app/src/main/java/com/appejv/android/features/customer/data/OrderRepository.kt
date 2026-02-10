package com.appejv.android.features.customer.data

import com.appejv.android.core.data.model.CreateOrderRequest
import com.appejv.android.core.data.model.Order
import com.appejv.android.core.network.ApiService
import com.appejv.android.core.utils.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OrderRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getOrders(
        status: String? = null,
        page: Int? = null,
        limit: Int? = null
    ): Result<List<Order>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getOrders(status, page, limit)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!.data)
                } else {
                    Result.Error("Không thể tải danh sách đơn hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
    
    suspend fun getOrder(id: Int): Result<Order> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getOrder(id)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    Result.Error("Không thể tải thông tin đơn hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
    
    suspend fun createOrder(request: CreateOrderRequest): Result<Order> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.createOrder(request)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    Result.Error("Không thể tạo đơn hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
}
