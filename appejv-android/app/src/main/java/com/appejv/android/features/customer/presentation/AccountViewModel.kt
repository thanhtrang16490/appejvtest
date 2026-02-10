package com.appejv.android.features.customer.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appejv.android.core.auth.TokenStorage
import com.appejv.android.core.data.model.User
import com.appejv.android.core.network.ApiService
import com.appejv.android.core.utils.Result
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AccountUiState(
    val user: User? = null,
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class AccountViewModel @Inject constructor(
    private val apiService: ApiService,
    private val tokenStorage: TokenStorage
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(AccountUiState())
    val uiState: StateFlow<AccountUiState> = _uiState.asStateFlow()
    
    init {
        loadProfile()
    }
    
    fun loadProfile() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            try {
                val response = apiService.getProfile()
                if (response.isSuccessful && response.body() != null) {
                    _uiState.update {
                        it.copy(
                            user = response.body(),
                            isLoading = false,
                            error = null
                        )
                    }
                } else {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = "Không thể tải thông tin tài khoản"
                        )
                    }
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = "Lỗi kết nối: ${e.localizedMessage}"
                    )
                }
            }
        }
    }
    
    fun logout() {
        viewModelScope.launch {
            try {
                // Call logout API
                apiService.logout()
            } catch (e: Exception) {
                // Ignore errors, just clear local data
            } finally {
                // Clear token storage
                tokenStorage.clearToken()
            }
        }
    }
}
