'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, UserPlus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { UserForm } from './UserForm'

export function AddUserDialog({ saleAdmins }: { saleAdmins: any[] }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#175ead] hover:bg-blue-600 rounded-full w-10 h-10 p-0 shadow-lg">
                    <UserPlus className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-8">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black tracking-tight">Tạo tài khoản mới</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Thêm nhân viên hoặc khách hàng mới vào hệ thống.
                    </DialogDescription>
                </DialogHeader>
                <UserForm saleAdmins={saleAdmins} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
