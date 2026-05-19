# MilkJatt — Coding Rules & Standards

> This document is the single source of truth for how code is written across all three layers of the MilkJatt platform: Backend API, Frontend Website, and Mobile App.
> Every developer must read and follow this before writing a single line of code.

---

## Table of Contents

1. [Project Structure Overview](#1-project-structure-overview)
2. [General Rules (All Layers)](#2-general-rules-all-layers)
3. [Backend Rules](#3-backend-rules)
4. [Frontend Rules (Next.js Website)](#4-frontend-rules-nextjs-website)
5. [Mobile App Rules (Android)](#5-mobile-app-rules-android)
6. [API Contract Rules](#6-api-contract-rules)
7. [Database Rules](#7-database-rules)
8. [Git & Branch Rules](#8-git--branch-rules)
9. [Environment & Secrets Rules](#9-environment--secrets-rules)
10. [Naming Conventions](#10-naming-conventions)

---

## 1. Project Structure Overview

```
milkjatt/
├── backend/          # Node.js + Express REST API
├── frontend/         # Next.js 16 website (milkjatt.com)
├── app/              # Android app (React Native / Flutter)
├── vendor-app/       # Vendor Android app
└── doc/              # All documentation lives here
```

---

## 2. General Rules (All Layers)

### 2.1 Code Style
- Use **2 spaces** for indentation — never tabs
- Max line length: **100 characters**
- Always use **single quotes** for strings (except JSX attributes which use double quotes)
- No trailing whitespace
- Files end with a single newline

### 2.2 Comments
- Write comments only when the **WHY is not obvious** from the code
- Never write comments that describe what the code does — the code should be self-explanatory
- No commented-out dead code — delete it, git remembers
- TODO comments must include a name: `// TODO(pritam): remove after launch`

### 2.3 No Magic Numbers
```js
// ❌ Bad
if (quantity > 10) { ... }

// ✅ Good
const MAX_DAILY_QUANTITY_LITRES = 10
if (quantity > MAX_DAILY_QUANTITY_LITRES) { ... }
```

### 2.4 Error Handling
- Never swallow errors silently
- Always log errors with context, not just the error object
- User-facing error messages must be in **Hindi + English both**

### 2.5 Never Hardcode
- No hardcoded phone numbers, prices, or city names in code
- All configurable values go in environment variables or a config file
- Prices come from the database, never from frontend/app code

---

## 3. Backend Rules

### 3.1 Tech Stack
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (access token 15min, refresh token 7 days)
- **File Storage:** AWS S3 or Cloudinary
- **Payments:** Razorpay
- **SMS/OTP:** Twilio or MSG91
- **Real-time:** Socket.IO

### 3.2 Folder Structure
```
backend/
├── src/
│   ├── config/         # DB connection, env config, constants
│   ├── controllers/    # Request handlers only — no business logic
│   ├── services/       # All business logic lives here
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route definitions
│   ├── middlewares/    # Auth, validation, error handling
│   ├── utils/          # Pure utility functions
│   └── jobs/           # Cron jobs (daily delivery scheduling etc.)
├── tests/
└── index.js
```

### 3.3 Controller Rules
- Controllers only: validate input → call service → return response
- **No business logic in controllers**
- Max 20 lines per controller function

```js
// ✅ Correct controller
const createSubscription = async (req, res) => {
  const { milkType, quantity, deliveryTime, frequency } = req.body
  const subscription = await subscriptionService.create({
    userId: req.user.id,
    milkType,
    quantity,
    deliveryTime,
    frequency,
  })
  res.status(201).json({ success: true, data: subscription })
}

// ❌ Wrong — business logic in controller
const createSubscription = async (req, res) => {
  const vendor = await Vendor.findOne({ area: req.body.area })
  if (!vendor.cowMilkAvailable && req.body.milkType === 'cow') {
    // ... 40 more lines of logic
  }
}
```

### 3.4 Service Rules
- One service file per domain: `subscriptionService.js`, `vendorService.js`, `deliveryService.js`
- Services can call other services but never directly access `req` or `res`
- All database queries go inside services, never in controllers or routes

### 3.5 Model Rules
- Every model must have: `createdAt`, `updatedAt` (use Mongoose timestamps)
- Use `enum` for fixed-value fields — never store arbitrary strings
- Add indexes on every field used in a query filter

```js
// ✅ Correct model
const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  milkType: { type: String, enum: ['cow', 'buffalo'], required: true },
  quantityLitres: { type: Number, required: true, min: 0.5, max: 10 },
  deliverySlot: { type: String, enum: ['morning', 'evening'], required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'alternate'], required: true },
  status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active', index: true },
  startDate: { type: Date, required: true },
}, { timestamps: true })
```

### 3.6 API Response Format
Every API response must follow this exact format:

```js
// Success
{
  "success": true,
  "data": { ... },
  "message": "Subscription created successfully"
}

// Error
{
  "success": false,
  "error": {
    "code": "VENDOR_NOT_AVAILABLE",
    "message": "This vendor is not available in your area",
    "messageHindi": "यह vendor आपके area में उपलब्ध नहीं है"
  }
}

// Paginated list
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

### 3.7 Validation Rules
- Validate all incoming data using **express-validator** or **Joi**
- Validate at the route level before the controller runs
- Never trust client-sent prices — always fetch from DB

### 3.8 Authentication Rules
- Every protected route must use the `authenticate` middleware
- Role-based: `authenticate` + `authorize('vendor')` or `authorize('admin')`
- Refresh tokens stored in httpOnly cookies, access tokens in memory (app) or header

### 3.9 Cron Jobs (Critical for Milk Delivery)
```
jobs/
├── scheduleDailyDeliveries.js   # Runs at midnight — creates delivery records for tomorrow
├── sendDeliveryReminders.js     # Runs at 5 AM — notifies vendors of today's deliveries
├── generateMonthlyBills.js      # Runs on 1st of month — creates bill for previous month
└── markMissedDeliveries.js      # Runs at 11 AM and 9 PM — marks unconfirmed as missed
```

Rules:
- Cron jobs must be **idempotent** — safe to run twice without side effects
- Every job logs start time, end time, and count of records processed
- Failed jobs send an alert to admin (email or Slack webhook)

---

## 4. Frontend Rules (Next.js Website)

### 4.1 Tech Stack
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript — strict mode on
- **Styling:** Tailwind CSS + inline styles for brand values
- **Font:** Space Grotesk (CSS var `--font-space-grotesk`)
- **Icons:** lucide-react only
- **State:** Zustand for global state, React state for local
- **Data fetching:** Axios with a shared apiClient

### 4.2 Folder Structure
```
frontend/
├── app/
│   ├── (public)/               # Public pages (no auth)
│   │   ├── milk-delivery-kanpur/
│   │   ├── become-a-milkjatt/
│   │   └── ...
│   ├── (auth)/                 # Login, register
│   ├── admin/                  # Admin dashboard
│   ├── vendor/                 # Vendor dashboard
│   ├── layout.tsx              # Root layout
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/                 # PublicNav, PublicFooter, Sidebar
│   ├── shared/                 # Reusable UI components
│   └── vendor/                 # Vendor-specific components
└── data/
    ├── api/                    # apiClient, endpoints
    ├── services/               # API call functions
    └── store/                  # Zustand stores
```

### 4.3 Page Rules

**Server Components (default):**
- Must export `metadata` for SEO
- Must have `alternates.canonical` set to the full URL
- Must have JSON-LD structured data where applicable
- No `useState`, `useEffect`, or event handlers

**Client Components:**
- Add `"use client"` at the top
- Use only when interactivity is needed
- If a page needs both metadata AND interactivity: create a `layout.tsx` for metadata, keep `page.tsx` as client component

```tsx
// ✅ Correct server component
export const metadata: Metadata = {
  title: 'Milk Delivery in Kanpur | MilkJatt',
  alternates: { canonical: 'https://milkjatt.com/milk-delivery-kanpur' },
}

export default function MilkDeliveryKanpur() {
  return <div>...</div>
}
```

### 4.4 SEO Rules (Every public page must have)
- `title` — max 60 characters, include primary keyword
- `description` — max 160 characters
- `keywords` — 5–8 keywords, mix Hindi and English
- `alternates.canonical` — full absolute URL
- `openGraph` — title, description, url
- JSON-LD — LocalBusiness schema minimum, FAQPage where FAQs exist
- At least 5 FAQs — mix Hindi and English questions

### 4.5 Styling Rules
- **Brand colors — never hardcode hex directly in JSX, use these constants:**
```ts
// Brand palette
const BRAND = {
  primary: '#16A34A',      // Green — primary actions
  primaryDark: '#15803D',  // Green dark — hover states
  primaryLight: '#F0FDF4', // Green light — backgrounds
  accent: '#F59E0B',       // Amber — trial/offer highlights
  dark: '#0F172A',         // Near black — headings
  body: '#334155',         // Slate — body text
  muted: '#64748B',        // Slate — secondary text
  border: '#E2E8F0',       // Light border
  white: '#FFFFFF',
}
```
- Max border radius: `rounded-xl` (never `rounded-3xl` or `rounded-[40px]`)
- No `shadow-2xl` — use `shadow-md` or `shadow-sm`
- No `font-black` with `uppercase tracking-widest` — use `font-bold` max
- Responsive: always mobile-first (`sm:`, `md:`, `lg:` prefixes)

### 4.6 Component Rules
- One component per file
- Props must be typed with TypeScript interfaces
- No `any` type — ever
- Default exports for pages, named exports for components

### 4.7 Internal Linking Rules
Every public page must link to:
- At least 2 other area pages (cross-linking for SEO)
- The main city page (`/milk-delivery-kanpur`)
- The vendor signup page (`/become-a-milkjatt`)
- The app download link (Play Store)

---

## 5. Mobile App Rules (Android)

### 5.1 Tech Stack
- **Framework:** React Native (Expo) OR Flutter — pick one and stick to it
- **State:** Zustand (React Native) or Provider/Riverpod (Flutter)
- **Navigation:** React Navigation (RN) or GoRouter (Flutter)
- **HTTP:** Axios (RN) or Dio (Flutter)
- **Storage:** AsyncStorage (RN) or SharedPreferences (Flutter) for tokens
- **Push Notifications:** Firebase Cloud Messaging (FCM)

### 5.2 Folder Structure (React Native)
```
app/
├── src/
│   ├── screens/
│   │   ├── auth/               # OTP login
│   │   ├── home/               # Home screen
│   │   ├── vendor/             # MilkJatt profile, list
│   │   ├── subscription/       # Create, manage subscription
│   │   ├── delivery/           # Calendar, history
│   │   ├── trial/              # ₹10 trial flow
│   │   └── profile/            # User profile, settings
│   ├── components/             # Reusable UI components
│   ├── navigation/             # Route definitions
│   ├── services/               # API calls
│   ├── store/                  # Zustand stores
│   ├── utils/                  # Helpers, formatters
│   └── constants/              # Colors, fonts, sizes
├── assets/                     # Images, icons, animations
└── app.json
```

### 5.3 Screen Rules
- Every screen is a single file: `HomeScreen.tsx`
- Screen only: fetch data → render UI
- No business logic inside screens — call a service function
- Every screen handles 3 states: **loading**, **error**, **success**

```tsx
// ✅ Correct screen structure
export default function HomeScreen() {
  const { vendors, isLoading, error } = useVendors()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  return <HomeContent vendors={vendors} />
}
```

### 5.4 App Color System
```ts
export const Colors = {
  primary: '#16A34A',
  primaryDark: '#15803D',
  primaryLight: '#DCFCE7',
  accent: '#F59E0B',        // Trial / offer banners
  background: '#FEFDF5',   // Cream background (matches screenshots)
  card: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#64748B',
  border: '#E5E7EB',
  error: '#DC2626',
  success: '#16A34A',
  warning: '#F59E0B',
}
```

### 5.5 Subscription Flow Rules
The subscription flow is the most critical flow in the app. These rules are non-negotiable:

1. **Milk type selection** must show price per litre and availability status
2. **Quantity** minimum is 0.5L, maximum is 10L, step is 0.5L
3. **Delivery time** — Morning (6–10 AM) and Evening (4–8 PM) — show vendor's actual window
4. **Estimated monthly bill** must update in real-time as user changes options
5. **Start date** cannot be today — minimum tomorrow
6. **Order summary** must be shown before confirmation — no surprises

### 5.6 Delivery Calendar Rules
- Green dot = Delivered ✅
- Red dot = Missed ❌
- Orange/Yellow dot = Pending 🕐
- Calendar must show current month by default
- Tapping a day shows delivery detail for that day
- Monthly summary (delivered count, missed count, litres, amount) always visible below calendar

### 5.7 Pause Delivery Rules
- "Pause for tomorrow only" — one tap, no extra steps
- "Select duration" — date range picker, max 30 days pause
- Pause must be set before the delivery cut-off time
- Show next active delivery date after pausing
- Paused days are NOT billed

### 5.8 Push Notification Rules
All notifications must be sent on these triggers:

| Trigger | Message |
|---|---|
| New subscription confirmed | "Aapki subscription shuru ho gayi! Kal subah {time} pe milk milegi." |
| Delivery dispatched | "Aapka doodhwala nikal gaya! {time} tak pahunchega." |
| Delivery completed | "Aaj ka doodh deliver ho gaya. Kaisi lagi? Rate karo." |
| Delivery missed | "Aaj delivery miss ho gayi. Hum investigate kar rahe hain." |
| Monthly bill generated | "Is mahine ka bill ₹{amount} hai. Due date: {date}." |
| Trial ending | "Aapka trial kal khatam hoga. Subscribe karo." |

### 5.9 Offline Handling
- Show delivery calendar from local cache when offline
- Show last known subscription details when offline
- All API errors show a user-friendly message in Hindi — never show raw error strings

### 5.10 Trial Flow Rules (Critical Growth Feature)
The ₹10 trial is the primary acquisition hook. It must be:
- Visible on home screen for all non-subscribed users
- Available only for new users (check on backend — never trust frontend)
- Post-paid: collect payment after 2 days, not before
- Free cancellation before 2nd delivery
- After trial ends: automatically show subscription prompt

---

## 6. API Contract Rules

### 6.1 URL Structure
```
Base: https://api.milkjatt.com/v1

Auth:
  POST   /auth/send-otp
  POST   /auth/verify-otp
  POST   /auth/refresh-token
  POST   /auth/logout

Vendors:
  GET    /vendors                     # List vendors (with area filter)
  GET    /vendors/:id                 # Single vendor profile
  GET    /vendors/:id/reviews         # Vendor reviews

Subscriptions:
  POST   /subscriptions               # Create subscription
  GET    /subscriptions/mine          # User's active subscriptions
  PATCH  /subscriptions/:id           # Update (quantity, time, etc.)
  DELETE /subscriptions/:id           # Cancel subscription
  POST   /subscriptions/:id/pause     # Pause delivery
  POST   /subscriptions/:id/resume    # Resume delivery

Deliveries:
  GET    /deliveries                  # Delivery history (with month filter)
  GET    /deliveries/calendar         # Calendar view data
  PATCH  /deliveries/:id/confirm      # Vendor confirms delivery

Trial:
  POST   /trial/request               # Request trial (new users only)

Bills:
  GET    /bills                       # List monthly bills
  GET    /bills/:id                   # Single bill detail
  POST   /bills/:id/pay               # Pay bill

Wallet:
  GET    /wallet                      # Wallet balance
  POST   /wallet/recharge             # Add funds
```

### 6.2 Versioning
- Always use `/v1/` prefix
- Breaking changes require a new version `/v2/` — never break existing clients
- Deprecate old versions with a header warning for 3 months before removing

### 6.3 Pagination
- All list endpoints must be paginated
- Default limit: 20 items
- Max limit: 100 items
- Use cursor-based pagination for delivery calendar (better performance)

---

## 7. Database Rules

### 7.1 Collections (MongoDB)

```
users           — Customer accounts
vendors         — MilkJatt (dairy farmer) profiles
subscriptions   — Active and past subscriptions
deliveries      — One record per delivery per day per subscription
bills           — Monthly bills per user per vendor
transactions    — Payment records
otps            — OTP records (TTL index: expire after 10 minutes)
notifications   — Push notification log
```

### 7.2 Rules
- Every collection has `createdAt` and `updatedAt` (Mongoose timestamps)
- Never delete records — use `status: 'deleted'` or `isDeleted: true`
- Never store passwords — OTP-only auth
- Phone numbers stored in E.164 format: `+919876543210`
- All amounts stored in **paise (integer)** not rupees — ₹60 = `6000`
- Dates stored as UTC, displayed in IST (UTC+5:30)

### 7.3 Amount Storage (Critical)
```js
// ❌ Never store as float
pricePerLitre: 60.50  // floating point errors

// ✅ Always store as integer paise
pricePerLitreInPaise: 6050  // 60.50 rupees = 6050 paise

// Convert for display
const displayPrice = (paise) => `₹${(paise / 100).toFixed(2)}`
```

---

## 8. Git & Branch Rules

### 8.1 Branch Naming
```
main              — Production only. Never commit directly.
develop           — Integration branch. Merge here first.
feature/xyz       — New features: feature/subscription-pause
fix/xyz           — Bug fixes: fix/calendar-missed-count
hotfix/xyz        — Production hotfixes only
release/v1.2.0    — Release preparation
```

### 8.2 Commit Message Format
```
type(scope): short description

Types: feat, fix, docs, style, refactor, test, chore

Examples:
feat(subscription): add pause delivery with duration selector
fix(calendar): correct missed delivery count for partial months
docs(api): add subscription endpoints to README
chore(deps): upgrade React Native to 0.74
```

### 8.3 Pull Request Rules
- No PR merges without at least 1 review
- PR must pass all tests before merge
- PR description must explain WHAT changed and WHY
- Keep PRs small — max 400 lines changed per PR

---

## 9. Environment & Secrets Rules

### 9.1 Never commit secrets
- `.env` files are in `.gitignore` — always
- Never hardcode API keys, passwords, or tokens in code
- Use environment variables for all secrets

### 9.2 Environment Files
```
.env.development    — Local dev
.env.staging        — Staging server
.env.production     — Production (only CI/CD has access)
```

### 9.3 Required Environment Variables

**Backend:**
```
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
MSG91_AUTH_KEY=
FCM_SERVER_KEY=
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_PLAY_STORE_URL=
```

---

## 10. Naming Conventions

### 10.1 Files
| Layer | Convention | Example |
|---|---|---|
| Backend service | camelCase | `subscriptionService.js` |
| Backend model | PascalCase | `Subscription.js` |
| Backend route | camelCase | `subscriptionRoutes.js` |
| Frontend page | kebab-case folder | `milk-delivery-kanpur/page.tsx` |
| Frontend component | PascalCase | `DeliveryCalendar.tsx` |
| App screen | PascalCase + Screen suffix | `HomeScreen.tsx` |
| App component | PascalCase | `MilkTypeSelector.tsx` |

### 10.2 Variables & Functions
```js
// Variables — camelCase
const milkType = 'cow'
const pricePerLitreInPaise = 6000

// Constants — SCREAMING_SNAKE_CASE
const MAX_PAUSE_DAYS = 30
const TRIAL_DURATION_DAYS = 2
const TRIAL_PRICE_IN_PAISE = 1000

// Functions — camelCase, verb-first
const createSubscription = () => {}
const calculateMonthlyBill = () => {}
const isPausedForDate = () => {}

// React components — PascalCase
const DeliveryCalendar = () => {}

// TypeScript interfaces — PascalCase, no I prefix
interface Subscription { ... }
interface Vendor { ... }

// Enums — PascalCase
enum MilkType { Cow = 'cow', Buffalo = 'buffalo' }
enum DeliverySlot { Morning = 'morning', Evening = 'evening' }
enum SubscriptionStatus { Active = 'active', Paused = 'paused', Cancelled = 'cancelled' }
```

### 10.3 API Field Names
- All API fields: `camelCase`
- Dates: ISO 8601 format (`2026-05-18T06:00:00Z`)
- Amounts: always suffix with unit (`pricePerLitreInPaise`, `quantityLitres`)
- Boolean fields: prefix with `is` or `has` (`isAvailable`, `hasTrial`, `isPaused`)

---

## Quick Reference Card

| Rule | Backend | Frontend | App |
|---|---|---|---|
| Language | JavaScript (Node.js) | TypeScript | TypeScript |
| Indentation | 2 spaces | 2 spaces | 2 spaces |
| Quotes | Single | Single | Single |
| API calls | — | services/ folder | services/ folder |
| Business logic | services/ only | — | — |
| Amounts | Integer paise | Display only | Display only |
| Error messages | Hindi + English | Hindi + English | Hindi + English |
| Auth | JWT middleware | Cookie / header | AsyncStorage |
| Images | S3 / Cloudinary | next/image | FastImage |

---

*Document version: 1.0*
*Created: 2026-05-18*
*Project: MilkJatt*
*Applies to: Backend, Frontend (milkjatt.com), Customer App, Vendor App*
