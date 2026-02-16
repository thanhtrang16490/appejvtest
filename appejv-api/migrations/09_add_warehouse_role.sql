-- Migration: Add warehouse role and permissions
-- Description: Add RLS policies for 'warehouse' role
-- Note: Uses existing helper functions from migration 06 to avoid recursion

-- Step 1: Add warehouse role value to profiles table
-- This should be done manually in Supabase Dashboard or the role column should be TEXT type
-- If role is ENUM, add 'warehouse' value in: Database > Tables > profiles > Edit Column 'role'

-- Step 2: Update get_user_role function to handle warehouse (if needed)
-- The existing function should already work for any role value

-- Step 3: Create helper function specifically for warehouse check
CREATE OR REPLACE FUNCTION public.is_warehouse()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role = 'warehouse' FROM profiles WHERE id = auth.uid();
$$;

-- Step 4: Drop existing warehouse policies if they exist
DROP POLICY IF EXISTS "warehouse_view_orders" ON orders;
DROP POLICY IF EXISTS "warehouse_update_order_status" ON orders;
DROP POLICY IF EXISTS "warehouse_view_products" ON products;
DROP POLICY IF EXISTS "warehouse_update_product_stock" ON products;
DROP POLICY IF EXISTS "warehouse_view_order_items" ON order_items;
DROP POLICY IF EXISTS "warehouse_view_profiles" ON profiles;

-- Step 5: Add RLS policy for warehouse to view all orders
CREATE POLICY "warehouse_view_orders" ON orders
    FOR SELECT
    TO authenticated
    USING (is_warehouse());

-- Step 6: Add RLS policy for warehouse to update order status only
CREATE POLICY "warehouse_update_order_status" ON orders
    FOR UPDATE
    TO authenticated
    USING (is_warehouse())
    WITH CHECK (is_warehouse());

-- Step 7: Add RLS policy for warehouse to view all products
CREATE POLICY "warehouse_view_products" ON products
    FOR SELECT
    TO authenticated
    USING (is_warehouse());

-- Step 8: Add RLS policy for warehouse to update product stock only
CREATE POLICY "warehouse_update_product_stock" ON products
    FOR UPDATE
    TO authenticated
    USING (is_warehouse())
    WITH CHECK (is_warehouse());

-- Step 9: Add RLS policy for warehouse to view order items
CREATE POLICY "warehouse_view_order_items" ON order_items
    FOR SELECT
    TO authenticated
    USING (is_warehouse());

-- Step 10: Add RLS policy for warehouse to view profiles
-- Warehouse can view all profiles (customers and sales) but not modify
CREATE POLICY "warehouse_view_profiles" ON profiles
    FOR SELECT
    TO authenticated
    USING (
        is_warehouse()
        OR id = auth.uid()  -- Can always view own profile
    );

-- Step 11: Create function to validate warehouse can only update product stock
CREATE OR REPLACE FUNCTION validate_warehouse_product_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user is warehouse
    IF is_warehouse() THEN
        -- Warehouse can only update stock and updated_at
        IF (OLD.name IS DISTINCT FROM NEW.name) OR
           (OLD.sku IS DISTINCT FROM NEW.sku) OR
           (OLD.price IS DISTINCT FROM NEW.price) OR
           (OLD.unit IS DISTINCT FROM NEW.unit) OR
           (OLD.category_id IS DISTINCT FROM NEW.category_id) OR
           (OLD.image_url IS DISTINCT FROM NEW.image_url) OR
           (OLD.description IS DISTINCT FROM NEW.description) THEN
            RAISE EXCEPTION 'Warehouse role can only update stock field';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Create trigger for warehouse product update validation
DROP TRIGGER IF EXISTS validate_warehouse_product_update_trigger ON products;
CREATE TRIGGER validate_warehouse_product_update_trigger
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION validate_warehouse_product_update();

-- Step 13: Create function to validate warehouse can only update order status
CREATE OR REPLACE FUNCTION validate_warehouse_order_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user is warehouse
    IF is_warehouse() THEN
        -- Warehouse can only update status and updated_at
        IF (OLD.customer_id IS DISTINCT FROM NEW.customer_id) OR
           (OLD.sale_id IS DISTINCT FROM NEW.sale_id) OR
           (OLD.total_amount IS DISTINCT FROM NEW.total_amount) OR
           (OLD.notes IS DISTINCT FROM NEW.notes) THEN
            RAISE EXCEPTION 'Warehouse role can only update status field';
        END IF;
        
        -- Warehouse can only change status from 'ordered' to 'shipping'
        IF OLD.status = 'ordered' AND NEW.status != 'shipping' THEN
            RAISE EXCEPTION 'Warehouse can only change status from ordered to shipping';
        END IF;
        
        IF OLD.status != 'ordered' THEN
            RAISE EXCEPTION 'Warehouse can only update orders with ordered status';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 14: Create trigger for warehouse order update validation
DROP TRIGGER IF EXISTS validate_warehouse_order_update_trigger ON orders;
CREATE TRIGGER validate_warehouse_order_update_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION validate_warehouse_order_update();

-- Step 15: Add comments for documentation
COMMENT ON FUNCTION public.is_warehouse() IS 
    'Returns true if current user has warehouse role';
COMMENT ON POLICY "warehouse_view_orders" ON orders IS 
    'Allows warehouse role to view all orders';
COMMENT ON POLICY "warehouse_update_order_status" ON orders IS 
    'Allows warehouse role to update order status from ordered to shipping';
COMMENT ON POLICY "warehouse_view_products" ON products IS 
    'Allows warehouse role to view all products';
COMMENT ON POLICY "warehouse_update_product_stock" ON products IS 
    'Allows warehouse role to update product stock only';
COMMENT ON POLICY "warehouse_view_profiles" ON profiles IS 
    'Allows warehouse role to view all profiles (customers and sales)';

-- Migration completed successfully
-- Next steps:
-- 1. Add 'warehouse' value to role column (if ENUM) in Supabase Dashboard
-- 2. Create test warehouse user
-- 3. Update their profile role to 'warehouse'
-- 4. Test permissions
