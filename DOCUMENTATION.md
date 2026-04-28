# Botswana Services — Complete Project Documentation

> A full-stack business directory and marketplace platform serving Botswana, built with Next.js 13, Prisma, and PostgreSQL.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [Authentication](#6-authentication)
7. [Subscription Tiers](#7-subscription-tiers)
8. [Advertising System](#8-advertising-system)
9. [Payment Integration (PayGate)](#9-payment-integration-paygate)
10. [API Reference](#10-api-reference)
11. [Key Features](#11-key-features)
12. [Environment Variables](#12-environment-variables)
13. [Getting Started](#13-getting-started)
14. [Deployment](#14-deployment)
15. [Roles & Permissions](#15-roles--permissions)

---

## 1. Project Overview

**Botswana Services** is a B2B2C platform that allows businesses across Botswana to register, create verified profiles, list products and services, publish promotions, manage bookings, and advertise to consumers. Consumers can browse businesses by category or location, read reviews, make bookings, and save favourites.

The platform is monetised through:
- **Subscription plans** for business accounts (Free → Desert Elephants BWP 500/yr → Desert Lions BWP 750/yr)
- **Advertising packages** — rotating banner ads, sticky sidebar ads, inline ads
- **Featured hero spaces** — paid carousel slots on the homepage (BWP 100/month)

All financial transactions flow through **PayGate**, a South African payment gateway with Botswana Pula (BWP) support.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 13.4 (App Router, RSC) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3, Sass (SCSS), Headless UI |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 6 |
| Auth | NextAuth 4 (Google OAuth + Credentials) |
| Storage | Supabase Storage (images, videos) |
| Email | Resend + React Email |
| Payments | PayGate (MD5 checksum API) |
| Maps | Leaflet + React-Leaflet |
| Charts | Recharts |
| Animations | Framer Motion, Lottie |
| Package Manager | pnpm 8 |
| Deployment | Vercel |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Public UI  │  │ Business UI │  │    Admin Panel   │   │
│  │  (consumer) │  │  (BUSINESS) │  │    (ADMIN role)  │   │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘   │
│         └────────────────┴──────────────────┘             │
│                          │                                  │
│              ┌───────────▼───────────┐                     │
│              │    API Routes (/api)  │                     │
│              └───────────┬───────────┘                     │
│                          │                                  │
│         ┌────────────────┼────────────────┐                │
│         ▼                ▼                ▼                │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────┐      │
│  │   Prisma    │ │   Supabase   │ │    PayGate     │      │
│  │  (Postgres) │ │   Storage    │ │   (Payments)   │      │
│  └─────────────┘ └──────────────┘ └────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

**Rendering strategy:**
- Server Components (RSC) for data-heavy pages (listings, directories)
- Client Components for interactive UI (search, filters, modals, payment flows)
- API routes handle all mutations and external service calls

---

## 4. Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (client-components)/    # Client-only components (Header, Footer)
│   │   └── (Header)/           # Header variants, nav, dropdowns
│   ├── (stay-listings)/        # Business directory pages
│   │   ├── page.tsx            # Main directory
│   │   ├── SectionGridFilterCard.tsx
│   │   └── SectionGridPropertyListings.tsx
│   ├── account*/               # User account pages
│   ├── add-listing/[[...stepIndex]]/  # 10-step listing creation wizard
│   ├── admin/                  # Admin panel
│   ├── advertise/              # Advertising purchase page
│   ├── api/                    # All REST API routes
│   ├── business/               # Business owner dashboard
│   ├── listing-stay-detail/[slug]/   # Business detail page
│   ├── listings/               # Product/service listings
│   ├── promotions/             # Business promotions
│   ├── property-listings/      # Property rental listings
│   ├── signup/                 # Registration (user + business)
│   └── subscription/           # Subscription management
│
├── components/                 # Shared UI components
│   ├── ads/                    # Ad display components
│   ├── BusinessAnalytics.tsx
│   ├── Listingcard.tsx
│   ├── LeafletMap.tsx
│   ├── PropertyCard.tsx
│   ├── SectionSubscriptionPackages.tsx
│   └── ...
│
├── contexts/                   # React Context providers
│   ├── AddListingContext.tsx    # Multi-step form state
│   └── ...
│
├── data/                       # Static data files
│   ├── botswanaLocations.ts / namibiaLocations.ts
│   ├── govementdirectory.ts    # Government directory data
│   └── namibiaGovernment.ts    # Botswana government offices
│
├── lib/                        # Server-side utilities
│   ├── auth.ts                 # NextAuth configuration
│   ├── paygate.ts              # PayGate API helpers
│   ├── prisma.ts               # Prisma client singleton
│   ├── subscription-access.ts  # Tier definitions + access checks
│   └── supabase.ts             # Supabase client
│
├── shared/                     # Generic UI primitives
│   ├── Button*.tsx
│   ├── Input.tsx
│   ├── Logo.tsx
│   ├── Pagination.tsx
│   └── Select.tsx
│
├── styles/                     # Global styles
│   └── __theme_colors.scss     # CSS custom properties (Botswana brand palette)
│
└── utils/                      # Utility functions
    ├── geocoding.ts            # Nominatim geocoding (Botswana)
    └── locationUtils.ts        # Botswana bounds + city coordinates
```

---

## 5. Database Schema

### User & Auth

```
User
  id, email, password (bcrypt), name, phone, bio, location, website
  role: USER | BUSINESS | ADMIN
  membershipType: BASIC | PREMIUM
  createdAt, updatedAt

Account     – OAuth provider tokens (linked to User)
Session     – NextAuth sessions
VerificationToken – Email verification
```

### Business

```
Business
  id, userId, name, slug (unique URL), description
  email, phone, website, address, city, country
  latitude, longitude
  category → Category
  establishedYear, employees, services[]
  status: DRAFT | PENDING | PUBLISHED | SUSPENDED
  verified, featured, viewCount, reviewCount, averageRating
  isBranch, branchName, parentBusinessId
  pricingRange: BUDGET | MODERATE | PREMIUM | LUXURY
  subscriptionTier (computed from active Subscription)
  createdAt, updatedAt

BusinessPhoto     – id, businessId, url, isPrimary, caption
BusinessHours     – dayOfWeek (0-6), openTime, closeTime, isClosed
BusinessMembership – membershipType, cardImageUrl, expiryDate, status
Category          – id, name, slug, parentId (hierarchical)
```

### Listings & Properties

```
Listing
  id, businessId, title, description, type, status
  pricePerNight, weekendPrice, monthlyDiscount, currency
  beds, baths, amenities[], photos[]
  ListingStatus: ACTIVE | INACTIVE | ARCHIVED | PENDING | APPROVED | REJECTED | SUSPENDED

PropertyListing
  id, businessId, title, description, type
  beds, baths, pricePerNight, currency
  city, address, amenities[]
  status, createdAt
```

### Reviews & Bookings

```
Review
  id, businessId, userId, rating (1-5), comment
  images[], status: PENDING | APPROVED | REJECTED
  likes → ReviewLike[]

Booking
  id, businessId, userId, serviceId
  customerName, customerEmail, customerPhone
  bookingDate, startTime, endTime
  status: PENDING | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW
  notes, totalAmount
```

### Subscriptions & Payments

```
SubscriptionPlan
  id, tier: WILD_HORSES | DESERT_ELEPHANTS | DESERT_LIONS
  name, description, monthlyPrice, yearlyPrice, currency

Subscription
  id, businessId, planId
  status: ACTIVE | INACTIVE | CANCELLED | EXPIRED | SUSPENDED
  billingCycle: MONTHLY | YEARLY
  startDate, endDate, nextBillingDate
  payGateReference

Payment
  id, businessId, subscriptionId
  amount, currency (BWP)
  status: PENDING | COMPLETED | FAILED | CANCELLED | REFUNDED
  payRequestId, transactionReference
  payGateChecksum
```

### Advertising

```
AdvertisementPackage
  id, packageId (advert1…advert4), name, description
  monthlyPrice, yearlyPrice, currency
  width, height, position, maxAds

AdvertisingSubscription
  id, businessId, packageId
  status: ACTIVE | INACTIVE | PAUSED | EXPIRED | SUSPENDED
  billingCycle, startDate, endDate
  imageUrl, linkUrl, altText

AdAnalytics
  id, subscriptionId
  impressions, clicks, date
  country, city, browser, device

FeaturedHeroSpace
  id, businessId
  imageUrl, linkUrl, altText
  startDate, endDate, isActive
  monthlyPrice (100 BWP), yearlyPrice (1008 BWP)
```

### Other

```
Promotion      – businessId, title, discount%, startDate, endDate, isActive
Notification   – userId, type, title, message, isRead
ContactMessage – name, email, subject, message
Favorite       – userId, businessId
```

---

## 6. Authentication

Authentication is handled by **NextAuth 4** configured in `src/lib/auth.ts`.

### Providers

| Provider | Details |
|----------|---------|
| Google OAuth | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET |
| Credentials | Email + bcrypt-hashed password |

### Session

- Strategy: **JWT**
- Max age: **30 days**
- JWT callback queries the database on every request to keep role/data fresh
- Session object includes: `id`, `email`, `name`, `image`, `role`

### Roles

| Role | Access |
|------|--------|
| `USER` | Browse, review, book, favourites |
| `BUSINESS` | All USER access + business dashboard, listings, analytics |
| `ADMIN` | Full platform access — approve content, manage users, moderation |

### Registration Flows

- `/signup?tab=user-registration` — Standard consumer account
- `/signup?tab=business-registration` — Business account (creates both User + Business records)

---

## 7. Subscription Tiers

Defined in `src/lib/subscription-access.ts`. All prices are **yearly only** in **BWP**.

### 🐴 Wild Horses — FREE

| Feature | Value |
|---------|-------|
| Price | BWP 0 / year |
| Photos | 1 |
| Listings | 1 |
| Promotions/month | 0 |
| Branch locations | 0 |
| Cover image | ✗ |
| Social media links | ✗ |
| Analytics | ✗ |
| Featured badge | ✗ |

### 🐘 Desert Elephants — BWP 500 / year

| Feature | Value |
|---------|-------|
| Price | BWP 500 / year |
| Photos | 10 |
| Listings | 10 |
| Promotions/month | 3 |
| Branch locations | 1 |
| Cover image | ✓ |
| Social media links | ✓ |
| Business hours (public) | ✓ |
| Location map | ✓ |
| Services profile | ✓ |
| Memberships & Associations | ✓ |
| Enhanced ranking | ✓ |
| Priority support | ✓ |

### 🦁 Desert Lions — BWP 750 / year

| Feature | Value |
|---------|-------|
| Price | BWP 750 / year |
| Photos | 50 |
| Listings | Unlimited |
| Promotions/month | 10 |
| Branch locations | 5 |
| All Desert Elephants features | ✓ |
| Video introduction | ✓ |
| Featured business badge | ✓ |
| Top search placement | ✓ |
| WhatsApp chatbot integration | ✓ |
| Full analytics dashboard | ✓ |
| Dedicated account manager | ✓ |

### Access Control Helpers

```ts
hasFeature(tier, 'videoIntroduction')    // boolean
getLimit(tier, 'photos')                 // number
canUploadPhoto(businessId)               // checks current count vs limit
canCreatePromotion(businessId)           // checks monthly usage
canAddBranch(businessId)                 // checks branch count vs limit
canAddListing(businessId)                // checks listing count vs limit
```

---

## 8. Advertising System

Four ad placements are available for businesses to purchase:

| Package ID | Position | Notes |
|-----------|---------|-------|
| `advert1` | Homepage hero rotating banner | Landscape, 8-second rotation |
| `advert2` | Sidebar sticky | Portrait format |
| `advert3` | Below/above CTA sections | Landscape, 7-second rotation |
| `advert4` | Category page top | Landscape, 10-second rotation |

### Featured Hero Space

Premium paid carousel slot on the homepage hero section.

| Billing | Price |
|---------|-------|
| Monthly (30 days) | BWP 100 |
| Yearly (365 days) | BWP 1,008 (~16% discount) |

### Ad Analytics

Every ad impression and click is tracked in the `AdAnalytics` table with device, browser, and location metadata. Accessible from the business analytics dashboard (Desert Lions tier).

---

## 9. Payment Integration (PayGate)

All payments use **PayGate** (`src/lib/paygate.ts`), a South African payment gateway that supports BWP.

### Transaction Flow

```
1. Client clicks "Subscribe Now" / "Purchase Ad"
        │
        ▼
2. POST /api/subscriptions/checkout  (or /advertising/checkout)
   → Generates PayGate params, reference ID
        │
        ▼
3. POST /api/subscriptions/initiate  (server proxy)
   → Calls PayGate initiate.trans
   → Receives PAY_REQUEST_ID, saves to DB
        │
        ▼
4. POST /api/subscriptions/process
   → Calculates checksum for process.trans
   → Returns form params to client
        │
        ▼
5. Client submits hidden form → PayGate payment page
        │
        ▼
6. User completes payment on PayGate
        │
   ┌────┴─────┐
   ▼          ▼
7a. Webhook  7b. Browser redirect
   /callback      /return
   (server)       (client)
        │
        ▼
8. Payment status updated, subscription/ad activated
```

### Security

- All PayGate communication uses **MD5 checksum** validation
- Fields must be in exact key-order for checksum calculation
- Webhook endpoint verifies checksum before activating subscriptions
- No payment data is stored — only transaction reference IDs

---

## 10. API Reference

### Authentication

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register consumer account |
| POST | `/api/auth/business-signup` | Register business account |
| `*` | `/api/auth/[...nextauth]` | NextAuth handlers (login, logout, OAuth) |

### User

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/user/profile` | Get current user profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/businesses` | Get user's businesses |
| GET | `/api/user/favorites` | Get favourite businesses |
| POST | `/api/user/favorites` | Add/remove favourite |
| GET | `/api/user/reviews` | Get user's reviews |
| POST | `/api/user/change-password` | Change password |
| DELETE | `/api/user/delete-account` | Delete account |

### Businesses (Public)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/businesses` | List businesses (filter: category, search, location) |
| GET | `/api/businesses/[slug]` | Get business detail |
| GET | `/api/businesses/category-counts` | Category statistics |
| GET | `/api/categories` | Get all categories |

### Business Management (BUSINESS role)

| Method | Route | Description |
|--------|-------|-------------|
| GET/PUT | `/api/business/profile` | Business profile |
| POST | `/api/business/images` | Upload photos |
| POST | `/api/business/video` | Upload video |
| GET/POST | `/api/business/listings` | Manage product listings |
| GET/POST | `/api/business/property-listings` | Manage property listings |
| GET/POST | `/api/business/bookings` | View/manage bookings |
| GET/POST | `/api/business/branches` | Manage branches |
| GET/POST | `/api/business/memberships` | Manage membership cards |
| GET | `/api/business/analytics` | Business analytics data |

### Listings

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/listings` | All active listings |
| GET | `/api/listings/[id]` | Single listing |
| POST | `/api/listings/create` | Create listing |
| GET | `/api/property-listings` | All property listings |

### Reviews

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/reviews` | List / submit reviews |

### Subscriptions

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/subscriptions/checkout` | Initiate checkout |
| POST | `/api/subscriptions/initiate` | PayGate initiate proxy |
| POST | `/api/subscriptions/process` | PayGate process step |
| POST | `/api/subscriptions/callback` | PayGate webhook |
| GET | `/api/subscriptions/return` | Post-payment redirect |
| GET | `/api/subscriptions/status` | Current subscription status |
| POST | `/api/subscriptions/cancel` | Cancel subscription |

### Advertising

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/advertising/packages` | Available ad packages |
| GET/POST | `/api/advertising/subscriptions` | Ad subscriptions |
| POST | `/api/advertising/initiate` | PayGate initiate proxy |
| POST | `/api/advertising/callback` | PayGate webhook |
| GET | `/api/advertising/analytics` | Ad performance data |
| POST | `/api/advertising/track` | Track impression / click |
| POST | `/api/advertising/upload-image` | Upload ad creative |

### Promotions

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/promotions` | List / create promotions |
| GET/PUT/DELETE | `/api/promotions/[id]` | Manage promotion |
| GET | `/api/promotions/monthly-stats` | Monthly usage count |

### Admin

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Platform statistics |
| GET/PUT | `/api/admin/businesses` | Business moderation |
| GET/PUT | `/api/admin/users` | User management |
| GET/PUT | `/api/admin/reviews` | Review approval |
| GET/PUT | `/api/admin/memberships` | Membership approval |
| GET/PUT | `/api/admin/property-listings` | Property moderation |

---

## 11. Key Features

### Business Directory
- Hierarchical category system
- Search by name, category, city
- Map-based discovery (Leaflet, Botswana bounds)
- Filters: price range, amenities, location, rating
- Verified business badges

### Listing Types
| Type | Details |
|------|---------|
| Products / Services | Standard business listings with pricing |
| Property Listings | Rentals with beds, baths, price/night, amenities |
| Promotions | Discount campaigns with expiry dates |

### Government Directory
Static data (`src/data/govementdirectory.ts`) covering:
- 13 Botswana government ministries
- 12 parastatals (Bank of Botswana, BPC, WUC, BTC, BURS, etc.)
- 6 local authorities
- 4 utility agencies
All with real `.gov.bw` contact information.

### Membership Cards
Businesses can upload membership card images (e.g., Chamber of Commerce, professional associations). Cards go through an admin approval workflow before being displayed on the public profile.

### Reviews & Ratings
- Star rating (1–5) with written reviews
- Review image attachments
- Admin approval before publishing
- "Helpful" likes on reviews
- Average rating displayed on business cards

### Booking System
Service appointment requests flow:
`Customer submits → PENDING → Business confirms → CONFIRMED → COMPLETED`

Businesses manage all bookings from their dashboard. Cancellation and no-show statuses are supported.

### Notifications
Four notification types: `REVIEW`, `BOOKING`, `SYSTEM`, `PROMOTIONAL`. Delivered in-app via the notification bell in the header.

### Analytics Dashboard
Available to **Desert Lions** subscribers:
- View counts over time
- Review count and rating trends
- Ad impression and click-through rates
- Geographic breakdown of visitors

---

## 12. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://user:pass@db.supabase.co:6543/postgres?pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:pass@db.supabase.co:5432/postgres"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-32-char-secret"

# Google OAuth
GOOGLE_CLIENT_ID="xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxx"

# Email (Resend)
RESEND_API_KEY="re_xxxx"

# PayGate (Payments)
PAYGATE_MERCHANT_ID="your-merchant-id"
PAYGATE_MERCHANT_KEY="your-merchant-key"

# App URL (used in email links and PayGate return URLs)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Cloudinary (optional – image hosting)
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="xxxx"
CLOUDINARY_API_SECRET="xxxx"
```

---

## 13. Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+ (`npm install -g pnpm`)
- PostgreSQL database (Supabase recommended)
- PayGate merchant account

### Installation

```bash
# Clone the repository
git clone https://github.com/Cse21-034/BotswanaServices.git
cd BotswanaServices

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Push database schema
pnpm prisma db push

# Seed subscription plans and ad packages
# (Run once after first deployment)
curl -X POST https://yourdomain.com/api/admin/seed-advertising-packages

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### First-time Setup Checklist

- [ ] Add all environment variables to `.env.local`
- [ ] Run `pnpm prisma db push` to create all tables
- [ ] Create an admin user (set `role = 'ADMIN'` directly in the database)
- [ ] Seed advertising packages via the admin API
- [ ] Upload the Botswana Services logo to `/public/images/botswana-logo/`
- [ ] Configure PayGate return/notify URLs to point to your domain

---

## 14. Deployment

The application is deployed on **Vercel** with Supabase as the database backend.

### Vercel Setup

1. Import the GitHub repository into Vercel
2. Set all environment variables listed in [Section 12](#12-environment-variables)
3. Set the **Root Directory** to `/` (project root)
4. Set **Framework Preset** to `Next.js`
5. Deploy

### PayGate Configuration

In the PayGate merchant portal, configure:
- **Return URL**: `https://yourdomain.com/api/subscriptions/return`
- **Notify URL**: `https://yourdomain.com/api/subscriptions/callback`
- **Ad Return URL**: `https://yourdomain.com/api/advertising/return`
- **Ad Notify URL**: `https://yourdomain.com/api/advertising/callback`

### Build Commands

```bash
pnpm build        # Production build
pnpm start        # Start production server
pnpm prisma generate  # Regenerate Prisma client after schema changes
pnpm prisma db push   # Apply schema changes to database
```

---

## 15. Roles & Permissions

### USER (Consumer)
- Browse all public business profiles
- Search and filter businesses by category, location, price
- Submit reviews (pending admin approval)
- Make service bookings
- Save favourite businesses
- Manage personal profile

### BUSINESS (Business Owner)
- All USER permissions
- Create and manage business profile
- Upload photos, video, logo, cover image (limits apply by tier)
- Manage product/service listings
- Manage property listings
- Create promotions (monthly limits apply by tier)
- Add branch locations (limits by tier)
- Manage bookings (confirm, complete, cancel)
- Upload membership cards (admin approval required)
- View business analytics (Desert Lions only)
- Purchase and manage advertising subscriptions
- Purchase featured hero space

### ADMIN
- All BUSINESS permissions
- Approve / reject businesses (`PENDING → PUBLISHED`)
- Approve / reject reviews
- Approve / reject membership cards
- Moderate property listings
- View platform-wide dashboard and statistics
- Manage all users and businesses
- Seed / configure advertising packages
- Batch geocode businesses

---

## Brand & Theme

**Botswana Services** uses a teal/navy/amber colour palette:

| Token | Colour | Usage |
|-------|--------|-------|
| Primary | `rgb(0, 180, 184)` Teal/Cyan | Buttons, links, active states |
| Secondary | `rgb(61, 74, 92)` Navy/Slate | Headers, text |
| Accent (Burgundy) | `rgb(245, 166, 35)` Amber/Gold | Badges, highlights |

Theme colours are defined as CSS custom properties in `src/styles/__theme_colors.scss` and applied via Tailwind's `burgundy-*`, `primary-*` utility classes.

---

## Subscription-Naming Convention

The three subscription tiers are named after iconic Botswana wildlife:

| Tier | Animal | Theme |
|------|--------|-------|
| Wild Horses | 🐴 Free | Entry-level, roam free |
| Desert Elephants | 🐘 BWP 500/yr | Strong, reliable, established |
| Desert Lions | 🦁 BWP 750/yr | Premium, dominant, best of the best |

---

*Documentation generated April 2026 — Botswana Services v1.0*
