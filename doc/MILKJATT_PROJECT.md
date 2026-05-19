# MilkJatt — Project Documentation

## What is MilkJatt?

MilkJatt is a hyperlocal milk delivery marketplace connecting customers with local dairy farmers (called "MilkJatts") in Kanpur, Uttar Pradesh. Customers subscribe to daily fresh milk delivery — cow or buffalo — from a trusted nearby dairy farmer. The model is subscription-first, not on-demand.

**Current status:** Android app is live and functional. Web presence (website + SEO) does not exist yet.

---

## Brand Identity

| Field | Value |
|---|---|
| App name | MilkJatt |
| City | Kanpur, Uttar Pradesh |
| Vendor term | MilkJatt (the local dairy farmer / doodhwala) |
| Primary color | Green (dairy / natural feel) |
| Tagline | Pure, Fresh & Delivered Daily |
| Trial hook | "Start Your Trial for ₹10 — 0.5L milk daily for 2 days" |

---

## Products

| Product | Price | Notes |
|---|---|---|
| Cow Milk | ₹50–₹60 / litre | Most popular, lighter |
| Buffalo Milk | ₹60–₹70 / litre | Creamier, higher fat |
| Shuddh Khoya | ₹400 / kg | Pre-order, limited stock |
| Curd / Paneer | Future expansion | Not in app yet |

---

## App Features (Already Built)

### Customer App

**Onboarding**
- OTP-based login (phone number)
- 3-screen onboarding: Quality Tested Milk → Farm Fresh Delivery → Flexible Subscription
- "Get Started" CTA

**Home Screen**
- Greeting with time-based context (Good Morning / Evening)
- Banner carousel (promotions, khoya pre-order)
- Quick Actions: Subscription, History, Support
- Trial CTA: "Start Your Trial for ₹10"
- Top Rated MilkJatts (horizontal scroll with farm photos, ratings, milk types)
- Available Milk Types: Cow, Buffalo

**MilkJatt (Vendor) Profile**
- Farm photo / cover image
- Vendor name, location (village/area, Kanpur)
- Star rating with review count
- Dairy name
- Milk type tags (Cow / Buffalo)
- Farm stats: Subscribers count, Cows count, Buffaloes count
- Farm Gallery button
- Milk Prices per litre (with availability status)
- Delivery Schedule: Morning (6:00 AM – 10:00 AM) / Evening (4:00 PM – 8:00 PM)
- Subscribe Now button

**Create Subscription Flow**
- Select Milk Type: Cow or Buffalo (with price per litre)
- Quantity selector (liters per delivery, +/- stepper)
- Delivery Time: ☀️ Morning (6–10 AM) or 🌙 Evening (4–8 PM)
- Delivery Frequency: Daily / Weekly / Alternate
- Start Date picker
- Special Instructions (optional text field)
- Order Summary: Milk Type, Quantity, Frequency, Time
- Estimated Monthly Bill shown at bottom
- "Start Subscription" CTA

**Trial Request**
- 500ml fresh milk daily for 2 days
- Total: 1 Litre
- Post-paid — Pay after trial
- Free cancellation anytime
- Choose Milk Type: Cow or Buffalo
- Available for new users only

**Subscription Management**
- Next delivery: date + time window
- View Delivery History link
- Subscription Details: Milk Type, Quantity/day, Frequency, Start Date
- Quick Actions:
  - ⏸ Pause Delivery
  - ➕ Extra Milk
  - 📋 Extra Orders
  - 🕐 Change Time
- Call vendor button
- WhatsApp vendor button
- Stop Subscription button

**Pause Delivery**
- Option 1: Pause for tomorrow only
- Option 2: Select duration (date range)
- Confirm Pause / Cancel

**Delivery Calendar (Order History)**
- Monthly calendar view
- Color coding: 🟢 Delivered / 🔴 Missed / 🟡 Pending
- Monthly summary: Delivered count, Missed count, Pending count, Total litres
- Total amount for the month
- Day-wise delivery history list

**Monthly Bill / Transaction History**
- Month-wise bill cards
- Each card: Month name, Total amount, Due date
- Delivery Summary: days delivered, total litres, milk type, dealer name
- Status: Pending (with Pay Now button) or Paid (with payment method + date)

---

### Vendor (MilkJatt) App
*Features inferred from app — vendor side manages deliveries and subscriptions*

- Accept/manage subscriptions
- Mark deliveries as done
- View subscriber list
- Set availability (cow/buffalo milk available or not)
- Morning and evening delivery rounds

---

## Delivery Model

