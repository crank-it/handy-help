export function generateAcceptanceEmail(
  customerName: string,
  customerAddress: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Handy Help!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background-color: #2d5a27; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Welcome to Handy Help!</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
        Hi ${customerName},
      </p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
        Thank you for accepting our proposal! We're thrilled to be taking care of your lawn at:
      </p>
      
      <div style="background-color: #f0f7ef; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 16px; color: #2d5a27; margin: 0; font-weight: 600;">
          📍 ${customerAddress}
        </p>
      </div>
      
      <h2 style="font-size: 20px; color: #2d5a27; margin-bottom: 15px;">What happens next?</h2>
      
      <div style="margin-bottom: 20px;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <span style="background-color: #2d5a27; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">1</span>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            <strong>We've scheduled your visits</strong> - A full year of lawn care is now in our system
          </p>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <span style="background-color: #2d5a27; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">2</span>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            <strong>We'll text you reminders</strong> - You'll get a message the day before each visit
          </p>
        </div>
        
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <span style="background-color: #2d5a27; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">3</span>
          <p style="margin: 0; color: #555; line-height: 1.5;">
            <strong>Sit back and relax</strong> - You don't need to be home, we'll take care of everything
          </p>
        </div>
      </div>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        If you have any questions, just reply to this email or give us a call!
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="font-size: 14px; color: #888; margin: 0;">
        Handy Help NZ - Local help you can count on
      </p>
      <p style="font-size: 12px; color: #aaa; margin: 10px 0 0 0;">
        📞 022 123 4567 | 📧 contact@handyhelp.nz
      </p>
    </div>
  </div>
</body>
</html>
`
}

export function generateProposalEmail(
  customerName: string,
  proposalUrl: string,
  packageType: string,
  priceCents: number
): string {
  const priceFormatted = `$${(priceCents / 100).toFixed(2)}`
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Lawn Care Proposal</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background-color: #2d5a27; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your Lawn Care Proposal</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
        Hi ${customerName},
      </p>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
        Thank you for your interest in Handy Help! We've put together a personalized lawn care proposal for you.
      </p>
      
      <div style="background-color: #f0f7ef; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="color: #2d5a27; margin: 0 0 10px 0;">${packageType} Package</h3>
        <p style="font-size: 24px; color: #2d5a27; margin: 0; font-weight: bold;">${priceFormatted} per visit</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${proposalUrl}" style="background-color: #2d5a27; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: 600; display: inline-block;">
          View Full Proposal
        </a>
      </div>
      
      <p style="font-size: 14px; color: #888; text-align: center;">
        This proposal is valid for 14 days
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="font-size: 14px; color: #888; margin: 0;">
        Handy Help NZ - Local help you can count on
      </p>
    </div>
  </div>
</body>
</html>
`
}

