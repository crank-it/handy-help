# Quick Start: Creating Your First Proposal

## Prerequisites
- Admin access to https://www.handyhelp.nz/admin
- At least one customer in the system
- Email service configured (optional but recommended)

## Step-by-Step Guide

### 1. Navigate to Proposals Page
1. Log in to admin dashboard
2. Click **"Proposals"** in the sidebar
3. Click the **"Create Proposal"** button (top right)

### 2. Select Customer
1. **Search** for customer by name, address, or phone
2. **Click on the customer card** to select them
3. Click **"Continue"** to next step

### 3. Configure Services

#### Choose Lawn Size
- **Small**: Perfect for compact properties
  - Standard: $45/visit | Premium: $55/visit
- **Medium**: Most common residential lawns
  - Standard: $60/visit | Premium: $70/visit
- **Large**: Larger properties
  - Standard: $80/visit | Premium: $95/visit

#### Select Package Type
- **Standard Package**
  - ~9 visits per year
  - Regular maintenance
  - Best for properties that need seasonal care
  
- **Premium Package**
  - ~17 visits per year
  - Enhanced care
  - Ideal for properties requiring frequent attention

#### Set Visit Frequency
Choose how often you'll visit:
- Weekly (7 days)
- Every 10 days
- Fortnightly (14 days) ← Most common
- Every 3 weeks (21 days)
- Monthly (28 days)

#### Select Included Services
Check all services that will be included:
- ☑️ **Lawn Clearing** - Regular mowing
- ☑️ **Edge Trimming** - Border maintenance
- ☑️ **Hedging** - Hedge trimming
- ☑️ **Other Services** - Custom requirements

#### Add Notes (Optional)
Internal notes for your reference (customer won't see these)

Click **"Continue"** when done

### 4. Review & Send

#### Verify Details
- Customer information
- Service configuration
- Pricing summary

#### Add Custom Message (Optional)
Write a personalized message for the customer, for example:
```
Hi Sarah! Thanks for having me inspect your property today. 
Based on what I saw, I think the standard package will be 
perfect for your lawn. Looking forward to working with you!
```

#### Send Proposal
Click **"Send Proposal"**

## What Happens Next?

### Immediately
- ✅ Proposal created in database
- ✅ Customer receives email (if email service configured)
- ✅ Proposal link is available to copy

### Customer Receives Email With:
- Complete proposal details
- Pricing breakdown
- Your custom message
- **Accept Proposal** button (green)
- **Decline** button (gray)
- Expiry date (14 days)

### When Customer Accepts:
1. Customer status changes to "Active"
2. Visit schedule is automatically created
3. Customer receives confirmation email
4. You can start managing their visits

### When Customer Declines:
1. Proposal marked as "Rejected"
2. Customer remains in current status
3. You can create a revised proposal if needed

## Viewing Proposals

### In Admin Dashboard
1. Go to **Proposals** page
2. See all proposals with status indicators
3. Use filters: All / Sent / Accepted / Rejected / Expired
4. Click **"Copy Link"** to share proposal manually

### Proposal Status Colors
- 🔵 **Blue** - Sent (waiting for response)
- 🟢 **Green** - Accepted
- 🔴 **Red** - Rejected
- ⚪ **Gray** - Expired

## Tips for Success

### Writing Custom Messages
- ✅ Be personal and friendly
- ✅ Reference the inspection or conversation
- ✅ Explain why you chose this package/frequency
- ✅ Mention any property-specific considerations
- ❌ Don't be too formal or generic

### Choosing the Right Package
- **Standard** for:
  - Properties with moderate growth
  - Customers wanting seasonal care
  - Budget-conscious clients
  
- **Premium** for:
  - High-maintenance properties
  - Customers wanting pristine lawns
  - Properties with specific requirements

### Setting Visit Frequency
Consider:
- Growth rate of grass in the area
- Season (faster growth in summer)
- Customer's aesthetic preferences
- Property location and sun exposure

## Troubleshooting

### "Email not sent"
- Check if customer has email address
- Verify email service is configured (RESEND_API_KEY or SENDGRID_API_KEY)
- Check server logs for errors
- You can still copy the proposal link and send manually

### Customer can't see proposal
- Verify you copied the complete link
- Check proposal hasn't expired (14 days)
- Try the link in incognito/private mode

### Need to revise proposal
- Create a new proposal with updated details
- Previous proposals remain in history

## Best Practices

1. **Do Inspection First**: Always inspect property before creating proposal
2. **Accurate Lawn Sizing**: Choose lawn size based on actual area, not property size
3. **Set Realistic Frequency**: Match visit frequency to actual needs
4. **Use Custom Messages**: Personalize every proposal for better acceptance rates
5. **Follow Up**: If no response after a week, send a friendly reminder
6. **Track Success**: Review proposal acceptance rates monthly

## Example Workflow

```
1. Customer books inspection
2. You visit property and assess
3. Immediately create proposal in admin
4. Customer receives email within minutes
5. Customer accepts proposal
6. System creates visit schedule automatically
7. You start servicing the lawn!
```

## Need Help?

- 📖 Full Documentation: See `PROPOSAL_SYSTEM.md`
- 🔧 Technical Details: See `PROPOSAL_IMPLEMENTATION.md`
- 📧 Support: contact@handyhelp.nz
- 📱 Phone: 022 123 4567

## Quick Reference

| Action | Location |
|--------|----------|
| Create Proposal | Admin → Proposals → Create Proposal |
| View All Proposals | Admin → Proposals |
| Copy Proposal Link | Proposals list → Copy Link button |
| Check Acceptance Rate | Proposals page → Stats at top |
| View Customer Status | Admin → Customers |

---

**Ready to create your first proposal? Head to the [Proposals page](https://www.handyhelp.nz/admin/proposals) and click "Create Proposal"!** 🌿

