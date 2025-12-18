-- Booking Flow Transformation Migration
-- This migration transforms the booking flow to support:
-- 1. Service-based selection instead of lawn size/package upfront
-- 2. Site inspection workflow via Calendly
-- 3. Proposal system for post-inspection quotes
-- 4. Deferred visit generation until proposal acceptance

-- Add new columns to customers table
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS other_service_description TEXT,
  ADD COLUMN IF NOT EXISTS inspection_booked_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS calendly_event_id TEXT,
  ADD COLUMN IF NOT EXISTS proposal_accepted_at TIMESTAMP;

-- Update customer status constraint to include new statuses
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_status_check;
ALTER TABLE customers ADD CONSTRAINT customers_status_check
  CHECK (status IN (
    'pending_inspection',    -- New: Initial booking, waiting for inspection
    'inspection_scheduled',  -- New: Inspection time booked via Calendly
    'proposal_sent',         -- New: Proposal created and sent to customer
    'active',                -- Existing: Proposal accepted, service active
    'paused',                -- Existing: Service temporarily paused
    'cancelled',             -- Existing: Service cancelled
    'pending_assessment'     -- Legacy: Keep for old records
  ));

-- Create proposals table
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,

  -- Proposal details (determined after inspection)
  lawn_size TEXT NOT NULL CHECK (lawn_size IN ('small', 'medium', 'large')),
  package_type TEXT NOT NULL CHECK (package_type IN ('standard', 'premium')),
  visit_frequency_days INTEGER NOT NULL CHECK (visit_frequency_days > 0),
  price_per_visit_cents INTEGER NOT NULL CHECK (price_per_visit_cents >= 0),
  estimated_annual_visits INTEGER NOT NULL CHECK (estimated_annual_visits > 0),

  -- Additional services and notes from inspection
  included_services JSONB DEFAULT '[]'::jsonb,
  notes TEXT,

  -- Status tracking
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected', 'expired')),
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for proposals table
CREATE INDEX IF NOT EXISTS idx_proposals_customer ON proposals(customer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_token ON proposals(token);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_expires_at ON proposals(expires_at);

-- Add trigger to update updated_at timestamp on proposals
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to explain services column structure
COMMENT ON COLUMN customers.services IS 'Array of selected services: lawn_clearing, edge_trimming, hedging, other';
COMMENT ON COLUMN customers.other_service_description IS 'Description when "other" service is selected';
COMMENT ON COLUMN customers.inspection_booked_at IS 'Timestamp when customer booked inspection via Calendly';
COMMENT ON COLUMN customers.calendly_event_id IS 'Calendly event ID for the inspection booking';
COMMENT ON COLUMN customers.proposal_accepted_at IS 'Timestamp when customer accepted the proposal';

COMMENT ON TABLE proposals IS 'Proposals sent to customers after site inspection';
COMMENT ON COLUMN proposals.token IS 'Secure token for public access to proposal (no auth required)';
COMMENT ON COLUMN proposals.expires_at IS 'Proposal expiry date (default 14 days from creation)';
