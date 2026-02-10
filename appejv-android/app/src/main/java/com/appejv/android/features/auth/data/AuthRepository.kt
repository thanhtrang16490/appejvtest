package com.appejv.android.features.auth.data

import com.appejv.android.core.auth.TokenStorage
import com.appejv.android.core.data.model.LoginRequest
import com.appejv.android.core.data.model.LoginResponse
import com.appejv.android.core.network.ApiService
import com.appejv.android.core.utils.Result
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val apiService: ApiService,
    private val tokenStorage: TokenStorage
) {
    suspend fun login(email: String, password: String): Result<LoginResponse> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.login(LoginRequest(email, password))
                
                if (response.isSuccessful && response.body() != null) {
                    val loginResponse = response.body()!!
                    
                    // Save tokens and user info
                    tokenStorage.saveAccessToken(loginResponse.accessToken)
                    tokenStorage.saveRefreshToken(loginResponse.refreshToken)
                    tokenStorage.saveUserId(loginResponse.user.id)
                    tokenStorage.saveUserEmail(loginResponse.user.email)
                    tokenStorage.saveUserRole(loginResponse.user.role)
                    
                    Result.Success(loginResponse)
                } else {
                    Result.Error("Đăng nhập thất bại: ${response.message()}")
                }
            } catch (e: Exception) {
                Result.Error("Lỗi kết nối: ${e.localizedMessage}", e)
            }
        }
    }

    suspend fun logout(): Result<Unit> {
        return withContext(Dispatchers.IO) {
            try {
                apiService.logout()
                tokenStorage.clearAll()
                Result.Success(Unit)
            } catch (e: Exception) {
                // Clear local data even if API call fails
                tokenStorage.clearAll()
                Result.Success(Unit)
            }
        }
    }

    fun isLoggedIn(): Boolean {
        return tokenStorage.isLoggedIn()
    }

    fun getUserRole(): String? {
        return tokenStorage.getUserRole()
    }
}
