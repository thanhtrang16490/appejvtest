-- Migration: Add notifications table

-- Step 1: Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('success', 'warning', 'info', 'error')),
    category TEXT NOT NULL CHECK (category IN ('order', 'inventory', 'customer', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);

-- Step 3: Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- System can insert notifications for any user (for server-side operations)
CREATE POLICY "System can insert notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 5: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_notifications_updated_at ON notifications;

CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Step 7: Add comments
COMMENT ON TABLE notifications IS 'Store user notifications for orders, inventory, customers, and system events';
COMMENT ON COLUMN notifications.user_id IS 'User who receives this notification';
COMMENT ON COLUMN notifications.type IS 'Notification type: success, warning, info, error';
COMMENT ON COLUMN notifications.category IS 'Notification category: order, inventory, customer, system';
COMMENT ON COLUMN notifications.title IS 'Notification title';
COMMENT ON COLUMN notifications.message IS 'Notification message content';
COMMENT ON COLUMN notifications.read IS 'Whether the notification has been read';
COMMENT ON COLUMN notifications.metadata IS 'Additional data (order_id, customer_id, etc.)';

-- Step 8: Create helper function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_category TEXT,
    p_title TEXT,
    p_message TEXT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, category, title, message, metadata)
    VALUES (p_user_id, p_type, p_category, p_title, p_message, p_metadata)
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 9: Create function to notify all admins
CREATE OR REPLACE FUNCTION notify_admins(
    p_type TEXT,
    p_category TEXT,
    p_title TEXT,
    p_message TEXT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    v_admin RECORD;
BEGIN
    FOR v_admin IN 
        SELECT id FROM profiles WHERE role IN ('admin', 'sale_admin')
    LOOP
        PERFORM create_notification(
            v_admin.id,
            p_type,
            p_category,
            p_title,
            p_message,
            p_metadata
        );
        v_count := v_count + 1;
    END LOOP;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create function to notify assigned sale
CREATE OR REPLACE FUNCTION notify_assigned_sale(
    p_customer_id INTEGER,
    p_type TEXT,
    p_category TEXT,
    p_title TEXT,
    p_message TEXT,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_sale_id UUID;
    v_notification_id UUID;
BEGIN
    -- Get assigned sale from customer
    SELECT assigned_sale INTO v_sale_id
    FROM customers
    WHERE id = p_customer_id;
    
    IF v_sale_id IS NOT NULL THEN
        v_notification_id := create_notification(
            v_sale_id,
            p_type,
            p_category,
            p_title,
            p_message,
            p_metadata
        );
    END IF;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 11: Verify the table
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- Step 12: Create some sample notifications (optional - for testing)
-- Uncomment to create sample data
/*
-- Get first admin user
DO $$
DECLARE
    v_admin_id UUID;
BEGIN
    SELECT id INTO v_admin_id FROM profiles WHERE role = 'admin' LIMIT 1;
    
    IF v_admin_id IS NOT NULL THEN
        -- Sample notifications
        PERFORM create_notification(
            v_admin_id,
            'warning',
            'inventory',
            'Sản phẩm sắp hết hàng',
            'Thức ăn heo con chỉ còn 10 sản phẩm trong kho',
            '{"product_id": 1, "stock": 10}'::jsonb
        );
        
        PERFORM create_notification(
            v_admin_id,
            'success',
            'order',
            'Đơn hàng mới',
            'Khách hàng vừa đặt đơn hàng mới',
            '{"order_id": 1}'::jsonb
        );
        
        PERFORM create_notification(
            v_admin_id,
            'info',
            'system',
            'Cập nhật hệ thống',
            'Hệ thống đã được cập nhật lên phiên bản mới',
            '{}'::jsonb
        );
    END IF;
END $$;
*/

-- Success message
SELECT 'Notifications table created successfully!' as message;
