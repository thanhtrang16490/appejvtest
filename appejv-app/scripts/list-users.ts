/**
 * Script to list all users in Supabase
 * Usage: npx tsx scripts/list-users.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function listUsers() {
  console.log('\n🔍 Fetching all users...\n')
  
  // Get all users
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('❌ Error listing users:', listError)
    return
  }

  if (!users || users.length === 0) {
    console.log('No users found')
    return
  }

  console.log(`Found ${users.length} user(s):\n`)

  // Get profiles for all users
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Display users with their profiles
  for (const user of users) {
    const profile = profileMap.get(user.id)
    
    console.log(`📧 ${user.email}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Created: ${new Date(user.created_at).toLocaleString('vi-VN')}`)
    
    if (profile) {
      console.log(`   Role: ${profile.role || 'not set'}`)
      console.log(`   Profile: ✓ exists`)
    } else {
      console.log(`   Role: ⚠️  no profile`)
      console.log(`   Profile: ✗ missing`)
    }
    console.log('')
  }

  console.log('\n💡 To update a user role, run:')
  console.log('   npx tsx scripts/update-user-role.ts <email> <role>')
  console.log('\nValid roles: admin, sale_admin, sale, customer')
}

listUsers()
  .then(() => {
    console.log('✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
