// Email Templates - HTML templates for proposal emails

interface ProposalEmailData {
  customerName: string
  address: string
  suburb?: string
  lawnSize: string
  packageType: string
  visitFrequencyDays: number
  pricePerVisit: number
  estimatedAnnualVisits: number
  estimatedAnnualCost: number
  includedServices: string[]
  notes?: string
  customMessage?: string
  proposalUrl: string
  expiryDate: string
}

const SERVICE_LABELS: Record<string, string> = {
  lawn_clearing: '🌱 Lawn Clearing',
  edge_trimming: '✂️ Edge Trimming',
  hedging: '🌿 Hedging',
  other: '🔧 Other Services',
}

export function generateProposalEmail(data: ProposalEmailData): string {
  const servicesHtml = data.includedServices
    .map(service => `
      <div style="padding: 8px 12px; background: #e8f5e9; border-radius: 6px; display: inline-block; margin: 4px;">
        <span style="color: #2e7d32; font-weight: 600;">${SERVICE_LABELS[service] || service}</span>
      </div>
    `)
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Lawn Care Proposal</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                🌿 Your Lawn Care Proposal
              </h1>
              <p style="margin: 10px 0 0 0; color: #e8f5e9; font-size: 18px;">
                From Handy Help NZ
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0 0 15px 0; color: #333; font-size: 16px; line-height: 1.6;">
                Hi <strong>${data.customerName}</strong>,
              </p>
              <p style="margin: 0 0 15px 0; color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for your interest in our lawn care services! We've prepared a customized proposal for your property at <strong>${data.address}${data.suburb ? `, ${data.suburb}` : ''}</strong>.
              </p>
              ${data.customMessage ? `
              <div style="background: #e3f2fd; border-left: 4px solid #1976d2; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #1565c0; font-size: 15px; line-height: 1.6;">
                  ${data.customMessage.replace(/\n/g, '<br>')}
                </p>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Service Details -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #2e7d32; font-size: 22px; font-weight: 700;">
                📋 Service Details
              </h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                <tr style="background: #f5f5f5;">
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 14px;">
                    Property
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-weight: 600; text-align: right; font-size: 14px;">
                    ${data.address}${data.suburb ? `, ${data.suburb}` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 14px;">
                    Lawn Size
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-weight: 600; text-align: right; font-size: 14px; text-transform: capitalize;">
                    ${data.lawnSize}
                  </td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666; font-size: 14px;">
                    Package
                  </td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-weight: 600; text-align: right; font-size: 14px; text-transform: capitalize;">
                    ${data.packageType}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; color: #666; font-size: 14px;">
                    Visit Frequency
                  </td>
                  <td style="padding: 12px 15px; color: #333; font-weight: 600; text-align: right; font-size: 14px;">
                    Every ${data.visitFrequencyDays} days
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Included Services -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="margin: 0 0 12px 0; color: #2e7d32; font-size: 18px; font-weight: 600;">
                ✅ Included Services
              </h3>
              <div style="line-height: 1.8;">
                ${servicesHtml}
              </div>
            </td>
          </tr>

          ${data.notes ? `
          <!-- Notes -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h3 style="margin: 0 0 12px 0; color: #2e7d32; font-size: 18px; font-weight: 600;">
                📝 Additional Notes
              </h3>
              <p style="margin: 0; color: #555; font-size: 15px; line-height: 1.6;">
                ${data.notes.replace(/\n/g, '<br>')}
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Pricing -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 10px; padding: 25px; border: 2px solid #2e7d32;">
                <h2 style="margin: 0 0 20px 0; color: #1b5e20; font-size: 22px; font-weight: 700; text-align: center;">
                  💰 Pricing
                </h2>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0; color: #1b5e20; font-size: 18px; font-weight: 600;">
                      Price per visit
                    </td>
                    <td style="padding: 10px 0; color: #1b5e20; font-size: 28px; font-weight: 700; text-align: right; font-family: 'Courier New', monospace;">
                      $${data.pricePerVisit.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 10px 0; border-top: 1px solid #81c784;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 5px 0; color: #2e7d32; font-size: 14px;">
                            Estimated visits per year
                          </td>
                          <td style="padding: 5px 0; color: #1b5e20; font-weight: 600; text-align: right; font-size: 14px;">
                            ~${data.estimatedAnnualVisits} visits
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 0 0 0; border-top: 2px solid #2e7d32; color: #1b5e20; font-size: 18px; font-weight: 600;">
                      Estimated annual cost
                    </td>
                    <td style="padding: 15px 0 0 0; border-top: 2px solid #2e7d32; color: #1b5e20; font-size: 28px; font-weight: 700; text-align: right; font-family: 'Courier New', monospace;">
                      $${data.estimatedAnnualCost.toFixed(2)}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 0 5px 0 0;">
                    <a href="${data.proposalUrl}" style="display: block; background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); color: #ffffff; text-decoration: none; padding: 16px 24px; border-radius: 8px; font-weight: 700; font-size: 16px; text-align: center; box-shadow: 0 4px 6px rgba(46, 125, 50, 0.3);">
                      ✅ View Full Proposal
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 15px 0 0 0; color: #666; font-size: 13px; text-align: center;">
                Click the button above to view your complete proposal and accept or decline.
              </p>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <div style="background: #fff3e0; border-left: 4px solid #f57c00; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #e65100; font-size: 14px;">
                  ⏰ <strong>This proposal expires on ${data.expiryDate}</strong>
                </p>
              </div>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 20px 30px 30px 30px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #333; font-size: 15px; font-weight: 600;">
                Questions about your proposal?
              </p>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                📧 <a href="mailto:contact@handyhelp.nz" style="color: #2e7d32; text-decoration: none;">contact@handyhelp.nz</a>
                <br>
                📱 <a href="tel:0221234567" style="color: #2e7d32; text-decoration: none;">022 123 4567</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f5f5f5; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 5px 0; color: #2e7d32; font-weight: 700; font-size: 16px;">
                Handy Help NZ
              </p>
              <p style="margin: 0; color: #999; font-size: 12px;">
                Professional Lawn Care Services
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

// Generate acceptance confirmation email
export function generateAcceptanceEmail(customerName: string, address: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal Accepted!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 10px;">🎉</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Thank You!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px 0; color: #333; font-size: 18px; line-height: 1.6;">
                Hi <strong>${customerName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                We've received your proposal acceptance for <strong>${address}</strong>.
              </p>
              <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">
                We're excited to start taking care of your lawn! Our team will be in touch shortly to schedule your first visit.
              </p>
              <div style="background: #e8f5e9; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0; color: #1b5e20; font-size: 15px; line-height: 1.6;">
                  <strong>What happens next?</strong><br>
                  • We'll contact you within 24 hours<br>
                  • Schedule your first lawn care visit<br>
                  • Answer any questions you may have
                </p>
              </div>
              <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">
                Questions? Contact us at <a href="mailto:contact@handyhelp.nz" style="color: #2e7d32;">contact@handyhelp.nz</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background: #f5f5f5; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #2e7d32; font-weight: 700;">Handy Help NZ</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

