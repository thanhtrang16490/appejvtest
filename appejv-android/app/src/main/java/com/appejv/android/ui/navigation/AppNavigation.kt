package com.appejv.android.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.appejv.android.features.auth.presentation.LoginScreen
import com.appejv.android.features.customer.presentation.*
import com.appejv.android.features.sales.presentation.SalesDashboardScreen

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object CustomerDashboard : Screen("customer_dashboard")
    object ProductsList : Screen("products_list")
    object ProductDetail : Screen("product_detail/{productId}") {
        fun createRoute(productId: Int) = "product_detail/$productId"
    }
    object OrdersList : Screen("orders_list")
    object OrderDetail : Screen("order_detail/{orderId}") {
        fun createRoute(orderId: Int) = "order_detail/$orderId"
    }
    object Selling : Screen("selling")
    object Account : Screen("account")
    object SalesDashboard : Screen("sales_dashboard")
    object Inventory : Screen("inventory")
    object CustomerList : Screen("customers")
    object CustomerDetail : Screen("customer_detail/{customerId}") {
        fun createRoute(customerId: String) = "customer_detail/$customerId"
    }
}

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = { role ->
                    when (role) {
                        "customer" -> {
                            navController.navigate(Screen.CustomerDashboard.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        }
                        "sale", "admin", "sale_admin" -> {
                            navController.navigate(Screen.SalesDashboard.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        }
                    }
                }
            )
        }

        composable(Screen.CustomerDashboard.route) {
            CustomerDashboardScreen(
                navController = navController,
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.ProductsList.route) {
            ProductsListScreen(navController = navController)
        }
        
        composable(Screen.ProductDetail.route) { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId")?.toIntOrNull() ?: 0
            ProductDetailScreen(
                productId = productId,
                navController = navController
            )
        }
        
        composable(Screen.OrdersList.route) {
            OrdersListScreen(navController = navController)
        }
        
        composable(Screen.OrderDetail.route) { backStackEntry ->
            val orderId = backStackEntry.arguments?.getString("orderId")?.toIntOrNull() ?: 0
            OrderDetailScreen(
                orderId = orderId,
                navController = navController
            )
        }
        
        composable(Screen.Selling.route) {
            SellingScreen(navController = navController)
        }
        
        composable(Screen.Account.route) {
            AccountScreen(
                navController = navController,
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.SalesDashboard.route) {
            SalesDashboardScreen(
                navController = navController,
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }
        
        composable(Screen.Inventory.route) {
            InventoryListScreen(navController = navController)
        }
        
        composable(Screen.CustomerList.route) {
            CustomerListScreen(navController = navController)
        }
        
        composable(Screen.CustomerDetail.route) { backStackEntry ->
            val customerId = backStackEntry.arguments?.getString("customerId") ?: ""
            CustomerDetailScreen(
                customerId = customerId,
                navController = navController
            )
        }
    }
}
