'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft, Users, User, Mail, Phone, Shield } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

interface TeamMember {
  id: string
  full_name: string
  email: string
  phone?: string
  role: string
  created_at: string
}

interface TeamStats {
  totalMembers: number
  totalCustomers: number
  totalOrders: number
  totalRevenue: number
}

export default function TeamPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<TeamStats>({
    totalMembers: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  const isSaleAdmin = user?.role === 'sale_admin'

  useEffect(() => {
    if (authLoading) return
    if (!user || !isSaleAdmin) {
      router.push('/sales')
      return
    }
    fetchData()
  }, [user, authLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch team members (sales with this sale_admin as manager)
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'sale')
        .eq('manager_id', user?.id)
        .order('full_name', { ascending: true })

      if (membersError) throw membersError
      setTeamMembers(membersData || [])

      // Calculate stats
      const memberIds = membersData?.map((m) => m.id) || []

      // Total customers assigned to team
      const { count: customersCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .in('assigned_to', memberIds)

      // Total orders from team
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount')
        .in('sale_id', memberIds)

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      setStats({
        totalMembers: membersData?.length || 0,
        totalCustomers: customersCount || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
      })
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải thông tin team')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' đ'
  }

  if (authLoading || loading) {
    return (
      <SalesLayout>
        <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#175ead] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </SalesLayout>
    )
  }

  return (
    <SalesLayout>
      <div className="min-h-screen bg-[#f0f9ff]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#f0f9ff] border-b border-gray-200">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Quản lý Team</h1>
          <div className="w-10"></div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#175ead]" />
                <p className="text-xs text-gray-600">Thành viên</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-emerald-600" />
                <p className="text-xs text-gray-600">Khách hàng</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <p className="text-xs text-gray-600">Đơn hàng</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600 text-lg">💰</span>
                <p className="text-xs text-gray-600">Doanh thu</p>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              Thành viên team ({teamMembers.length})
            </h2>

            {teamMembers.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Chưa có thành viên nào trong team</p>
                <p className="text-sm text-gray-500 mt-2">
                  Liên hệ admin để thêm nhân viên vào team của bạn
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <Link key={member.id} href={`/sales/users/${member.id}`}>
                    <div className="border border-gray-200 rounded-xl p-4 hover:border-[#175ead] hover:bg-blue-50 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-cyan-600" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900">
                              {member.full_name || 'Chưa cập nhật'}
                            </h3>
                            <Badge variant="info">Sale</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SalesLayout>
  )
}
