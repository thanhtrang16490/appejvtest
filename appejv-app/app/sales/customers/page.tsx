'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { Users, Search, Plus, X, Phone, MapPin } from 'lucide-react'

// Generate consistent color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    { bg: 'bg-blue-500', text: 'text-white' },
    { bg: 'bg-emerald-500', text: 'text-white' },
    { bg: 'bg-purple-500', text: 'text-white' },
    { bg: 'bg-amber-500', text: 'text-white' },
    { bg: 'bg-rose-500', text: 'text-white' },
    { bg: 'bg-cyan-500', text: 'text-white' },
    { bg: 'bg-indigo-500', text: 'text-white' },
    { bg: 'bg-pink-500', text: 'text-white' },
    { bg: 'bg-teal-500', text: 'text-white' },
    { bg: 'bg-orange-500', text: 'text-white' },
  ]
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

interface Customer {
  id: string
  name: string
  code: string
  phone: string
  address: string
  email: string
  created_at: string
}

const TABS = [
  { id: 'my', label: 'Của tôi' },
  { id: 'team', label: 'Team' },
  { id: 'all', label: 'Tất cả' },
]

export default function CustomersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'my' | 'team' | 'all'>('my')
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchProfile()
  }, [user, authLoading])

  useEffect(() => {
    if (profile) {
      fetchCustomers()
    }
  }, [profile, activeTab])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user!.id)
        .single()

      if (!profileData || !['sale', 'sale_admin', 'admin'].includes(profileData.role)) {
        router.push('/')
        return
      }

      setProfile(profileData)

      // If sale_admin, fetch team member IDs
      if (profileData.role === 'sale_admin') {
        const { data: teamData } = await supabase
          .from('sales_teams')
          .select('id')
          .eq('manager_id', user!.id)
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
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      let query = supabase
        .from('customers')
        .select('*')
        .order('full_name', { ascending: true, nullsFirst: false })

      // Filter based on active tab
      if (activeTab === 'my') {
        query = query.eq('assigned_to', user!.id)
      } else if (activeTab === 'team' && teamMemberIds.length > 0) {
        query = query.in('assigned_to', teamMemberIds)
      }
      // 'all' tab: no filter (admin sees everything)

      const { data: customersData, error } = await query

      if (error) throw error

      // Map to customer format
      const mappedCustomers = (customersData || []).map(c => ({
        id: c.id,
        name: c.full_name || 'No Name',
        code: c.id.substring(0, 8),
        phone: c.phone || '',
        address: c.address || '',
        email: c.email || '',
        created_at: c.created_at,
      }))

      setCustomers(mappedCustomers)
    } catch (error: any) {
      console.error('Error fetching customers:', error)
      toast.error(error.message || 'Không thể tải danh sách khách hàng')
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return customers
    }
    
    const query = searchQuery.toLowerCase()
    return customers.filter(customer =>
      customer.name?.toLowerCase().includes(query) ||
      customer.code?.toLowerCase().includes(query) ||
      customer.phone?.includes(searchQuery) ||
      customer.address?.toLowerCase().includes(query)
    )
  }, [searchQuery, customers])

  const getVisibleTabs = () => {
    if (!profile) return []
    
    const tabs = [TABS[0]] // Always show 'my'
    
    if (profile.role === 'sale_admin') {
      tabs.push(TABS[1]) // Add 'team'
    }
    
    if (profile.role === 'admin') {
      tabs.push(TABS[1], TABS[2]) // Add 'team' and 'all'
    }
    
    return tabs
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  const visibleTabs = getVisibleTabs()

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
            <p className="text-sm text-gray-600 mt-1">{filteredCustomers.length} khách hàng</p>
          </div>
          <Link href="/sales/customers/add">
            <button className="w-10 h-10 bg-[#175ead] rounded-full flex items-center justify-center hover:bg-[#134a8a] transition-colors">
              <Plus className="w-5 h-5 text-white" />
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tabs */}
        {visibleTabs.length > 1 && (
          <div className="flex gap-2">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'my' | 'team' | 'all')}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors',
                  activeTab === tab.id
                    ? 'bg-[#175ead] text-white border-[#175ead]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Customers List */}
        {filteredCustomers.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-400">
              {searchQuery ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCustomers.map((customer) => {
              const avatarColor = getAvatarColor(customer.name)
              const initials = customer.name.substring(0, 2).toUpperCase()
              
              return (
                <Link key={customer.id} href={`/sales/customers/${customer.id}`}>
                  <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={cn('w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0', avatarColor.bg)}>
                        <span className={cn('text-sm font-bold', avatarColor.text)}>
                          {initials}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {customer.name}
                          </h3>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                            {customer.code}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          {customer.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-600">{customer.phone}</span>
                            </div>
                          )}
                          {customer.address && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-600 truncate">{customer.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="text-gray-300">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
