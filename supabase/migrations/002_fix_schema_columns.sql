-- Fix schema to match application code expectations
-- This migration updates column names and constraints

-- =====================================================
-- CUSTOMERS TABLE FIXES
-- =====================================================

-- Rename 'package' to 'package_type' to match application code
ALTER TABLE customers RENAME COLUMN package TO package_type;

-- Rename 'notes' to 'special_instructions' to match application code
ALTER TABLE customers RENAME COLUMN notes TO special_instructions;

-- Add 'start_date' column for tracking when service begins
ALTER TABLE customers ADD COLUMN IF NOT EXISTS start_date DATE;

-- Drop 'price_per_visit' as prices are calculated dynamically based on lawn_size and package_type
ALTER TABLE customers DROP COLUMN IF EXISTS price_per_visit;

-- Update status check constraint to include 'pending_assessment'
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_status_check;
ALTER TABLE customers ADD CONSTRAINT customers_status_check
  CHECK (status IN ('pending_assessment', 'active', 'paused', 'cancelled'));

-- =====================================================
-- VISITS TABLE FIXES
-- =====================================================

-- Rename 'price' to 'price_cents' if it exists (for consistency with application code)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'visits' AND column_name = 'price') THEN
    ALTER TABLE visits RENAME COLUMN price TO price_cents;
  END IF;
END $$;

-- Add missing columns for visits
ALTER TABLE visits ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS actual_duration_minutes INTEGER;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS actual_start_time TIMESTAMP;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS actual_end_time TIMESTAMP;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS season TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS property_issues TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS customer_issues TEXT;

-- =====================================================
-- RLS POLICIES FOR ANONYMOUS FORM SUBMISSION
-- =====================================================

-- Ensure anonymous users can create customers (for booking form)
DROP POLICY IF EXISTS public_create_customer ON customers;
CREATE POLICY public_create_customer ON customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure visits can be created (for booking workflow)
DROP POLICY IF EXISTS service_create_visits ON visits;
CREATE POLICY service_create_visits ON visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading customers and visits for authenticated users (admin)
DROP POLICY IF EXISTS authenticated_read_customers ON customers;
CREATE POLICY authenticated_read_customers ON customers
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS authenticated_read_visits ON visits;
CREATE POLICY authenticated_read_visits ON visits
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow updating customers and visits for authenticated users (admin)
DROP POLICY IF EXISTS authenticated_update_customers ON customers;
CREATE POLICY authenticated_update_customers ON customers
  FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS authenticated_update_visits ON visits;
CREATE POLICY authenticated_update_visits ON visits
  FOR UPDATE
  TO authenticated
  USING (true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

-- Schema has been updated to match application code expectations.
--
-- Changes made:
-- 1. Renamed customers.package -> package_type
-- 2. Renamed customers.notes -> special_instructions
-- 3. Added customers.start_date column
-- 4. Removed customers.price_per_visit (calculated dynamically)
-- 5. Updated status check to include 'pending_assessment'
-- 6. Renamed visits.price -> price_cents (if existed)
-- 7. Added missing visit columns
-- 8. Updated RLS policies for anonymous form submissions
