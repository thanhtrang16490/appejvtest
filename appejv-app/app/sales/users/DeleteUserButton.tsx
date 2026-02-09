'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserMinus, Loader2 } from 'lucide-react'
import { deleteUser } from './actions'
import { toast } from 'sonner'

export function DeleteUserButton({ userId, currentUserId, onUserDeleted }: { userId: string, currentUserId: string, onUserDeleted: () => void }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to remove this user?')) return

        setLoading(true)
        const result = await deleteUser(userId)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('User removed')
            onUserDeleted() // Refetch data after deleting user
        }
    }

    return (
        <Button
            variant="outline"
            className="flex-1 text-destructive hover:bg-destructive/10 border-destructive/20"
            disabled={userId === currentUserId || loading}
            onClick={handleDelete}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserMinus className="w-4 h-4 mr-2" />}
            Remove
        </Button>
    )
}
