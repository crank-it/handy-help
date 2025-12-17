// POST /api/messages/send - Send WhatsApp message to one or more customers
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendWhatsAppMessage, replaceTemplateVariables, isWhatsAppConfigured } from '@/lib/whatsapp'
import {
  createMessage,
  createBulkMessage,
  updateMessageStatus,
  updateBulkMessageStats,
  getTemplate,
} from '@/lib/data/messages'
import type { MessageContextType, Customer } from '@/types'

interface SendMessageBody {
  // Recipients - can use either customer IDs or direct phone numbers
  customerIds?: string[]
  phoneNumbers?: string[]

  // Message content
  message: string
  templateId?: string
  templateVariables?: Record<string, string>

  // Context
  contextType?: MessageContextType
  contextId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SendMessageBody

    // Validate request
    if (!body.customerIds?.length && !body.phoneNumbers?.length) {
      return NextResponse.json(
        { error: 'Either customerIds or phoneNumbers must be provided' },
        { status: 400 }
      )
    }

    if (!body.message && !body.templateId) {
      return NextResponse.json(
        { error: 'Either message or templateId must be provided' },
        { status: 400 }
      )
    }

    // Get message content
    let messageContent = body.message
    if (body.templateId) {
      const template = await getTemplate(body.templateId)
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        )
      }
      messageContent = template.template_body
    }

    // Build recipient list
    const recipients: Array<{
      customerId?: string
      customerName?: string
      phoneNumber: string
    }> = []

    // Add customers by ID
    if (body.customerIds?.length) {
      const supabase = await createClient()
      const { data: customers } = await supabase
        .from('customers')
        .select('id, name, phone')
        .in('id', body.customerIds)

      if (customers) {
        for (const customer of customers) {
          recipients.push({
            customerId: customer.id,
            customerName: customer.name,
            phoneNumber: customer.phone,
          })
        }
      }
    }

    // Add direct phone numbers
    if (body.phoneNumbers?.length) {
      for (const phone of body.phoneNumbers) {
        recipients.push({ phoneNumber: phone })
      }
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: 'No valid recipients found' },
        { status: 400 }
      )
    }

    // Check if WhatsApp is configured
    const whatsappConfigured = isWhatsAppConfigured()

    // Create bulk message record if multiple recipients
    let bulkMessageId: string | undefined
    if (recipients.length > 1) {
      const bulk = await createBulkMessage({
        message_body: messageContent,
        template_id: body.templateId,
        total_recipients: recipients.length,
      })
      bulkMessageId = bulk?.id

      if (bulkMessageId) {
        await updateBulkMessageStats(bulkMessageId, {
          status: 'sending',
          started_at: new Date().toISOString(),
        })
      }
    }

    // Send messages to all recipients
    const results: Array<{
      recipient: string
      success: boolean
      messageId?: string
      error?: string
    }> = []

    let sentCount = 0
    let failedCount = 0

    for (const recipient of recipients) {
      // Build variables for template
      const variables: Record<string, string> = {
        customer_name: recipient.customerName || 'Customer',
        ...body.templateVariables,
      }

      // Replace template variables
      const finalMessage = replaceTemplateVariables(messageContent, variables)

      // Create message record
      const message = await createMessage({
        customer_id: recipient.customerId,
        phone_number: recipient.phoneNumber,
        message_body: finalMessage,
        template_id: body.templateId,
        direction: 'outbound',
        context_type: body.contextType || (recipients.length > 1 ? 'bulk' : 'manual'),
        context_id: body.contextId,
        bulk_message_id: bulkMessageId,
      })

      if (!message) {
        results.push({
          recipient: recipient.phoneNumber,
          success: false,
          error: 'Failed to create message record',
        })
        failedCount++
        continue
      }

      // Send via WhatsApp (or simulate if not configured)
      if (whatsappConfigured) {
        const sendResult = await sendWhatsAppMessage(recipient.phoneNumber, finalMessage)

        if (sendResult.success) {
          await updateMessageStatus(message.id, 'sent', {
            whatsapp_message_id: sendResult.messageId,
            sent_at: new Date().toISOString(),
          })
          sentCount++
          results.push({
            recipient: recipient.phoneNumber,
            success: true,
            messageId: message.id,
          })
        } else {
          await updateMessageStatus(message.id, 'failed', {
            error_message: sendResult.error,
          })
          failedCount++
          results.push({
            recipient: recipient.phoneNumber,
            success: false,
            error: sendResult.error,
          })
        }
      } else {
        // WhatsApp not configured - mark as pending for later
        // This allows testing the UI without actual WhatsApp integration
        await updateMessageStatus(message.id, 'pending', {
          error_message: 'WhatsApp API not configured - message queued',
        })
        results.push({
          recipient: recipient.phoneNumber,
          success: true, // Success from UI perspective
          messageId: message.id,
          error: 'WhatsApp not configured - message saved but not sent',
        })
        sentCount++
      }
    }

    // Update bulk message stats
    if (bulkMessageId) {
      await updateBulkMessageStats(bulkMessageId, {
        sent_count: sentCount,
        failed_count: failedCount,
        status: failedCount === recipients.length
          ? 'partial_failure'
          : failedCount > 0
            ? 'partial_failure'
            : 'completed',
        completed_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      totalRecipients: recipients.length,
      sent: sentCount,
      failed: failedCount,
      bulkMessageId,
      results,
      whatsappConfigured,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
