package com.appejv.android.features.sales.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appejv.android.core.data.model.Product
import com.appejv.android.core.utils.Result
import com.appejv.android.features.sales.data.InventoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class InventoryListUiState(
    val products: List<Product> = emptyList(),
    val searchQuery: String = "",
    val filteredProducts: List<Product> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class InventoryListViewModel @Inject constructor(
    private val inventoryRepository: InventoryRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(InventoryListUiState())
    val uiState: StateFlow<InventoryListUiState> = _uiState.asStateFlow()
    
    init {
        loadProducts()
    }
    
    fun loadProducts() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            when (val result = inventoryRepository.getProducts()) {
                is Result.Success -> {
                    _uiState.update {
                        it.copy(
                            products = result.data,
                            filteredProducts = result.data,
                            isLoading = false,
                            error = null
                        )
                    }
                }
                is Result.Error -> {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = result.message
                        )
                    }
                }
            }
        }
    }
    
    fun updateSearchQuery(query: String) {
        _uiState.update { state ->
            val filtered = if (query.isEmpty()) {
                state.products
            } else {
                state.products.filter { product ->
                    product.name.contains(query, ignoreCase = true) ||
                    product.description?.contains(query, ignoreCase = true) == true
                }
            }
            
            state.copy(
                searchQuery = query,
                filteredProducts = filtered
            )
        }
    }
}
