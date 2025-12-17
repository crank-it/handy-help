import { createClient } from '@/lib/supabase/server'
import { Visit } from '@/types'

export async function getVisits(filters?: {
  startDate?: string
  endDate?: string
  customerId?: string
  status?: string
}): Promise<Visit[]> {
  const supabase = await createClient()

  let query = supabase
    .from('visits')
    .select(`
      *,
      customers (
        id,
        name,
        address,
        suburb,
        lawn_size,
        package_type
      )
    `)

  if (filters?.startDate) {
    query = query.gte('scheduled_date', filters.startDate)
  }
  if (filters?.endDate) {
    query = query.lte('scheduled_date', filters.endDate)
  }
  if (filters?.customerId) {
    query = query.eq('customer_id', filters.customerId)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  query = query.order('scheduled_date', { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching visits:', error)
    return []
  }

  return data.map((visit) => ({
    id: visit.id,
    customer_id: visit.customer_id,
    customer_name: visit.customers?.name || 'Unknown',
    customer_address: visit.customers?.address || '',
    customer_suburb: visit.customers?.suburb,
    lawn_size: visit.customers?.lawn_size || 'medium',
    package_type: visit.customers?.package_type || 'standard',
    scheduled_date: visit.scheduled_date,
    status: visit.status,
    estimated_duration_minutes: visit.estimated_duration_minutes,
    actual_start_time: visit.actual_start_time,
    actual_end_time: visit.actual_end_time,
    actual_duration_minutes: visit.actual_duration_minutes,
    price_cents: visit.price_cents,
    season: visit.season,
    completion_notes: visit.completion_notes,
    property_issues: visit.property_issues,
    customer_issues: visit.customer_issues,
    created_at: visit.created_at,
    updated_at: visit.updated_at,
  }))
}

export async function getTodaysVisits(): Promise<Visit[]> {
  const today = new Date().toISOString().split('T')[0]
  return getVisits({ startDate: today, endDate: today })
}

export async function getUpcomingVisits(limit: number = 10): Promise<Visit[]> {
  const today = new Date().toISOString().split('T')[0]
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      customers (
        id,
        name,
        address,
        suburb,
        lawn_size,
        package_type
      )
    `)
    .gte('scheduled_date', today)
    .eq('status', 'scheduled')
    .order('scheduled_date', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching upcoming visits:', error)
    return []
  }

  return data.map((visit) => ({
    id: visit.id,
    customer_id: visit.customer_id,
    customer_name: visit.customers?.name || 'Unknown',
    customer_address: visit.customers?.address || '',
    customer_suburb: visit.customers?.suburb,
    lawn_size: visit.customers?.lawn_size || 'medium',
    package_type: visit.customers?.package_type || 'standard',
    scheduled_date: visit.scheduled_date,
    status: visit.status,
    estimated_duration_minutes: visit.estimated_duration_minutes,
    actual_start_time: visit.actual_start_time,
    actual_end_time: visit.actual_end_time,
    actual_duration_minutes: visit.actual_duration_minutes,
    price_cents: visit.price_cents,
    season: visit.season,
    completion_notes: visit.completion_notes,
    property_issues: visit.property_issues,
    customer_issues: visit.customer_issues,
    created_at: visit.created_at,
    updated_at: visit.updated_at,
  }))
}

export async function updateVisit(
  visitId: string,
  updates: Partial<Visit>
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('visits')
    .update(updates)
    .eq('id', visitId)

  if (error) {
    console.error('Error updating visit:', error)
    return false
  }

  return true
}

export async function markVisitComplete(
  visitId: string,
  data: {
    actual_start_time?: string
    actual_end_time?: string
    actual_duration_minutes?: number
    completion_notes?: string
    property_issues?: string
    customer_issues?: string
  }
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('visits')
    .update({
      status: 'completed',
      ...data,
    })
    .eq('id', visitId)

  if (error) {
    console.error('Error marking visit complete:', error)
    return false
  }

  return true
}
