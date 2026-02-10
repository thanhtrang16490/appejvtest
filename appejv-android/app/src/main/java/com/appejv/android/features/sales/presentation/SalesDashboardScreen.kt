package com.appejv.android.features.sales.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.appejv.android.ui.theme.AppejvTheme
import java.text.NumberFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SalesDashboardScreen(
    navController: NavController? = null,
    onLogout: () -> Unit,
    viewModel: SalesDashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showMenu by remember { mutableStateOf(false) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "APPE JV",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Sales Portal",
                            style = MaterialTheme.typography.bodySmall
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { showMenu = true }) {
                        Icon(Icons.Default.Menu, contentDescription = "Menu")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = AppejvTheme.Primary,
                    titleContentColor = Color.White,
                    actionIconContentColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        when {
            uiState.isLoading -> {
                LoadingState()
            }
            uiState.error != null -> {
                ErrorState(
                    message = uiState.error ?: "Đã xảy ra lỗi",
                    onRetry = { viewModel.loadDashboard() }
                )
            }
            else -> {
                DashboardContent(
                    uiState = uiState,
                    navController = navController,
                    modifier = Modifier.padding(paddingValues)
                )
            }
        }
        
        // Menu Drawer
        if (showMenu) {
            MenuDrawer(
                onDismiss = { showMenu = false },
                onLogout = {
                    showMenu = false
                    onLogout()
                },
                navController = navController
            )
        }
    }
}

@Composable
fun DashboardContent(
    uiState: SalesDashboardUiState,
    navController: NavController?,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Card
        item {
            WelcomeCard(userName = uiState.userName)
        }
        
        // Statistics Cards
        item {
            Text(
                text = "Thống kê hôm nay",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
        item {
            StatisticsGrid(statistics = uiState.statistics)
        }
        
        // Quick Actions
        item {
            Text(
                text = "Thao tác nhanh",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
        item {
            QuickActionsGrid(navController = navController)
        }
        
        // Recent Activity
        item {
            Text(
                text = "Hoạt động gần đây",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
        item {
            RecentActivityCard()
        }
    }
}

@Composable
fun WelcomeCard(userName: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = AppejvTheme.Primary
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "Xin chào, $userName!",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Chúc bạn một ngày làm việc hiệu quả",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White.copy(alpha = 0.9f)
                )
            }
            
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                modifier = Modifier.size(48.dp),
                tint = Color.White
            )
        }
    }
}

@Composable
fun StatisticsGrid(statistics: DashboardStatistics) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        modifier = Modifier.height(280.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(
            listOf(
                StatItem(
                    icon = Icons.Default.ShoppingCart,
                    title = "Đơn hàng",
                    value = "${statistics.totalOrders}",
                    subtitle = "Hôm nay",
                    color = Color(0xFF4CAF50)
                ),
                StatItem(
                    icon = Icons.Default.AttachMoney,
                    title = "Doanh thu",
                    value = formatCurrency(statistics.totalRevenue),
                    subtitle = "Hôm nay",
                    color = Color(0xFF2196F3)
                ),
                StatItem(
                    icon = Icons.Default.People,
                    title = "Khách hàng",
                    value = "${statistics.totalCustomers}",
                    subtitle = "Tổng số",
                    color = Color(0xFFFF9800)
                ),
                StatItem(
                    icon = Icons.Default.Inventory,
                    title = "Sản phẩm",
                    value = "${statistics.totalProducts}",
                    subtitle = "Trong kho",
                    color = Color(0xFF9C27B0)
                )
            )
        ) { stat ->
            StatisticCard(stat = stat)
        }
    }
}

