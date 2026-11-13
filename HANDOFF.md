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

Homepage sells **one** plan, set by `PUBLIC_PLAN_ID` in `src/lib/plans.js` (currently `wedding`). Header is Program + Log in + that plan’s CTA (`publicCta()`). Flip `PUBLIC_PLAN_ID` (and the pricing card copy) when another program is public.

Hidden enroll links still work:

- `/enroll?plan=monthly` Lift with EME, $55 / 4 weeks
- `/enroll?plan=challenge` 6 Week Challenge, $222 one-time
- `/enroll?plan=wedding` default

Coach can still run all three calendars in `/coach/programs`.

## Member flow

1. Home → public CTA (`publicCta()`, now Start Prep) → `/enroll?plan=` + `PUBLIC_PLAN_ID`
2. Name, email, password → Paddle overlay (sandbox until live keys)
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

Checkout: overlay, one-page, success `/enroll/thanks`. Default payment link in Paddle checkout settings must be a real https origin (not localhost), typically `https://www.emelifts.com/enroll`.

Webhook: `transaction.completed` (one-time wedding/challenge) and subscription events for monthly. Destination must be **this** app: `https://www.emelifts.com/api/webhooks/paddle`. The old Trainerize site will not grant member-app access.

## Go live (productionize)

Live host is **Vercel**, domain **https://www.emelifts.com** (apex `emelifts.com` redirects there). Neon is the database. Do not commit `.env`.

### Where we are

Testing on the real domain with **sandbox Paddle**. Cards do not pay Em. Coach/test logins work once Auth + Neon are on Vercel.

### Vercel env for testing (sandbox)

Production environment. After any add/edit, **Redeploy**.

| Name | Notes |
| --- | --- |
| `DATABASE_URL` | Same Neon pooled URL as local |
| `AUTH_SECRET` | New random string. Not the local placeholder |
| `AUTH_URL` | `https://www.emelifts.com` (not localhost) |
| `PADDLE_ENV` | `sandbox` |
| `PADDLE_API_KEY` | Sandbox key (`pdl_sdbx_…`) |
| `PADDLE_WEBHOOK_SECRET` | Sandbox notification secret |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Sandbox `test_…`. Vercel will warn; **Change to Config**. This token is meant for the browser |
| `PADDLE_PRICE_WEDDING` | Sandbox `pri_…` |
| `PADDLE_PRICE_MONTHLY` | Sandbox `pri_…` (hidden enroll) |
| `PADDLE_PRICE_CHALLENGE` | Sandbox `pri_…` (hidden enroll) |

Do not set `COACH_EMAIL` / `COACH_PASSWORD` unless seeding an empty DB. Coach already exists in Neon.

Paddle sandbox webhook destination: `https://www.emelifts.com/api/webhooks/paddle`. If it still points at Trainerize, pay succeeds and the member stays on waiting.

### Em: Paddle live + bank (money to her)

She does this in **Paddle live**, not sandbox.

1. Open Paddle and switch to the **live** account (not sandbox).
2. Finish business verification (legal name, BC corp, tax as they ask).
3. Add **payout / bank details** so Paddle can send her money.
4. Wait until Paddle says the account can take live payments.
5. Create the live catalog (price ids `pri_…`, not product ids `pro_…`):
   - 12 Week Wedding Prep, one-time, CAD (homepage)
   - Monthly and 6 Week Challenge only if those will be sold
6. Developer tools → create a **live** API key and a **live** client-side token (not `test_…`, not `pdl_sdbx_…`).
7. Checkout settings → default payment link `https://www.emelifts.com/enroll` (https, not localhost).
8. Notifications → live webhook to `https://www.emelifts.com/api/webhooks/paddle`.
   Subscribe: `transaction.completed`, `subscription.created`, `subscription.activated`, `subscription.canceled`, `subscription.past_due`, `subscription.paused`.
9. Copy the **new** live webhook secret. Sandbox secret will not verify live events.
10. Text Harsh that live Paddle + bank are done, and send the live `pri_…` / tokens through a private channel (not git, not `docs/COACH.md`).

### Harsh / agent: switch Vercel from sandbox to live

Only after Em finishes the list above. Edit **Production** vars (do not leave sandbox keys in Production):

| Name | Change to |
| --- | --- |
| `PADDLE_ENV` | `production` |
| `PADDLE_API_KEY` | Live server key |
| `PADDLE_WEBHOOK_SECRET` | Live webhook secret |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Live client token (still Config / `NEXT_PUBLIC_`) |
| `PADDLE_PRICE_WEDDING` | **Live** `pri_…` (new id, not the sandbox one) |
| `PADDLE_PRICE_MONTHLY` | Live `pri_…` if that product exists |
| `PADDLE_PRICE_CHALLENGE` | Live `pri_…` if that product exists |

Leave `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` as they are.

Then **Redeploy** Production. `NEXT_PUBLIC_*` is baked in at build time.

Smoke check on https://www.emelifts.com:

1. Log in as coach.
2. Start Prep → overlay is live Paddle (not sandbox / test cards).
3. One real or Paddle-approved live test charge → member can log in and sees Today (webhook granted).
4. Paddle dashboard shows the payout going to Em’s bank, not a sandbox sale.

If overlay fails: missing or still-sandbox `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`, or default payment link is localhost. If paid but waiting: webhook URL/secret still sandbox or still Trainerize. If login 500 / “server configuration”: `AUTH_SECRET` or `AUTH_URL` wrong.

## Auth / ops

- Coach seeded via `COACH_EMAIL` / `COACH_PASSWORD` (rotate; do not commit)
- Do not put passwords in `docs/COACH.md` or any tracked file
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
