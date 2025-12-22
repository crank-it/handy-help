# Redwoods Lane - Local Business Management

This feature allows your son to manage his local Redwoods Lane business separately from the main Handy Help operations.

## What's New

A new "Redwoods Lane" section has been added to the admin panel with:

- **Customer Management**: Track houses on Redwoods Lane with customer details, agreed prices, and expectations
- **Job Scheduling**: Schedule and track jobs for each customer
- **Payment Tracking**: Mark jobs as completed and track payment status
- **Simple Dashboard**: Kid-friendly interface with stats and easy navigation

## Database Setup

To enable this feature, you need to run the new migration:

### Option 1: Run in Supabase Dashboard (Recommended)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Click "New query"
4. Open the file: `/Users/home/Dev/handy-help/supabase/migrations/005_redwoods_lane.sql`
5. Copy the entire contents and paste into the SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Option 2: Using Supabase CLI (if installed)

```bash
cd /Users/home/Dev/handy-help
supabase db push
```

### Verify the Migration

Run this query in the SQL Editor to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'redwoods%';
```

You should see:
- `redwoods_customers`
- `redwoods_jobs`

## How to Use

### 1. Access Redwoods Lane Section

- Log into the admin panel at `/admin`
- Click "Redwoods Lane" in the sidebar (with the map pin icon)

### 2. Add a Customer

- Click "Add Customer" button
- Fill in:
  - House number (e.g., "1", "2A", "15")
  - Customer name
  - Contact info (optional)
  - Agreed price (e.g., $20.00)
  - Payment frequency (per visit, weekly, fortnightly, monthly)
  - Customer expectations (what they want done)
  - Special notes (gate codes, dogs, etc.)
- Click "Add Customer"

### 3. Schedule Jobs

- Click on a customer from the list
- Click "Schedule Job"
- Set the date and time
- Adjust price if needed (defaults to agreed price)
- Add any special notes for this job
- Click "Schedule Job"

### 4. Complete Jobs

- Go to the customer's page
- Find the scheduled job
- Click "Complete" when the job is done
- Click "Mark Paid" when payment is received

### 5. Track Progress

The dashboard shows:
- Number of active customers
- Upcoming jobs
- Jobs completed this month
- Total earnings this month

## Features

### Customer Management
- Track multiple houses on Redwoods Lane
- Store contact information
- Record agreed prices and payment terms
- Note customer expectations and special instructions
- Pause/activate customers as needed

### Job Scheduling
- Schedule jobs for specific dates and times
- Track job status (scheduled, completed, cancelled)
- Record actual time spent on jobs
- Add notes for each job

### Payment Tracking
- Track payment status for each job
- See total earnings per customer
- Monthly earnings summary
- Easy "Mark Paid" workflow

## Data Structure

### Redwoods Customers
- House number
- Customer name
- Phone & email (optional)
- Agreed price
- Payment frequency
- Expectations
- Special notes
- Active status

### Redwoods Jobs
- Customer reference
- Scheduled date & time
- Job status
- Price
- Payment status
- Completion time
- Duration
- Notes

## Tips for Your Son

1. **Add customers first** - Before scheduling any jobs, add all the houses you're working with
2. **Set expectations** - Write down what each customer expects so you don't forget
3. **Use special notes** - Record important info like gate codes or where to find the key
4. **Schedule ahead** - Plan your week by scheduling jobs in advance
5. **Mark complete right away** - After finishing a job, mark it complete while it's fresh
6. **Track payments** - Mark jobs as paid when you receive the money

## Navigation

- **Main page** (`/admin/redwoods`): See all customers and stats
- **Customer detail** (`/admin/redwoods/[id]`): View customer info and their jobs
- **Add customer** (`/admin/redwoods/new`): Add a new house
- **Edit customer** (`/admin/redwoods/[id]/edit`): Update customer info
- **Schedule job** (`/admin/redwoods/[id]/jobs/new`): Schedule a new job

## Separation from Main Business

This section is **completely separate** from the main Handy Help business:
- Different customers database
- Different job tracking
- Separate earnings calculations
- Won't interfere with existing bookings or customers

## Future Enhancements

Potential additions (not implemented yet):
- Recurring job templates
- Route optimization for multiple houses
- SMS reminders
- Photo uploads for completed jobs
- Customer feedback/ratings
- Weather-based rescheduling

---

**Note**: This is a simple, kid-friendly system designed to help manage a small local business. As the business grows, more features can be added!