@Composable
fun StatisticCard(stat: StatItem) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = stat.icon,
                contentDescription = stat.title,
                tint = stat.color,
                modifier = Modifier.size(32.dp)
            )
            
            Text(
                text = stat.value,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            Text(
                text = stat.title,
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray
            )
            
            Text(
                text = stat.subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun QuickActionsGrid(navController: NavController?) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(3),
        modifier = Modifier.height(240.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(
            listOf(
                QuickAction(
                    icon = Icons.Default.ShoppingCart,
                    title = "Tạo đơn",
                    color = Color(0xFF4CAF50),
                    route = "selling"
                ),
                QuickAction(
                    icon = Icons.Default.Inventory,
                    title = "Kho hàng",
                    color = Color(0xFF2196F3),
                    route = "inventory"
                ),
                QuickAction(
                    icon = Icons.Default.People,
                    title = "Khách hàng",
                    color = Color(0xFFFF9800),
                    route = "customers"
                ),
                QuickAction(
                    icon = Icons.Default.Receipt,
                    title = "Đơn hàng",
                    color = Color(0xFF9C27B0),
                    route = "orders_list"
                ),
                QuickAction(
                    icon = Icons.Default.BarChart,
                    title = "Báo cáo",
                    color = Color(0xFFE91E63),
                    route = "reports"
                ),
                QuickAction(
                    icon = Icons.Default.Settings,
                    title = "Cài đặt",
                    color = Color(0xFF607D8B),
                    route = "settings"
                )
            )
        ) { action ->
            QuickActionCard(
                action = action,
                onClick = {
                    navController?.navigate(action.route)
                }
            )
        }
    }
}

@Composable
fun QuickActionCard(
    action: QuickAction,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = action.color.copy(alpha = 0.1f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = action.icon,
                contentDescription = action.title,
                tint = action.color,
                modifier = Modifier.size(32.dp)
            )
            
            Text(
                text = action.title,
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.Medium,
                color = action.color
            )
        }
    }
}

@Composable
fun RecentActivityCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.White
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ActivityItem(
                icon = Icons.Default.ShoppingCart,
                title = "Đơn hàng mới #1234",
                subtitle = "5 phút trước",
                color = Color(0xFF4CAF50)
            )
            
            Divider()
            
            ActivityItem(
                icon = Icons.Default.Person,
                title = "Khách hàng mới đăng ký",
                subtitle = "15 phút trước",
                color = Color(0xFF2196F3)
            )
            
            Divider()
            
            ActivityItem(
                icon = Icons.Default.Inventory,
                title = "Cập nhật kho hàng",
                subtitle = "1 giờ trước",
                color = Color(0xFFFF9800)
            )
        }
    }
}

@Composable
fun ActivityItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    color: Color
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(color.copy(alpha = 0.1f), RoundedCornerShape(8.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(24.dp)
            )
        }
        
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MenuDrawer(
    onDismiss: () -> Unit,
    onLogout: () -> Unit,
    navController: NavController?
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "Menu",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            MenuDrawerItem(
                icon = Icons.Default.Person,
                title = "Tài khoản",
                onClick = {
                    onDismiss()
                    navController?.navigate("account")
                }
            )
            
            MenuDrawerItem(
                icon = Icons.Default.Settings,
                title = "Cài đặt",
                onClick = {
                    onDismiss()
                    navController?.navigate("settings")
                }
            )
            
            MenuDrawerItem(
                icon = Icons.Default.Help,
                title = "Trợ giúp",
                onClick = {
                    onDismiss()
                }
            )
            
            Divider(modifier = Modifier.padding(vertical = 8.dp))
            
            MenuDrawerItem(
                icon = Icons.Default.ExitToApp,
                title = "Đăng xuất",
                color = Color.Red,
                onClick = {
                    onDismiss()
                    onLogout()
                }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Composable
fun MenuDrawerItem(
    icon: ImageVector,
    title: String,
    color: Color = Color.Black,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(12.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = color
        )
        Text(
            text = title,
            style = MaterialTheme.typography.bodyLarge,
            color = color
        )
    }
}

@Composable
fun LoadingState() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(color = AppejvTheme.Primary)
    }
}

@Composable
fun ErrorState(message: String, onRetry: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.padding(32.dp)
        ) {
            Text(text = "⚠️", style = MaterialTheme.typography.displayMedium)
            Text(text = message, style = MaterialTheme.typography.bodyLarge)
            Button(
                onClick = onRetry,
                colors = ButtonDefaults.buttonColors(containerColor = AppejvTheme.Primary)
            ) {
                Text("Thử lại")
            }
        }
    }
}

private fun formatCurrency(amount: Double): String {
    val formatter = NumberFormat.getCurrencyInstance(Locale("vi", "VN"))
    return formatter.format(amount)
}

// Data classes
data class StatItem(
    val icon: ImageVector,
    val title: String,
    val value: String,
    val subtitle: String,
    val color: Color
)

data class QuickAction(
    val icon: ImageVector,
    val title: String,
    val color: Color,
    val route: String
)
