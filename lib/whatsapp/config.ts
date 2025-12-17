// WhatsApp Business API Configuration
// Supports both WhatsApp Business Cloud API (Meta) and Twilio WhatsApp

export type WhatsAppProvider = 'meta' | 'twilio'

export interface WhatsAppConfig {
  provider: WhatsAppProvider
  // Meta WhatsApp Business API
  meta?: {
    phoneNumberId: string
    businessAccountId: string
    accessToken: string
    apiVersion: string
  }
  // Twilio WhatsApp
  twilio?: {
    accountSid: string
    authToken: string
    fromNumber: string // Must be in format 'whatsapp:+1234567890'
  }
}

export function getWhatsAppConfig(): WhatsAppConfig | null {
  // Check for Meta WhatsApp Business API credentials
  if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
    return {
      provider: 'meta',
      meta: {
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
        businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
        accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
        apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
      },
    }
  }

  // Check for Twilio credentials
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return {
      provider: 'twilio',
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
      },
    }
  }

  return null
}

export function isWhatsAppConfigured(): boolean {
  return getWhatsAppConfig() !== null
}

// Convert NZ phone numbers to E.164 format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '')

  // Handle NZ numbers
  if (cleaned.startsWith('0')) {
    // NZ local format (021, 022, 027, etc.) -> +64
    cleaned = '64' + cleaned.substring(1)
  } else if (!cleaned.startsWith('64')) {
    // If it doesn't start with country code, assume NZ
    cleaned = '64' + cleaned
  }

  return '+' + cleaned
}

// Format for display
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.startsWith('64')) {
    // Format as NZ number: +64 21 123 4567
    const number = cleaned.substring(2)
    if (number.length === 9) {
      return `+64 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`
    }
    if (number.length === 10) {
      return `+64 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
    }
  }

  return phone
}
