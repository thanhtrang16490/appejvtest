package com.appejv.android.features.customer.presentation

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appejv.android.core.data.model.Product
import com.appejv.android.core.utils.Result
import com.appejv.android.features.customer.data.ProductRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProductDetailUiState(
    val isLoading: Boolean = false,
    val product: Product? = null,
    val quantity: Int = 1,
    val error: String? = null
)

@HiltViewModel
class ProductDetailViewModel @Inject constructor(
    private val productRepository: ProductRepository,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val productId: Int = checkNotNull(savedStateHandle["productId"])

    private val _uiState = MutableStateFlow(ProductDetailUiState())
    val uiState: StateFlow<ProductDetailUiState> = _uiState.asStateFlow()

    init {
        loadProduct()
    }

    private fun loadProduct() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            when (val result = productRepository.getProduct(productId)) {
                is Result.Success -> {
                    _uiState.value = _uiState.value.copy(
                        product = result.data,
                        isLoading = false
                    )
                }
                is Result.Error -> {
                    _uiState.value = _uiState.value.copy(
                        error = result.message,
                        isLoading = false
                    )
                }
                else -> {}
            }
        }
    }

    fun increaseQuantity() {
        val currentQuantity = _uiState.value.quantity
        val maxStock = _uiState.value.product?.stock ?: 0
        
        if (currentQuantity < maxStock) {
            _uiState.value = _uiState.value.copy(quantity = currentQuantity + 1)
        }
    }

    fun decreaseQuantity() {
        val currentQuantity = _uiState.value.quantity
        if (currentQuantity > 1) {
            _uiState.value = _uiState.value.copy(quantity = currentQuantity - 1)
        }
    }

    fun setQuantity(quantity: Int) {
        val maxStock = _uiState.value.product?.stock ?: 0
        val validQuantity = quantity.coerceIn(1, maxStock)
        _uiState.value = _uiState.value.copy(quantity = validQuantity)
    }

    fun addToCart() {
        // TODO: Implement cart functionality
        // For now, just show a message
    }

    fun refresh() {
        loadProduct()
    }
}
