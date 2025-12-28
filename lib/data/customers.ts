import { createClient } from '@/lib/supabase/server'
import { Customer } from '@/types'

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      visits (
        id,
        scheduled_date,
        status,
        price_cents
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }

  return data.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    suburb: customer.suburb,
    lawn_size: customer.lawn_size,
    package_type: customer.package_type,
    status: customer.status,
    special_instructions: customer.special_instructions,
    start_date: customer.start_date,
    created_at: customer.created_at,
    total_visits: customer.visits.length,
    completed_visits: customer.visits.filter((v: any) => v.status === 'completed').length,
    total_paid_cents: customer.visits
      .filter((v: any) => v.status === 'completed')
      .reduce((sum: number, v: any) => sum + v.price_cents, 0),
  }))
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const supabase = await createClient()

  const { data: customer, error } = await supabase
    .from('customers')
    .select(`
      *,
      visits (
        id,
        scheduled_date,
        status,
        estimated_duration_minutes,
        actual_duration_minutes,
        price_cents,
        season,
        completion_notes,
        property_issues,
        customer_issues
      )
    `)
    .eq('id', id)
    .single()

  if (error || !customer) {
    console.error('Error fetching customer:', error)
    return null
  }

  const visits = customer.visits || []
  const completedVisits = visits.filter((v: any) => v.status === 'completed')

  // Calculate average completion time
  const totalDuration = completedVisits.reduce(
    (sum: number, v: any) => sum + (v.actual_duration_minutes || 0),
    0
  )
  const averageTime = completedVisits.length > 0
    ? Math.round(totalDuration / completedVisits.length)
    : undefined

  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    suburb: customer.suburb,
    lawn_size: customer.lawn_size,
    package_type: customer.package_type,
    status: customer.status,
    special_instructions: customer.special_instructions,
    start_date: customer.start_date,
    created_at: customer.created_at,
    total_visits: visits.length,
    completed_visits: completedVisits.length,
    total_paid_cents: completedVisits.reduce(
      (sum: number, v: any) => sum + v.price_cents,
      0
    ),
    average_completion_time: averageTime,
  }
}

export async function updateCustomerStatus(
  customerId: string,
  status: string
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('customers')
    .update({ status })
    .eq('id', customerId)

  if (error) {
    console.error('Error updating customer status:', error)
    return false
  }

  return true
}

export interface CreateCustomerInput {
  name: string
  email?: string
  phone: string
  address: string
  suburb?: string
  lawn_size?: 'small' | 'medium' | 'large'
  package_type?: 'standard' | 'premium'
  special_instructions?: string
  start_date?: string
  status?: string
}

export async function createCustomer(
  input: CreateCustomerInput
): Promise<{ success: boolean; customerId?: string; error?: string }> {
  const supabase = await createClient()

  const customerData = {
    name: input.name,
    email: input.email || null,
    phone: input.phone,
    address: input.address,
    suburb: input.suburb || null,
    lawn_size: input.lawn_size || null,
    package_type: input.package_type || null,
    special_instructions: input.special_instructions || null,
    start_date: input.start_date || null,
    status: input.status || 'pending_assessment',
  }

  const { data, error } = await supabase
    .from('customers')
    .insert(customerData)
    .select('id')
    .single()

  if (error) {
    console.error('Error creating customer:', error)
    return { success: false, error: error.message }
  }

  return { success: true, customerId: data.id }
}
