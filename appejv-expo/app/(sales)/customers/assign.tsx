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
      if (!user) return

      // Fetch unassigned customers from profiles with role='customer'
      // Note: assigned_to field will be available after migration
      const { data: customersData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('full_name', { ascending: true })
      
      // For now, show all customers (filter by assigned_to after migration)
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
      
      // Update customers table (after migration)
      // For now, this will fail gracefully if table doesn't exist
      const { error } = await supabase
        .from('customers')
        .update({
          assigned_to: selectedMember,
          assigned_at: new Date().toISOString(),
          assigned_by: user?.id,
        })
        .in('id', selectedCustomers)
      
      if (error) {
        console.error('Assignment error:', error)
        Alert.alert('Thông báo', 'Chức năng gán khách hàng sẽ khả dụng sau khi chạy migration database')
      } else {
        Alert.alert('Thành công', `Đã gán ${selectedCustomers.length} khách hàng`)
        router.back()
      }
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
          {teamMembers.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có thành viên trong team</Text>
          ) : (
            teamMembers.map((member) => (
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
                <Text style={styles.memberName}>{member.sale?.full_name || 'Unknown'}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Select Customers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Chọn khách hàng ({selectedCustomers.length}/{unassignedCustomers.length})
          </Text>
          {unassignedCustomers.length === 0 ? (
            <Text style={styles.emptyText}>Không có khách hàng nào</Text>
          ) : (
            unassignedCustomers.map((customer) => (
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
                  <Text style={styles.customerName}>{customer.full_name || 'No Name'}</Text>
                  <Text style={styles.customerPhone}>{customer.phone || 'No phone'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f0f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 32,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  memberCardSelected: {
    borderColor: '#175ead',
    backgroundColor: '#f0f9ff',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  customerCardSelected: {
    borderColor: '#175ead',
    backgroundColor: '#f0f9ff',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  assignButton: {
    backgroundColor: '#175ead',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  assignButtonDisabled: {
    opacity: 0.6,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
})
