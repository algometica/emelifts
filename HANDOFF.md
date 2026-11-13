# Emelifts handoff (for other agents)

Read this before changing the app. Product owner: Harsh. Coach: Em (`em@emelifts.com`). Live domain: `https://emelifts.com`. Repo: `algometica/emelifts`. Current work lives on `member-app` and is meant to replace the old Trainerize-linked marketing site on `main`.

Do not put secrets in git. `.env` is local. Production env is Vercel (or whatever hosts the domain).

## What this is

A mobile-first web app that replaces Trainerize for Emelifts:

- Public marketing site
- Paddle checkout (Emelifts is merchant of record through Paddle, not Stripe)
- Member PWA (today, logger, habits, messages, progress)
- Coach admin (clients, program studio, per-client week edits)

Software access after pay. No WhatsApp coaching. No email or push for messages. Photos and YouTube demos are in the schema but hidden from live UX.

## Stack

- Next.js 16 App Router, React 19, Tailwind 3.4
- Auth.js v5 Credentials JWT (`src/auth.js`, `src/middleware.js`)
- Prisma 6 + Neon Postgres (`DATABASE_URL`)
- Paddle Billing overlay (`@paddle/paddle-js`) + webhook (`@paddle/paddle-node-sdk`)
- bcryptjs passwords

Next 16 docs live under `node_modules/next/dist/docs/`. `AGENTS.md` is auto-rewritten by `next dev`; do not treat it as product docs.

## Public product (now)

Homepage sells **one** plan: **12 Week Wedding Prep** (about CA$444 one-time). CTAs go to `/enroll?plan=wedding`.

Hidden enroll links still work:

- `/enroll?plan=monthly` Lift with EME, $55 / 4 weeks
- `/enroll?plan=challenge` 6 Week Challenge, $222 one-time
- `/enroll?plan=wedding` default

Coach can still run all three calendars in `/coach/programs`.

## Member flow

1. Home → Start Prep → `/enroll?plan=wedding`
2. Name, email, password, terms → Paddle overlay (sandbox until live keys)
3. `/enroll/thanks` then `/login`
4. Paddle webhook `POST /api/webhooks/paddle` must call `grantAppAccess` or the member stays on `/app/waiting`
5. `/app` Today: this week only (Sun–Sat strip). Rest days vs workout card
6. `/app/workout/[sessionId]` logger. Finish submits set fields (`finishWorkout`)
7. `/app/progress` habit week grid + optional weight
8. `/app/messages` 1:1 with coach. Edit 2h, undo send 30s. No thread delete
9. `/app/profile` password + sign out

Middleware: `/app` and `/coach` need a session. Non-coach hitting `/coach` goes to `/app`.

## Coach flow

Login as coach → `/coach`.

- **Clients**: list, complimentary invite (no Paddle), pending enroll unlock
- **Client page**: pause/on, send calendar from that client’s start date, **This client’s week** (copy-on-write for one person), messages
- **Programs**: master templates. Week 1 is default. Later weeks copy week 1 until Customize week N. **Send to clients** rebuilds upcoming days from each membership start (does not reset everyone to today). Logged days stay
- **Account**: password

Staggered starts: program week is relative to each client start, not a shared calendar week.

## Data (Prisma)

Important models: `User` (role `member` | `coach`), `Membership` (plan, status, Paddle ids, `programId`, `startDate`), `Program` (`planKey` unique: `monthly` | `challenge` | `wedding` | `custom-*`), `Workout` (`weekIndex` 0-based, `dayOffset` 0–6 Sun–Sat, optional `userId` for a client-only clone), `Exercise`, `ScheduledSession`, `SetLog`, `Habit` / `HabitLog`, `Message` (`editedAt`).

`src/lib/schedule.js` fans a program out to dates. Client-specific workouts win over master for that week.

## Paddle

Env (see `.env.example`):

- `PADDLE_ENV` `sandbox` | `production`
- `PADDLE_API_KEY` server
- `PADDLE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` (sandbox `test_…`)
- `PADDLE_PRICE_MONTHLY` / `CHALLENGE` / `WEDDING` are **price** ids `pri_…` not product ids

Checkout: overlay, one-page, success `/enroll/thanks`. Default payment link in Paddle checkout settings must be a real https origin (not localhost), typically `https://emelifts.com/enroll`.

Webhook: `transaction.completed` (one-time wedding/challenge) and subscription events for monthly. Destination must be **this** app: `https://emelifts.com/api/webhooks/paddle`. The old Trainerize site will not grant member-app access.

**Not live until:** Paddle production account, payout/bank details, live API key + client token + live price ids, `PADDLE_ENV=production` on the host, webhook secret for the live destination. Sandbox checkout does not pay Em.

## Auth / ops

- Coach seeded via `COACH_EMAIL` / `COACH_PASSWORD` (rotate; do not commit)
- `AUTH_SECRET`, `AUTH_URL` must match the deployed origin
- Neon is production DB. `prisma db push` for schema
- Rate limit on auth POSTs (`src/lib/limit.js`)

## Files to start from

| Area | Path |
|---|---|
| Plans / prices | `src/lib/plans.js`, `src/lib/links.js` |
| Home / nav | `src/app/page.js`, `src/lib/nav.js`, `src/components/Pricing.js` |
| Enroll | `src/app/enroll/page.js`, `src/components/app/PaddleCheckout.js` |
| Webhook / grant | `src/app/api/webhooks/paddle/route.js`, `src/lib/access.js` |
| Schedule | `src/lib/schedule.js` |
| Coach studio | `src/components/coach/ProgramStudio.js`, `ClientWeekStudio.js` |
| Member today / logger | `src/app/app/page.js`, `src/components/app/WorkoutLogger.js` |
| Coach copy for Em | `docs/COACH.md` |

## Do not

- Wire Stripe or Interac
- Merge thinking this is still “Trainerize plus a landing page”
- Point Paddle webhooks at the old Trainerize app
- Expose photos / YouTube in member UX unless asked
- Commit `.env`
