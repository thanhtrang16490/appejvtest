'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export function LogoutButton() {
    const handleLogout = async () => {
        try {
            await logout()
            // Redirect to appejv.app website
            window.location.href = 'https://appejv.app'
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
        >
            <LogOut className="w-5 h-5" />
        </Button>
    )
}
