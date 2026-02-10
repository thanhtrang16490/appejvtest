package com.appejv.android.features.sales.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appejv.android.core.data.model.Customer
import com.appejv.android.core.utils.Result
import com.appejv.android.features.sales.data.CustomerRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CustomerListUiState(
    val customers: List<Customer> = emptyList(),
    val searchQuery: String = "",
    val filteredCustomers: List<Customer> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class CustomerListViewModel @Inject constructor(
    private val customerRepository: CustomerRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(CustomerListUiState())
    val uiState: StateFlow<CustomerListUiState> = _uiState.asStateFlow()
    
    init {
        loadCustomers()
    }
    
    fun loadCustomers() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            when (val result = customerRepository.getCustomers()) {
                is Result.Success -> {
                    _uiState.update {
                        it.copy(
                            customers = result.data,
                            filteredCustomers = result.data,
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
                state.customers
            } else {
                state.customers.filter { customer ->
                    customer.fullName?.contains(query, ignoreCase = true) == true ||
                    customer.email.contains(query, ignoreCase = true) ||
                    customer.phone?.contains(query, ignoreCase = true) == true
                }
            }
            
            state.copy(
                searchQuery = query,
                filteredCustomers = filtered
            )
        }
    }
}
