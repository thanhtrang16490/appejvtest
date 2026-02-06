-- Migration: Add audit_logs table for tracking user activities

-- ============================================
-- STEP 1: Create audit_logs table
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    ip_address TEXT,
    user_agent TEXT,
    resource TEXT,
    action TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: Add indexes for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_success ON audit_logs(success);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_timestamp ON audit_logs(user_id, timestamp DESC);

-- ============================================
-- STEP 3: Enable Row Level Security
-- ============================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create RLS Policies
-- ============================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- System can insert audit logs (for server-side operations)
CREATE POLICY "System can insert audit logs"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- No one can update or delete audit logs (immutable)
-- This ensures audit trail integrity

-- ============================================
-- STEP 5: Add comments
-- ============================================

COMMENT ON TABLE audit_logs IS 'Audit trail for all user activities and security events';
COMMENT ON COLUMN audit_logs.timestamp IS 'When the event occurred';
COMMENT ON COLUMN audit_logs.event_type IS 'Type of event (LOGIN_SUCCESS, DATA_MODIFICATION, etc.)';
COMMENT ON COLUMN audit_logs.user_id IS 'User who performed the action';
COMMENT ON COLUMN audit_logs.user_email IS 'Email of the user (for reference if user is deleted)';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the client';
COMMENT ON COLUMN audit_logs.user_agent IS 'Browser/client user agent';
COMMENT ON COLUMN audit_logs.resource IS 'Resource being accessed (e.g., /api/products)';
COMMENT ON COLUMN audit_logs.action IS 'Action performed (GET, POST, PUT, DELETE)';
COMMENT ON COLUMN audit_logs.success IS 'Whether the action was successful';
COMMENT ON COLUMN audit_logs.error_message IS 'Error message if action failed';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional context data (JSON)';

-- ============================================
-- STEP 6: Create function to log audit events
-- ============================================

CREATE OR REPLACE FUNCTION log_audit_event(
    p_event_type TEXT,
    p_user_id UUID DEFAULT NULL,
    p_user_email TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_resource TEXT DEFAULT NULL,
    p_action TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO audit_logs (
        event_type,
        user_id,
        user_email,
        ip_address,
        user_agent,
        resource,
        action,
        success,
        error_message,
        metadata
    ) VALUES (
        p_event_type,
        p_user_id,
        p_user_email,
        p_ip_address,
        p_user_agent,
        p_resource,
        p_action,
        p_success,
        p_error_message,
        p_metadata
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 7: Create views for common queries
-- ============================================

-- View for recent activities
CREATE OR REPLACE VIEW recent_audit_logs AS
SELECT 
    id,
    timestamp,
    event_type,
    user_id,
    user_email,
    resource,
    action,
    success,
    metadata
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 100;

-- View for failed activities
CREATE OR REPLACE VIEW failed_audit_logs AS
SELECT 
    id,
    timestamp,
    event_type,
    user_id,
    user_email,
    ip_address,
    resource,
    action,
    error_message,
    metadata
FROM audit_logs
WHERE success = FALSE
ORDER BY timestamp DESC;

-- View for security events
CREATE OR REPLACE VIEW security_audit_logs AS
SELECT 
    id,
    timestamp,
    event_type,
    user_id,
    user_email,
    ip_address,
    user_agent,
    resource,
    success,
    error_message
FROM audit_logs
WHERE event_type IN (
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'LOGOUT',
    'PASSWORD_CHANGE',
    'UNAUTHORIZED_ACCESS',
    'RATE_LIMIT_EXCEEDED',
    'SUSPICIOUS_ACTIVITY'
)
ORDER BY timestamp DESC;

-- ============================================
-- STEP 8: Create function to get user activity summary
-- ============================================

CREATE OR REPLACE FUNCTION get_user_activity_summary(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    event_type TEXT,
    count BIGINT,
    last_occurrence TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.event_type,
        COUNT(*) as count,
        MAX(al.timestamp) as last_occurrence
    FROM audit_logs al
    WHERE al.user_id = p_user_id
    AND al.timestamp > NOW() - (p_days || ' days')::INTERVAL
    GROUP BY al.event_type
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 9: Create function to cleanup old logs
-- ============================================

-- Function to delete audit logs older than X days
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_old INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE timestamp < NOW() - (days_old || ' days')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 10: Create triggers for automatic logging
-- ============================================

-- Trigger to log product changes
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'products',
            'INSERT',
            TRUE,
            NULL,
            jsonb_build_object('product_id', NEW.id, 'product_name', NEW.name)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'products',
            'UPDATE',
            TRUE,
            NULL,
            jsonb_build_object('product_id', NEW.id, 'product_name', NEW.name, 'changes', jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)))
        );
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'products',
            'DELETE',
            TRUE,
            NULL,
            jsonb_build_object('product_id', OLD.id, 'product_name', OLD.name)
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to products
DROP TRIGGER IF EXISTS trigger_log_product_changes ON products;
CREATE TRIGGER trigger_log_product_changes
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW
    EXECUTE FUNCTION log_product_changes();

