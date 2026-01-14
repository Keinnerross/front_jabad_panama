# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Development server on port 3001
npm run build        # Production build
npm run lint         # ESLint
npm run start        # Production server (default port)
npm run start:prod   # Production server on port 3002
```

## Architecture Overview

This is a **Next.js 16 App Router** application (React 19) for a Chabad center website with:
- **Strapi v5** headless CMS for content management
- **Stripe** payment processing for donations and event bookings
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
└── utils/                      # Helper functions
```

### Key Services

- **`services/strapiApiFetch.js`** - Centralized Strapi API client with 50+ endpoints. Uses environment-aware URLs (internal for server, external for client). All content fetching goes through this service.

- **`services/strapi-orders.js`** - Order persistence to Strapi. Handles 4 order types: donations, shabbat meals, shabbat boxes, custom events.

- **`services/emailService.js`** - HTML email templates with theme-aware styling for order confirmations, donation receipts, and admin notifications.

- **`services/shabbatTimesApi.js`** - Hebcal API integration for Shabbat times and Jewish calendar events.

### Data Fetching Pattern

Server components fetch data directly with async/await (no React Query/SWR):

```javascript
// Server component pattern
export default async function Page() {
  const [data1, data2] = await Promise.all([
    api.endpoint1(),
    api.endpoint2()
  ]);
  return <ClientComponent data={data1} />;
}
```

### State Management

React Context (no Redux/Zustand):
- `CartContext` - Shopping cart with localStorage persistence, validates product type mixing
- `NotificationContext` - Toast notifications (success, error, warning, info)
- `SiteConfigContext` - Server-fetched site configuration

## Key Conventions

- **Path alias**: `@/*` maps to `src/*`
- **Trailing slashes**: All URLs end with `/` (configured in next.config.mjs)
- **Route groups**: Parenthesized folders `(name)` organize routes without affecting URL paths
- **Server-first**: Server components fetch data, pass props to client components for interactivity
- **Dynamic theming**: `data-theme` attribute on root element controls color scheme (blue, teal, green, turquoise, red, coral, orange, gold)

## Environment Variables

Server-only:
- `STRAPI_API_URL`, `STRAPI_API_TOKEN`, `STRAPI_INTERNAL_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `EMAIL_USER`, `EMAIL_PASS`

Client-accessible (NEXT_PUBLIC_):
- `NEXT_PUBLIC_STRAPI_API_URL`, `NEXT_PUBLIC_STRAPI_API_TOKEN`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_BASE_PATH`

## Payment Flow

1. Frontend creates cart items via CartContext
2. POST to `/api/checkout` creates Stripe session
3. User completes payment on Stripe
4. Stripe webhook (`/api/webhooks/stripe`) processes completion
5. Order saved to Strapi, confirmation emails sent

## Production Deployment

Uses PM2 with ecosystem.config.js. App name: `chabad_front_demo`, port 1303.
