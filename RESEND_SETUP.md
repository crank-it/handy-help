# Resend Email Setup Guide

This guide will help you set up Resend to send proposal emails from your Handy Help application.

## Why Resend?

- ✅ **Simple** - Easy to set up and use
- ✅ **Reliable** - Built by the Vercel team
- ✅ **Great DX** - Modern API with TypeScript support
- ✅ **Free tier** - 3,000 emails/month free
- ✅ **Fast** - Optimized for transactional emails

## Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Click **Sign Up** (or **Get Started**)
3. Create an account (you can use GitHub to sign in)
4. Verify your email address

## Step 2: Get Your API Key

1. Once logged in, you'll be on the **API Keys** page
2. Click **Create API Key**
3. Give it a name like "Handy Help Production"
4. Select **Full access** (or **Sending access** if available)
5. Click **Create**
6. **Copy the API key** - You'll only see it once!
   - It will look like: `re_123abc456def789ghi`

## Step 3: Set Up Your Domain (Important!)

By default, Resend sends from `onboarding@resend.dev`, which works for testing but may end up in spam for production.

### Option A: Use Your Own Domain (Recommended for Production)

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `handyhelp.nz`
4. Resend will give you DNS records to add
5. Go to your domain registrar (where you bought handyhelp.nz)
6. Add the DNS records (usually MX, TXT, and CNAME records)
7. Wait for verification (can take a few minutes to 48 hours)
8. Once verified, you can send from `noreply@handyhelp.nz`

### Option B: Use Resend's Testing Domain (Quick Start)

For testing, you can use `onboarding@resend.dev`:
- No domain setup needed
- Works immediately
- Good for development and testing
- May have deliverability issues in production

## Step 4: Add Environment Variables

### Local Development (.env.local)

Create or update `/Users/home/Dev/handy-help/.env.local`:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here

# Email sender address
# Option 1: Use your verified domain
EMAIL_FROM=noreply@handyhelp.nz

# Option 2: Use Resend's test domain (for testing only)
# EMAIL_FROM=onboarding@resend.dev

# Other required variables
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_SUPABASE_URL=https://bttmnxguqbuvsnqknkqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### Production (Vercel)

1. Go to https://vercel.com/dashboard
2. Select your **Handy Help** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `RESEND_API_KEY` | `re_your_api_key_here` | Production, Preview, Development |
| `EMAIL_FROM` | `noreply@handyhelp.nz` | Production, Preview, Development |

5. Click **Save**
6. **Redeploy** your application for changes to take effect

## Step 5: Test Email Sending

### Quick Test - Send Yourself a Test Email

You can test by creating a proposal for a customer with your email address:

1. Go to your admin dashboard
2. Click **Create Proposal**
3. Select a customer (or create a test customer with your email)
4. Configure the proposal details
5. Send the proposal
6. Check your email inbox (and spam folder)

### Console Test (Optional)

If you want to test without the UI, you can use the API directly:

```bash
curl -X POST https://www.handyhelp.nz/api/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-uuid-here",
    "lawnSize": "medium",
    "packageType": "standard",
    "visitFrequencyDays": 14,
    "pricePerVisitCents": 4500,
    "estimatedAnnualVisits": 17,
    "includedServices": ["lawn_clearing"],
    "notes": "Test proposal",
    "customMessage": "This is a test"
  }'
```

## Troubleshooting

### Emails Not Being Received

1. **Check spam folder** - Test emails often land in spam
2. **Verify domain** - Make sure your domain is verified in Resend
3. **Check logs** - Look at Vercel logs for error messages
4. **Try test domain** - Use `onboarding@resend.dev` to rule out domain issues

### "Email service not configured" Error

- Make sure `RESEND_API_KEY` is set in your environment variables
- Restart your dev server after adding `.env.local`
- Redeploy on Vercel after adding environment variables

### "Unauthorized" Error from Resend

- Check that your API key is correct
- Make sure you copied the full key (starts with `re_`)
- Try creating a new API key in Resend dashboard

### Emails Going to Spam

- **Verify your domain** - Unverified domains are more likely to go to spam
- **Add SPF/DKIM records** - Resend provides these when you verify your domain
- **Use a real sender address** - `noreply@handyhelp.nz` is better than `test@...`
- **Warm up gradually** - Start with small volumes

## Email Limits

### Free Tier (No credit card)
- 100 emails/day
- 3,000 emails/month
- Good for testing and small projects

### Paid Tier (After adding credit card)
- $0.10 per 1,000 emails
- No daily limits
- Better deliverability
- Email analytics

## Monitoring

### Check Sent Emails

1. Go to https://resend.com/emails
2. See all sent emails, opens, clicks
3. Check delivery status and errors

### Check Logs in Vercel

1. Go to Vercel dashboard → Your project
2. Click **Logs** tab
3. Look for email-related messages
4. Filter by "proposal" or "email"

## Best Practices

1. **Verify your domain** before going to production
2. **Test thoroughly** with the test domain first
3. **Monitor deliverability** in Resend dashboard
4. **Keep API keys secret** - Never commit them to Git
5. **Use environment variables** for all configuration
6. **Handle errors gracefully** - Proposals should still be created even if email fails

## What Happens When You Send a Proposal

1. User clicks "Send Proposal" in admin dashboard
2. API creates proposal in database
3. API generates proposal email HTML
4. API calls Resend to send email
5. Customer receives beautiful HTML email with:
   - Personalized greeting
   - Property details
   - Service breakdown
   - Pricing information
   - Accept/Reject buttons
   - Expiry date
6. Customer clicks "View Proposal" button
7. Opens proposal page with full details

## Support

- **Resend Docs:** https://resend.com/docs
- **Resend Support:** support@resend.com
- **API Reference:** https://resend.com/docs/api-reference/introduction

## Next Steps

After setting up Resend:

1. ✅ Install Resend package (Done)
2. ✅ Update email service code (Done)
3. 🔄 Get Resend API key
4. 🔄 Add environment variables
5. 🔄 Test sending a proposal email
6. 🔄 Verify domain for production use

Once emails are working, you'll have a complete proposal system! 🎉

