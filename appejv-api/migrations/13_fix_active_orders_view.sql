-- Fix Security Definer View Issue for active_orders
-- Drop and recreate active_orders view without SECURITY DEFINER

-- Drop the existing view
DROP VIEW IF EXISTS public.active_orders CASCADE;

-- Recreate with SECURITY INVOKER
-- This view shows orders that are not completed or cancelled
CREATE OR REPLACE VIEW public.active_orders
WITH (security_invoker = true)
AS
SELECT *
FROM public.orders
WHERE status NOT IN ('completed', 'cancelled', 'delivered')
ORDER BY created_at DESC;

-- Grant appropriate permissions
GRANT SELECT ON public.active_orders TO authenticated;

-- Add comment explaining the security model
COMMENT ON VIEW public.active_orders IS 
'View showing active orders (not completed, cancelled, or delivered). 
Uses SECURITY INVOKER to enforce RLS policies of the querying user.
Users can only see orders they have permission to access based on RLS policies.';
