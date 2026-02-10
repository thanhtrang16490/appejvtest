package com.appejv.android.features.customer.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appejv.android.core.data.model.Order
import com.appejv.android.core.data.model.Product
import com.appejv.android.core.utils.Result
import com.appejv.android.features.auth.data.AuthRepository
import com.appejv.android.features.customer.data.OrderRepository
import com.appejv.android.features.customer.data.ProductRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CustomerDashboardUiState(
    val isLoading: Boolean = false,
    val products: List<Product> = emptyList(),
    val recentOrders: List<Order> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class CustomerDashboardViewModel @Inject constructor(
    private val productRepository: ProductRepository,
    private val orderRepository: OrderRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CustomerDashboardUiState())
    val uiState: StateFlow<CustomerDashboardUiState> = _uiState.asStateFlow()

    init {
        loadDashboardData()
    }

    fun loadDashboardData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            // Load products
            when (val productsResult = productRepository.getProducts(limit = 10)) {
                is Result.Success -> {
                    _uiState.value = _uiState.value.copy(products = productsResult.data)
                }
                is Result.Error -> {
                    _uiState.value = _uiState.value.copy(error = productsResult.message)
                }
                else -> {}
            }
            
            // Load recent orders
            when (val ordersResult = orderRepository.getOrders(limit = 5)) {
                is Result.Success -> {
                    _uiState.value = _uiState.value.copy(
                        recentOrders = ordersResult.data,
                        isLoading = false
                    )
                }
                is Result.Error -> {
                    _uiState.value = _uiState.value.copy(
                        error = ordersResult.message,
                        isLoading = false
                    )
                }
                else -> {
                    _uiState.value = _uiState.value.copy(isLoading = false)
                }
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
        }
    }
}
