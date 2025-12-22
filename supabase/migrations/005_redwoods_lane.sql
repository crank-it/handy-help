-- Redwoods Lane Local Business Management
-- Simple tracking for local neighborhood customers and jobs

-- Redwoods Lane Customers
CREATE TABLE IF NOT EXISTS redwoods_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  house_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  agreed_price_cents INTEGER NOT NULL DEFAULT 0,
  payment_frequency TEXT NOT NULL DEFAULT 'per_visit' CHECK (payment_frequency IN ('per_visit', 'weekly', 'fortnightly', 'monthly')),
  expectations TEXT,
  special_notes TEXT,
  start_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Redwoods Lane Jobs
CREATE TABLE IF NOT EXISTS redwoods_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES redwoods_customers(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  price_cents INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  completed_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_redwoods_customers_active ON redwoods_customers(is_active);
CREATE INDEX IF NOT EXISTS idx_redwoods_customers_house_number ON redwoods_customers(house_number);
CREATE INDEX IF NOT EXISTS idx_redwoods_jobs_customer_id ON redwoods_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_redwoods_jobs_scheduled_date ON redwoods_jobs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_redwoods_jobs_status ON redwoods_jobs(status);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_redwoods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER redwoods_customers_updated_at
  BEFORE UPDATE ON redwoods_customers
  FOR EACH ROW
  EXECUTE FUNCTION update_redwoods_updated_at();

CREATE TRIGGER redwoods_jobs_updated_at
  BEFORE UPDATE ON redwoods_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_redwoods_updated_at();

-- Comments
COMMENT ON TABLE redwoods_customers IS 'Local Redwoods Lane neighborhood customers';
COMMENT ON TABLE redwoods_jobs IS 'Jobs scheduled for Redwoods Lane customers';

