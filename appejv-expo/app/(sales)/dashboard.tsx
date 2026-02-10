import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../src/contexts/AuthContext'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const filterTabs = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'yesterday', label: 'Hôm qua' },
  { id: 'thisMonth', label: 'Tháng này' },
  { id: 'other', label: 'Khác' },
]

export default function SalesDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    pendingCount: 0,
    lowStockCount: 0,
    customerCount: 0,
    totalRevenue: 0
  })
  const [activeFilter, setActiveFilter] = useState('thisMonth')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeFilter])

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
      // 1. Pending Orders
      let pendingQuery = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .gte('created_at', startDate)
        .lt('created_at', endDate)

      if (isSale) {
        pendingQuery = pendingQuery.eq('sale_id', authUser.id)
      } else if (isSaleAdmin) {
        pendingQuery = pendingQuery.in('sale_id', [authUser.id, ...managedSaleIds])
      }
      const { count: pendingCount } = await pendingQuery

      // 2. Low Stock Items
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lt('stock', 20)

      // 3. Customers
      let customerQuery = supabase.from('customers').select('*', { count: 'exact', head: true })
      if (isSale) {
        customerQuery = customerQuery.eq('assigned_sale', authUser.id)
      } else if (isSaleAdmin) {
        customerQuery = customerQuery.in('assigned_sale', [authUser.id, ...managedSaleIds])
      }
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

      setStats({
        pendingCount: pendingCount || 0,
        lowStockCount: lowStockCount || 0,
        customerCount: customerCount || 0,
        totalRevenue
      })
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
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        break
      default:
        startDate = new Date(0)
        endDate = new Date()
    }

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Logo */}
        <View style={styles.topHeader}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoTitle}>APPE JV</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => router.push('/(sales)/menu')}
          >
            <Ionicons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

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
                onPress={() => setActiveFilter(tab.id)}
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
              title="Chờ xử lý" 
              icon="time" 
              value={stats.pendingCount.toString()} 
              color="#f59e0b" 
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
      </ScrollView>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: '500',
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
})
