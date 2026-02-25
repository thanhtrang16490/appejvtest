import { useState, useEffect, useCallback, useRef } from 'react'
import { View, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../../src/lib/supabase'
import { useRouter, useFocusEffect } from 'expo-router'
import { emitScrollVisibility } from './_layout'
import { useTabBarHeight } from '../../src/hooks/useTabBarHeight'
import AppHeader from '../../src/components/AppHeader'
import { useDashboardData } from '../../src/hooks/useDashboardData'
import {
  DashboardStats,
  QuickActions,
  RecentOrders,
  TimeRangeFilter,
  TimeRangeModal,
} from '../../src/components/dashboard'
import { LAYOUT } from '../../src/constants/layout'
import { COLORS } from '../../src/constants/colors'

const { PADDING: SPACING } = LAYOUT

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

/**
 * Sales Dashboard - Refactored version
 * Sử dụng components và hooks mới để giảm complexity
 */
export default function SalesDashboard() {
  const router = useRouter()
  const { contentPaddingBottom } = useTabBarHeight()
  const [profile, setProfile] = useState<any>(null)
  const [activeFilter, setActiveFilter] = useState('thisMonth')
  const [refreshing, setRefreshing] = useState(false)
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<number | null>(null)
  const isInitialMount = useRef(true)

  // Use custom hook for data fetching
  const { stats, recentOrders, loading, refetch } = useDashboardData(activeFilter, profile)

  /**
   * Handle scroll để ẩn/hiện tab bar
   */
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    if (Math.abs(scrollDiff) > 5) {
      if (scrollDiff > 0 && currentScrollY > 50) {
        emitScrollVisibility(false)
      } else if (scrollDiff < 0) {
        emitScrollVisibility(true)
      }

      lastScrollY.current = currentScrollY
    }

    scrollTimeout.current = setTimeout(() => {
      emitScrollVisibility(true)
    }, 2000)
  }

  /**
   * Fetch user profile
   */
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }
    }

    fetchProfile()
    isInitialMount.current = false
  }, [])

  /**
   * Auto refresh khi screen focused
   */
  useFocusEffect(
    useCallback(() => {
      if (!isInitialMount.current && !refreshing) {
        refetch()
      }
    }, [refreshing, refetch])
  )

  /**
   * Pull to refresh handler
   */
  const onRefresh = () => {
    setRefreshing(true)
    refetch().finally(() => setRefreshing(false))
  }

  /**
   * Quick action handlers
   */
  const handleNewOrder = () => {
    router.push('/(sales)/selling')
  }

  const handleViewProducts = () => {
    router.push('/(sales)/products' as any)
  }

  const handleViewCustomers = () => {
    router.push('/(sales)/customers')
  }

  const handleViewReports = () => {
    router.push('/(sales)/reports')
  }

  const handleOrderPress = (orderId: string) => {
    router.push(`/(sales)/orders/${orderId}`)
  }

  const handleViewAllOrders = () => {
    router.push('/(sales)/orders')
  }

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
  }

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY.DEFAULT} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: contentPaddingBottom }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Time Range Filter */}
        <TimeRangeFilter
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          options={timeRangeOptions}
        />

        {/* Statistics Cards */}
        <DashboardStats stats={stats} role={profile?.role} />

        {/* Quick Actions */}
        <QuickActions
          onNewOrder={handleNewOrder}
          onViewProducts={handleViewProducts}
          onViewCustomers={handleViewCustomers}
          onViewReports={handleViewReports}
        />

        {/* Recent Orders */}
        <RecentOrders
          orders={recentOrders}
          onOrderPress={handleOrderPress}
          onViewAll={handleViewAllOrders}
        />
      </ScrollView>

      {/* Time Range Modal */}
      <TimeRangeModal
        visible={showTimeRangeModal}
        activeFilter={activeFilter}
        options={timeRangeOptions}
        onClose={() => setShowTimeRangeModal(false)}
        onSelect={handleFilterChange}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.MEDIUM,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
