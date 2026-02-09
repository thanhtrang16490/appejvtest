/**
 * Script to check admin user and reset password
 * Run: npx tsx scripts/check-admin-user.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing environment variables')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    console.error('\nCurrent values:')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function checkAndUpdateAdminUser() {
    try {
        console.log('🔍 Checking for admin users...\n')

        // Get all users with admin role
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, role, full_name, phone')
            .eq('role', 'admin')

        if (profileError) {
            throw profileError
        }

        if (!profiles || profiles.length === 0) {
            console.log('❌ No admin users found in profiles table')
            console.log('\n💡 You need to create an admin user first')
            return
        }

        console.log(`✅ Found ${profiles.length} admin user(s):\n`)

        // Get auth details for each admin profile
        for (const profile of profiles) {
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id)

            if (userError || !user) {
                console.log(`⚠️  Profile ID: ${profile.id}`)
                console.log(`   Role: ${profile.role}`)
                console.log(`   Name: ${profile.full_name || 'N/A'}`)
                console.log(`   Phone: ${profile.phone || 'N/A'}`)
                console.log(`   Status: ❌ Auth user not found\n`)
                continue
            }

            console.log(`👤 Admin User Found:`)
            console.log(`   Email: ${user.email}`)
            console.log(`   User ID: ${user.id}`)
            console.log(`   Role: ${profile.role}`)
            console.log(`   Name: ${profile.full_name || 'N/A'}`)
            console.log(`   Phone: ${profile.phone || 'N/A'}`)
            console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
            console.log(`   Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`)
            console.log(`   Email Confirmed: ${user.email_confirmed_at ? '✅' : '❌'}`)
            console.log()

            // Ask to reset password
            console.log(`🔐 Resetting password to: admin123`)
            
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                user.id,
                { password: 'admin123' }
            )

            if (updateError) {
                console.log(`   ❌ Failed to update password: ${updateError.message}\n`)
            } else {
                console.log(`   ✅ Password updated successfully!\n`)
                console.log(`📋 Login Credentials:`)
                console.log(`   Email: ${user.email}`)
                console.log(`   Password: admin123`)
                console.log()
            }
        }

        console.log('✅ Admin user check completed!')

    } catch (error: any) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

// Run the script
checkAndUpdateAdminUser()
