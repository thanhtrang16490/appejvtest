'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChevronLeft, Plus, Edit2, Trash2, Folder } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal'

interface Category {
  id: string
  name: string
  description?: string
  created_at: string
}

export default function CategoriesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const isAdmin = user?.role === 'admin'
  const isSaleAdmin = user?.role === 'sale_admin'

  useEffect(() => {
    if (authLoading) return
    if (!user || (!isAdmin && !isSaleAdmin)) {
      router.push('/sales')
      return
    }
    fetchCategories()
  }, [user, authLoading])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      toast.error('Không thể tải danh mục')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setFormData({ name: '', description: '' })
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục')
      return
    }

    try {
      const supabase = createClient()

      if (editingCategory) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            description: formData.description || null,
          })
          .eq('id', editingCategory.id)

        if (error) throw error
        toast.success('Đã cập nhật danh mục')
      } else {
        // Create
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name,
            description: formData.description || null,
          })

        if (error) throw error
        toast.success('Đã tạo danh mục mới')
      }

      handleCloseModal()
      fetchCategories()
    } catch (error: any) {
      console.error('Error saving category:', error)
      toast.error('Không thể lưu danh mục')
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', category.id)

      if (error) throw error
      toast.success('Đã xóa danh mục')
      fetchCategories()
    } catch (error: any) {
      console.error('Error deleting category:', error)
      toast.error('Không thể xóa danh mục')
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f0f9ff] border-b border-gray-200">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">Quản lý danh mục</h1>
          <button
            onClick={() => handleOpenModal()}
            className="w-10 h-10 flex items-center justify-center bg-[#175ead] hover:bg-[#134a8a] rounded-full transition-colors"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Chưa có danh mục nào</p>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo danh mục đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Folder className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 truncate">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-[#175ead]" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
          size="md"
        >
          <ModalBody>
            <Input
              label="Tên danh mục"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên danh mục"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả (tùy chọn)
              </label>
              <textarea
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175ead] focus:border-transparent"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {editingCategory ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}
