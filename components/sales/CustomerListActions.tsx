'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CustomerDialog } from './CustomerDialog'

export function CustomerListActions({ isAdmin }: { isAdmin: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    if (!isAdmin) return null

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
            >
                <Plus className="w-6 h-6" />
            </Button>
            <CustomerDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            />
        </>
    )
}
