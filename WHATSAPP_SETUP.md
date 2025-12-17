# WhatsApp Messaging Setup Guide

This guide explains how to set up WhatsApp Business API integration for Handy Help NZ.

## Overview

The messaging system supports two WhatsApp API providers:
1. **Meta WhatsApp Business API** (recommended for production)
2. **Twilio WhatsApp API** (easier to set up for testing)

## Features

Once configured, you can:
- Send messages to individual customers from their profile page
- Send messages from the schedule view by clicking on visits
- Select multiple customers and send bulk messages
- Use pre-built templates for common scenarios (reminders, weather delays, on-the-way, etc.)
- View message history in the Messages page
- Receive incoming messages from customers

## Database Migration

Before using WhatsApp messaging, run the database migration:

1. Go to your Supabase dashboard → **SQL Editor**
2. Open `/supabase/migrations/002_whatsapp_messaging.sql`
3. Copy and paste the entire contents
4. Click "Run"

This creates the following tables:
- `messages` - Stores all sent/received messages
- `message_templates` - Pre-defined message templates
- `bulk_messages` - Tracks bulk message batches

## Option 1: Meta WhatsApp Business API (Recommended)

### Step 1: Create a Meta Business Account

1. Go to [business.facebook.com](https://business.facebook.com)
2. Create a Business Account if you don't have one
3. Verify your business

### Step 2: Set Up WhatsApp Business API

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app or use an existing one
3. Add the "WhatsApp" product to your app
4. Go to WhatsApp → Getting Started
5. Set up a WhatsApp Business Account
6. Get a phone number or add your own business number

### Step 3: Get Your Credentials

From the WhatsApp dashboard, note:
- **Phone Number ID** (found in WhatsApp → API Setup)
- **WhatsApp Business Account ID**
- **Permanent Access Token** (create one in System Users)

### Step 4: Configure Environment Variables

Add to your `.env.local`:

```bash
# Meta WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_API_VERSION=v18.0

# For receiving messages (webhook verification)
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_secret_verify_token
```

### Step 5: Set Up Webhook (for incoming messages)

1. In your Meta app, go to WhatsApp → Configuration
2. Set the Webhook URL to: `https://yourdomain.com/api/messages/webhook`
3. Set the Verify Token to match your `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
4. Subscribe to `messages` webhook field

---

## Option 2: Twilio WhatsApp API (Easier Setup)

### Step 1: Create a Twilio Account

1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for an account
3. Get your Account SID and Auth Token from the dashboard

### Step 2: Enable WhatsApp Sandbox (for testing)

1. Go to Messaging → Try it Out → Send a WhatsApp message
2. Follow the instructions to join the sandbox
3. Note your sandbox phone number (e.g., `whatsapp:+14155238886`)

### Step 3: Configure Environment Variables

Add to your `.env.local`:

```bash
# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Step 4: Set Up Webhook (for incoming messages)

1. In your Twilio Console, go to Messaging → Settings → WhatsApp Sandbox Settings
2. Set "When a message comes in" to: `https://yourdomain.com/api/messages/webhook`

---

## Testing Without API Keys

The system is designed to work even without WhatsApp configured:
- Messages will be saved to the database with status "pending"
- You can test the UI and message flow
- Once API keys are added, messages will be sent automatically

---

## Using the Messaging System

### Sending Individual Messages

1. Go to **Admin → Customers** and click on a customer
2. Click the **Message** button in the top right
3. Select a template or write a custom message
4. Click **Send Message**

### Sending from Schedule

1. Go to **Admin → Schedule**
2. Hover over any visit to see the message icon
3. Click the icon to message that customer
4. Or click "Message all" under a day to message all customers scheduled that day

### Bulk Messaging

1. Go to **Admin → Schedule**
2. Click **Select** in the top toolbar
3. Click on visits to select them
4. Click **Message (X)** to open the bulk message dialog
5. Write your message and send

### Message Templates

Pre-built templates are available for:
- **Reminders**: "Your visit is scheduled for tomorrow"
- **On The Way**: "I'm on my way, ETA 15 minutes"
- **Delays**: "Running late, will be there at [time]"
- **Weather**: "Rain forecast may affect your visit"
- **Sick Day**: "Not feeling well, need to reschedule"
- **Follow Up**: "Just finished your lawn!"

Templates support variables like:
- `{{customer_name}}` - Customer's name
- `{{date}}` - Scheduled date
- `{{time}}` - Scheduled time
- `{{eta}}` - Estimated arrival time
- `{{weather_chance}}` - Rain probability

### Viewing Message History

1. Go to **Admin → Messages**
2. View all sent and received messages
3. Filter by direction (sent/received)
4. Click on a customer name to view their profile

---

## Phone Number Format

The system automatically converts NZ phone numbers:
- `021 123 4567` → `+64211234567`
- `0211234567` → `+64211234567`
- `+64211234567` → `+64211234567` (unchanged)

---

## Troubleshooting

### Messages Not Sending

1. Check that API credentials are correct
2. Verify the phone number format
3. Check the Messages page for error messages
4. Look at browser console for API errors

### Not Receiving Messages

1. Verify webhook URL is publicly accessible
2. Check webhook verify token matches
3. Check Supabase logs for errors

### Rate Limiting

WhatsApp has rate limits:
- Meta: ~80 messages per second
- Twilio: Varies by plan

For bulk messages, the system sends sequentially with a small delay.

---

## Security Notes

- Never commit API keys to git
- Use environment variables for all secrets
- The webhook endpoint validates message signatures
- Row Level Security protects message data

---

## Next Steps

1. Set up either Meta or Twilio WhatsApp API
2. Run the database migration
3. Add environment variables
4. Test by sending a message to yourself
5. Set up webhooks for incoming messages

---

Created for Handy Help NZ - WhatsApp Integration
