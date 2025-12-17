# Create Admin User in Supabase

After running the database migration, you need to create the admin user account.

## Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Authentication in Supabase**:
   - Visit: https://supabase.com/dashboard/project/bttmnxguqbuvsnqknkqo/auth/users
   - Click **"Add user"** dropdown → **"Create new user"**

2. **Fill in the details**:
   - **Email**: `ben@yoonet.io`
   - **Password**: `admin1234`
   - **Auto Confirm User**: ✅ Check this box (important!)
   - Click **"Create user"**

3. **Done!** You can now log in at:
   - http://localhost:3002/admin/login
   - Or your Vercel URL: https://your-site.vercel.app/admin/login

## Option 2: Using SQL (Alternative)

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Create admin user (only works if you haven't set up email confirmation)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'ben@yoonet.io',
  crypt('admin1234', gen_salt('bf')),
  NOW(),
  NOW(),
  '',
  NOW(),
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider":"email","providers":["email"]}',
  '{}',
  NULL,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
);
```

**Note**: Using the dashboard (Option 1) is much simpler and recommended!

## Test Login

1. Go to: http://localhost:3002/admin/login
2. Enter:
   - **Email**: `ben@yoonet.io`
   - **Password**: `admin1234`
3. Click **Sign In**

You should be redirected to the admin dashboard!

## What's Protected

All admin routes are now protected:
- `/admin` - Dashboard
- `/admin/schedule` - Schedule view
- `/admin/customers` - Customer list
- `/admin/customers/[id]` - Customer details
- `/admin/earnings` - Revenue tracking

The only public admin page is `/admin/login`

## Sign Out

Click **"Sign Out"** in the sidebar to log out.

## Change Password Later

To change the admin password:
1. Go to Supabase Dashboard → Authentication → Users
2. Find `ben@yoonet.io`
3. Click the 3 dots → **"Reset password"**
4. Or update directly in the dashboard

## Add More Admin Users

Repeat the same process with different email addresses. All authenticated users can access the admin panel.

---

**Security Note**: In production, make sure to:
1. Use a stronger password
2. Enable email confirmation
3. Set up password recovery
4. Consider adding role-based access control
