# Vercel Environment Variables Setup

## ⚠️ Fix for 500 MIDDLEWARE_INVOCATION_FAILED Error

The middleware error happens because environment variables aren't set in Vercel yet.

## 🚀 Quick Fix (5 minutes)

### Step 1: Go to Vercel Project Settings

1. Visit: https://vercel.com/your-username/handy-help/settings/environment-variables
   - Or go to your Vercel dashboard → handy-help project → Settings → Environment Variables

### Step 2: Add These Environment Variables

Add each of these variables:

#### Required Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bttmnxguqbuvsnqknkqo.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dG1ueGd1cWJ1dnNucWtua3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ1NjEsImV4cCI6MjA4MDUwMDU2MX0.cbHcvVnkPIQk2oCyWI8eT-CbbNvWNGlyrYNWMxFkVuc` | Production, Preview, Development |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dG1ueGd1cWJ1dnNucWtua3FvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDkyNDU2MSwiZXhwIjoyMDgwNTAwNTYxfQ._1U1YJn5ZB9f9nn0KPdQLYYgrg34qdA2bDUiykihdT8` | Production, Preview, Development |
| `NOTIFICATION_EMAIL` | `william@handyhelp.nz` | Production, Preview, Development |
| `ADMIN_PASSWORD` | `handy2025` | Production, Preview, Development |

#### Optional Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `RESEND_API_KEY` | (your Resend API key if you have one) | Production, Preview, Development |

### Step 3: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **3 dots** (•••) menu
4. Click **"Redeploy"**
5. Check "Use existing Build Cache" is **unchecked**
6. Click **"Redeploy"**

OR just push a new commit to trigger a fresh deployment.

### Step 4: Test

Once redeployed, visit:
- https://handy-help-lemon.vercel.app/admin
- Should now redirect to `/admin/login` instead of showing 500 error

## 📋 Visual Guide

### Adding a Variable:

1. **Variable Name**: `NEXT_PUBLIC_SUPABASE_URL`
2. **Value**: `https://bttmnxguqbuvsnqknkqo.supabase.co`
3. **Environments**: Select all (Production, Preview, Development)
4. Click **Save**

Repeat for all variables above.

## ✅ Verification

After redeployment, check:

1. **Health endpoint**: https://handy-help-lemon.vercel.app/api/health
   - Should return JSON with database status

2. **Admin redirect**: https://handy-help-lemon.vercel.app/admin
   - Should redirect to login page (not 500 error)

3. **Login works**: After creating admin user in Supabase
   - Can log in with ben@yoonet.io / admin1234

## 🐛 Troubleshooting

### Still getting 500 error?
- Wait 30 seconds after redeployment
- Clear browser cache
- Check deployment logs in Vercel
- Verify all env vars are saved

### Variables not applying?
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy without build cache
- Check for typos in variable names (case-sensitive!)

### Login doesn't work?
- Create admin user in Supabase first (see CREATE_ADMIN_USER.md)
- Check browser console for errors
- Verify Supabase keys are correct

## 📝 Quick Copy/Paste

For easy setup, here are all the values ready to copy:

```bash
# Supabase URL
https://bttmnxguqbuvsnqknkqo.supabase.co

# Anon Key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dG1ueGd1cWJ1dnNucWtua3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ1NjEsImV4cCI6MjA4MDUwMDU2MX0.cbHcvVnkPIQk2oCyWI8eT-CbbNvWNGlyrYNWMxFkVuc

# Service Key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dG1ueGd1cWJ1dnNucWtua3FvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDkyNDU2MSwiZXhwIjoyMDgwNTAwNTYxfQ._1U1YJn5ZB9f9nn0KPdQLYYgrg34qdA2bDUiykihdT8

# Notification Email
william@handyhelp.nz

# Admin Password
handy2025
```

---

**Next**: Add these to Vercel → Redeploy → Test
**Time**: 5 minutes
