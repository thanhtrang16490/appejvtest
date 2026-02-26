-- Migration: Add order history tracking
-- This migration adds a table to track order status changes and comments

-- Create order_history table
CREATE TABLE IF NOT EXISTS order_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'status_change', 'comment', 'created', 'updated'
  old_value TEXT,
  new_value TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_order_history_order_id ON order_history(order_id);
CREATE INDEX idx_order_history_created_at ON order_history(created_at DESC);

-- Enable RLS
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_history
-- Admin can see all history
CREATE POLICY "Admin can view all order history"
  ON order_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Sale admin can see team history
CREATE POLICY "Sale admin can view team order history"
  ON order_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'sale_admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM orders o
      JOIN profiles p ON o.sale_id = p.id
      WHERE o.id = order_history.order_id
      AND (p.id = auth.uid() OR p.manager_id = auth.uid())
    )
  );

-- Sales can see their own order history
CREATE POLICY "Sales can view own order history"
  ON order_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_history.order_id
      AND orders.sale_id = auth.uid()
    )
  );

-- Warehouse can see all order history
CREATE POLICY "Warehouse can view all order history"
  ON order_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'warehouse'
    )
  );

-- Customers can see their own order history
CREATE POLICY "Customers can view own order history"
  ON order_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = order_history.order_id
      AND c.user_id = auth.uid()
    )
  );

-- Insert policy - authenticated users can add history
CREATE POLICY "Authenticated users can insert order history"
  ON order_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create function to automatically log status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_history (order_id, user_id, action_type, old_value, new_value)
    VALUES (NEW.id, auth.uid(), 'status_change', OLD.status, NEW.status);
  END IF;
  
  -- Log order creation
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO order_history (order_id, user_id, action_type, new_value)
    VALUES (NEW.id, COALESCE(NEW.sale_id, auth.uid()), 'created', NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic status change logging
DROP TRIGGER IF EXISTS order_status_change_trigger ON orders;
CREATE TRIGGER order_status_change_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- Grant permissions
GRANT SELECT, INSERT ON order_history TO authenticated;
GRANT USAGE ON SEQUENCE order_history_id_seq TO authenticated;

COMMENT ON TABLE order_history IS 'Tracks order status changes and comments';
COMMENT ON COLUMN order_history.action_type IS 'Type of action: status_change, comment, created, updated';
COMMENT ON COLUMN order_history.old_value IS 'Previous value (for status changes)';
COMMENT ON COLUMN order_history.new_value IS 'New value (for status changes)';
COMMENT ON COLUMN order_history.comment IS 'User comment or note';
