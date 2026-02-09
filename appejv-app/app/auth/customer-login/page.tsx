'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CustomerLoginPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to main login page
        router.replace('/auth/login')
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#175ead] mx-auto mb-4"></div>
                <p className="text-gray-600">Đang chuyển hướng...</p>
            </div>
        </div>
    )
}
