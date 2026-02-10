import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'

const filterTabs = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: 'thisMonth', label: 'Tháng này' },
  { id: 'other', label: 'Khác' },
]

const timeRangeOptions = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: 'last7days', label: '7 ngày qua' },
  { id: 'thisMonth', label: 'Tháng này' },
  { id: 'lastMonth', label: 'Tháng trước' },
  { id: 'thisQuarter', label: 'Quý này' },
  { id: 'thisYear', label: 'Năm nay' },
  { id: 'all', label: 'Tất cả' },
]

export default function SalesDashboard() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    orderedCount: 0,
    lowStockCount: 0,
    customerCount: 0,
    totalRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [activeFilter, setActiveFilter] = useState('thisMonth')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    // Only trigger if scroll difference is significant
    if (Math.abs(scrollDiff) > 5) {
      if (scrollDiff > 0 && currentScrollY > 50) {
        // Scrolling down - hide
        emitScrollVisibility(false)
      } else if (scrollDiff < 0) {
        // Scrolling up - show
        emitScrollVisibility(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    // Show tab bar after user stops scrolling
    scrollTimeout.current = setTimeout(() => {
      emitScrollVisibility(true)
    }, 2000)
  }

  useEffect(() => {
    fetchData()
    isInitialMount.current = false
  }, [activeFilter])

  // Auto refresh when screen is focused (but not on initial load)
  useFocusEffect(
    useCallback(() => {
      // Only refresh if not initial mount and not currently refreshing
      if (!isInitialMount.current && !refreshing) {
        fetchData()
      }
    }, [refreshing])
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchData().finally(() => setRefreshing(false))
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Verify role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authUser.id)
        .single()

      if (!profileData || !['sale', 'admin', 'sale_admin'].includes(profileData.role)) {
        router.replace('/(auth)/login')
        return
      }

      setProfile(profileData)

      const isSale = profileData.role === 'sale'
      const isSaleAdmin = profileData.role === 'sale_admin'

      // For Sale Admin, fetch managed sales IDs
      let managedSaleIds: string[] = []
      if (isSaleAdmin) {
        const { data: managedSales } = await supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', authUser.id)
        managedSaleIds = managedSales?.map((s: any) => s.id) || []
      }

      // Get date range based on filter
      const { startDate, endDate } = getDateRange()

      // Fetch Stats
      // 1. Ordered Orders (đặt hàng)
      let orderedQuery = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ordered')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (isSale) {
        orderedQuery = orderedQuery.eq('sale_id', authUser.id)
      } else if (isSaleAdmin) {
        orderedQuery = orderedQuery.in('sale_id', [authUser.id, ...managedSaleIds])
      }
      const { count: orderedCount } = await orderedQuery

      // 2. Low Stock Items
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 20)

      // 3. Customers (from profiles with role='customer')
      let customerQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer')
      
      const { count: customerCount } = await customerQuery

      // 4. Completed Orders & Revenue
      let revenueQuery = supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (isSale) {
        revenueQuery = revenueQuery.eq('sale_id', authUser.id)
      } else if (isSaleAdmin) {
        revenueQuery = revenueQuery.in('sale_id', [authUser.id, ...managedSaleIds])
      }
      const { data: completedOrders } = await revenueQuery

      const totalRevenue = completedOrders?.reduce((sum, o: any) => sum + (o.total_amount || 0), 0) || 0

      // 5. Recent Orders (5 latest)
      let recentQuery = supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (isSale) {
        recentQuery = recentQuery.eq('sale_id', authUser.id)
      } else if (isSaleAdmin) {
        recentQuery = recentQuery.in('sale_id', [authUser.id, ...managedSaleIds])
      }
      const { data: recentOrdersData } = await recentQuery

      setStats({
        orderedCount: orderedCount || 0,
        lowStockCount: lowStockCount || 0,
        customerCount: customerCount || 0,
        totalRevenue
      })
      setRecentOrders(recentOrdersData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = () => {
    const now = new Date()
    let startDate: Date
    let endDate: Date = new Date()

    switch (activeFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        break
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'last7days':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
        break
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        break
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'thisQuarter':
        const quarter = Math.floor(now.getMonth() / 3)
        startDate = new Date(now.getFullYear(), quarter * 3, 1)
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 1)
        break
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear() + 1, 0, 1)
        break
      case 'all':
        startDate = new Date(2020, 0, 1) // Từ 2020
        endDate = new Date(now.getFullYear() + 1, 0, 1)
        break
      default:
        startDate = new Date(0)
        endDate = new Date()
    }

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  }

  const handleFilterChange = (filterId: string) => {
    if (filterId === 'other') {
      setShowTimeRangeModal(true)
    } else {
      setActiveFilter(filterId)
    }
  }

  const handleTimeRangeSelect = (rangeId: string) => {
    setActiveFilter(rangeId)
    setShowTimeRangeModal(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' VNĐ'
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  const isSaleAdmin = profile?.role === 'sale_admin'

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Nháp', color: '#374151', bg: '#f3f4f6' },
    ordered: { label: 'Đặt hàng', color: '#d97706', bg: '#fef3c7' },
    shipping: { label: 'Giao hàng', color: '#2563eb', bg: '#dbeafe' },
    paid: { label: 'Thanh toán', color: '#9333ea', bg: '#f3e8ff' },
    completed: { label: 'Hoàn thành', color: '#059669', bg: '#d1fae5' },
    cancelled: { label: 'Đã hủy', color: '#dc2626', bg: '#fee2e2' }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Logo */}
        <AppHeader />

        {/* Page Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Tổng quan bán hàng</Text>
              <Text style={styles.headerSubtitle}>
                {isSaleAdmin ? 'Hiệu suất nhóm của bạn' : 'Hiệu suất bán hàng của bạn'}
              </Text>
            </View>
            <View style={styles.headerIcon}>
              <Ionicons name="bag-handle" size={24} color="#175ead" />
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterTab,
                  activeFilter === tab.id && styles.filterTabActive
                ]}
                onPress={() => handleFilterChange(tab.id)}
              >
                <Text style={[
                  styles.filterTabText,
                  activeFilter === tab.id && styles.filterTabTextActive
                ]}>
                  {tab.label}
                </Text>
                {tab.id === 'other' && (
                  <Ionicons 
                    name="chevron-down" 
                    size={16} 
                    color={activeFilter === tab.id ? 'white' : '#666'} 
                    style={{ marginLeft: 4 }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <MetricCard 
              title="Tổng doanh thu" 
              icon="trending-up" 
              value={formatCurrency(stats.totalRevenue)} 
              color="#10b981" 
              bg="#d1fae5" 
            />
            <MetricCard 
              title="Đặt hàng" 
              icon="cart" 
              value={stats.orderedCount.toString()} 
              color="#d97706" 
              bg="#fef3c7" 
            />
            <MetricCard 
              title="Hàng sắp hết" 
              icon="warning" 
              value={stats.lowStockCount.toString()} 
              color="#ef4444" 
              bg="#fee2e2" 
            />
            <MetricCard 
              title="Khách hàng" 
              icon="people" 
              value={stats.customerCount.toString()} 
              color="#175ead" 
              bg="#dbeafe" 
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Thao tác nhanh</Text>
          <View style={styles.actionsGrid}>
            <QuickActionButton 
              title="Tạo đơn mới" 
              icon="bag-add" 
              color="#dbeafe" 
              iconColor="#175ead" 
              onPress={() => router.push('/(sales)/selling' as any)}
            />
            <QuickActionButton 
              title="Khách hàng" 
              icon="people" 
              color="#d1fae5" 
              iconColor="#10b981" 
              onPress={() => router.push('/(sales)/customers')}
            />
            <QuickActionButton 
              title="Bán hàng" 
              icon="cart" 
              color="#fef3c7" 
              iconColor="#f59e0b" 
              onPress={() => router.push('/(sales)/selling' as any)}
            />
            <QuickActionButton 
              title="Báo cáo" 
              icon="bar-chart" 
              color="#e0e7ff" 
              iconColor="#6366f1" 
              onPress={() => router.push('/(sales)/reports' as any)}
            />
          </View>
        </View>

        {/* Recent Orders */}
        <View style={[styles.recentContainer, { paddingBottom: contentPaddingBottom }]}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Đơn hàng gần đây</Text>
            <TouchableOpacity onPress={() => router.push('/(sales)/orders')}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {recentOrders.length === 0 ? (
            <View style={styles.emptyOrders}>
              <Ionicons name="receipt-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyOrdersText}>Chưa có đơn hàng nào</Text>
              <TouchableOpacity 
                style={styles.createOrderButton}
                onPress={() => router.push('/(sales)/selling' as any)}
              >
                <Text style={styles.createOrderButtonText}>Tạo đơn đầu tiên</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {recentOrders.map((order) => {
                const config = statusMap[order.status] || statusMap.draft
                return (
                  <TouchableOpacity
                    key={order.id}
                    style={styles.orderItem}
                    onPress={() => router.push(`/(sales)/orders/${order.id}`)}
                  >
                    <View style={styles.orderLeft}>
                      <View style={styles.orderIconContainer}>
                        <Ionicons name="receipt" size={20} color="#175ead" />
                      </View>
                      <View style={styles.orderInfo}>
                        <Text style={styles.orderNumber}>Đơn #{order.id}</Text>
                        <Text style={styles.orderDate}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={styles.orderAmount}>
                        {formatCurrency(order.total_amount)}
                      </Text>
                      <View style={[styles.orderBadge, { backgroundColor: config.bg }]}>
                        <Text style={[styles.orderBadgeText, { color: config.color }]}>
                          {config.label}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Time Range Bottom Drawer */}
      <Modal
        visible={showTimeRangeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimeRangeModal(false)}
      >
        <TouchableOpacity 
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setShowTimeRangeModal(false)}
        >
          <View style={styles.drawerContent} onStartShouldSetResponder={() => true}>
            <View style={styles.drawerHandle} />
            
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Chọn thời gian</Text>
              <TouchableOpacity 
                style={styles.drawerCloseButton}
                onPress={() => setShowTimeRangeModal(false)}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.drawerScroll}>
              {timeRangeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.drawerOption,
                    activeFilter === option.id && styles.drawerOptionActive
                  ]}
                  onPress={() => handleTimeRangeSelect(option.id)}
                >
                  <Text style={[
                    styles.drawerOptionText,
                    activeFilter === option.id && styles.drawerOptionTextActive
                  ]}>
                    {option.label}
                  </Text>
                  {activeFilter === option.id && (
                    <Ionicons name="checkmark" size={24} color="#175ead" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

function MetricCard({ title, icon, value, color, bg }: any) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={[styles.metricIconContainer, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  )
}

function QuickActionButton({ title, icon, color, iconColor, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginTop: 8,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#175ead',
    borderColor: '#175ead',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    flex: 1,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#374151',
  },
  recentContainer: {
    paddingHorizontal: 16,
    // paddingBottom is set dynamically using useTabBarHeight hook
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#175ead',
  },
  emptyOrders: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyOrdersText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  createOrderButton: {
    backgroundColor: '#175ead',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  createOrderButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  ordersList: {
    gap: 12,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  orderIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  orderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  drawerCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerScroll: {
    maxHeight: 500,
  },
  drawerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  drawerOptionActive: {
    backgroundColor: '#f0f9ff',
  },
  drawerOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  drawerOptionTextActive: {
    color: '#175ead',
    fontWeight: '600',
  },
})
