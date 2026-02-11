# Phase 3 Implementation Guide - Remaining Tasks

## Overview

Phase 3 Part 1 đã hoàn thành (Team Management). Phần này hướng dẫn implement các features còn lại.

---

## Remaining Tasks

1. ⏸️ Update customers page with tabs (My/Team/All)
2. ⏸️ Update orders page with tabs (My/Team)
3. ⏸️ Update dashboard for sale_admin (dual dashboard)
4. ⏸️ Create customer assignment UI
5. ⏸️ Enable feature flags

---

## Task 1: Update Customers Page with Tabs

### File: `app/(sales)/customers/index.tsx`

### Changes Needed:

#### 1. Add imports
```typescript
import { useAuth } from '../../../src/contexts/AuthContext'
import { hasTeamFeatures } from '../../../src/lib/feature-flags'
```

#### 2. Add state for tabs
```typescript
const { user } = useAuth()
const [activeTab, setActiveTab] = useState<'my' | 'team' | 'all'>('my')
const [profile, setProfile] = useState<any>(null)
const [teamMemberIds, setTeamMemberIds] = useState<string[]>([])
```

#### 3. Fetch profile and team members
```typescript
useEffect(() => {
  const fetchProfile = async () => {
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(data)
      
      // If sale_admin, fetch team member IDs
      if (data?.role === 'sale_admin') {
        const { data: teamData } = await supabase
          .from('sales_teams')
          .select('id')
          .eq('manager_id', user.id)
          .single()
        
        if (teamData) {
          const { data: membersData } = await supabase
            .from('team_members')
            .select('sale_id')
            .eq('team_id', teamData.id)
            .eq('status', 'active')
          
          setTeamMemberIds(membersData?.map(m => m.sale_id) || [])
        }
      }
    }
  }
  fetchProfile()
}, [user])
```

#### 4. Add tab navigation UI (after page header)
```typescript
{/* Tabs */}
{profile && (
  <View style={styles.tabsContainer}>
    <TouchableOpacity
      style={[styles.tab, activeTab === 'my' && styles.tabActive]}
      onPress={() => setActiveTab('my')}
    >
      <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
        Của tôi
      </Text>
    </TouchableOpacity>
    
    {hasTeamFeatures(profile.role) && (
      <TouchableOpacity
        style={[styles.tab, activeTab === 'team' && styles.tabActive]}
        onPress={() => setActiveTab('team')}
      >
        <Text style={[styles.tabText, activeTab === 'team' && styles.tabTextActive]}>
          Team
        </Text>
      </TouchableOpacity>
    )}
    
    {profile.role === 'admin' && (
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.tabActive]}
        onPress={() => setActiveTab('all')}
      >
        <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
          Tất cả
        </Text>
      </TouchableOpacity>
    )}
  </View>
)}
```

#### 5. Update query based on active tab
```typescript
const fetchCustomers = async () => {
  try {
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Filter based on active tab
    if (activeTab === 'my') {
      query = query.eq('assigned_to', user.id)
    } else if (activeTab === 'team') {
      query = query.in('assigned_to', teamMemberIds)
    }
    // 'all' tab: no filter (admin sees everything)
    
    const { data } = await query
    setCustomers(data || [])
  } catch (error) {
    console.error('Error:', error)
  }
}
```

#### 6. Add styles
```typescript
tabsContainer: {
  flexDirection: 'row',
  paddingHorizontal: 16,
  paddingVertical: 8,
  backgroundColor: '#f0f9ff',
  gap: 8,
},
tab: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  backgroundColor: 'white',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#e5e7eb',
},
tabActive: {
  backgroundColor: '#175ead',
  borderColor: '#175ead',
},
tabText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#6b7280',
},
tabTextActive: {
  color: 'white',
},
```

---

## Task 2: Update Orders Page with Tabs

### File: `app/(sales)/orders/index.tsx`

### Changes Needed:

Similar to customers page, but simpler (only My/Team tabs):

#### 1. Add imports and state
```typescript
import { useAuth } from '../../../src/contexts/AuthContext'
import { hasTeamFeatures } from '../../../src/lib/feature-flags'

const [activeTab, setActiveTab] = useState<'my' | 'team'>('my')
const [profile, setProfile] = useState<any>(null)
const [teamMemberIds, setTeamMemberIds] = useState<string[]>([])
```

#### 2. Add tab navigation (2 tabs only)
```typescript
<View style={styles.tabsContainer}>
  <TouchableOpacity
    style={[styles.tab, activeTab === 'my' && styles.tabActive]}
    onPress={() => setActiveTab('my')}
  >
    <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
      Của tôi
    </Text>
  </TouchableOpacity>
  
  {hasTeamFeatures(profile?.role) && (
    <TouchableOpacity
      style={[styles.tab, activeTab === 'team' && styles.tabActive]}
      onPress={() => setActiveTab('team')}
    >
      <Text style={[styles.tabText, activeTab === 'team' && styles.tabTextActive]}>
        Team
      </Text>
    </TouchableOpacity>
  )}
</View>
```

