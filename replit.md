# BrushWhackers - Land Clearing & Brush Removal

## Overview
BrushWhackers is a full-stack web application for a professional land clearing and brush removal business targeting the Charlotte, North Carolina area. Built with React + Vite frontend, Node/Express backend, and PostgreSQL database.

## Current Phase
Phase 3: Pricing + Quote Form + Leads API

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Wouter (routing) + TanStack Query
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon-backed via Drizzle ORM)
- **Font**: Inter (applied globally)
- **Brand Color**: Blue (primary: 217 91% 60%)

## Project Structure
```
client/src/
  components/
    layout/              - SiteLayout (with sticky quote button), TopNav, Footer
    sticky-quote-button  - Fixed position "Get a Quote" button on desktop
    ui/                  - Shadcn UI components
  hooks/
    use-page-meta.ts     - Hook for per-page SEO (title + meta description)
    use-toast.ts         - Toast notifications hook
  pages/
    home.tsx             - SEO landing page (hero, What We Clear, services, process, Why BW, service area, testimonials, CTA)
    services.tsx         - Services overview with SEO meta
    service-detail.tsx   - Individual service pages (Best For, What's Included, Typical Projects, Pricing Factors, FAQs, Related Services)
    pricing.tsx          - 4 pricing tiers (Hourly, Half-Day, Full-Day, By the Acre) + What Affects Price + FAQ
    blog.tsx             - Blog listing with SEO meta
    blog-post.tsx        - Blog post view
    quote.tsx            - Multi-step quote form (4 steps) submitting to /api/public/leads
    admin/
      dashboard.tsx      - Admin dashboard
      leads.tsx          - CRM leads management
      cms.tsx            - Content manager shell
      branding.tsx       - Branding settings shell
      docs.tsx           - Docs library (fetches from /api/admin/docs)
  lib/
    stock-images.ts      - Stock image URL constants (STOCK_IMAGES, SERVICE_IMAGES)
    services-data.ts     - Full service definitions (slug, title, SEO meta, intro, bestFor, whatsIncluded, typicalProjects, pricingFactors, FAQs, relatedSlugs)
    queryClient.ts       - TanStack Query config with apiRequest helper
server/
  routes.ts              - API endpoints
  storage.ts             - DatabaseStorage class (leads CRUD)
  db.ts                  - Drizzle ORM + pg pool setup
  index.ts               - Express server entry
shared/
  schema.ts              - Drizzle schema (users, leads tables) + Zod validation
```

## Database Schema
- **users**: id (varchar PK), username, password
- **leads**: id (serial PK), fullName, phone, email, jobAddress, county, servicesNeeded (text[]), propertyType, approximateArea, accessNotes, desiredOutcome, timeline, budgetComfort, status (default: 'new'), createdAt

## API Routes
- `GET /api/health` - Health check
- `POST /api/public/leads` - Create lead (Zod validated, rate-limited 5/min/IP, honeypot spam protection)
- `GET /api/admin/leads` - List all leads
- `GET /api/admin/docs` - Project documentation JSON

## Pricing Model
- Hourly: $250 minimum (first hour), then $175/hr
- Half-Day: $600 (4 hours, effective $150/hr)
- Full-Day: $1,000 (8 hours, effective $125/hr)
- By the Acre: Starting at $900/acre

## SEO Approach
- Each page has unique title and meta description via usePageMeta hook
- H1 tags include service name + "Charlotte, NC"
- Regional references: Mecklenburg, Union, Cabarrus, Gaston counties, Lake Norman, Matthews, Mint Hill, Huntersville, Concord, Fort Mill, Belmont
- Internal links between service pages via relatedSlugs
- Sticky "Get a Quote" button on desktop

## Running Locally
1. `npm install`
2. Set up environment variables (DATABASE_URL, SESSION_SECRET)
3. `npm run db:push` to create database tables
4. `npm run dev` (starts on port 5000)

## User Preferences
- Brand color: Blue
- Target area: Charlotte, NC & surrounding counties (50mi radius)
- Modern, beautiful, engaging design
- SEO-driven content with local keywords
- Multi-step quote form for lead capture
