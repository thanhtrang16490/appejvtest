'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import SalesLayout from '../../layout'
import { 
  ChevronLeft, 
  Phone, 
  MapPin, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  User,
  Edit2,
  Check,
  X
} from 'lucide-react'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'

interface Customer {
  id: string
  full_name: string
  phone: string
  address: string
  email: string
  created_at: string
  assigned_to: string | null
  assigned_sale?: {
    id: string
    full_name: string
    email: string
  }
}

interface Order {
  id: number
  status: string
  total_amount: number
  created_at: string
}

interface SaleUser {
  id: string
  full_name: string
  email: string
}

const STATUS_MAP = {
  draft: { label: 'Đơn nháp', color: 'text-gray-700', bg: 'bg-gray-100' },
  ordered: { label: 'Đơn đặt hàng', color: 'text-amber-700', bg: 'bg-amber-100' },
  shipping: { label: 'Giao hàng', color: 'text-blue-700', bg: 'bg-blue-100' },
  paid: { label: 'Thanh toán', color: 'text-purple-700', bg: 'bg-purple-100' },
  completed: { label: 'Hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100' },
} as const

export default function CustomerDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [saleUsers, setSaleUsers] = useState<SaleUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    full_name: '',
    phone: '',
    address: '',
    email: '',
    assigned_to: '',
  })

  const isAdmin = user?.role === 'admin'
  const isSaleAdmin = user?.role === 'sale_admin'

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchData()
  }, [user, authLoading, customerId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select(`
          *,
          assigned_sale:profiles!customers_assigned_to_fkey(id, full_name, email)
        `)
        .eq('id', customerId)
        .single()

      if (customerError) throw customerError
      setCustomer(customerData)
      setEditedData({
        full_name: customerData.full_name || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        email: customerData.email || '',
        assigned_to: customerData.assigned_to || '',
      })

      // Fetch sale users for assignment (only for admin/sale_admin)
      if (isAdmin || isSaleAdmin) {
        let saleQuery = supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'sale')
          .order('full_name', { ascending: true })

        // If sale_admin, only show their team
        if (isSaleAdmin && user?.id) {
          saleQuery = saleQuery.eq('manager_id', user.id)
        }

        const { data: saleData } = await saleQuery
        setSaleUsers(saleData || [])
      }

      // Fetch customer orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (ordersError) throw ordersError
      setOrders(ordersData || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error(error.message || 'Không thể tải thông tin khách hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()

      const updateData: any = {
        full_name: editedData.full_name,
        phone: editedData.phone,
        address: editedData.address,
        email: editedData.email,
        assigned_to: editedData.assigned_to || null,
      }

      const { error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', customerId)

      if (error) throw error

      toast.success('Đã cập nhật thông tin khách hàng')
      setEditing(false)
      fetchData()
    } catch (error: any) {
      console.error('Error updating customer:', error)
      toast.error('Không thể cập nhật thông tin')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    if (customer) {
      setEditedData({
        full_name: customer.full_name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        email: customer.email || '',
        assigned_to: customer.assigned_to || '',
      })
    }
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

  if (!customer) {
    return (
      <SalesLayout>
        <div className="min-h-screen bg-[#f0f9ff] flex items-center justify-center">
          <p className="text-red-600">Không tìm thấy khách hàng</p>
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
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Chi tiết khách hàng</h1>
          <div className="w-10">
            {editing ? (
              <button
                onClick={handleSave}
                className="w-10 h-10 flex items-center justify-center hover:bg-emerald-50 rounded-full transition-colors"
              >
                <Check className="w-6 h-6 text-emerald-600" />
              </button>
            ) : (
              isAdmin && (
                <button
                  onClick={() => setEditing(true)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit2 className="w-6 h-6 text-[#175ead]" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Customer Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-2 bg-emerald-200"></div>
            
            <div className="flex items-start justify-between p-5 pb-3">
              <div className="w-20 h-20 bg-emerald-200 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
              <Badge variant="success">Khách hàng</Badge>
            </div>

            <div className="px-5 pb-5">
              {editing ? (
                <div className="space-y-4">
                  <Input
                    label="Họ và tên"
                    value={editedData.full_name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedData({ ...editedData, full_name: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                  
                  <Input
                    label="Số điện thoại"
                    value={editedData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedData({ ...editedData, phone: e.target.value })}
                    placeholder="Nhập số điện thoại"
                    type="tel"
                  />
                  
                  <Input
                    label="Email"
                    value={editedData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedData({ ...editedData, email: e.target.value })}
                    placeholder="Nhập email"
                    type="email"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      value={editedData.address}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedData({ ...editedData, address: e.target.value })}
                      placeholder="Nhập địa chỉ"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
                    />
                  </div>
                  
                  {/* Sale Assignment - Only for admin/sale_admin */}
                  {(isAdmin || isSaleAdmin) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sale phụ trách
                      </label>
                      <select
                        value={editedData.assigned_to}
                        onChange={(e) => setEditedData({ ...editedData, assigned_to: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
                      >
                        <option value="">-- Chưa gán --</option>
                        {saleUsers.map((sale) => (
                          <option key={sale.id} value={sale.id}>
                            {sale.full_name} ({sale.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {customer.full_name || 'No Name'}
                  </h2>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Info Section */}
          {!editing && (
            <>
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-base font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-0.5">Điện thoại</p>
                      <p className="text-sm font-medium text-gray-900">{customer.phone || '---'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-0.5">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{customer.email || '---'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-0.5">Địa chỉ</p>
                      <p className="text-sm font-medium text-gray-900">{customer.address || '---'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 mb-0.5">Ngày tham gia</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(customer.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Sale phụ trách */}
                  {(isAdmin || isSaleAdmin) && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 mb-0.5">Sale phụ trách</p>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.assigned_sale?.full_name || 'Chưa gán'}
                        </p>
                        {customer.assigned_sale?.email && (
                          <p className="text-xs text-gray-500 mt-0.5">{customer.assigned_sale.email}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-base font-bold text-gray-900">Đơn hàng gần đây</h3>
                  <span className="text-sm text-gray-600">({orders.length})</span>
                </div>
                
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const status = STATUS_MAP[order.status as keyof typeof STATUS_MAP] || STATUS_MAP.draft
                      return (
                        <Link key={order.id} href={`/sales/orders/${order.id}`}>
                          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ShoppingBag className="w-5 h-5 text-[#175ead]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900">Đơn #{order.id}</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 mb-1">
                                {formatCurrency(order.total_amount)}
                              </p>
                              <Badge variant={
                                order.status === 'completed' ? 'success' :
                                order.status === 'cancelled' ? 'danger' :
                                order.status === 'ordered' ? 'warning' :
                                'default'
                              }>
                                {status.label}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chưa có đơn hàng nào</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Cancel Button when editing */}
          {editing && (
            <button
              onClick={handleCancel}
              className="w-full py-3.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </div>
    </SalesLayout>
  )
}
