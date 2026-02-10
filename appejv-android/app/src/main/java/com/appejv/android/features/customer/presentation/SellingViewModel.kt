package com.appejv.android.features.customer.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.appejv.android.core.data.model.CreateOrderItem
import com.appejv.android.core.data.model.CreateOrderRequest
import com.appejv.android.core.data.model.Product
import com.appejv.android.core.utils.Result
import com.appejv.android.features.customer.data.OrderRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SellingUiState(
    val cartItems: List<CartItem> = emptyList(),
    val totalAmount: Double = 0.0,
    val isCreatingOrder: Boolean = false,
    val orderCreated: Boolean = false,
    val createdOrderId: Int? = null,
    val error: String? = null
)

@HiltViewModel
class SellingViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(SellingUiState())
    val uiState: StateFlow<SellingUiState> = _uiState.asStateFlow()
    
    fun addToCart(product: Product, quantity: Int = 1) {
        _uiState.update { state ->
            val existingItem = state.cartItems.find { it.product.id == product.id }
            
            val updatedCart = if (existingItem != null) {
                // Update quantity if product already in cart
                state.cartItems.map { item ->
                    if (item.product.id == product.id) {
                        item.copy(quantity = item.quantity + quantity)
                    } else {
                        item
                    }
                }
            } else {
                // Add new item to cart
                state.cartItems + CartItem(product, quantity)
            }
            
            state.copy(
                cartItems = updatedCart,
                totalAmount = calculateTotal(updatedCart)
            )
        }
    }
    
    fun updateQuantity(productId: Int, newQuantity: Int) {
        if (newQuantity <= 0) {
            removeFromCart(productId)
            return
        }
        
        _uiState.update { state ->
            val updatedCart = state.cartItems.map { item ->
                if (item.product.id == productId) {
                    item.copy(quantity = newQuantity)
                } else {
                    item
                }
            }
            
            state.copy(
                cartItems = updatedCart,
                totalAmount = calculateTotal(updatedCart)
            )
        }
    }
    
    fun removeFromCart(productId: Int) {
        _uiState.update { state ->
            val updatedCart = state.cartItems.filter { it.product.id != productId }
            
            state.copy(
                cartItems = updatedCart,
                totalAmount = calculateTotal(updatedCart)
            )
        }
    }
    
    fun clearCart() {
        _uiState.update {
            it.copy(
                cartItems = emptyList(),
                totalAmount = 0.0
            )
        }
    }
    
    fun createOrder() {
        val cartItems = _uiState.value.cartItems
        if (cartItems.isEmpty()) {
            _uiState.update { it.copy(error = "Giỏ hàng trống") }
            return
        }
        
        viewModelScope.launch {
            _uiState.update { it.copy(isCreatingOrder = true, error = null) }
            
            val orderItems = cartItems.map { cartItem ->
                CreateOrderItem(
                    productId = cartItem.product.id,
                    quantity = cartItem.quantity,
                    priceAtOrder = cartItem.product.price
                )
            }
            
            val request = CreateOrderRequest(
                customerId = null, // Will use current user's ID from token
                items = orderItems
            )
            
            when (val result = orderRepository.createOrder(request)) {
                is Result.Success -> {
                    _uiState.update {
                        it.copy(
                            isCreatingOrder = false,
                            orderCreated = true,
                            createdOrderId = result.data.id,
                            cartItems = emptyList(),
                            totalAmount = 0.0
                        )
                    }
                }
                is Result.Error -> {
                    _uiState.update {
                        it.copy(
                            isCreatingOrder = false,
                            error = result.message
                        )
                    }
                }
            }
        }
    }
    
    fun resetOrderState() {
        _uiState.update {
            it.copy(
                orderCreated = false,
                createdOrderId = null,
                error = null
            )
        }
    }
    
    private fun calculateTotal(cartItems: List<CartItem>): Double {
        return cartItems.sumOf { it.product.price * it.quantity }
    }
}
