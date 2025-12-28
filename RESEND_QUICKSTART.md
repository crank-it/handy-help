# Resend Quick Start Checklist

## ✅ What's Done

- ✅ Resend package installed (`npm install resend`)
- ✅ Email service updated to use Resend SDK
- ✅ Code is ready to send emails
- ✅ Backwards compatible (won't crash if not configured)

## 🔲 What You Need to Do

### 1. Run Database Migration (URGENT!)

Before testing email, you need to run migration 007:

```sql
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS custom_message TEXT;
```

See [RUN_MIGRATION_007.md](./RUN_MIGRATION_007.md) for instructions.

### 2. Get Resend API Key (5 minutes)

1. Go to https://resend.com
2. Sign up (free - use GitHub login)
3. Get your API key from dashboard
4. Copy it (starts with `re_`)

### 3. Add Environment Variables

#### Local Development

Create `.env.local` in project root:

```bash
# Resend
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=onboarding@resend.dev

# Or use your domain (after verifying in Resend)
# EMAIL_FROM=noreply@handyhelp.nz

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3002

# Supabase (copy from ENV_VARIABLES.txt)
NEXT_PUBLIC_SUPABASE_URL=https://bttmnxguqbuvsnqknkqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_key
```

#### Production (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `RESEND_API_KEY` = `re_your_key_here`
   - `EMAIL_FROM` = `noreply@handyhelp.nz`
3. Save and redeploy

### 4. Test It Out

1. **Restart your dev server** (if running locally)
2. Go to admin dashboard
3. Click "Create Proposal"
4. Select a customer with an email address
5. Fill in proposal details
6. Send it!
7. Check your email (and spam folder)

### 5. Verify Domain (Production Only)

For production, verify your domain in Resend:

1. Go to Resend → Domains
2. Add `handyhelp.nz`
3. Add DNS records to your domain registrar
4. Wait for verification
5. Update `EMAIL_FROM=noreply@handyhelp.nz`

See [RESEND_SETUP.md](./RESEND_SETUP.md) for detailed instructions.

## Testing Checklist

- [ ] Migration 007 is run
- [ ] Resend API key added to `.env.local`
- [ ] Dev server restarted
- [ ] Can create proposal successfully
- [ ] Email is received
- [ ] Email looks good (not in spam)
- [ ] Accept/Reject links work
- [ ] Resend API key added to Vercel
- [ ] Production deployment works

## Expected Results

### When Email Service is Configured (RESEND_API_KEY set)

✅ **Success Case:**
```
Proposal created and sent successfully!
```
The customer receives a beautiful HTML email.

⚠️ **Partial Success (if email fails):**
```
Proposal created successfully!
Note: Email could not be sent: [error reason]
```
Proposal is saved, but email couldn't be sent (check API key, domain, etc.)

### When Email Service is NOT Configured

⚠️ **Warning:**
```
Proposal created successfully!
Note: Email could not be sent: Email service not configured
```
Proposal is saved but no email is sent. You'll need to send the proposal link manually.

## Common Issues

### "Email service not configured"
→ Add `RESEND_API_KEY` to your environment variables

### "Unauthorized" from Resend
→ Check your API key is correct and starts with `re_`

### "Could not find 'custom_message' column"
→ Run migration 007 (see RUN_MIGRATION_007.md)

### Email not received
→ Check spam folder, verify domain in Resend

### "Failed to create proposal"
→ Check browser console and Vercel logs for details

## Support

- See [RESEND_SETUP.md](./RESEND_SETUP.md) for full setup guide
- See [PROPOSAL_BUG_FIX.md](./PROPOSAL_BUG_FIX.md) for bug fixes
- Check Resend docs: https://resend.com/docs

## Summary

**Priority 1 (Required):**
1. Run migration 007 in Supabase
2. Get Resend API key
3. Add to environment variables
4. Test locally

**Priority 2 (Recommended):**
1. Verify domain in Resend
2. Deploy to production
3. Test in production

**Priority 3 (Nice to have):**
1. Set up email monitoring
2. Configure webhooks (for tracking opens/clicks)
3. Customize email templates

