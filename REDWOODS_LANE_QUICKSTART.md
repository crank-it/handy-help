# Redwoods Lane - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Run the Database Migration (2 minutes)

1. Open your Supabase dashboard at [supabase.com](https://supabase.com)
2. Go to **SQL Editor**
3. Click **"New query"**
4. Open this file on your computer: `/Users/home/Dev/handy-help/supabase/migrations/005_redwoods_lane.sql`
5. Copy everything in that file
6. Paste it into the Supabase SQL Editor
7. Click **"Run"** (or press Cmd+Enter)
8. ✅ You should see "Success. No rows returned"

### Step 2: Restart Your Dev Server (30 seconds)

```bash
# In your terminal, stop the server (Ctrl+C) then:
npm run dev
```

### Step 3: Access Redwoods Lane (30 seconds)

1. Go to your admin panel: `http://localhost:3000/admin` (or whatever port you're using)
2. Look for **"Redwoods Lane"** in the sidebar (it has a map pin icon 📍)
3. Click it!

### Step 4: Add Your First Customer (2 minutes)

1. Click the **"Add Customer"** button
2. Fill in the form:
   - **House Number**: e.g., "1" or "2A"
   - **Customer Name**: e.g., "Mr. Smith"
   - **Phone**: (optional) e.g., "+64 21 123 4567"
   - **Agreed Price**: e.g., "20.00"
   - **Payment Frequency**: Choose "Per Visit"
   - **Expectations**: e.g., "Mow lawn, trim edges, clean up"
   - **Special Notes**: e.g., "Gate code is 1234"
3. Click **"Add Customer"**

### Step 5: Schedule Your First Job (1 minute)

1. Click on the customer you just added
2. Click **"Schedule Job"**
3. Pick a date
4. (Optional) Set a time
5. Price will default to what you agreed
6. Click **"Schedule Job"**

## 🎉 That's It!

You're now ready to:
- ✅ Track all your Redwoods Lane customers
- ✅ Schedule jobs
- ✅ Mark jobs as complete
- ✅ Track payments
- ✅ See your earnings

## 📱 Quick Tips

### When You Complete a Job
1. Go to the customer's page
2. Find the job in the list
3. Click **"Complete"**
4. When they pay you, click **"Mark Paid"**

### To See Your Stats
- Go to the main Redwoods Lane page
- You'll see:
  - How many active customers you have
  - Upcoming jobs
  - Jobs completed this month
  - Money earned this month

### To Edit a Customer
1. Click on the customer
2. Click **"Edit Customer"** (top right)
3. Make your changes
4. Click **"Save Changes"**

## 🆘 Troubleshooting

**Can't see Redwoods Lane in the sidebar?**
- Make sure you ran the database migration (Step 1)
- Restart your dev server (Step 2)

**Getting an error when adding a customer?**
- Check that the migration ran successfully in Supabase
- Look at the browser console (F12) for error messages

**Need more help?**
- See the full guide: `REDWOODS_LANE_SETUP.md`
- Check the summary: `REDWOODS_LANE_SUMMARY.md`

---

**Ready to grow your business! 🌳💪**

