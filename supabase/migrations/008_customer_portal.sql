-- Migration 008: Customer Portal
-- Adds portal_messages table and url_slug to customers

-- Create portal_messages table for database-only messaging
CREATE TABLE IF NOT EXISTS portal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('customer', 'admin')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries by customer
CREATE INDEX IF NOT EXISTS idx_portal_messages_customer_id ON portal_messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_portal_messages_created_at ON portal_messages(created_at DESC);

-- Add url_slug column to customers for portal access
ALTER TABLE customers ADD COLUMN IF NOT EXISTS url_slug TEXT UNIQUE;

-- Create index for url_slug lookups
CREATE INDEX IF NOT EXISTS idx_customers_url_slug ON customers(url_slug);

-- Function to generate URL slug from address
CREATE OR REPLACE FUNCTION generate_url_slug(address TEXT, suburb TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug: lowercase, remove special chars, replace spaces with hyphens
  base_slug := LOWER(REGEXP_REPLACE(
    COALESCE(address, '') || COALESCE('-' || suburb, ''),
    '[^a-zA-Z0-9\s-]', '', 'g'
  ));
  base_slug := REGEXP_REPLACE(base_slug, '\s+', '-', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '-+', '-', 'g');
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  -- Ensure uniqueness by adding counter if needed
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM customers WHERE url_slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Generate url_slug for existing customers that don't have one
UPDATE customers 
SET url_slug = generate_url_slug(address, suburb)
WHERE url_slug IS NULL;

-- Add comment
COMMENT ON TABLE portal_messages IS 'Database-only messaging between customers and admin via customer portal';
COMMENT ON COLUMN customers.url_slug IS 'URL-friendly slug for customer portal access based on address';

