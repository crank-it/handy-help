# Supabase Setup Guide

This guide will walk you through connecting your Handy Help NZ application to Supabase.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: handy-help-nz
   - **Database Password**: Choose a strong password (you'll need this later)
   - **Region**: Choose the closest to New Zealand (e.g., ap-southeast-1 Singapore)
   - **Pricing Plan**: Free tier is fine to start
5. Click "Create new project"
6. Wait 2-3 minutes for the project to initialize

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: Your anonymous/public API key (starts with `eyJ...`)
   - **service_role**: Your service role key (also starts with `eyJ...`) - keep this secret!

## Step 3: Set Up Environment Variables

1. In your project root (`/Users/ben/handy-help-nz/`), create a file named `.env.local`
2. Copy the contents from `.env.example` and fill in your actual values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration (optional for now)
RESEND_API_KEY=
NOTIFICATION_EMAIL=william@handyhelp.nz

# Admin Authentication
ADMIN_PASSWORD=your-secure-password-here
```

3. Save the file
4. **Important**: `.env.local` is already in `.gitignore` so it won't be committed to git

## Step 4: Run the Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the migration file at `/Users/ben/handy-help-nz/supabase/migrations/001_initial_schema.sql`
4. Copy the **entire contents** of that file
5. Paste it into the SQL Editor in Supabase
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Verify the migration worked:

In the SQL Editor, run this query:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see three tables: `customers`, `visits`, and `payments`

## Step 5: Test the Connection

1. Restart your Next.js dev server:
   ```bash
   # Kill the current server (Ctrl+C or kill the process)
   npm run dev
   ```

2. Try creating a test booking:
   - Go to http://localhost:3002
   - Click "Book Your Service"
   - Complete all 6 steps
   - Submit the form

3. Check if it worked:
   - Go to your Supabase dashboard
   - Click **Table Editor** → **customers**
   - You should see your test booking!

## Step 6: Set Up Email Notifications (Optional)

To receive email notifications when customers book:

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the Resend dashboard
3. Add it to your `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```
4. Verify your domain or use resend's test domain for development

## Troubleshooting

### Error: "Failed to create booking"
- Check that your `.env.local` file exists and has the correct values
- Make sure you've restarted the dev server after adding the file
- Check the browser console and terminal for error messages

### Error: "relation 'customers' does not exist"
- The migration hasn't been run yet
- Go back to Step 4 and run the SQL migration in Supabase

### Can't see the admin dashboard
- Make sure you've set `ADMIN_PASSWORD` in `.env.local`
- The admin is at: http://localhost:3002/admin
- (Note: Simple password protection will be added in the next update)

### Database shows empty even after booking
- Check the terminal for error messages
- Look at the Supabase **Logs** section for errors
- Verify your API keys are correct

## Next Steps

Once Supabase is connected:

1. ✅ Bookings will save to the database
2. ✅ Admin dashboard will show real data
3. ✅ William will receive email notifications (if Resend is set up)
4. ✅ Property assessments will be saved
5. ✅ Visit tracking will work

## Security Notes

- **Never commit `.env.local`** - it contains secret keys
- The `SUPABASE_SERVICE_KEY` is very powerful - keep it secret
- Row Level Security (RLS) policies are currently permissive - tighten them before going live
- Consider adding proper admin authentication before production

## Need Help?

If you run into issues:
1. Check the Supabase logs (Dashboard → Logs)
2. Check the browser console (F12 → Console)
3. Check the Next.js terminal output
4. Double-check all your environment variables

---

Created for Handy Help NZ by Claude Code
