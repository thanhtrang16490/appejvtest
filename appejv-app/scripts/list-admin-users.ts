/**
 * Simple script to list admin users from profiles table
 * Run: npx tsx scripts/list-admin-users.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use anon key instead of service role
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listAdminUsers() {
    try {
        console.log('🔍 Checking for admin users in profiles table...\n')

        // Get all admin profiles
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, role, full_name, phone, created_at')
            .eq('role', 'admin')
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        if (!profiles || profiles.length === 0) {
            console.log('❌ No admin users found in profiles table\n')
            console.log('💡 To create an admin user:')
            console.log('   1. Go to Supabase Dashboard → Authentication')
            console.log('   2. Create a new user')
            console.log('   3. Update profiles table: SET role = \'admin\' WHERE id = \'user-id\'')
            return
        }

        console.log(`✅ Found ${profiles.length} admin user(s):\n`)

        profiles.forEach((profile, index) => {
            console.log(`${index + 1}. Admin Profile:`)
            console.log(`   User ID: ${profile.id}`)
            console.log(`   Name: ${profile.full_name || 'N/A'}`)
            console.log(`   Phone: ${profile.phone || 'N/A'}`)
            console.log(`   Role: ${profile.role}`)
            console.log(`   Created: ${new Date(profile.created_at).toLocaleString()}`)
            console.log()
        })

        console.log('📋 Next Steps:')
        console.log('   1. Go to Supabase Dashboard → Authentication → Users')
        console.log('   2. Find user by ID above')
        console.log('   3. Check email and reset password to: admin123')
        console.log()
        console.log('   Or run SQL in Supabase SQL Editor:')
        console.log('   ```sql')
        console.log('   SELECT email FROM auth.users WHERE id = \'user-id-from-above\';')
        console.log('   ```')

    } catch (error: any) {
        console.error('❌ Error:', error.message)
        
        if (error.message.includes('relation "profiles" does not exist')) {
            console.log('\n💡 Profiles table not found. Make sure database is set up correctly.')
        }
    }
}

// Run the script
listAdminUsers()
