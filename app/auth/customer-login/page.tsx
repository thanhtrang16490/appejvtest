'use client'

import { useState } from 'react'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CustomerLoginPage() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.currentTarget)
        const result = await login(formData)

        if (result?.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            toast.success('Welcome back!')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-sm border-none shadow-none sm:border sm:shadow-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Customer Login</CardTitle>
                    <CardDescription>
                        Enter your phone number and access code.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="0912345678" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Access Code (Password)</Label>
                            <Input id="password" name="password" type="password" placeholder="••••••" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                        <Link href="/auth/login" className="text-xs text-muted-foreground underline">
                            Are you a Sales Staff? Login here
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
