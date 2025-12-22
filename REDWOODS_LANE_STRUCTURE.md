# Redwoods Lane - System Structure

## 📊 Navigation Flow

```
Admin Panel
    └── Redwoods Lane (new menu item)
        ├── Main Dashboard (/admin/redwoods)
        │   ├── Stats Cards (customers, jobs, earnings)
        │   ├── Customer List
        │   └── [Add Customer Button]
        │
        ├── Add Customer (/admin/redwoods/new)
        │   └── Customer Form
        │
        └── Customer Detail (/admin/redwoods/[id])
            ├── Customer Info
            ├── Stats (per customer)
            ├── Jobs List
            ├── [Edit Customer Button] → Edit Page
            └── [Schedule Job Button] → Schedule Page
                ├── Edit Customer (/admin/redwoods/[id]/edit)
                │   └── Edit Form
                └── Schedule Job (/admin/redwoods/[id]/jobs/new)
                    └── Job Form
```

## 🗂️ File Structure

```
handy-help/
│
├── app/
│   ├── admin/
│   │   └── redwoods/                    # Redwoods Lane section
│   │       ├── page.tsx                 # Main dashboard
│   │       ├── new/
│   │       │   └── page.tsx             # Add customer form
│   │       └── [id]/
│   │           ├── page.tsx             # Customer detail
│   │           ├── edit/
│   │           │   └── page.tsx         # Edit customer form
│   │           └── jobs/
│   │               └── new/
│   │                   └── page.tsx     # Schedule job form
│   │
│   └── api/
│       └── redwoods/                    # API endpoints
│           ├── customers/
│           │   ├── route.ts             # POST /api/redwoods/customers
│           │   └── [id]/
│           │       └── route.ts         # GET/PATCH /api/redwoods/customers/:id
│           └── jobs/
│               ├── route.ts             # POST /api/redwoods/jobs
│               └── [id]/
│                   └── route.ts         # PATCH /api/redwoods/jobs/:id
│
├── components/
│   ├── admin/
│   │   ├── Sidebar.tsx                  # Updated with Redwoods Lane menu
│   │   └── RedwoodsJobsList.tsx         # Job list component (new)
│   └── ui/
│       ├── Button.tsx                   # Updated with 'outline' variant
│       └── Badge.tsx                    # Updated with 'default' variant
│
├── lib/
│   └── data/
│       └── redwoods.ts                  # Data access layer (new)
│
├── types/
│   └── index.ts                         # Updated with Redwoods types
│
└── supabase/
    └── migrations/
        └── 005_redwoods_lane.sql        # Database schema (new)
```

## 💾 Database Structure

```
redwoods_customers
├── id (UUID)
├── house_number (text)
├── customer_name (text)
├── phone (text, optional)
├── email (text, optional)
├── agreed_price_cents (integer)
├── payment_frequency (enum)
├── expectations (text, optional)
├── special_notes (text, optional)
├── start_date (date, optional)
├── is_active (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

redwoods_jobs
├── id (UUID)
├── customer_id (UUID) → references redwoods_customers
├── scheduled_date (date)
├── scheduled_time (text, optional)
├── status (enum: scheduled, completed, cancelled)
├── price_cents (integer)
├── payment_status (enum: pending, paid)
├── completed_at (timestamp, optional)
├── duration_minutes (integer, optional)
├── notes (text, optional)
├── created_at (timestamp)
└── updated_at (timestamp)
```

## 🔄 Data Flow

### Adding a Customer
```
User fills form
    ↓
POST /api/redwoods/customers
    ↓
createRedwoodsCustomer()
    ↓
Supabase: INSERT into redwoods_customers
    ↓
Redirect to /admin/redwoods
```

### Scheduling a Job
```
User fills form
    ↓
POST /api/redwoods/jobs
    ↓
createRedwoodsJob()
    ↓
Supabase: INSERT into redwoods_jobs
    ↓
Redirect to /admin/redwoods/[customerId]
```

### Completing a Job
```
User clicks "Complete"
    ↓
PATCH /api/redwoods/jobs/[id]
    ↓
updateRedwoodsJob({ status: 'completed', completed_at: now })
    ↓
Supabase: UPDATE redwoods_jobs
    ↓
Page refresh (shows updated status)
```

### Marking as Paid
```
User clicks "Mark Paid"
    ↓
PATCH /api/redwoods/jobs/[id]
    ↓
updateRedwoodsJob({ payment_status: 'paid' })
    ↓
Supabase: UPDATE redwoods_jobs
    ↓
Page refresh (shows paid badge)
```

## 🎨 UI Components Used

- **Card** - Container for content sections
- **Button** - Actions (primary, outline variants)
- **Badge** - Status indicators (success, error, default)
- **Input** - Text, number, date, time inputs
- **Textarea** - Multi-line text input
- **Icons** (lucide-react):
  - MapPin - Redwoods Lane menu icon
  - Home - Customer icon
  - Calendar - Date/scheduling
  - DollarSign - Money/pricing
  - CheckCircle - Complete action
  - Plus - Add actions
  - Edit - Edit action
  - ArrowLeft - Back navigation

## 🔐 Separation from Main Business

```
Main Business                    Redwoods Lane
├── customers                    ├── redwoods_customers
├── visits                       ├── redwoods_jobs
├── payments                     │
├── proposals                    │
├── messages                     │
└── /admin/customers             └── /admin/redwoods

        ↕ NO OVERLAP ↕
```

## 📈 Stats Calculations

**Active Customers**: COUNT where is_active = true
**Upcoming Jobs**: COUNT where status = 'scheduled' AND date >= today
**Completed This Month**: COUNT where status = 'completed' AND date >= first_day_of_month
**Earnings This Month**: SUM(price_cents) where status = 'completed' AND payment_status = 'paid' AND date >= first_day_of_month

## 🎯 Key Features Summary

✅ **Fully Isolated** - Won't affect existing business
✅ **Simple Interface** - Easy for kids to use
✅ **Complete Workflow** - Add customers → Schedule → Complete → Get paid
✅ **Mobile Friendly** - Works on phones and tablets
✅ **Real-time Stats** - See progress at a glance
✅ **Flexible Pricing** - Per visit or recurring
✅ **Notes & Expectations** - Remember important details

---

This structure keeps everything organized and makes it easy to find and modify any part of the Redwoods Lane feature!

