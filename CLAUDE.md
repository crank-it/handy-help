# Handy Help NZ — Project Context

## What This Is

A booking and scheduling platform for William's lawn mowing service in Dunedin, New Zealand.

**Live site:** handyhelp.nz  
**Owner:** William Carter (15), with guidance from Ben Carter (Yoonet/Outer Edge)

---

## Tech Stack (Non-negotiable)

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | Next.js 14 (App Router) | Server components by default |
| Language | TypeScript | Strict mode, no `any` |
| Styling | Tailwind CSS ONLY | No custom CSS, no inline styles |
| Components | shadcn/ui | Check here first before building custom |
| Database | Supabase | Auth + Postgres |
| Email | Resend | Transactional emails |
| Deployment | Vercel | Connected to this repo |

---

## Critical Rules

1. **Tailwind only** — No `.css` files, no CSS modules, no `style={{}}`
2. **shadcn/ui first** — Before creating a component, check if shadcn has it
3. **Use `cn()` helper** — For conditional classes: `cn("base", condition && "active")`
4. **CSS variables** — Use `bg-background`, `text-foreground`, `text-primary`
5. **Server components default** — Only add `"use client"` when you need interactivity

---

## Supabase Patterns

The Supabase SSR client requires typed cookie handlers. These files have correct types:

- `lib/supabase/types.ts` — Cookie type definitions
- `lib/supabase/server.ts` — Server client (for server components/actions)
- `lib/supabase/client.ts` — Browser client (for client components)
- `middleware.ts` — Auth middleware with route protection

**Never regenerate these files.** They have specific TypeScript types that prevent build errors.

---

## Key Files

| File | Purpose |
|------|---------|
| `app/(public)/page.tsx` | Landing page |
| `app/(public)/book/page.tsx` | Booking flow |
| `app/(admin)/dashboard/page.tsx` | William's admin dashboard |
| `lib/supabase/*` | Database clients (don't modify types) |
| `middleware.ts` | Auth protection (don't remove type annotations) |

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `customers` | Customer records |
| `bookings` | Booking requests |
| `visits` | Scheduled/completed visits |
| `properties` | Property details (lawn size, access, etc.) |

---

## Design System

**Brand:** Trust Blue (#2563EB)  
**Font:** Inter  
**Style:** Professional, trustworthy, scales beyond lawn care

**Key classes:**
- Primary buttons: `bg-primary text-primary-foreground`
- Cards: `bg-card border border-border rounded-lg shadow-sm`
- Headings: `font-semibold text-foreground`
- Muted text: `text-muted-foreground`

---

## Current State

- [x] Landing page live
- [x] Basic booking form
- [x] Supabase auth configured
- [ ] Admin dashboard (in progress)
- [ ] Email notifications via Resend
- [ ] Payment integration

---

## When Making Changes

1. **Check .cursorrules** — Contains detailed patterns for pages, forms, components
2. **Run `npm run build`** — Catch type errors before deploying
3. **Test mobile** — Most customers will book from their phones
4. **Don't add custom CSS** — Everything in Tailwind classes

---

## Common Gotchas

| Issue | Fix |
|-------|-----|
| `cookiesToSet` type error | Check `lib/supabase/server.ts` has `CookieToSet[]` type |
| Edge Runtime warnings | Ignore — doesn't break build |
| Component not found | Run `npx shadcn@latest add [component]` |
| Auth not working | Check `middleware.ts` route matcher |

---

## Useful Commands

```bash
# Install shadcn component
npx shadcn@latest add button

# Run development server
npm run dev

# Build (catches type errors)
npm run build

# Push database changes
npx supabase db push
```
