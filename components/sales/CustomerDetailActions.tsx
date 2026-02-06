'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { CustomerDialog } from './CustomerDialog'
import { deleteCustomer } from '@/app/sales/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CustomerDetailActionsProps {
    customer: any
    isAdmin: boolean
    onSuccess?: () => void
}

export function CustomerDetailActions({ customer, isAdmin, onSuccess }: CustomerDetailActionsProps) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const router = useRouter()

    if (!isAdmin) return null

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return

        const result = await deleteCustomer(customer.id)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Đã xóa khách hàng')
            router.push('/sales/customers')
        }
    }

    const handleEditSuccess = () => {
        setIsEditOpen(false)
        if (onSuccess) {
            onSuccess()
        }
    }

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={() => setIsEditOpen(true)}
                className="rounded-2xl font-bold border-primary/20 text-primary hover:bg-primary/5"
            >
                <Edit className="w-4 h-4 mr-2" />
                Sửa
            </Button>
            <Button
                variant="outline"
                onClick={handleDelete}
                className="rounded-2xl font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
            >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
            </Button>
            <CustomerDialog
                customer={customer}
                isOpen={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSuccess={handleEditSuccess}
                isAdmin={isAdmin}
            />
        </div>
    )
}
