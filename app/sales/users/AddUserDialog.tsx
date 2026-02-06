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
                <Button className="gap-2 shadow-lg shadow-primary/20 rounded-2xl h-12 font-bold px-6">
                    <UserPlus className="w-4 h-4" />
                    Thêm người dùng
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
