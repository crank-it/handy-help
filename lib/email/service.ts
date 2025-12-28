// Email Service - Handles sending emails (currently via Resend or generic SMTP)

export interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'smtp'
  apiKey?: string
  from: string
}

function getEmailConfig(): EmailConfig | null {
  // Check for Resend
  if (process.env.RESEND_API_KEY) {
    return {
      provider: 'resend',
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || 'noreply@handyhelp.nz',
    }
  }

  // Check for SendGrid
  if (process.env.SENDGRID_API_KEY) {
    return {
      provider: 'sendgrid',
      apiKey: process.env.SENDGRID_API_KEY,
      from: process.env.EMAIL_FROM || 'noreply@handyhelp.nz',
    }
  }

  // Check for generic SMTP
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return {
      provider: 'smtp',
      from: process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@handyhelp.nz',
    }
  }

  return null
}

// Send email via Resend
async function sendViaResend(
  config: EmailConfig,
  to: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.from,
        to: [to],
        subject,
        html,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    return {
      success: true,
      messageId: data.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Send email via SendGrid
async function sendViaSendGrid(
  config: EmailConfig,
  to: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: config.from },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      return {
        success: false,
        error: data.errors?.[0]?.message || `HTTP ${response.status}: ${response.statusText}`,
      }
    }

    // SendGrid returns 202 Accepted with no body on success
    return {
      success: true,
      messageId: response.headers.get('x-message-id') || undefined,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Main send function
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  const config = getEmailConfig()

  if (!config) {
    console.warn('Email service not configured - email would be sent to:', to)
    console.warn('Subject:', subject)
    return {
      success: false,
      error: 'Email service not configured. Please add RESEND_API_KEY or SENDGRID_API_KEY to environment variables.',
    }
  }

  if (config.provider === 'resend') {
    return sendViaResend(config, to, subject, html)
  }

  if (config.provider === 'sendgrid') {
    return sendViaSendGrid(config, to, subject, html)
  }

  // SMTP fallback (not implemented yet)
  return {
    success: false,
    error: 'SMTP provider not yet implemented',
  }
}