-- Trigger to log customer changes
CREATE OR REPLACE FUNCTION log_customer_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'customers',
            'INSERT',
            TRUE,
            NULL,
            jsonb_build_object('customer_id', NEW.id, 'customer_name', NEW.name)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'customers',
            'UPDATE',
            TRUE,
            NULL,
            jsonb_build_object('customer_id', NEW.id, 'customer_name', NEW.name)
        );
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'customers',
            'DELETE',
            TRUE,
            NULL,
            jsonb_build_object('customer_id', OLD.id, 'customer_name', OLD.name)
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to customers
DROP TRIGGER IF EXISTS trigger_log_customer_changes ON customers;
CREATE TRIGGER trigger_log_customer_changes
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION log_customer_changes();

-- Trigger to log order changes
CREATE OR REPLACE FUNCTION log_order_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'orders',
            'INSERT',
            TRUE,
            NULL,
            jsonb_build_object('order_id', NEW.id, 'total_amount', NEW.total_amount)
        );
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_audit_event(
            'DATA_MODIFICATION',
            auth.uid(),
            NULL,
            NULL,
            NULL,
            'orders',
            'UPDATE',
            TRUE,
            NULL,
            jsonb_build_object('order_id', NEW.id, 'status', NEW.status, 'old_status', OLD.status)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to orders
DROP TRIGGER IF EXISTS trigger_log_order_changes ON orders;
CREATE TRIGGER trigger_log_order_changes
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_order_changes();

-- ============================================
-- STEP 11: Verify the changes
-- ============================================

-- Check table created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'audit_logs'
ORDER BY ordinal_position;

-- Check indexes created
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'audit_logs'
ORDER BY indexname;

-- Check views created
SELECT 
    table_name
FROM information_schema.views
WHERE table_schema = 'public'
AND table_name LIKE '%audit%'
ORDER BY table_name;

-- ============================================
-- STEP 12: Usage examples (commented out)
-- ============================================

/*
-- Log a manual event
SELECT log_audit_event(
    'LOGIN_SUCCESS',
    auth.uid(),
    'user@example.com',
    '192.168.1.1',
    'Mozilla/5.0...',
    '/auth/login',
    'POST',
    TRUE,
    NULL,
    '{"device": "mobile"}'::jsonb
);

-- Get user activity summary
SELECT * FROM get_user_activity_summary('user-uuid-here', 30);

-- View recent activities
SELECT * FROM recent_audit_logs LIMIT 20;

-- View failed activities
SELECT * FROM failed_audit_logs LIMIT 20;

-- View security events
SELECT * FROM security_audit_logs LIMIT 20;

-- Cleanup old logs (older than 1 year)
SELECT cleanup_old_audit_logs(365);
*/

-- Success message
SELECT 'Audit logs table created successfully!' as message;
SELECT 'Triggers are now logging all product, customer, and order changes automatically!' as info;
