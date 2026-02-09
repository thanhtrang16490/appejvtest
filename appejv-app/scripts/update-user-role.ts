/**
 * Script to update user role in Supabase
 * Usage: npx tsx scripts/update-user-role.ts <email> <role>
 * Example: npx tsx scripts/update-user-role.ts admin@appe.com.vn admin
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateUserRole(email: string, role: string) {
  console.log(`\n🔍 Looking for user: ${email}`)
  
  // Get user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('❌ Error listing users:', listError)
    return
  }

  const user = users?.find(u => u.email === email)
  
  if (!user) {
    console.error(`❌ User not found: ${email}`)
    console.log('\n📋 Available users:')
    users?.forEach(u => console.log(`   - ${u.email} (${u.id})`))
    return
  }

  console.log(`✓ Found user: ${user.email} (${user.id})`)

  // Check current profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (currentProfile) {
    console.log(`📊 Current profile:`, currentProfile)
  } else {
    console.log(`⚠️  No profile found, will create one`)
  }

  // Update or insert profile
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      role: role,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    })
    .select()

  if (error) {
    console.error('❌ Error updating profile:', error)
    return
  }

  console.log(`✅ Successfully updated role to: ${role}`)
  
  // Verify update
  const { data: updatedProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log(`\n✓ Verified profile:`, updatedProfile)
}

// Get command line arguments
const email = process.argv[2]
const role = process.argv[3]

if (!email || !role) {
  console.error('❌ Usage: npx tsx scripts/update-user-role.ts <email> <role>')
  console.log('\nValid roles:')
  console.log('  - admin       (full access)')
  console.log('  - sale_admin  (sales + admin features)')
  console.log('  - sale        (sales only)')
  console.log('  - customer    (customer portal)')
  console.log('\nExample:')
  console.log('  npx tsx scripts/update-user-role.ts admin@appe.com.vn admin')
  process.exit(1)
}

const validRoles = ['admin', 'sale_admin', 'sale', 'customer']
if (!validRoles.includes(role)) {
  console.error(`❌ Invalid role: ${role}`)
  console.log(`Valid roles: ${validRoles.join(', ')}`)
  process.exit(1)
}

updateUserRole(email, role)
  .then(() => {
    console.log('\n✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
