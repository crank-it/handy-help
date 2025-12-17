// Core types
export type LawnSize = 'small' | 'medium' | 'large'
export type Package = 'standard' | 'premium'
export type Season = 'summer' | 'autumn' | 'winter' | 'spring'
export type VisitStatus = 'scheduled' | 'completed' | 'skipped' | 'rescheduled'
export type CustomerStatus = 'pending_assessment' | 'active' | 'paused' | 'cancelled'
export type PaymentMethod = 'bank_transfer' | 'cash'
export type PaymentStatus = 'pending' | 'paid'

// Future: Service types for platform expansion
export type ServiceType = 'lawn_care' | 'gardening' | 'cleaning' | 'handyman'

// Booking flow
export interface BookingData {
  address: string
  suburb?: string
  lawnSize?: LawnSize
  package?: Package
  name?: string
  email?: string
  phone?: string
  notes?: string
  customerId?: string
}

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
  lawn_size: LawnSize
  package_type: Package
  special_instructions?: string
  status: CustomerStatus
  start_date?: string

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
