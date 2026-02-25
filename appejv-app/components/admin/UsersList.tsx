'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  UserPlus, 
  Shield, 
  User, 
  Phone, 
  Calendar,
  Trash2,
  Search
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import AddUserDialog from '@/components/admin/AddUserDialog'

interface UsersListProps {
  users: any[]
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return { label: 'Admin', color: 'bg-red-100 text-red-600' }
    case 'sale_admin':
      return { label: 'Sale Admin', color: 'bg-amber-100 text-amber-600' }
    case 'sale':
      return { label: 'Sale', color: 'bg-blue-100 text-blue-600' }
    default:
      return { label: 'Customer', color: 'bg-gray-100 text-gray-600' }
  }
}

export default function UsersList({ users: initialUsers }: UsersListProps) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.includes(searchQuery) ||
    user.id.includes(searchQuery)
  )

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      return
    }

    try {
      setDeleting(userId)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      setUsers(users.filter(u => u.id !== userId))
      toast.success('Đã xóa người dùng')
      router.refresh()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Không thể xóa người dùng')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-500 mt-1">{users.length} người dùng</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-red-600 hover:bg-red-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Tìm kiếm theo tên, số điện thoại, hoặc ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => {
            const roleBadge = getRoleBadge(user.role)
            
            return (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {user.role === 'admin' ? (
                          <Shield className="w-6 h-6 text-red-600" />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {user.full_name || 'No Name'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge.color}`}>
                            {roleBadge.label}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-400 font-mono mb-3">
                          ID: {user.id.substring(0, 8)}...
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone || '---'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(user.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>

                        {user.manager && (
                          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">
                              <span className="font-semibold">QUẢN LÝ:</span> {user.manager.full_name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.full_name)}
                      disabled={deleting === user.id}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Add User Dialog */}
      <AddUserDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          router.refresh()
          setShowAddDialog(false)
        }}
      />
    </div>
  )
}