| Field | Detail |
|---|---|
| Delivery windows | Morning: 6:00 AM – 10:00 AM / Evening: 4:00 PM – 8:00 PM |
| Frequency options | Daily / Weekly / Alternate |
| Order cut-off | Night before (implied) |
| Unit | Per litre (not per can/bottle) |
| Payment | Post-paid monthly bill OR wallet |
| Trial | ₹10 for 2 days, post-paid, new users only |

---

## Key Differentiators vs Competitors

### vs Provilac (competitor studied)
| Feature | MilkJatt | Provilac |
|---|---|---|
| Trial offer | ✅ ₹10 for 2 days | ❌ No trial visible |
| Vendor type | Local dairy farmer (real farm photos) | Branded/packaged milk |
| Farm transparency | ✅ Cows/buffaloes count, farm gallery | ❌ Not shown |
| Khoya / dairy products | ✅ Pre-order available | ✅ A2 milk, packaged |
| Wallet system | ❌ Not yet | ✅ ₹500/1000/2000 packs |
| Vacation mode | ❌ Not yet (pause exists) | ✅ Calendar vacation mode |
| Varying quantity | ❌ Not yet | ✅ "Varying" frequency |

### Gaps to close (priority order)
1. **Wallet / prepaid recharge** — reduces payment friction for monthly bill
2. **Vacation mode** — select date range to pause (pause exists but no calendar view)
3. **Varying quantity** — e.g. 1L Mon–Fri, 2L weekends

---

## Website Needed (Does Not Exist Yet)

### Domain
`milkjatt.com` or `milkjatt.in` — to be confirmed

### Pages to Build (SEO Priority)

| Page | URL | Target Keywords |
|---|---|---|
| Main city page | `/milk-delivery-kanpur` | "milk delivery Kanpur", "दूध डिलीवरी कानपुर" |
| Cow milk page | `/cow-milk-home-delivery-kanpur` | "cow milk delivery Kanpur", "गाय का दूध कानपुर" |
| Buffalo milk page | `/buffalo-milk-home-delivery-kanpur` | "buffalo milk delivery Kanpur", "भैंस का दूध कानपुर" |
| Subscription page | `/daily-milk-subscription-kanpur` | "daily milk subscription Kanpur" |
| Near me page | `/milk-delivery-near-me` | "milk delivery near me" |
| Vendor signup | `/become-a-milkjatt` | "milk vendor Kanpur", "दूध का बिज़नेस कानपुर" |
| Area pages | `/milk-delivery-nawabganj` etc. | Hyperlocal Kanpur areas |

### Website Sections (per page)
- Hero with trial CTA (₹10 for 2 days) — strongest hook
- How it works (3 steps)
- Milk types available (Cow / Buffalo with prices)
- MilkJatt vendor profiles (trust section)
- Delivery schedule (Morning 6–10 AM / Evening 4–8 PM)
- Coverage areas in Kanpur
- FAQ (bilingual Hindi + English)
- Download app CTA

### Tech Stack
Same as Difwa: Next.js App Router, TypeScript, Tailwind CSS, Space Grotesk font
Brand color: Green theme (not Difwa blue)

---

## Business Model

- **Commission per order** from vendor (exact % TBD)
- **No listing fee** for vendors
- **Trial at ₹10** — acquisition hook, post-paid
- **Monthly bill collection** — end of month payment from customer
- **Premium products** — Khoya, curd at higher margins

---

## Growth Strategy

### Vendor Acquisition (Supply)
- Target local dairy farmers in Kanpur villages (Nawabganj, Maitha, Sajhora, Singhpur)
- WhatsApp outreach to existing doodhwalas
- Pitch: "Apne existing customers ko app pe lao + naye customers milenge"
- No technical knowledge needed — simple app

### Customer Acquisition (Demand)
- ₹10 trial is the primary hook — push everywhere
- Kanpur residential society WhatsApp groups
- Facebook: "Kanpur Residents", "Kanpur Moms" groups
- "Pure farm fresh milk — straight from the farmer"

### Retention
- Monthly bill with delivery calendar = transparency = trust
- Pause feature = no reason to cancel permanently
- Extra milk on special occasions (festivals, guests)

---

## Competitor Reference

**Provilac** — studied for feature reference
- Orange brand color, strong subscription UX
- Wallet with ₹500/1000/2000 recharge packs
- A2 milk as premium SKU at ₹90/L
- Calendar-based vacation management
- "Buy Once" vs "Subscribe" toggle on product page
- Varying quantity subscription option
- Strong product detail pages with nutritional info

---

## Contact / Business Info

*(To be updated with MilkJatt-specific contact details)*
- Phone: TBD
- Email: TBD
- Address: Kanpur, Uttar Pradesh

---

*Document created: 2026-05-18*
*Reference: App screenshots from MilkJatt Android app + Provilac competitor analysis*
*Related: MILK_DELIVERY_PIVOT.md (Difwa → Milk strategy)*
