# Handy Help NZ — Project Status

Last updated: December 2025

---

## Current State

### What's Working ✅

- [x] Landing page deployed
- [x] Basic booking form
- [x] Supabase database connected
- [x] Auth system configured
- [x] Vercel deployment pipeline
- [x] Mobile-responsive design

### In Progress 🔄

- [ ] Admin dashboard for William
- [ ] Email notifications (Resend integration)
- [ ] Booking confirmation flow

### Not Started Yet 📋

- [ ] Payment integration
- [ ] Seasonal scheduling logic (Southern Hemisphere)
- [ ] Customer portal (view/modify bookings)
- [ ] SMS notifications

---

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build (catches type errors)
npm run lint             # Check for issues

# Database
npx supabase db push     # Push schema changes
npx supabase gen types   # Generate TypeScript types

# Components
npx shadcn@latest add [component]  # Add shadcn component
```

---

## Environment Variables

Required in `.env.local` and Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
```

---

## Known Issues

| Issue | Status | Notes |
|-------|--------|-------|
| Edge Runtime warnings | Ignore | Supabase SSR uses Node.js APIs, doesn't break build |
| Mobile keyboard overlap | To fix | Form inputs on iOS |

---

## Architecture Notes

### Route Groups

```
app/
├── (public)/          # No auth required
│   ├── page.tsx       # Landing
│   └── book/          # Booking flow
├── (admin)/           # Auth required (William only)
│   └── dashboard/     # Admin views
└── api/               # API routes
```

### Supabase Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `customers` | Customer records | name, email, phone, address |
| `bookings` | Booking requests | customer_id, service_type, status |
| `visits` | Scheduled visits | booking_id, date, completed |
| `properties` | Property details | customer_id, lawn_size, access_notes |

### Auth Flow

1. Customer: No auth needed (public booking)
2. Admin: Supabase Auth, protected by middleware
3. Middleware checks `/dashboard` routes

---

## Next Session: Pick Up Here

**Priority:** Admin dashboard

William needs to see and manage bookings. Start with:

1. Dashboard home page (`app/(admin)/dashboard/page.tsx`)
2. Bookings list with status indicators
3. Mark visit as complete action

**Files to create:**
- `app/(admin)/dashboard/page.tsx`
- `app/(admin)/dashboard/bookings/page.tsx`
- `components/dashboard/bookings-table.tsx`
- `app/actions/bookings.ts` (server actions)

---

## Deployment

**Production:** handyhelp.nz  
**Preview:** Automatic on PR  
**Platform:** Vercel (connected to GitHub)

Pushing to `main` triggers automatic deploy.

---

## Contacts

- **William:** Runs the business, access to dashboard
- **Ben:** Technical oversight, Yoonet/Outer Edge
