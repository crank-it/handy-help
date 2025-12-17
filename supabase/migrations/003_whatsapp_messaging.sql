-- WhatsApp Messaging System
-- Migration for adding messaging capabilities to Handy Help NZ

-- =====================================================
-- TABLES
-- =====================================================

-- Messages table - stores all sent/received messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Recipient(s)
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL, -- E.164 format (+64...)

  -- Message content
  message_body TEXT NOT NULL,
  template_id UUID, -- Reference to template if used

  -- Direction and status
  direction TEXT NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),

  -- WhatsApp API response
  whatsapp_message_id TEXT, -- Message ID from WhatsApp API
  error_message TEXT, -- If failed, store the error

  -- Context - what triggered this message
  context_type TEXT CHECK (context_type IN ('manual', 'reminder', 'weather', 'delay', 'on_the_way', 'sick_day', 'follow_up', 'bulk', 'reply')),
  context_id UUID, -- e.g., visit_id if related to a specific visit

  -- Bulk message tracking
  bulk_message_id UUID, -- Groups messages sent as bulk

  -- Timestamps
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Message templates - pre-defined messages
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Template info
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('reminder', 'weather', 'delay', 'on_the_way', 'sick_day', 'follow_up', 'general')),

  -- Template content
  -- Use {{variable}} for placeholders: {{customer_name}}, {{date}}, {{time}}, {{address}}
  template_body TEXT NOT NULL,

  -- WhatsApp Business API template (if using approved templates)
  whatsapp_template_name TEXT,
  whatsapp_template_namespace TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bulk message batches - track group messages
CREATE TABLE bulk_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Message content
  message_body TEXT NOT NULL,
  template_id UUID REFERENCES message_templates(id) ON DELETE SET NULL,

  -- Stats
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'completed', 'partial_failure')),

  -- Timestamps
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Messages indexes
CREATE INDEX idx_messages_customer ON messages(customer_id);
CREATE INDEX idx_messages_phone ON messages(phone_number);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_direction ON messages(direction);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_bulk ON messages(bulk_message_id);
CREATE INDEX idx_messages_whatsapp_id ON messages(whatsapp_message_id);

-- Templates indexes
CREATE INDEX idx_templates_category ON message_templates(category);
CREATE INDEX idx_templates_active ON message_templates(is_active);

-- Bulk messages indexes
CREATE INDEX idx_bulk_status ON bulk_messages(status);
CREATE INDEX idx_bulk_created ON bulk_messages(created_at DESC);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Apply updated_at trigger to new tables
CREATE TRIGGER messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bulk_messages_updated_at
  BEFORE UPDATE ON bulk_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- DEFAULT TEMPLATES
-- =====================================================

INSERT INTO message_templates (name, category, template_body) VALUES
-- Reminder templates
('Visit Reminder - Tomorrow', 'reminder',
  'Hi {{customer_name}}, just a reminder that your lawn service is scheduled for tomorrow. See you then! - Handy Help'),

('Visit Reminder - Same Day', 'reminder',
  'Hi {{customer_name}}, this is a reminder that your lawn service is scheduled for today. We''ll be there soon! - Handy Help'),

-- On the way templates
('On My Way', 'on_the_way',
  'Hi {{customer_name}}, I''m on my way to your place now. Should be there in about {{eta}} minutes! - Will from Handy Help'),

('Arriving Shortly', 'on_the_way',
  'Hi {{customer_name}}, I''m almost at your place - just 5 minutes away! - Will from Handy Help'),

-- Delay templates
('Running Late', 'delay',
  'Hi {{customer_name}}, I''m running a bit behind schedule today. I''ll be there around {{new_time}} instead. Sorry for any inconvenience! - Will from Handy Help'),

('Reschedule Needed', 'delay',
  'Hi {{customer_name}}, unfortunately I need to reschedule your visit originally planned for {{original_date}}. Would {{new_date}} work for you? - Will from Handy Help'),

-- Weather templates
('Weather Delay', 'weather',
  'Hi {{customer_name}}, there''s a {{weather_chance}}% chance of rain tomorrow which may affect your scheduled visit. I''ll keep an eye on the forecast and let you know if we need to reschedule. - Will from Handy Help'),

('Weather Cancellation', 'weather',
  'Hi {{customer_name}}, due to the weather forecast, I need to postpone your lawn service scheduled for {{date}}. I''ll be in touch to reschedule. Thanks for understanding! - Will from Handy Help'),

-- Sick day templates
('Sick Day Notice', 'sick_day',
  'Hi {{customer_name}}, I''m not feeling well today and won''t be able to make it for your scheduled visit. I''ll be in touch to reschedule as soon as I''m better. Apologies for any inconvenience! - Will from Handy Help'),

-- Follow up templates
('Visit Completed', 'follow_up',
  'Hi {{customer_name}}, just finished your lawn! Let me know if there''s anything you''d like me to do differently next time. - Will from Handy Help'),

('Invoice Sent', 'follow_up',
  'Hi {{customer_name}}, I''ve sent through the invoice for your recent lawn service. Payment details are in the email. Thanks! - Will from Handy Help'),

-- General templates
('Thank You - New Customer', 'general',
  'Hi {{customer_name}}, thanks for choosing Handy Help for your lawn care! I''ll be in touch soon to do an initial assessment. - Will'),

('General Update', 'general',
  'Hi {{customer_name}}, {{message}}. - Will from Handy Help');

-- =====================================================
-- VIEWS
-- =====================================================

-- Recent messages with customer info
CREATE VIEW recent_messages AS
SELECT
  m.id,
  m.customer_id,
  c.name as customer_name,
  m.phone_number,
  m.message_body,
  m.direction,
  m.status,
  m.context_type,
  m.created_at,
  m.sent_at,
  m.delivered_at,
  m.read_at
FROM messages m
LEFT JOIN customers c ON m.customer_id = c.id
ORDER BY m.created_at DESC;

-- Message statistics
CREATE VIEW message_stats AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_messages,
  COUNT(CASE WHEN direction = 'outbound' THEN 1 END) as sent_messages,
  COUNT(CASE WHEN direction = 'inbound' THEN 1 END) as received_messages,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
FROM messages
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_messages ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for admin operations)
CREATE POLICY messages_service_access ON messages FOR ALL USING (true);
CREATE POLICY templates_service_access ON message_templates FOR ALL USING (true);
CREATE POLICY bulk_messages_service_access ON bulk_messages FOR ALL USING (true);

-- =====================================================
-- SUCCESS!
-- =====================================================
-- WhatsApp messaging tables created successfully.
--
-- Tables added:
-- - messages: Store all sent/received messages
-- - message_templates: Pre-defined message templates
-- - bulk_messages: Track bulk message batches
--
-- Default templates added for:
-- - Visit reminders
-- - On the way notifications
-- - Delay notifications
-- - Weather-related updates
-- - Sick day notices
-- - Follow-up messages
