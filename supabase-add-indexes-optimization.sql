-- =====================================================
-- DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================
-- Run this migration in Supabase SQL Editor
-- These indexes will significantly improve query performance

-- =====================================================
-- ORDERS TABLE INDEXES
-- =====================================================

-- Index for filtering orders by sale_id (most common query)
CREATE INDEX IF NOT EXISTS idx_orders_sale_id 
ON orders(sale_id) 
WHERE deleted_at IS NULL;

-- Index for filtering orders by customer_id
CREATE INDEX IF NOT EXISTS idx_orders_customer_id 
ON orders(customer_id) 
WHERE deleted_at IS NULL;

-- Index for filtering orders by status (used in tabs)
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status) 
WHERE deleted_at IS NULL;

-- Index for sorting orders by created_at (most recent first)
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON orders(created_at DESC) 
WHERE deleted_at IS NULL;

-- Composite index for sale_id + status (common filter combination)
CREATE INDEX IF NOT EXISTS idx_orders_sale_status 
ON orders(sale_id, status) 
WHERE deleted_at IS NULL;

-- Composite index for date range queries in reports
CREATE INDEX IF NOT EXISTS idx_orders_status_created 
ON orders(status, created_at DESC) 
WHERE deleted_at IS NULL AND status = 'completed';

-- =====================================================
-- ORDER_ITEMS TABLE INDEXES
-- =====================================================

-- Index for joining order_items with orders
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
ON order_items(order_id);

-- Index for product analytics
CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
ON order_items(product_id);

-- Composite index for order + product lookups
CREATE INDEX IF NOT EXISTS idx_order_items_order_product 
ON order_items(order_id, product_id);

-- =====================================================
-- PRODUCTS TABLE INDEXES
-- =====================================================

-- Index for filtering products by category
CREATE INDEX IF NOT EXISTS idx_products_category_id 
ON products(category_id) 
WHERE deleted_at IS NULL;

-- Index for low stock alerts
CREATE INDEX IF NOT EXISTS idx_products_stock 
ON products(stock) 
WHERE deleted_at IS NULL AND stock < 20;

-- Index for product name search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_products_name_lower 
ON products(LOWER(name)) 
WHERE deleted_at IS NULL;

-- Index for slug lookups (product pages)
CREATE INDEX IF NOT EXISTS idx_products_slug 
ON products(slug) 
WHERE deleted_at IS NULL;

-- =====================================================
-- CUSTOMERS TABLE INDEXES
-- =====================================================

-- Index for filtering customers by assigned sale
CREATE INDEX IF NOT EXISTS idx_customers_assigned_sale 
ON customers(assigned_sale) 
WHERE deleted_at IS NULL;

-- Index for customer name search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_customers_name_lower 
ON customers(LOWER(name)) 
WHERE deleted_at IS NULL;

-- Index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone 
ON customers(phone) 
WHERE deleted_at IS NULL;

-- =====================================================
-- PROFILES TABLE INDEXES
-- =====================================================

-- Index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON profiles(role);

-- Index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone 
ON profiles(phone) 
WHERE phone IS NOT NULL;

-- Index for full_name search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_profiles_name_lower 
ON profiles(LOWER(full_name)) 
WHERE full_name IS NOT NULL;

-- Note: manager_id index
-- Uncomment if you've run the manager hierarchy migration:
-- CREATE INDEX IF NOT EXISTS idx_profiles_manager_id 
-- ON profiles(manager_id) 
-- WHERE manager_id IS NOT NULL;

-- =====================================================
-- CATEGORIES TABLE INDEXES
-- =====================================================

-- Index for category name lookups
CREATE INDEX IF NOT EXISTS idx_categories_name 
ON categories(name);

-- =====================================================
-- AUDIT_LOGS TABLE INDEXES
-- =====================================================

-- Index for filtering audit logs by user
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
ON audit_logs(user_id) 
WHERE user_id IS NOT NULL;

-- Index for filtering by event type
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type 
ON audit_logs(event_type);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

-- Composite index for user + date range queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created 
ON audit_logs(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

-- =====================================================
-- VERIFY INDEXES
-- =====================================================

-- Run this query to verify all indexes were created:
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- PERFORMANCE NOTES
-- =====================================================

-- These indexes will:
-- 1. Speed up order filtering by sale, customer, and status
-- 2. Improve report generation queries (date ranges)
-- 3. Optimize product search and category filtering
-- 4. Accelerate customer lookups by sale assignment
-- 5. Enhance audit log queries

-- Trade-offs:
-- - Slightly slower INSERT/UPDATE operations (minimal impact)
-- - Additional storage space (typically 10-20% of table size)
-- - Indexes are automatically maintained by PostgreSQL

-- Monitoring:
-- Use Supabase Dashboard > Database > Query Performance
-- to monitor slow queries and adjust indexes as needed

-- =====================================================
-- MAINTENANCE
-- =====================================================

-- Reindex if needed (run during low traffic):
-- REINDEX TABLE orders;
-- REINDEX TABLE order_items;
-- REINDEX TABLE products;
-- REINDEX TABLE customers;

-- Analyze tables to update statistics:
ANALYZE orders;
ANALYZE order_items;
ANALYZE products;
ANALYZE customers;
ANALYZE profiles;
ANALYZE categories;
ANALYZE audit_logs;
