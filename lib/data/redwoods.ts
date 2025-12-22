import { createClient } from '@/lib/supabase/server'
import { RedwoodsCustomer, RedwoodsJob } from '@/types'

// Customers
export async function getRedwoodsCustomers(): Promise<RedwoodsCustomer[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('redwoods_customers')
    .select('*')
    .order('house_number', { ascending: true })
  
  if (error) {
    console.error('Error fetching Redwoods customers:', error)
    throw error
  }
  
  return data || []
}

export async function getRedwoodsCustomer(id: string): Promise<RedwoodsCustomer | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('redwoods_customers')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching Redwoods customer:', error)
    return null
  }
  
  return data
}

export async function createRedwoodsCustomer(customer: Omit<RedwoodsCustomer, 'id' | 'created_at' | 'updated_at'>): Promise<RedwoodsCustomer> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('redwoods_customers')
    .insert(customer)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating Redwoods customer:', error)
    throw error
  }
  
  return data
}

export async function updateRedwoodsCustomer(id: string, updates: Partial<RedwoodsCustomer>): Promise<RedwoodsCustomer> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('redwoods_customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating Redwoods customer:', error)
    throw error
  }
  
  return data
}

export async function deleteRedwoodsCustomer(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('redwoods_customers')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting Redwoods customer:', error)
    throw error
  }
}

// Jobs
export async function getRedwoodsJobs(customerId?: string): Promise<RedwoodsJob[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('redwoods_jobs')
    .select(`
      *,
      redwoods_customers!inner(customer_name, house_number)
    `)
  
  if (customerId) {
    query = query.eq('customer_id', customerId)
  }
  
  query = query.order('scheduled_date', { ascending: false })
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching Redwoods jobs:', error)
    throw error
  }
  
  // Flatten the customer data
  return (data || []).map(job => ({
    ...job,
    customer_name: job.redwoods_customers?.customer_name,
    house_number: job.redwoods_customers?.house_number,
    redwoods_customers: undefined
  }))
}

export async function getRedwoodsJob(id: string): Promise<RedwoodsJob | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('redwoods_jobs')
    .select(`
      *,
      redwoods_customers!inner(customer_name, house_number)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching Redwoods job:', error)
    return null
  }
  
  return {
    ...data,
    customer_name: data.redwoods_customers?.customer_name,
    house_number: data.redwoods_customers?.house_number,
    redwoods_customers: undefined
  }
}

export async function createRedwoodsJob(job: Omit<RedwoodsJob, 'id' | 'created_at' | 'updated_at' | 'customer_name' | 'house_number'>): Promise<RedwoodsJob> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('redwoods_jobs')
    .insert(job)
    .select(`
      *,
      redwoods_customers!inner(customer_name, house_number)
    `)
    .single()
  
  if (error) {
    console.error('Error creating Redwoods job:', error)
    throw error
  }
  
  return {
    ...data,
    customer_name: data.redwoods_customers?.customer_name,
    house_number: data.redwoods_customers?.house_number,
    redwoods_customers: undefined
  }
}

export async function updateRedwoodsJob(id: string, updates: Partial<RedwoodsJob>): Promise<RedwoodsJob> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('redwoods_jobs')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      redwoods_customers!inner(customer_name, house_number)
    `)
    .single()
  
  if (error) {
    console.error('Error updating Redwoods job:', error)
    throw error
  }
  
  return {
    ...data,
    customer_name: data.redwoods_customers?.customer_name,
    house_number: data.redwoods_customers?.house_number,
    redwoods_customers: undefined
  }
}

export async function deleteRedwoodsJob(id: string): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('redwoods_jobs')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting Redwoods job:', error)
    throw error
  }
}

// Stats
export async function getRedwoodsStats() {
  const supabase = await createClient()
  
  // Get active customers count
  const { count: activeCustomers } = await supabase
    .from('redwoods_customers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
  
  // Get upcoming jobs count
  const today = new Date().toISOString().split('T')[0]
  const { count: upcomingJobs } = await supabase
    .from('redwoods_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'scheduled')
    .gte('scheduled_date', today)
  
  // Get completed jobs this month
  const firstDayOfMonth = new Date()
  firstDayOfMonth.setDate(1)
  const firstDayStr = firstDayOfMonth.toISOString().split('T')[0]
  
  const { count: completedThisMonth } = await supabase
    .from('redwoods_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gte('scheduled_date', firstDayStr)
  
  // Get total earnings this month
  const { data: earningsData } = await supabase
    .from('redwoods_jobs')
    .select('price_cents')
    .eq('status', 'completed')
    .eq('payment_status', 'paid')
    .gte('scheduled_date', firstDayStr)
  
  const totalEarnings = earningsData?.reduce((sum, job) => sum + (job.price_cents || 0), 0) || 0
  
  return {
    activeCustomers: activeCustomers || 0,
    upcomingJobs: upcomingJobs || 0,
    completedThisMonth: completedThisMonth || 0,
    earningsThisMonth: totalEarnings
  }
}

