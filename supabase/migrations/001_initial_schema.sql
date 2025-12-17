-- Handy Help NZ - Initial Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact information
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,

  -- Address
  address TEXT NOT NULL,
  suburb TEXT,

  -- Service configuration
  lawn_size TEXT NOT NULL CHECK (lawn_size IN ('small', 'medium', 'large')),
  package TEXT NOT NULL CHECK (package IN ('standard', 'premium')),
  price_per_visit DECIMAL(10,2) NOT NULL,

  -- Additional info
  notes TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Visits table
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,

  -- Scheduling
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT CHECK (scheduled_time IN ('morning', 'afternoon')),

  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'skipped', 'rescheduled')),

  -- Service details
  services JSONB DEFAULT '["mowing"]'::jsonb,
  price DECIMAL(10,2) NOT NULL,

  -- Completion
  completed_at TIMESTAMP,
  completion_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,

  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('bank_transfer', 'cash')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),

  -- Additional info
  reference TEXT,
  notes TEXT,

  -- Timestamps
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Customers indexes
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_suburb ON customers(suburb);
CREATE INDEX idx_customers_phone ON customers(phone);

-- Visits indexes
CREATE INDEX idx_visits_customer ON visits(customer_id);
CREATE INDEX idx_visits_date ON visits(scheduled_date);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_date_status ON visits(scheduled_date, status);

-- Payments indexes
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_visit ON payments(visit_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(created_at);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to customers table
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Apply to visits table
CREATE TRIGGER visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- Generate visits for new customer
-- =====================================================

CREATE OR REPLACE FUNCTION generate_customer_visits(
  p_customer_id UUID,
  p_package TEXT,
  p_start_date DATE,
  p_price DECIMAL
)
RETURNS void AS $$
DECLARE
  v_current_date DATE := p_start_date;
  v_end_date DATE := p_start_date + INTERVAL '12 months';
  v_month INT;
  v_frequency_days INT;
BEGIN
  WHILE v_current_date < v_end_date LOOP
    v_month := EXTRACT(MONTH FROM v_current_date);

    -- Determine frequency based on season and package
    IF v_month IN (12, 1, 2) THEN -- Summer
      IF p_package = 'standard' THEN
        v_frequency_days := 28;
      ELSE
        v_frequency_days := 14;
      END IF;
    ELSIF v_month IN (3, 4) THEN -- Autumn
      IF p_package = 'standard' THEN
        v_frequency_days := 35;
      ELSE
        v_frequency_days := 21;
      END IF;
    ELSIF v_month IN (5, 6, 7, 8) THEN -- Winter
      IF p_package = 'standard' THEN
        -- Skip winter for standard
        v_current_date := DATE_TRUNC('month', v_current_date) + INTERVAL '4 months';
        CONTINUE;
      ELSE
        v_frequency_days := 30;
      END IF;
    ELSE -- Spring (9, 10, 11)
      IF p_package = 'standard' THEN
        v_frequency_days := 28;
      ELSE
        v_frequency_days := 18;
      END IF;
    END IF;

    -- Insert visit
    INSERT INTO visits (customer_id, scheduled_date, price, status)
    VALUES (p_customer_id, v_current_date, p_price, 'scheduled');

    -- Move to next visit date
    v_current_date := v_current_date + (v_frequency_days || ' days')::INTERVAL;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS
-- =====================================================

-- Upcoming visits with customer details
CREATE VIEW upcoming_visits AS
SELECT
  v.id,
  v.scheduled_date,
  v.scheduled_time,
  v.status,
  v.price,
  c.id as customer_id,
  c.name as customer_name,
  c.phone as customer_phone,
  c.address as customer_address,
  c.suburb as customer_suburb,
  c.lawn_size,
  c.package,
  c.notes as customer_notes
FROM visits v
JOIN customers c ON v.customer_id = c.id
WHERE v.status = 'scheduled'
  AND v.scheduled_date >= CURRENT_DATE
ORDER BY v.scheduled_date, v.scheduled_time;

-- Customer summary with stats
CREATE VIEW customer_summary AS
SELECT
  c.*,
  COUNT(v.id) as total_visits,
  COUNT(CASE WHEN v.status = 'completed' THEN 1 END) as completed_visits,
  COUNT(CASE WHEN v.status = 'scheduled' AND v.scheduled_date >= CURRENT_DATE THEN 1 END) as upcoming_visits,
  COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END), 0) as total_paid,
  COALESCE(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) as outstanding_amount,
  MAX(v.completed_at) as last_visit_date
FROM customers c
LEFT JOIN visits v ON c.id = v.customer_id
LEFT JOIN payments p ON c.id = p.customer_id
GROUP BY c.id;

-- Daily schedule
CREATE VIEW daily_schedule AS
SELECT
  v.scheduled_date,
  v.scheduled_time,
  COUNT(*) as visit_count,
  ARRAY_AGG(
    JSON_BUILD_OBJECT(
      'id', v.id,
      'customer_name', c.name,
      'address', c.address,
      'suburb', c.suburb,
      'lawn_size', c.lawn_size,
      'price', v.price,
      'notes', c.notes
    ) ORDER BY v.scheduled_time, c.suburb
  ) as visits
FROM visits v
JOIN customers c ON v.customer_id = c.id
WHERE v.status = 'scheduled'
  AND v.scheduled_date >= CURRENT_DATE
GROUP BY v.scheduled_date, v.scheduled_time
ORDER BY v.scheduled_date, v.scheduled_time;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Admin access (for William's dashboard)
-- Note: You'll need to set up auth first, then add proper policies
-- For now, these policies allow service role access

-- Public access for booking form
CREATE POLICY public_create_customer ON customers
  FOR INSERT WITH CHECK (true);

-- Service role can insert visits when creating booking
CREATE POLICY service_create_visits ON visits
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- OPTIONAL: Add-on Services Table
-- =====================================================

CREATE TABLE addon_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT, -- e.g., "per metre" for hedge trimming
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default add-on services
INSERT INTO addon_services (name, description, price, unit) VALUES
  ('Hedge trim', 'Trim hedges and bushes', 3.00, 'per metre'),
  ('Weed spray', 'Targeted weed treatment', 25.00, 'per visit'),
  ('Dog waste cleanup - small', 'Small dog waste removal', 8.00, 'per visit'),
  ('Dog waste cleanup - medium', 'Medium dog waste removal', 12.00, 'per visit'),
  ('Dog waste cleanup - large', 'Large/multiple dog waste removal', 18.00, 'per visit'),
  ('Leaf cleanup', 'Autumn leaf removal', 15.00, 'per visit');

-- =====================================================
-- SUCCESS!
-- =====================================================

-- Database schema created successfully.
--
-- Next steps:
-- 1. Set up Supabase authentication for admin access
-- 2. Create RLS policies for authenticated users
-- 3. Connect your Next.js app using the Supabase client
-- 4. Test the generate_customer_visits function
