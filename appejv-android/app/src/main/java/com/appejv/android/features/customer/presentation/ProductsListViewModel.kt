package com.appejv.android.features.customer.presentation

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

data class ProductsListUiState(
    val isLoading: Boolean = false,
    val products: List<Product> = emptyList(),
    val filteredProducts: List<Product> = emptyList(),
    val searchQuery: String = "",
    val selectedCategoryId: Int? = null,
    val error: String? = null
)

@HiltViewModel
class ProductsListViewModel @Inject constructor(
    private val productRepository: ProductRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProductsListUiState())
    val uiState: StateFlow<ProductsListUiState> = _uiState.asStateFlow()

    init {
        loadProducts()
    }

    fun loadProducts(categoryId: Int? = null) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            
            when (val result = productRepository.getProducts(categoryId = categoryId)) {
                is Result.Success -> {
                    _uiState.value = _uiState.value.copy(
                        products = result.data,
                        filteredProducts = result.data,
                        isLoading = false,
                        selectedCategoryId = categoryId
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

    fun searchProducts(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
        
        val filtered = if (query.isBlank()) {
            _uiState.value.products
        } else {
            _uiState.value.products.filter { product ->
                product.name.contains(query, ignoreCase = true) ||
                product.code.contains(query, ignoreCase = true)
            }
        }
        
        _uiState.value = _uiState.value.copy(filteredProducts = filtered)
    }

    fun clearSearch() {
        _uiState.value = _uiState.value.copy(
            searchQuery = "",
            filteredProducts = _uiState.value.products
        )
    }

    fun refresh() {
        loadProducts(_uiState.value.selectedCategoryId)
    }
}
