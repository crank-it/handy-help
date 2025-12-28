# Proposal Creation System

## Overview

The proposal creation system allows admins to create customized lawn care proposals from within the admin backend and send them to customers via email. Customers can then accept or reject proposals through a dedicated proposal page.

## Features

### 1. Admin Proposal Creation
- **Access**: Admin Dashboard → Proposals → "Create Proposal" button
- **Three-step wizard**:
  1. **Select Customer**: Search and select from existing customers
  2. **Configure Services**: Choose lawn size, package type, visit frequency, and included services
  3. **Review & Send**: Add custom message and send proposal

### 2. Service Configuration

#### Lawn Sizes
- **Small**: $45 (standard) / $55 (premium)
- **Medium**: $60 (standard) / $70 (premium)
- **Large**: $80 (standard) / $95 (premium)

#### Package Types
- **Standard**: ~9 visits per year
- **Premium**: ~17 visits per year

#### Visit Frequencies
- Weekly (7 days)
- Every 10 days
- Fortnightly (14 days)
- Every 3 weeks (21 days)
- Monthly (28 days)

#### Available Services
- 🌱 Lawn Clearing
- ✂️ Edge Trimming
- 🌿 Hedging
- 🔧 Other Services

### 3. Email Notifications

#### Proposal Email
Sent automatically when proposal is created (if customer has email):
- Beautiful HTML template with company branding
- Complete service details and pricing breakdown
- Custom message from admin (optional)
- Internal notes (not visible to customer)
- Accept and Decline buttons linking to proposal page
- Expiry date (14 days by default)

#### Acceptance Email
Sent automatically when customer accepts proposal:
- Confirmation of acceptance
- Next steps information
- Contact information

### 4. Customer Proposal Page

**URL Format**: `https://www.handyhelp.nz/proposal/{secure-token}`

**Features**:
- No login required (secure token-based access)
- Full proposal details
- Pricing breakdown
- Accept/Decline buttons
- Status indicators (sent/accepted/rejected/expired)
- Expiry countdown

**Actions**:
- ✅ **Accept**: Updates customer to "active" status, creates visit schedule
- ❌ **Decline**: Marks proposal as rejected
- **Contact Us**: Direct email link for questions

## Technical Implementation

### Database Schema

#### Proposals Table
```sql
CREATE TABLE proposals (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  token TEXT UNIQUE,
  
  -- Service details
  lawn_size TEXT,
  package_type TEXT,
  visit_frequency_days INTEGER,
  price_per_visit_cents INTEGER,
  estimated_annual_visits INTEGER,
  
  -- Additional info
  included_services JSONB,
  notes TEXT,
  custom_message TEXT,
  
  -- Status
  status TEXT,
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### API Endpoints

#### POST `/api/proposals`
Create a new proposal and send email to customer.

**Request Body**:
```json
{
  "customerId": "uuid",
  "lawnSize": "small|medium|large",
  "packageType": "standard|premium",
  "visitFrequencyDays": 14,
  "pricePerVisitCents": 6000,
  "estimatedAnnualVisits": 9,
  "includedServices": ["lawn_clearing", "edge_trimming"],
  "notes": "Internal notes",
  "customMessage": "Personalized message for customer"
}
```

**Response**:
```json
{
  "success": true,
  "proposalId": "uuid",
  "token": "secure-token",
  "proposalUrl": "https://...",
  "expiresAt": "2025-01-11T...",
  "emailSent": true,
  "emailError": null
}
```

#### GET `/api/proposals`
List all proposals (admin only).

#### POST `/api/proposals/{token}/accept`
Accept a proposal. Creates visit schedule and updates customer status.

#### POST `/api/proposals/{token}/reject`
Reject a proposal.

### Components

#### CreateProposalModal
Location: `/components/admin/CreateProposalModal.tsx`

Full-featured modal with:
- Customer search and selection
- Service configuration with live pricing
- Custom message input
- Email preview

### Email Service

#### Configuration
Set one of these environment variables:
- `RESEND_API_KEY` - For Resend email service
- `SENDGRID_API_KEY` - For SendGrid email service
- `EMAIL_FROM` - Sender email address

#### Email Templates
Location: `/lib/email/templates.ts`

- `generateProposalEmail()` - Main proposal email
- `generateAcceptanceEmail()` - Acceptance confirmation

### Security

- Proposals use secure UUID tokens
- No authentication required for viewing (token-based security)
- Proposals expire after 14 days
- One-time acceptance (prevents double-acceptance)

## Workflow

### Admin Workflow
1. Customer completes booking and inspection
2. Admin navigates to Proposals page
3. Clicks "Create Proposal"
4. Selects customer
5. Configures services and pricing
6. Adds custom message (optional)
7. Reviews and sends
8. Email automatically sent to customer

### Customer Workflow
1. Receives email with proposal details
2. Reviews pricing and services
3. Clicks "View Full Proposal" in email
4. Reviews complete proposal page
5. Clicks "Accept" or "Decline"
6. Receives confirmation email (if accepted)

### System Workflow (on Acceptance)
1. Update proposal status to "accepted"
2. Update customer status to "active"
3. Generate annual visit schedule based on package and frequency
4. Send acceptance confirmation email
5. Admin can now manage customer visits

## Migration Required

Run this migration to add custom_message support:

```bash
# Migration file: 007_add_custom_message_to_proposals.sql
psql $DATABASE_URL < supabase/migrations/007_add_custom_message_to_proposals.sql
```

Or via Supabase CLI:
```bash
supabase db push
```

## Future Enhancements

- [ ] WhatsApp notification support (in addition to email)
- [ ] SMS fallback for customers without email
- [ ] Proposal templates for quick creation
- [ ] Proposal versioning (send revised proposals)
- [ ] Customer feedback on declined proposals
- [ ] PDF export of proposals
- [ ] Proposal analytics (open rates, acceptance rates by service type)
- [ ] Automated follow-up reminders before expiry

## Testing

### Manual Testing Checklist

1. **Create Proposal**
   - [ ] Can search and select customers
   - [ ] All service options work
   - [ ] Pricing calculates correctly
   - [ ] Custom message saves

2. **Email Delivery**
   - [ ] Email sends successfully
   - [ ] Email contains all proposal details
   - [ ] Custom message appears in email
   - [ ] Links work correctly

3. **Customer Actions**
   - [ ] Proposal page displays correctly
   - [ ] Accept button works
   - [ ] Decline button works
   - [ ] Expired proposals show correct status

4. **Admin Dashboard**
   - [ ] Proposals list shows all proposals
   - [ ] Status filters work
   - [ ] Stats calculate correctly
   - [ ] Can copy proposal links

## Troubleshooting

### Email Not Sending
- Check email service configuration (RESEND_API_KEY or SENDGRID_API_KEY)
- Verify EMAIL_FROM is set correctly
- Check API key permissions
- Look for errors in server logs

### Proposal Not Accessible
- Verify token is correct
- Check proposal hasn't expired
- Ensure proposal exists in database

### Acceptance Not Working
- Check customer status in database
- Verify visits are being created
- Look for errors in accept endpoint logs

## Support

For issues or questions:
- Email: contact@handyhelp.nz
- Phone: 022 123 4567

