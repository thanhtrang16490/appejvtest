'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CustomerDialog } from './CustomerDialog'

export function CustomerListActions({ canCreate, isAdmin = false }: { canCreate: boolean, isAdmin?: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    if (!canCreate) return null

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-[#175ead] hover:bg-blue-600 rounded-full w-10 h-10 p-0 shadow-lg"
            >
                <Plus className="w-5 h-5" />
            </Button>
            <CustomerDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                isAdmin={isAdmin}
            />
        </>
    )
}
