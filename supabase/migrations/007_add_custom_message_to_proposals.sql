-- Add custom_message column to proposals table for personalized messages
ALTER TABLE proposals
ADD COLUMN IF NOT EXISTS custom_message TEXT;

COMMENT ON COLUMN proposals.custom_message IS 'Custom message from admin to customer, included in proposal email';

