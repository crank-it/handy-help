// Core types
export type LawnSize = 'small' | 'medium' | 'large'
export type Package = 'standard' | 'premium'

/** @deprecated Season is deprecated for new bookings. Kept for historical data compatibility only. */
export type Season = 'summer' | 'autumn' | 'winter' | 'spring'

export type VisitStatus = 'scheduled' | 'completed' | 'skipped' | 'rescheduled'

export type CustomerStatus =
  | 'pending_inspection'    // New: Initial booking, waiting for inspection
  | 'inspection_scheduled'  // New: Inspection time booked
  | 'proposal_sent'         // New: Proposal created and sent to customer
  | 'active'                // Existing: Proposal accepted, service active
  | 'paused'                // Existing: Service temporarily paused
  | 'cancelled'             // Existing: Service cancelled
  | 'pending_assessment'    // Legacy: Keep for old records

export type PaymentMethod = 'bank_transfer' | 'cash'
export type PaymentStatus = 'pending' | 'paid'

// Service selection types
export type Service = 'lawn_clearing' | 'edge_trimming' | 'hedging' | 'other'

// Future: Service types for platform expansion
export type ServiceType = 'lawn_care' | 'gardening' | 'cleaning' | 'handyman'

// Scheduling
export interface ScheduledVisit {
  date: Date
  season: Season
  frequency: string
}

export interface PricingInfo {
  perVisit: number
  estimatedAnnualVisits: number
  estimatedAnnualCost: number
}

// Database entities
export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  address: string
  suburb?: string

  // Service selection (new booking flow)
  services?: Service[]
  other_service_description?: string

  // Lawn details (determined after inspection)
  lawn_size?: LawnSize
  package_type?: Package

  special_instructions?: string
  status: CustomerStatus
  start_date?: string

  // Portal access
  url_slug?: string

  // Inspection tracking
  inspection_booked_at?: string
  proposal_accepted_at?: string

  // Performance metrics
  average_completion_time?: number // in minutes
  total_visits?: number
  completed_visits?: number
  total_paid_cents?: number

  created_at: string
  updated_at?: string
}

export interface Visit {
  id: string
  customer_id: string
  customer_name?: string
  customer_address?: string
  customer_suburb?: string
  lawn_size?: LawnSize
  package_type?: Package
  scheduled_date: string
  scheduled_time?: 'morning' | 'afternoon'
  status: VisitStatus
  estimated_duration_minutes?: number
  price_cents: number
  season?: Season

  // Completion tracking
  completed_at?: string
  actual_start_time?: string
  actual_end_time?: string
  actual_duration_minutes?: number
  completion_notes?: string

  // Issues tracking
  property_issues?: string
  customer_issues?: string

  created_at: string
  updated_at?: string
}

export interface Payment {
  id: string
  customer_id: string
  visit_id?: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  reference?: string
  notes?: string
  paid_at?: string
  created_at: string
}

// Proposals
export interface Proposal {
  id: string
  customer_id: string
  token: string

  // Proposal details (determined after inspection)
  lawn_size: LawnSize
  package_type: Package
  visit_frequency_days: number
  price_per_visit_cents: number
  estimated_annual_visits: number

  // Additional services and notes
  included_services: string[]
  notes?: string
  custom_message?: string

  // Status tracking
  status: 'sent' | 'accepted' | 'rejected' | 'expired'
  accepted_at?: string
  expires_at: string

  created_at: string
  updated_at?: string
}

// Property Assessment
export interface AssessmentPhoto {
  id: string
  url: string
  category: 'entry' | 'overview' | 'obstacles' | 'avoid_areas' | 'general'
  caption?: string
  timestamp: string
}

export interface PropertyAssessment {
  id: string
  customer_id: string

  // Access & Entry
  access_gate_code?: string
  access_key_location?: string
  access_parking_spot?: string
  access_entry_point?: string
  access_lock_type?: string
  access_notes?: string

  // Lawn Assessment
  lawn_boundaries_clear: boolean
  lawn_irrigation_location?: string
  lawn_slopes_noted: boolean
  lawn_condition?: 'excellent' | 'good' | 'fair' | 'poor'

  // Obstacles & Hazards
  obstacles_heavy_objects: string[]
  obstacles_fixed: string[]
  obstacles_hazards: string[]
  obstacles_pet_considerations?: string
  obstacles_moving_instructions?: string

  // Areas to Avoid
  avoid_garden_beds: string[]
  avoid_delicate_plants: string[]
  avoid_no_mow_zones: string[]
  avoid_sprinkler_locations: string[]

  // Service Requirements
  service_clipping_disposal: 'compost' | 'green_bin' | 'take_away' | 'leave'
  service_equipment_needed: string[]
  service_special_requests?: string
  service_estimated_time?: number

  // Photos
  photos: AssessmentPhoto[]

  // Metadata
  assessed_by: string
  assessed_at: string
  notes?: string
}

// Portal Messages
export interface PortalMessage {
  id: string
  customer_id: string
  sender: 'customer' | 'admin'
  message: string
  created_at: string
}

// Redwoods Lane Jobs (one-off residential jobs)
export interface RedwoodsJob {
  id: string
  customer_id: string
  scheduled_date: string
  scheduled_time?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  price_cents: number
  duration_minutes?: number
  notes?: string
  payment_status: 'pending' | 'paid'
  completed_at?: string
  created_at: string
  updated_at?: string
}

// UI Types
export interface MessageRecipient {
  id: string
  name: string
  phone: string
  address?: string
}

// Messaging Types
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
export type MessageContextType = 'visit_reminder' | 'visit_confirmation' | 'proposal' | 'general' | 'bulk'
export type TemplateCategory = 'reminder' | 'confirmation' | 'proposal' | 'general' | 'marketing'

export interface Message {
  id: string
  customer_id?: string
  customer_name?: string
  phone_number: string
  message_body: string
  template_id?: string
  direction: 'outbound' | 'inbound'
  status: MessageStatus
  whatsapp_message_id?: string
  context_type?: MessageContextType
  context_id?: string
  bulk_message_id?: string
  error_message?: string
  sent_at?: string
  delivered_at?: string
  read_at?: string
  created_at: string
  updated_at?: string
}

export interface MessageTemplate {
  id: string
  name: string
  category: TemplateCategory
  template_body: string
  whatsapp_template_name?: string
  whatsapp_template_namespace?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface BulkMessage {
  id: string
  message_body: string
  template_id?: string
  status: 'pending' | 'sending' | 'completed' | 'partial_failure'
  total_recipients: number
  sent_count: number
  delivered_count: number
  failed_count: number
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at?: string
}
