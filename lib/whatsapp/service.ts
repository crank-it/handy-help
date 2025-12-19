// WhatsApp Service - Handles sending messages via WhatsApp Business API
import { getWhatsAppConfig, formatPhoneNumber, type WhatsAppConfig } from './config'

export interface SendMessageResult {
  success: boolean
  messageId?: string
  error?: string
}

interface MetaWhatsAppResponse {
  messaging_product: string
  contacts: { input: string; wa_id: string }[]
  messages: { id: string }[]
}

interface TwilioWhatsAppResponse {
  sid: string
  status: string
  error_code?: number
  error_message?: string
}

// Send a message via Meta WhatsApp Business API
async function sendViaMeta(
  config: NonNullable<WhatsAppConfig['meta']>,
  to: string,
  message: string
): Promise<SendMessageResult> {
  const url = `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to.replace('+', ''), // Meta API expects without +
        type: 'text',
        text: {
          preview_url: false,
          body: message,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    const data = (await response.json()) as MetaWhatsAppResponse
    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Send a message via Twilio WhatsApp
async function sendViaTwilio(
  config: NonNullable<WhatsAppConfig['twilio']>,
  to: string,
  message: string
): Promise<SendMessageResult> {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`

  // Twilio WhatsApp requires 'whatsapp:' prefix
  const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
  const fromNumber = config.fromNumber.startsWith('whatsapp:')
    ? config.fromNumber
    : `whatsapp:${config.fromNumber}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${config.accountSid}:${config.authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: toNumber,
        From: fromNumber,
        Body: message,
      }).toString(),
    })

    const data = (await response.json()) as TwilioWhatsAppResponse

    if (data.error_code) {
      return {
        success: false,
        error: data.error_message || `Twilio error: ${data.error_code}`,
      }
    }

    return {
      success: true,
      messageId: data.sid,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Main send function - dispatches to the appropriate provider
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<SendMessageResult> {
  const config = getWhatsAppConfig()

  if (!config) {
    return {
      success: false,
      error: 'WhatsApp is not configured. Please add API credentials to environment variables.',
    }
  }

  // Format phone number to E.164
  const formattedPhone = formatPhoneNumber(to)

  if (config.provider === 'meta' && config.meta) {
    return sendViaMeta(config.meta, formattedPhone, message)
  }

  if (config.provider === 'twilio' && config.twilio) {
    return sendViaTwilio(config.twilio, formattedPhone, message)
  }

  return {
    success: false,
    error: 'Invalid WhatsApp configuration',
  }
}

// Send message to multiple recipients
export async function sendBulkWhatsAppMessages(
  recipients: { phone: string; message: string }[]
): Promise<{ phone: string; result: SendMessageResult }[]> {
  const results = await Promise.all(
    recipients.map(async ({ phone, message }) => ({
      phone,
      result: await sendWhatsAppMessage(phone, message),
    }))
  )

  return results
}

// Replace template variables in a message
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template

  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  }

  return result
}

// Common template variable builders
export function buildCustomerVariables(customer: {
  name: string
  address?: string
  suburb?: string
}): Record<string, string> {
  return {
    customer_name: customer.name,
    address: customer.address || '',
    suburb: customer.suburb || '',
  }
}

export function buildVisitVariables(visit: {
  scheduled_date: string
  scheduled_time?: string
}): Record<string, string> {
  const date = new Date(visit.scheduled_date)
  return {
    date: date.toLocaleDateString('en-NZ', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }),
    time: visit.scheduled_time === 'morning' ? 'morning' : 'afternoon',
  }
}
