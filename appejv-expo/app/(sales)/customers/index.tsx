import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Image, RefreshControl, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

// Generate consistent color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    { bg: '#3b82f6', text: '#ffffff' }, // blue
    { bg: '#10b981', text: '#ffffff' }, // emerald
    { bg: '#a855f7', text: '#ffffff' }, // purple
    { bg: '#f59e0b', text: '#ffffff' }, // amber
    { bg: '#f43f5e', text: '#ffffff' }, // rose
    { bg: '#06b6d4', text: '#ffffff' }, // cyan
    { bg: '#6366f1', text: '#ffffff' }, // indigo
    { bg: '#ec4899', text: '#ffffff' }, // pink
    { bg: '#14b8a6', text: '#ffffff' }, // teal
    { bg: '#f97316', text: '#ffffff' }, // orange
  ]
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export default function CustomersScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [customers, setCustomers] = useState<any[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Filter customers based on search query
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = customers.filter(customer =>
        customer.name?.toLowerCase().includes(query) ||
        customer.code?.toLowerCase().includes(query) ||
        customer.phone?.includes(searchQuery) ||
        customer.address?.toLowerCase().includes(query)
      )
      setFilteredCustomers(filtered)
    }
  }, [searchQuery, customers])

  const fetchData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        router.replace('/(auth)/login')
        return
      }

      // Fetch profile
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

      const userRole = profileData.role
      const isSale = userRole === 'sale'
      const isSaleAdmin = userRole === 'sale_admin'

      // For Sale Admin, fetch managed sales IDs
      let managedSaleIds: string[] = []
      if (isSaleAdmin) {
        const { data: managedSales } = await supabase
          .from('profiles')
          .select('id')
          .eq('manager_id', authUser.id)
        managedSaleIds = managedSales?.map(s => s.id) || []
      }

      // Fetch customers from profiles with role='customer'
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false })

      // Role-based filtering
      if (isSale) {
        // Sale sees customers they created/manage
        query = query.eq('created_by', authUser.id)
      } else if (isSaleAdmin) {
        // Sale Admin sees customers created by their team
        query = query.in('created_by', [authUser.id, ...managedSaleIds])
      }
      // Admin sees all customers (no filter)

      const { data: customersData } = await query

      // Map profiles to customer format
      const mappedCustomers = (customersData || []).map(p => ({
        id: p.id,
        name: p.full_name || 'No Name',
        code: p.id.substring(0, 8), // Use first 8 chars of ID as code
        phone: p.phone || '',
        address: p.address || '',
        email: p.email || '',
        created_at: p.created_at,
      }))

      setCustomers(mappedCustomers)
      setFilteredCustomers(mappedCustomers)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <View style={styles.topHeader}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/icon.png')} 
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
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Khách hàng</Text>
          <Text style={styles.subtitle}>{filteredCustomers.length} khách hàng</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm khách hàng..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Customers List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredCustomers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredCustomers.map((customer) => {
            const avatarColor = getAvatarColor(customer.name || 'Unknown')
            const initials = (customer.name || 'UK').substring(0, 2).toUpperCase()
            
            return (
              <TouchableOpacity
                key={customer.id}
                style={styles.customerCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/(sales)/customers/${customer.id}`)}
              >
                <View style={styles.customerContent}>
                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
                    <Text style={[styles.avatarText, { color: avatarColor.text }]}>
                      {initials}
                    </Text>
                  </View>

                  {/* Customer Info */}
                  <View style={styles.customerDetails}>
                    <View style={styles.customerHeader}>
                      <Text style={styles.customerName} numberOfLines={1}>
                        {customer.name}
                      </Text>
                      {customer.code && (
                        <Text style={styles.customerCode}>{customer.code}</Text>
                      )}
                    </View>

                    <View style={styles.customerMeta}>
                      {customer.phone && (
                        <View style={styles.metaItem}>
                          <Ionicons name="call" size={12} color="#6b7280" />
                          <Text style={styles.metaText}>{customer.phone}</Text>
                        </View>
                      )}
                      {customer.address && (
                        <View style={styles.metaItem}>
                          <Ionicons name="location" size={12} color="#6b7280" />
                          <Text style={styles.metaText} numberOfLines={1}>
                            {customer.address}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Arrow */}
                  <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
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
  pageHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f9ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#175ead',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#f0f9ff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 8,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  clearButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerDetails: {
    flex: 1,
    minWidth: 0,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  customerCode: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerMeta: {
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
})
