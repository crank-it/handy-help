# Handy Help NZ — Quick Prompts

Copy-paste these prompts when working on specific features.

---

## Resume Session

```
I'm continuing work on Handy Help NZ (William's lawn mowing service).

Please read:
- CLAUDE.md for project context
- PROJECT-STATUS.md for current state
- .cursorrules for coding rules

Then confirm you're ready and tell me where we left off.
```

---

## New Dashboard Page

```
Create a new dashboard page for [PURPOSE].

Location: app/(admin)/dashboard/[route]/page.tsx

Requirements:
- Server component for data fetching
- Add loading.tsx skeleton
- Add error.tsx error boundary
- Use shadcn/ui components
- Tailwind only — no custom CSS
- Mobile responsive

Data to display: [DESCRIBE]
Actions needed: [LIST]
```

---

## New Booking Feature

```
Add a new feature to the booking flow: [DESCRIBE FEATURE]

Requirements:
- Keep existing booking form structure
- Use react-hook-form + zod for validation
- shadcn/ui form components
- Tailwind only
- Mobile-first design
- Server action for submission
```

---

## Fix Styling Issue

```
I have a styling issue in: [FILE PATH]

Expected: [WHAT IT SHOULD LOOK LIKE]
Actual: [WHAT IT LOOKS LIKE]

Fix using:
- Tailwind classes only
- No custom CSS
- Check if shadcn/ui has a component for this
```

---

## Add Supabase Table

```
Add a new Supabase table for: [PURPOSE]

Fields:
- [FIELD]: [TYPE] - [DESCRIPTION]
- [FIELD]: [TYPE] - [DESCRIPTION]

Include:
1. SQL migration
2. TypeScript type definition
3. Example query

Follow existing patterns in lib/supabase/
```

---

## Email Notification

```
Create an email notification for: [TRIGGER e.g., "new booking"]

Using Resend, send to: [RECIPIENT]
Include: [CONTENT]

Requirements:
- Server action to trigger
- Clean HTML template
- Include booking details
- Error handling
```

---

## Build Error Fix

```
I'm getting a build error:

[PASTE ERROR MESSAGE]

File: [FILE PATH]

Please:
1. Identify the root cause
2. Fix without breaking existing patterns
3. Ensure it follows .cursorrules
4. Run npm run build to verify
```

---

## Mobile Responsiveness

```
This page isn't working well on mobile: [FILE PATH]

Issues:
- [DESCRIBE MOBILE PROBLEMS]

Please:
- Fix using Tailwind responsive classes
- Test at 375px width (iPhone SE)
- Ensure touch targets are at least 44px
- Keep desktop layout working
```

---

## Quick Checks

```
Before I commit, please verify:

1. No custom CSS files (only globals.css with Tailwind)
2. All components use shadcn/ui where applicable
3. Supabase files have correct type annotations
4. Server components don't use "use client" unnecessarily
5. Forms use react-hook-form + zod
6. npm run build passes

Report any issues found.
```
