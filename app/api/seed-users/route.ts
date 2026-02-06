import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
    // Initialize admin client with service role key
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const users = [
        {
            email: 'khachhang@demo.com',
            password: 'password123',
            role: 'customer',
            phone: '+84979195599',
            full_name: 'Đoàn Văn Mười'
        },
        {
            email: 'sale@demo.com',
            password: 'password123',
            role: 'sale',
            phone: '+84900000001',
            full_name: 'Nhân Viên Sale'
        },
        {
            email: 'admin@demo.com',
            password: 'password123',
            role: 'admin',
            phone: '+84900000002',
            full_name: 'Quản Lý'
        },
        {
            email: 'saleadmin@demo.com',
            password: 'password123',
            role: 'sale_admin',
            phone: '+84900000003',
            full_name: 'Sale Admin'
        }
    ]

    const results = []

    try {
        for (const u of users) {
            // 1. Create User
            const { data: { user }, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: u.email,
                password: u.password,
                phone: u.phone,
                email_confirm: true,
                user_metadata: { full_name: u.full_name }
            })

            let userId = user?.id

            if (createError) {
                console.log(`User ${u.email} error:`, createError.message)
                const isAlreadyRegistered = createError.message.toLowerCase().includes('already') ||
                    createError.message.toLowerCase().includes('registered')

                if (isAlreadyRegistered) {
                    const { data: foundUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
                    if (listError) {
                        results.push({ email: u.email, status: 'Error listing users', error: listError.message })
                        continue
                    }
                    const existing = foundUsers.users.find(x => x.email === u.email)
                    if (existing) userId = existing.id
                } else {
                    results.push({ email: u.email, status: 'Failed to create user', error: createError.message })
                    continue
                }
            }

            // 2. Update Profile/Role
            if (userId) {
                const { error: profileError } = await supabaseAdmin
                    .from('profiles')
                    .upsert({
                        id: userId,
                        role: u.role,
                        full_name: u.full_name,
                        phone: u.phone
                    })

                results.push({
                    email: u.email,
                    status: profileError ? 'Profile Error' : (createError ? 'Updated Role' : 'Created & Set Role'),
                    userId,
                    error: profileError?.message
                })
            }
        }

        return NextResponse.json({ success: true, results })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
