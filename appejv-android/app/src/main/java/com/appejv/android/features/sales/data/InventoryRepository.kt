package com.appejv.android.features.sales.data

import com.appejv.android.core.data.model.Product
import com.appejv.android.core.network.ApiService
import com.appejv.android.core.utils.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class InventoryRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getProducts(
        page: Int? = null,
        limit: Int? = null,
        categoryId: Int? = null
    ): Result<List<Product>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getProducts(page, limit, categoryId)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!.data)
                } else {
                    Result.Error("Không thể tải danh sách sản phẩm")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
    
    suspend fun getProduct(id: Int): Result<Product> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.getProduct(id)
                
                if (response.isSuccessful && response.body() != null) {
                    Result.Success(response.body()!!)
                } else {
                    Result.Error("Không thể tải thông tin sản phẩm")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }
}
