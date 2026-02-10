package com.appejv.android.features.sales.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appejv.android.core.network.ApiService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SalesDashboardUiState(
    val userName: String = "Admin",
    val statistics: DashboardStatistics = DashboardStatistics(),
    val isLoading: Boolean = false,
    val error: String? = null
)

data class DashboardStatistics(
    val totalOrders: Int = 0,
    val totalRevenue: Double = 0.0,
    val totalCustomers: Int = 0,
    val totalProducts: Int = 0
)

@HiltViewModel
class SalesDashboardViewModel @Inject constructor(
    private val apiService: ApiService
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(SalesDashboardUiState())
    val uiState: StateFlow<SalesDashboardUiState> = _uiState.asStateFlow()
    
    init {
        loadDashboard()
    }
    
    fun loadDashboard() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            try {
                // Load user profile
                val profileResponse = apiService.getProfile()
                val userName = if (profileResponse.isSuccessful && profileResponse.body() != null) {
                    profileResponse.body()?.fullName ?: profileResponse.body()?.email ?: "Admin"
                } else {
                    "Admin"
                }
                
                // Load statistics (mock data for now - would need real API endpoints)
                val statistics = DashboardStatistics(
                    totalOrders = 45,
                    totalRevenue = 125000000.0,
                    totalCustomers = 234,
                    totalProducts = 156
                )
                
                _uiState.update {
                    it.copy(
                        userName = userName,
                        statistics = statistics,
                        isLoading = false,
                        error = null
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = "Không thể tải dữ liệu: ${e.localizedMessage}"
                    )
                }
            }
        }
    }
}
