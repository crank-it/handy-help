# ⚡ Run Database Migration - Quick Guide

## Current Status
✅ Environment configured
✅ Supabase credentials working
❌ **Database tables missing** ← Fix this now!

## 🚀 Run Migration (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard/project/bttmnxguqbuvsnqknkqo
2. Click **SQL Editor** in the left sidebar (looks like `</>`)
3. Click **New Query** button

### Step 2: Copy the Migration SQL
The migration file is at:
```
/Users/ben/handy-help-nz/supabase/migrations/001_initial_schema.sql
```

**Quick copy command:**
```bash
cat /Users/ben/handy-help-nz/supabase/migrations/001_initial_schema.sql | pbcopy
```
This copies the entire file to your clipboard.

### Step 3: Run in Supabase
1. Paste the SQL into the query editor
2. Click **Run** (or press Cmd+Enter)
3. You should see: "Success. No rows returned"

### Step 4: Verify It Worked
Run this in your terminal:
```bash
curl http://localhost:3002/api/health
```

You should see:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "tables": ["customers", "visits", "payments"]
  }
}
```

## ✅ What This Creates

### Tables:
- **customers** - Customer profiles and service details
- **visits** - Scheduled and completed lawn visits
- **payments** - Payment tracking

### Additional Features:
- Auto-generated UUIDs for all records
- Timestamps (created_at, updated_at)
- Referential integrity (cascading deletes)
- Check constraints for data validation
- Helpful database views for queries
- Function to generate seasonal visits

## 🎯 After Migration Runs

You can immediately:
1. **Test booking flow** - Go to http://localhost:3002 and book a service
2. **Check database** - Go to Supabase → Table Editor → customers
3. **View admin dashboard** - Go to http://localhost:3002/admin (password: handy2025)

## 🐛 Troubleshooting

### "Permission denied" error
- Make sure you're logged into the correct Supabase project
- Verify you're using project ID: `bttmnxguqbuvsnqknkqo`

### "Syntax error" in SQL
- Make sure you copied the ENTIRE file (it's about 200 lines)
- Don't add or remove any characters

### Health check still shows "unhealthy"
- Refresh the page: http://localhost:3002/api/health
- Restart dev server if needed

## 📊 Quick Verification Query

After running the migration, test this in Supabase SQL Editor:
```sql
-- Should return 3 tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

Expected result:
```
customers
visits
payments
```

---

**Next step after migration:** Test creating your first booking at http://localhost:3002
