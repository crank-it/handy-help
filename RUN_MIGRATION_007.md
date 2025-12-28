# Run Migration 007 - Add Custom Message to Proposals

## The Problem
You're getting this error when creating proposals:
```
Could not find the 'custom_message' column of 'proposals' in the schema cache
```

This means migration `007_add_custom_message_to_proposals.sql` hasn't been run on your production database yet.

## The Solution

You need to run the migration on your Supabase database. Here's how:

### Option 1: Via Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard
2. Select your project (bttmnxguqbuvsnqknkqo)
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Add custom_message column to proposals table for personalized messages
ALTER TABLE proposals
ADD COLUMN IF NOT EXISTS custom_message TEXT;

COMMENT ON COLUMN proposals.custom_message IS 'Custom message from admin to customer, included in proposal email';
```

6. Click **Run** or press `Cmd+Enter`
7. You should see "Success. No rows returned"

### Option 2: Via Command Line (If you have Supabase CLI)

```bash
cd /Users/home/Dev/handy-help
supabase db push
```

This will push all pending migrations to your remote database.

### Option 3: Manual SQL via psql (Advanced)

If you have direct database access:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.bttmnxguqbuvsnqknkqo.supabase.co:5432/postgres"
```

Then run:
```sql
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS custom_message TEXT;
```

## Verify It Worked

After running the migration, you can verify it worked by running this query in the SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'proposals' 
AND column_name = 'custom_message';
```

You should see:
```
column_name      | data_type
-----------------+-----------
custom_message   | text
```

## After Running Migration

1. The error should be gone
2. You can now add custom messages to proposals
3. No need to redeploy - the changes will work immediately

## Backwards Compatibility

I've also made the code backwards-compatible, so if you can't run the migration immediately:
- Proposals will still work
- Custom messages just won't be saved to the database
- No errors will be thrown

But you should run the migration as soon as possible to get the full functionality.

## All Migrations Status

Here are all the migrations in your project:
1. ✅ `001_initial_schema.sql` - Initial database schema
2. ✅ `002_fix_schema_columns.sql` - Column name fixes
3. ✅ `003_whatsapp_messaging.sql` - WhatsApp integration
4. ✅ `004_booking_flow_transformation.sql` - Proposals table created
5. ✅ `005_redwoods_lane.sql` - Redwoods Lane feature
6. ✅ `006_make_lawn_size_optional.sql` - Made lawn_size optional
7. ❌ `007_add_custom_message_to_proposals.sql` - **NEEDS TO BE RUN**

If you're not sure whether the other migrations have been run, you can check by running this in SQL Editor:

```sql
-- Check if custom_message column exists
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'proposals' 
  AND column_name = 'custom_message'
);
```

Returns `true` if migration is done, `false` if it needs to be run.

