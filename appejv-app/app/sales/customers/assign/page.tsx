'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft, UserPlus, User, Check } from 'lucide-react'
import Button from '@/components/ui/Button'

interface Customer {
  id: string
  full_name: string
  phone: string
  email: string
}

interface TeamMember {
  id: string
  full_name: string
  email: string
  role: string
}

export default function CustomerAssignPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [unassignedCustomers, setUnassignedCustomers] = useState<Customer[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [assigning, setAssigning] = useState(false)

  const isAdmin = user?.role === 'admin'
  const isSaleAdmin = user?.role === 'sale_admin'

  useEffect(() => {
    if (authLoading) return
    if (!user || (!isAdmin && !isSaleAdmin)) {
      router.push('/sales')
      return
    }
    fetchData()
  }, [user, authLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch unassigned customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .is('assigned_to', null)
        .order('full_name', { ascending: true })

      if (customersError) throw customersError
      setUnassignedCustomers(customersData || [])

      // Fetch team members
      let teamQuery = supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'sale')
        .order('full_name', { ascending: true })

      // If sale_admin, only show their team members
      if (isSaleAdmin && user?.id) {
        teamQuery = teamQuery.eq('manager_id', user.id)
      }

      const { data: teamData, error: teamError } = await teamQuery

      if (teamError) throw teamError
      setTeamMembers(teamData || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId]
    )
  }

  const handleAssign = async () => {
    if (selectedCustomers.length === 0) {
      toast.error('Vui lòng chọn khách hàng')
      return
    }

    if (!selectedMember) {
      toast.error('Vui lòng chọn nhân viên')
      return
    }

    try {
      setAssigning(true)
      const supabase = createClient()

      const { error } = await supabase
        .from('customers')
        .update({ assigned_to: selectedMember })
        .in('id', selectedCustomers)

      if (error) throw error

      toast.success(`Đã gán ${selectedCustomers.length} khách hàng`)
      setSelectedCustomers([])
      setSelectedMember(null)
      fetchData()
    } catch (error: any) {
      console.error('Error assigning customers:', error)
      toast.error('Không thể gán khách hàng')
    } finally {
      setAssigning(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f0f9ff] border-b border-gray-200">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Gán khách hàng</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Select Team Member */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h2 className="text-base font-bold text-gray-900 mb-3">Chọn nhân viên</h2>
            {teamMembers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Chưa có nhân viên trong team của bạn
              </p>
            ) : (
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMember(member.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedMember === member.id
                        ? 'border-[#175ead] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMember === member.id
                          ? 'border-[#175ead] bg-[#175ead]'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedMember === member.id && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-base font-medium text-gray-900">
                        {member.full_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Customers */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              Chọn khách hàng ({selectedCustomers.length}/{unassignedCustomers.length})
            </h2>
            {unassignedCustomers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                Không có khách hàng chưa được gán
              </p>
            ) : (
              <div className="space-y-2">
                {unassignedCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => toggleCustomer(customer.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedCustomers.includes(customer.id)
                        ? 'border-[#175ead] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedCustomers.includes(customer.id)
                          ? 'border-[#175ead] bg-[#175ead]'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedCustomers.includes(customer.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-base font-medium text-gray-900">
                        {customer.full_name || 'No Name'}
                      </p>
                      <p className="text-sm text-gray-600">{customer.phone || 'No phone'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer with Assign Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-20">
          <Button
            onClick={handleAssign}
            disabled={assigning || selectedCustomers.length === 0 || !selectedMember}
            className="w-full"
          >
            {assigning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang gán...</span>
              </div>
            ) : (
              `Gán ${selectedCustomers.length} khách hàng`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