#### 3. Update query
```typescript
const fetchOrders = async () => {
  let query = supabase
    .from('orders')
    .select('*, customer:customers(*)')
    .order('created_at', { ascending: false })
  
  if (activeTab === 'my') {
    query = query.eq('created_by', user.id)
  } else if (activeTab === 'team') {
    query = query.in('created_by', teamMemberIds)
  }
  
  const { data } = await query
  setOrders(data || [])
}
```

---

## Task 3: Update Dashboard for Sale Admin

### File: `app/(sales)/dashboard.tsx`

### Changes Needed:

#### 1. Add imports
```typescript
import { hasSaleAdminDashboard } from '../../../src/lib/feature-flags'
```

#### 2. Add state for team stats
```typescript
const [teamStats, setTeamStats] = useState({
  teamMembers: 0,
  teamCustomers: 0,
  teamOrders: 0,
  teamRevenue: 0,
})
const [topPerformers, setTopPerformers] = useState<any[]>([])
```

#### 3. Fetch team stats (if sale_admin)
```typescript
useEffect(() => {
  const fetchTeamStats = async () => {
    if (profile?.role === 'sale_admin' && hasSaleAdminDashboard(profile.role)) {
      // Fetch team
      const { data: teamData } = await supabase
        .from('sales_teams')
        .select('id')
        .eq('manager_id', user.id)
        .single()
      
      if (teamData) {
        // Fetch team members
        const { data: membersData } = await supabase
          .from('team_members')
          .select('sale_id')
          .eq('team_id', teamData.id)
          .eq('status', 'active')
        
        const memberIds = membersData?.map(m => m.sale_id) || []
        
        // Count team customers
        const { count: customersCount } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .in('assigned_to', memberIds)
        
        // Count team orders
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .in('created_by', memberIds)
        
        // Calculate team revenue
        const { data: revenueData } = await supabase
          .from('orders')
          .select('total')
          .in('created_by', memberIds)
          .eq('status', 'completed')
        
        const revenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
        
        setTeamStats({
          teamMembers: memberIds.length,
          teamCustomers: customersCount || 0,
          teamOrders: ordersCount || 0,
          teamRevenue: revenue,
        })
        
        // Fetch top performers
        const performersWithStats = await Promise.all(
          memberIds.map(async (id) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', id)
              .single()
            
            const { data: orders } = await supabase
              .from('orders')
              .select('total')
              .eq('created_by', id)
              .eq('status', 'completed')
            
            const revenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
            
            return { name: profile?.full_name, revenue }
          })
        )
        
        setTopPerformers(
          performersWithStats
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 3)
        )
      }
    }
  }
  
  fetchTeamStats()
}, [profile])
```

#### 4. Add team performance section (after personal stats)
```typescript
{profile?.role === 'sale_admin' && hasSaleAdminDashboard(profile.role) && (
  <>
    {/* Team Performance */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>👥 Team Performance</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#175ead" />
          <Text style={styles.statValue}>{teamStats.teamMembers}</Text>
          <Text style={styles.statLabel}>Thành viên</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="person" size={24} color="#10b981" />
          <Text style={styles.statValue}>{teamStats.teamCustomers}</Text>
          <Text style={styles.statLabel}>Khách hàng</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="receipt" size={24} color="#f59e0b" />
          <Text style={styles.statValue}>{teamStats.teamOrders}</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color="#10b981" />
          <Text style={styles.statValue}>
            {new Intl.NumberFormat('vi-VN', {
              notation: 'compact',
            }).format(teamStats.teamRevenue)}
          </Text>
          <Text style={styles.statLabel}>Doanh thu</Text>
        </View>
      </View>
    </View>
    
    {/* Top Performers */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Top Performers</Text>
      {topPerformers.map((performer, index) => (
        <View key={index} style={styles.performerCard}>
          <Text style={styles.performerRank}>#{index + 1}</Text>
          <Text style={styles.performerName}>{performer.name}</Text>
          <Text style={styles.performerRevenue}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(performer.revenue)}
          </Text>
        </View>
      ))}
    </View>
  </>
)}
```

#### 5. Add styles
```typescript
performerCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  padding: 16,
  borderRadius: 12,
  gap: 12,
  marginBottom: 8,
},
performerRank: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#175ead',
  width: 40,
},
performerName: {
  flex: 1,
  fontSize: 16,
  fontWeight: '600',
  color: '#111827',
},
performerRevenue: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#10b981',
},
```

---

## Task 4: Create Customer Assignment UI

### File: `app/(sales)/customers/assign.tsx` (NEW)

Create new file with customer assignment interface:

