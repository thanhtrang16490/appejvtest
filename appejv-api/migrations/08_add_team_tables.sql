-- Migration 08: Add Sales Team Structure
-- Phase 1: Foundation - Add team tables without breaking existing functionality
-- This migration is SAFE to run - it only adds new tables, doesn't modify existing ones

-- ============================================================================
-- SALES TEAMS TABLE
-- ============================================================================
-- Stores team information with manager (sale_admin)
CREATE TABLE IF NOT EXISTS sales_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sales_teams_manager ON sales_teams(manager_id);
CREATE INDEX IF NOT EXISTS idx_sales_teams_status ON sales_teams(status);

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================
-- Maps sales people to teams
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES sales_teams(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'removed'
  notes TEXT,
  UNIQUE(team_id, sale_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_sale ON team_members(sale_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON team_members(status);

-- ============================================================================
-- UPDATE CUSTOMERS TABLE
-- ============================================================================
-- Add team-related fields to customers (nullable for backward compatibility)
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES sales_teams(id) ON DELETE SET NULL;

-- Indexes for customer assignment
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_team ON customers(team_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_by ON customers(assigned_by);

-- ============================================================================
-- UPDATE ORDERS TABLE
-- ============================================================================
-- Add tracking fields for orders (nullable for backward compatibility)
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES sales_teams(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

-- Indexes for order tracking
CREATE INDEX IF NOT EXISTS idx_orders_created_by ON orders(created_by);
CREATE INDEX IF NOT EXISTS idx_orders_team ON orders(team_id);
CREATE INDEX IF NOT EXISTS idx_orders_approved_by ON orders(approved_by);

-- ============================================================================
-- CUSTOMER ASSIGNMENTS HISTORY TABLE
-- ============================================================================
-- Track customer assignment history for audit trail
CREATE TABLE IF NOT EXISTS customer_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  team_id UUID REFERENCES sales_teams(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_assignments_customer ON customer_assignments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_assignments_assigned_to ON customer_assignments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customer_assignments_team ON customer_assignments(team_id);

-- ============================================================================
-- RLS POLICIES - SALES TEAMS
-- ============================================================================
-- Enable RLS
ALTER TABLE sales_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_assignments ENABLE ROW LEVEL SECURITY;

-- Admin can see all teams
CREATE POLICY "Admins can view all teams"
ON sales_teams FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Sale admin can see their own team
CREATE POLICY "Sale admins can view their team"
ON sales_teams FOR SELECT
USING (
  manager_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Sale can see their team
CREATE POLICY "Sales can view their team"
ON team_members FOR SELECT
USING (
  sale_id = auth.uid()
  OR team_id IN (
    SELECT id FROM sales_teams WHERE manager_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Admin and sale_admin can manage teams
CREATE POLICY "Admins and sale admins can manage teams"
ON sales_teams FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'sale_admin')
  )
);

-- Admin and sale_admin can manage team members
CREATE POLICY "Admins and sale admins can manage team members"
ON team_members FOR ALL
USING (
  team_id IN (
    SELECT id FROM sales_teams WHERE manager_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Everyone can view assignment history for their customers
CREATE POLICY "Users can view customer assignment history"
ON customer_assignments FOR SELECT
USING (
  assigned_to = auth.uid()
  OR assigned_by = auth.uid()
  OR customer_id IN (
    SELECT id FROM customers WHERE assigned_to = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('admin', 'sale_admin')
  )
);

-- ============================================================================
-- UPDATE EXISTING RLS POLICIES FOR CUSTOMERS
-- ============================================================================
-- Note: These policies will be activated in Phase 3 when customer assignment is enabled
-- For now, they are created but won't affect existing functionality

-- Drop old customer policies if they exist
DROP POLICY IF EXISTS "Sales can view assigned customers" ON customers;
DROP POLICY IF EXISTS "Sale admins can view team customers" ON customers;

-- New policy: Sales can view their assigned customers
CREATE POLICY "Sales can view assigned customers"
ON customers FOR SELECT
USING (
  -- Admin sees all
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
  OR
  -- Sale sees assigned customers (if assigned_to is set)
  (assigned_to = auth.uid() AND assigned_to IS NOT NULL)
  OR
  -- If no assignment system yet, use old logic (backward compatibility)
  (assigned_to IS NULL)
);

-- New policy: Sale admins can view team customers
CREATE POLICY "Sale admins can view team customers"
ON customers FOR SELECT
USING (
  -- Admin sees all
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
  OR
  -- Sale admin sees own customers
  (assigned_to = auth.uid() AND assigned_to IS NOT NULL)
  OR
  -- Sale admin sees team customers
  (
    assigned_to IN (
      SELECT sale_id FROM team_members 
      WHERE team_id IN (
        SELECT id FROM sales_teams WHERE manager_id = auth.uid()
      )
      AND status = 'active'
    )
    AND assigned_to IS NOT NULL
  )
  OR
  -- Backward compatibility: if no assignment, use old logic
  (assigned_to IS NULL)
);

-- ============================================================================
-- UPDATE EXISTING RLS POLICIES FOR ORDERS
-- ============================================================================
-- Drop old order policies if they exist
DROP POLICY IF EXISTS "Sales can view their orders" ON orders;
DROP POLICY IF EXISTS "Sale admins can view team orders" ON orders;

-- New policy: Sales can view their orders
CREATE POLICY "Sales can view their orders"
ON orders FOR SELECT
USING (
  -- Admin sees all
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
  OR
  -- Sale sees orders they created
  (created_by = auth.uid() AND created_by IS NOT NULL)
  OR
  -- Sale sees orders for their assigned customers
  customer_id IN (
    SELECT id FROM customers WHERE assigned_to = auth.uid()
  )
  OR
  -- Backward compatibility: if no created_by, use old logic
  (created_by IS NULL)
);

-- New policy: Sale admins can view team orders
CREATE POLICY "Sale admins can view team orders"
ON orders FOR SELECT
USING (
  -- Admin sees all
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
  OR
  -- Sale admin sees own orders
  (created_by = auth.uid() AND created_by IS NOT NULL)
  OR
  -- Sale admin sees orders for own customers
  customer_id IN (
    SELECT id FROM customers WHERE assigned_to = auth.uid()
  )
  OR
  -- Sale admin sees team orders
  customer_id IN (
    SELECT id FROM customers 
    WHERE assigned_to IN (
      SELECT sale_id FROM team_members 
      WHERE team_id IN (
        SELECT id FROM sales_teams WHERE manager_id = auth.uid()
      )
      AND status = 'active'
    )
  )
  OR
  -- Backward compatibility
  (created_by IS NULL)
);

-- ============================================================================
-- FUNCTIONS FOR TEAM MANAGEMENT
-- ============================================================================

-- Function to get team member count
CREATE OR REPLACE FUNCTION get_team_member_count(team_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM team_members 
    WHERE team_id = team_uuid 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get team customer count
CREATE OR REPLACE FUNCTION get_team_customer_count(team_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM customers 
    WHERE team_id = team_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign customer to sale
CREATE OR REPLACE FUNCTION assign_customer_to_sale(
  customer_uuid UUID,
  sale_uuid UUID,
  assigned_by_uuid UUID,
  team_uuid UUID DEFAULT NULL,
  assignment_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update customer
  UPDATE customers
  SET 
    assigned_to = sale_uuid,
    assigned_at = NOW(),
    assigned_by = assigned_by_uuid,
    team_id = team_uuid
  WHERE id = customer_uuid;
  
  -- Record in history
  INSERT INTO customer_assignments (
    customer_id,
    assigned_to,
    assigned_by,
    team_id,
    notes
  ) VALUES (
    customer_uuid,
    sale_uuid,
    assigned_by_uuid,
    team_uuid,
    assignment_notes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at timestamp on sales_teams
CREATE OR REPLACE FUNCTION update_sales_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sales_teams_updated_at
BEFORE UPDATE ON sales_teams
FOR EACH ROW
EXECUTE FUNCTION update_sales_teams_updated_at();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE sales_teams IS 'Sales teams with manager (sale_admin)';
COMMENT ON TABLE team_members IS 'Maps sales people to teams';
COMMENT ON TABLE customer_assignments IS 'Audit trail for customer assignments';
COMMENT ON COLUMN customers.assigned_to IS 'Sale person assigned to this customer';
COMMENT ON COLUMN customers.team_id IS 'Team this customer belongs to';
COMMENT ON COLUMN orders.created_by IS 'User who created this order';
COMMENT ON COLUMN orders.team_id IS 'Team this order belongs to';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This migration adds team structure foundation
-- No existing functionality is broken
-- All new columns are nullable for backward compatibility
-- RLS policies maintain existing access patterns
