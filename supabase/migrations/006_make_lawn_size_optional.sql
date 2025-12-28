-- Fix: Make lawn_size and package_type optional for customers
-- These fields are determined after inspection, not at booking time

-- Drop the NOT NULL constraint on lawn_size
ALTER TABLE customers 
  ALTER COLUMN lawn_size DROP NOT NULL;

-- Drop the NOT NULL constraint check
ALTER TABLE customers 
  DROP CONSTRAINT IF EXISTS customers_lawn_size_check;

-- Add new constraint that allows NULL or valid values
ALTER TABLE customers 
  ADD CONSTRAINT customers_lawn_size_check 
  CHECK (lawn_size IS NULL OR lawn_size IN ('small', 'medium', 'large'));

-- Drop the NOT NULL constraint check on package_type
ALTER TABLE customers 
  DROP CONSTRAINT IF EXISTS customers_package_type_check;

-- Add new constraint that allows NULL or valid values
ALTER TABLE customers 
  ADD CONSTRAINT customers_package_type_check 
  CHECK (package_type IS NULL OR package_type IN ('standard', 'premium'));

-- Update RLS policies to allow inserts with NULL lawn_size/package_type
-- (Policies already exist from migration 002, this is just ensuring they're correct)

-- Enable RLS if not already enabled
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Recreate insert policy to allow anonymous inserts (for booking form and admin)
DROP POLICY IF EXISTS public_create_customer ON customers;
CREATE POLICY public_create_customer ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Recreate select policy for authenticated users
DROP POLICY IF EXISTS authenticated_read_customers ON customers;
CREATE POLICY authenticated_read_customers ON customers
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Recreate update policy for authenticated users
DROP POLICY IF EXISTS authenticated_update_customers ON customers;
CREATE POLICY authenticated_update_customers ON customers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Success message
COMMENT ON TABLE customers IS 'Customers table - lawn_size and package_type are optional until after inspection';