```typescript
import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../src/contexts/AuthContext'
import { supabase } from '../../../src/lib/supabase'
import { Ionicons } from '@expo/vector-icons'

export default function CustomerAssignScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [unassignedCustomers, setUnassignedCustomers] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch unassigned customers
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .is('assigned_to', null)
        .order('created_at', { ascending: false })
      
      setUnassignedCustomers(customersData || [])
      
      // Fetch team members
      const { data: teamData } = await supabase
        .from('sales_teams')
        .select('id')
        .eq('manager_id', user.id)
        .single()
      
      if (teamData) {
        const { data: membersData } = await supabase
          .from('team_members')
          .select('*, sale:profiles!team_members_sale_id_fkey(*)')
          .eq('team_id', teamData.id)
          .eq('status', 'active')
        
        setTeamMembers(membersData || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleAssign = async () => {
    if (selectedCustomers.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn khách hàng')
      return
    }
    
    if (!selectedMember) {
      Alert.alert('Lỗi', 'Vui lòng chọn nhân viên')
      return
    }
    
    try {
      setAssigning(true)
      
      // Update customers
      const { error } = await supabase
        .from('customers')
        .update({
          assigned_to: selectedMember,
          assigned_at: new Date().toISOString(),
          assigned_by: user.id,
        })
        .in('id', selectedCustomers)
      
      if (error) throw error
      
      Alert.alert('Thành công', `Đã gán ${selectedCustomers.length} khách hàng`)
      router.back()
    } catch (error) {
      console.error('Error:', error)
      Alert.alert('Lỗi', 'Không thể gán khách hàng')
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#175ead" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gán khách hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Select Team Member */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn nhân viên</Text>
          {teamMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.memberCard,
                selectedMember === member.sale_id && styles.memberCardSelected
              ]}
              onPress={() => setSelectedMember(member.sale_id)}
            >
              <Ionicons 
                name={selectedMember === member.sale_id ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={selectedMember === member.sale_id ? "#175ead" : "#9ca3af"}
              />
              <Text style={styles.memberName}>{member.sale?.full_name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Customers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Chọn khách hàng ({selectedCustomers.length}/{unassignedCustomers.length})
          </Text>
          {unassignedCustomers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              style={[
                styles.customerCard,
                selectedCustomers.includes(customer.id) && styles.customerCardSelected
              ]}
              onPress={() => toggleCustomer(customer.id)}
            >
              <Ionicons 
                name={selectedCustomers.includes(customer.id) ? "checkbox" : "square-outline"}
                size={24}
                color={selectedCustomers.includes(customer.id) ? "#175ead" : "#9ca3af"}
              />
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerPhone}>{customer.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Assign Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.assignButton, assigning && styles.assignButtonDisabled]}
          onPress={handleAssign}
          disabled={assigning}
        >
          {assigning ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.assignButtonText}>
              Gán {selectedCustomers.length} khách hàng
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// Add styles...
```

---

## Task 5: Enable Feature Flags

### File: `src/lib/feature-flags.ts`

Update feature flags to enable Phase 3 features:

```typescript
export const featureFlags: FeatureFlags = {
  // Phase 2
  useNewAdminRoutes: false,           // Keep disabled for now
  showAdminInNavigation: false,
  
  // Phase 3 - ENABLE THESE
  enableTeamManagement: true,         // ✅ Enable
  enableCustomerAssignment: true,     // ✅ Enable
  enableSaleAdminDashboard: true,     // ✅ Enable
  enableTeamReports: true,            // ✅ Enable
  enableOrderApprovals: false,        // Not in Phase 3
  
  // Future
  enableWarehouseModule: false,
  
  // Dev
  enableDebugMode: false,
  enablePerformanceMonitoring: false,
}
```

---

## Testing Checklist

After implementing all changes:

### Database
- [ ] Run migration: `cd appejv-api && ./run-migration.sh 08_add_team_tables.sql`
- [ ] Verify tables created
- [ ] Verify columns added
- [ ] Test RLS policies

### Team Management
- [ ] Login as sale_admin
- [ ] See Team tab in navigation
- [ ] View team overview
- [ ] View team member details
- [ ] Stats display correctly

### Customer Tabs
- [ ] See "Của tôi" tab (all roles)
- [ ] See "Team" tab (sale_admin only)
- [ ] See "Tất cả" tab (admin only)
- [ ] Tabs filter correctly
- [ ] Can switch between tabs

### Order Tabs
- [ ] See "Của tôi" tab (all roles)
- [ ] See "Team" tab (sale_admin only)
- [ ] Tabs filter correctly

### Dashboard
- [ ] Sale sees single dashboard
- [ ] Sale admin sees dual dashboard
- [ ] Personal stats correct
- [ ] Team stats correct
- [ ] Top performers list correct

### Customer Assignment
- [ ] Can access assign page
- [ ] See unassigned customers
- [ ] See team members
- [ ] Can select customers
- [ ] Can select member
- [ ] Assignment works
- [ ] History recorded

---

## Implementation Order

1. ✅ Enable feature flags first
2. ✅ Update customers page with tabs
3. ✅ Update orders page with tabs
4. ✅ Update dashboard for sale_admin
5. ✅ Create customer assignment UI
6. ✅ Test everything

---

## Notes

- All changes are backward compatible
- Feature flags control visibility
- RLS policies enforce access
- Migration must run before testing
- Test with different roles

---

**Status**: Ready to implement

**Next**: Follow this guide step by step

