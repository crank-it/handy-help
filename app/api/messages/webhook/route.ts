// WhatsApp Webhook Handler
// Receives incoming messages and status updates from WhatsApp

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMessage, updateMessageStatus } from '@/lib/data/messages'
import { formatPhoneNumber } from '@/lib/whatsapp'

// Meta WhatsApp webhook verification (GET request)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Verify webhook with Meta
  if (mode === 'subscribe') {
    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

    if (token === verifyToken) {
      console.log('WhatsApp webhook verified')
      return new NextResponse(challenge, { status: 200 })
    } else {
      console.error('WhatsApp webhook verification failed')
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return new NextResponse('OK', { status: 200 })
}

// Handle incoming webhooks (POST request)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Determine which provider sent this webhook
    if (body.object === 'whatsapp_business_account') {
      // Meta WhatsApp Business API webhook
      await handleMetaWebhook(body)
    } else if (body.AccountSid) {
      // Twilio webhook
      await handleTwilioWebhook(body)
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Still return 200 to prevent retries
    return NextResponse.json({ success: true })
  }
}

// Handle Meta WhatsApp Business API webhooks
async function handleMetaWebhook(body: MetaWebhookBody) {
  const entries = body.entry || []

  for (const entry of entries) {
    const changes = entry.changes || []

    for (const change of changes) {
      if (change.field !== 'messages') continue

      const value = change.value
      const messages = value.messages || []
      const statuses = value.statuses || []

      // Handle incoming messages
      for (const message of messages) {
        await handleIncomingMessage({
          from: message.from,
          messageId: message.id,
          text: message.text?.body || message.button?.text || '',
          timestamp: message.timestamp,
        })
      }

      // Handle status updates
      for (const status of statuses) {
        await handleStatusUpdate({
          messageId: status.id,
          status: status.status,
          timestamp: status.timestamp,
        })
      }
    }
  }
}

// Handle Twilio webhooks
async function handleTwilioWebhook(body: TwilioWebhookBody) {
  const { From, Body, MessageSid, SmsStatus } = body

  if (SmsStatus) {
    // Status update
    await handleStatusUpdate({
      messageId: MessageSid,
      status: mapTwilioStatus(SmsStatus),
    })
  } else if (Body && From) {
    // Incoming message
    await handleIncomingMessage({
      from: From.replace('whatsapp:', ''),
      messageId: MessageSid,
      text: Body,
    })
  }
}

// Process incoming message
async function handleIncomingMessage(data: {
  from: string
  messageId: string
  text: string
  timestamp?: string
}) {
  const supabase = await createClient()

  // Try to find customer by phone number
  const formattedPhone = formatPhoneNumber(data.from)

  const { data: customer } = await supabase
    .from('customers')
    .select('id, name')
    .or(`phone.eq.${formattedPhone},phone.eq.${data.from}`)
    .single()

  // Create message record
  await createMessage({
    customer_id: customer?.id,
    phone_number: formattedPhone,
    message_body: data.text,
    direction: 'inbound',
    context_type: 'reply',
  })

  // Update message with WhatsApp ID and mark as delivered
  // (The message was created, now we'd update it with the external ID)

  console.log(`Received message from ${data.from}: ${data.text}`)
}

// Process status update
async function handleStatusUpdate(data: {
  messageId: string
  status: string
  timestamp?: string
}) {
  const supabase = await createClient()

  // Find message by WhatsApp message ID
  const { data: message } = await supabase
    .from('messages')
    .select('id')
    .eq('whatsapp_message_id', data.messageId)
    .single()

  if (!message) {
    console.log(`No message found for WhatsApp ID: ${data.messageId}`)
    return
  }

  // Map status and update
  const statusMap: Record<string, 'sent' | 'delivered' | 'read' | 'failed'> = {
    sent: 'sent',
    delivered: 'delivered',
    read: 'read',
    failed: 'failed',
  }

  const newStatus = statusMap[data.status]
  if (!newStatus) return

  const extras: Record<string, string> = {}
  if (newStatus === 'delivered') {
    extras.delivered_at = new Date().toISOString()
  } else if (newStatus === 'read') {
    extras.read_at = new Date().toISOString()
  }

  await updateMessageStatus(message.id, newStatus, extras)
}

// Map Twilio status to our status
function mapTwilioStatus(twilioStatus: string): string {
  const statusMap: Record<string, string> = {
    queued: 'pending',
    sent: 'sent',
    delivered: 'delivered',
    read: 'read',
    failed: 'failed',
    undelivered: 'failed',
  }
  return statusMap[twilioStatus] || twilioStatus
}

// Type definitions for webhooks
interface MetaWebhookBody {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      field: string
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          type: string
          text?: { body: string }
          button?: { text: string }
        }>
        statuses?: Array<{
          id: string
          status: string
          timestamp: string
          recipient_id: string
        }>
      }
    }>
  }>
}

interface TwilioWebhookBody {
  AccountSid: string
  From: string
  To: string
  Body?: string
  MessageSid: string
  SmsStatus?: string
}
