// Message data access layer
import { createClient } from '@/lib/supabase/server'
import type {
  Message,
  MessageTemplate,
  BulkMessage,
  MessageContextType,
  MessageStatus,
  TemplateCategory,
} from '@/types'

// =====================================================
// Messages
// =====================================================

export async function getMessages(options?: {
  customerId?: string
  limit?: number
  offset?: number
  direction?: 'outbound' | 'inbound'
  status?: MessageStatus
}): Promise<Message[]> {
  const supabase = await createClient()

  let query = supabase
    .from('messages')
    .select(`
      *,
      customers (name)
    `)
    .order('created_at', { ascending: false })

  if (options?.customerId) {
    query = query.eq('customer_id', options.customerId)
  }

  if (options?.direction) {
    query = query.eq('direction', options.direction)
  }

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data.map((m) => ({
    ...m,
    customer_name: m.customers?.name,
  })) as Message[]
}

export async function getMessagesByCustomer(customerId: string): Promise<Message[]> {
  return getMessages({ customerId })
}

export async function getRecentMessages(limit: number = 50): Promise<Message[]> {
  return getMessages({ limit })
}

export async function createMessage(message: {
  customer_id?: string
  phone_number: string
  message_body: string
  template_id?: string
  direction: 'outbound' | 'inbound'
  context_type?: MessageContextType
  context_id?: string
  bulk_message_id?: string
}): Promise<Message | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .insert({
      ...message,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating message:', error)
    return null
  }

  return data as Message
}

export async function updateMessageStatus(
  messageId: string,
  status: MessageStatus,
  extras?: {
    whatsapp_message_id?: string
    error_message?: string
    sent_at?: string
    delivered_at?: string
    read_at?: string
  }
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('messages')
    .update({
      status,
      ...extras,
    })
    .eq('id', messageId)

  if (error) {
    console.error('Error updating message status:', error)
    return false
  }

  return true
}

// =====================================================
// Message Templates
// =====================================================

export async function getTemplates(options?: {
  category?: TemplateCategory
  activeOnly?: boolean
}): Promise<MessageTemplate[]> {
  const supabase = await createClient()

  let query = supabase
    .from('message_templates')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.activeOnly !== false) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }

  return data as MessageTemplate[]
}

export async function getTemplate(id: string): Promise<MessageTemplate | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('message_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching template:', error)
    return null
  }

  return data as MessageTemplate
}

export async function createTemplate(template: {
  name: string
  category: TemplateCategory
  template_body: string
  whatsapp_template_name?: string
  whatsapp_template_namespace?: string
}): Promise<MessageTemplate | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('message_templates')
    .insert(template)
    .select()
    .single()

  if (error) {
    console.error('Error creating template:', error)
    return null
  }

  return data as MessageTemplate
}

export async function updateTemplate(
  id: string,
  updates: Partial<MessageTemplate>
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('message_templates')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating template:', error)
    return false
  }

  return true
}

// =====================================================
// Bulk Messages
// =====================================================

export async function createBulkMessage(bulk: {
  message_body: string
  template_id?: string
  total_recipients: number
}): Promise<BulkMessage | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bulk_messages')
    .insert({
      ...bulk,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating bulk message:', error)
    return null
  }

  return data as BulkMessage
}

export async function updateBulkMessageStats(
  id: string,
  stats: {
    sent_count?: number
    delivered_count?: number
    failed_count?: number
    status?: 'pending' | 'sending' | 'completed' | 'partial_failure'
    started_at?: string
    completed_at?: string
  }
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('bulk_messages')
    .update(stats)
    .eq('id', id)

  if (error) {
    console.error('Error updating bulk message:', error)
    return false
  }

  return true
}

export async function getBulkMessages(limit: number = 20): Promise<BulkMessage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bulk_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching bulk messages:', error)
    return []
  }

  return data as BulkMessage[]
}

// =====================================================
// Message Statistics
// =====================================================

export async function getMessageStats(): Promise<{
  totalSent: number
  totalDelivered: number
  totalFailed: number
  todayCount: number
}> {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('messages')
    .select('status, created_at')
    .eq('direction', 'outbound')

  if (error) {
    console.error('Error fetching message stats:', error)
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      todayCount: 0,
    }
  }

  return {
    totalSent: data.filter((m) => m.status !== 'pending').length,
    totalDelivered: data.filter((m) => ['delivered', 'read'].includes(m.status)).length,
    totalFailed: data.filter((m) => m.status === 'failed').length,
    todayCount: data.filter((m) => m.created_at?.startsWith(today)).length,
  }
}

// =====================================================
// Customer Conversation History
// =====================================================

export async function getConversation(customerId: string): Promise<Message[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching conversation:', error)
    return []
  }

  return data as Message[]
}
