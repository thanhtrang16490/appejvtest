package com.appejv.android.features.sales.data

import com.appejv.android.core.data.model.CreateCustomerRequest
import com.appejv.android.core.data.model.Customer
import com.appejv.android.core.network.ApiService
import com.appejv.android.core.utils.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CustomerRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getCustomers(
        page: Int? = null,
        limit: Int? = null
    ): Result<List<Customer>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getCustomers(page, limit)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!.data)
                } else {
                    Result.Error("Không thể tải danh sách khách hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
    
    suspend fun getCustomer(id: String): Result<Customer> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getCustomer(id)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    Result.Error("Không thể tải thông tin khách hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
    
    suspend fun createCustomer(request: CreateCustomerRequest): Result<Customer> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.createCustomer(request)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    Result.Error("Không thể tạo khách hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
    
    suspend fun updateCustomer(id: String, updates: Map<String, Any>): Result<Customer> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.updateCustomer(id, updates)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    Result.Error("Không thể cập nhật khách hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
    
    suspend fun deleteCustomer(id: String): Result<Unit> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.deleteCustomer(id)
                
                if (response.isSuccessful) {
                    Result.Success(Unit)
                } else {
                    Result.Error("Không thể xóa khách hàng")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
}
