#!/bin/bash

# Script to create a sale user for testing customer assignment

source .env

echo "Creating sale user..."

# Create auth user via Supabase Admin API
# Note: This requires service_role key with proper permissions

# For now, let's create the user manually through Supabase Dashboard
# Or use the app's signup functionality

echo "Please create a sale user through one of these methods:"
echo ""
echo "1. Via Supabase Dashboard:"
echo "   - Go to Authentication > Users"
echo "   - Click 'Add user'"
echo "   - Email: sale1@appejv.app"
echo "   - Password: password123"
echo "   - Then update profiles table:"
echo "     UPDATE profiles SET role='sale', full_name='Sale User 1' WHERE id='<user_id>';"
echo ""
echo "2. Via app's user management:"
echo "   - Login as admin"
echo "   - Go to Menu > Quản lý nhân sự"
echo "   - Add new user with role 'sale'"
echo ""
echo "3. Via SQL (if you have direct database access):"
echo ""
echo "-- First, create auth user in Supabase Dashboard"
echo "-- Then run this SQL:"
echo "INSERT INTO profiles (id, role, full_name)"
echo "VALUES ('<user_id_from_auth>', 'sale', 'Sale User 1');"
echo ""
