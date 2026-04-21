# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Development server on port 1376
npm run build        # Production build
npm run lint         # ESLint
npm run start        # Production server (default port)
npm run start:prod   # Production server on port 3002
```

## Architecture Overview

This is a **Next.js 16 App Router** application (React 19) for a Chabad center website with:
- **Strapi v5** headless CMS for content management
- **Stripe / PayArc** payment processing (switchable via `PAYMENT_PROVIDER` env var)
- **Tailwind CSS 4** with 8 dynamic color themes
- **Nodemailer** for email notifications

### Directory Structure

```
src/app/
├── (pages)/                    # Route groups
│   ├── (main)/                 # Home, about, contact, donation pages
│   ├── (entries)/              # Hotels, restaurants, activities, custom pages
│   └── (app)/                  # Checkout, reservations, booking flows
├── api/                        # API routes (checkout, webhooks, contact, newsletter)
├── components/
│   ├── layout/                 # Header, Footer, navigation
│   ├── sections/               # Feature-specific page sections
│   └── ui/                     # Reusable UI components (cart, notifications, icons)
├── context/                    # CartContext, NotificationContext, SiteConfigContext
├── services/                   # API clients and business logic
│   └── payment/                # Payment provider abstraction (Stripe, PayArc)
└── utils/                      # Helper functions
```

### Key Services

- **`services/strapiApiFetch.js`** - Centralized Strapi API client with 50+ endpoints. Uses `typeof window === 'undefined'` at call time to choose between `STRAPI_INTERNAL_URL` (server) and `NEXT_PUBLIC_STRAPI_API_URL` (client). All content fetching goes through this service.

- **`services/payment/index.js`** - Payment provider abstraction. `getPaymentProvider()` returns a singleton Stripe or PayArc provider based on `PAYMENT_PROVIDER` env var. Both providers share the same interface (`createCheckoutSession`, etc.).

- **`services/strapi-orders.js`** - Order persistence to Strapi. Handles 4 order types: donations, shabbat meals, shabbat boxes, custom events.

- **`services/emailService.js`** - HTML email templates with theme-aware styling via `getThemeColors()` that mirrors the CSS theme system. Used for order confirmations, donation receipts, and admin notifications.

- **`services/shabbatTimesApi.js`** - Hebcal API integration for Shabbat times and Jewish calendar events.

### Data Fetching Pattern

Server components fetch data directly with async/await (no React Query/SWR). Root layout fetches site config, platform settings, events, and custom pages in parallel and passes them down:

```javascript
const [siteConfig, platformSettings, allEvents, customPages] = await Promise.all([
  api.siteConfig(),
  api.platformSettings(),
  api.shabbatsAndHolidays(),
  api.customPages()
]);
```

### State Management

React Context (no Redux/Zustand):
- `CartContext` - Shopping cart with localStorage persistence. Prevents mixing product types (`mealReservation`, `customEvent`, `shabbatBox`) and enforces same-date items. Returns `'conflict'` string from `addToCart()` when type/date conflict triggers a modal.
- `NotificationContext` - Toast notifications with type-specific durations (success: 5s, error: 8s, warning: 6s, info: 5s). Auto-dismiss handled by `NotificationItem` component.
- `SiteConfigContext` - Server-fetched site configuration including theme.

### Dynamic Theme System

8 themes controlled via `data-theme` attribute on `<html>`: blue, teal, green, turquoise, red, coral, orange, gold. CSS custom properties in `globals.css` define colors per theme, with `color-mix()` for derived shades. Theme is set from `siteConfig.color_theme` in root layout.

### Server/Client Component Split

Layout components follow a consistent split pattern:
- `Header.js` (server) fetches data via `getEnvVars()`, renders `HeaderClient.js`
- `HeaderClient.js` ("use client") handles interactivity, state, lazy-loaded components like `CartPopup`

## Key Conventions

- **Path alias**: `@/*` maps to `src/*`
- **Trailing slashes**: All URLs end with `/` (configured in next.config.mjs)
- **Base path**: Supports reverse proxy setups via `NEXT_PUBLIC_BASE_PATH`
- **Route groups**: Parenthesized folders `(name)` organize routes without affecting URL paths
- **Server-first**: Server components fetch data, pass props to client components for interactivity
- **API route pattern**: Export GET (diagnostic) + POST. Validate Content-Type, parse JSON with try-catch, return JSON errors with status codes.
- **Anti-spam**: Contact form API uses honeypot field, submission time threshold (< 2s = spam), and regex pattern matching.

## Environment Variables

Server-only:
- `STRAPI_API_URL`, `STRAPI_API_TOKEN`, `STRAPI_INTERNAL_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `EMAIL_USER`, `EMAIL_PASS`
- `PAYMENT_PROVIDER` - `stripe` or `payarc`
- `USE_WEBHOOK_PROCESSING` - `true` in prod (with SSL), `false` in dev

Client-accessible (NEXT_PUBLIC_):
- `NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_STRAPI_API_TOKEN`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_BASE_PATH`

## Payment Flow

1. Frontend creates cart items via CartContext
2. POST to `/api/checkout` creates payment session (Stripe or PayArc based on `PAYMENT_PROVIDER`)
3. User completes payment on provider's hosted page
4. Webhook (`/api/webhooks/stripe` or `/api/webhooks/payarc`) processes completion
5. Order saved to Strapi, confirmation emails sent

## Production Deployment

Uses PM2 with ecosystem.config.js. App name: `chabad_front_demo`, port 1303. PM2 config manually parses `.env` (no dotenv dependency). Max memory: 1GB, autorestart enabled.
