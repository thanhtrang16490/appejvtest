#!/bin/bash

# Script to run warehouse role migration
# This adds the 'warehouse' role and sets up appropriate permissions

set -e

echo "🏭 Running Warehouse Role Migration..."
echo "======================================"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if SUPABASE_DB_URL is set
if [ -z "$SUPABASE_DB_URL" ]; then
    echo "❌ Error: SUPABASE_DB_URL is not set"
    echo "Please set it in your .env file or environment"
    exit 1
fi

echo "📋 Migration: 09_add_warehouse_role.sql"
echo ""

# Run the migration
psql "$SUPABASE_DB_URL" -f migrations/09_add_warehouse_role.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📝 Summary:"
    echo "  - Added 'warehouse' role to user_role enum"
    echo "  - Created RLS policies for warehouse to view orders, products, customers"
    echo "  - Created RLS policies for warehouse to update order status and product stock"
    echo "  - Added validation triggers to restrict warehouse updates"
    echo ""
    echo "🔐 Warehouse Permissions:"
    echo "  ✅ View all orders"
    echo "  ✅ Update order status (ordered → shipping only)"
    echo "  ✅ View all products"
    echo "  ✅ Update product stock only"
    echo "  ✅ View customers and profiles"
    echo "  ❌ Cannot create/delete orders or products"
    echo "  ❌ Cannot modify prices, names, or other product fields"
    echo ""
    echo "🧪 Next Steps:"
    echo "  1. Create a test warehouse user in Supabase Auth"
    echo "  2. Update their profile role to 'warehouse'"
    echo "  3. Test login and permissions in the app"
    echo ""
else
    echo ""
    echo "❌ Migration failed!"
    exit 1
fi
