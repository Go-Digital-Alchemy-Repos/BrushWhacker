# BrushWhackers - Land Clearing & Brush Removal

## Overview
BrushWhackers is a full-stack web application for a professional land clearing and brush removal business targeting the Charlotte, North Carolina area. Built with React + Vite frontend, Node/Express backend, and PostgreSQL database. Includes a complete admin portal with CRM lead management.

## Current Phase
Phase 4: Admin Portal + CRM

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Wouter (routing) + TanStack Query
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon-backed via Drizzle ORM)
- **Auth**: Passport.js LocalStrategy + express-session (MemoryStore)
- **Font**: Inter (applied globally)
- **Brand Color**: Blue (primary: 217 91% 60%)

## Project Structure
```
client/src/
  components/
    admin/
      admin-layout.tsx   - Admin layout with sidebar nav, auth guard, mobile support
    layout/              - SiteLayout (with sticky quote button), TopNav, Footer
    sticky-quote-button  - Fixed position "Get a Quote" button on desktop
    ui/                  - Shadcn UI components
  hooks/
    use-admin-auth.ts    - Admin authentication hook (login/logout/me)
    use-page-meta.ts     - Hook for per-page SEO (title + meta description)
    use-toast.ts         - Toast notifications hook
  pages/
    home.tsx             - SEO landing page
    services.tsx         - Services overview
    service-detail.tsx   - Individual service pages
    pricing.tsx          - 4 pricing tiers
    blog.tsx             - Blog listing
    blog-post.tsx        - Blog post view
    quote.tsx            - Multi-step quote form (4 steps)
    admin/
      login.tsx          - Admin login page
      dashboard.tsx      - Dashboard with stats cards and pipeline overview
      leads.tsx          - CRM leads list with filters, search, pagination
      lead-detail.tsx    - Lead detail with status, notes, activity timeline
      cms.tsx            - Content manager shell
      branding.tsx       - Branding settings shell
      docs.tsx           - Docs library (Phase 4 documentation)
  lib/
    stock-images.ts      - Stock image URL constants
    services-data.ts     - Full service definitions with SEO content
    queryClient.ts       - TanStack Query config with apiRequest helper
server/
  auth.ts                - Passport.js setup, session config, requireAdmin middleware
  routes.ts              - All API endpoints (public + admin)
  storage.ts             - DatabaseStorage class (leads CRUD, notes, activity, stats)
  db.ts                  - Drizzle ORM + pg pool setup
  index.ts               - Express server entry
shared/
  schema.ts              - Drizzle schema (users, leads, lead_notes, lead_activity) + Zod validation
```

## Database Schema
- **users**: id (varchar PK), username, password
- **leads**: id (serial PK), fullName, phone, email, jobAddress, county, servicesNeeded (text[]), propertyType, approximateArea, accessFlags (text[]), accessNotes, desiredOutcome, timeline, budgetComfort, status (New|Contacted|Scheduled|Won|Lost), source, tags (text[]), assignedTo, lastContactedAt, createdAt, updatedAt
- **lead_notes**: id (serial PK), leadId, note, createdBy, createdAt
- **lead_activity**: id (serial PK), leadId, type (STATUS_CHANGE|NOTE_ADDED|ASSIGNED|EXPORTED), payload (jsonb), createdAt

## API Routes
### Public
- `GET /api/health` - Health check
- `POST /api/public/leads` - Create lead (Zod validated, rate-limited 5/min/IP, honeypot spam protection)

### Auth
- `POST /api/admin/login` - Admin login (username/password)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin user (or 401)

### Admin (Protected)
- `GET /api/admin/leads` - List leads with filters (status, county, service, search, dateFrom, dateTo, page, pageSize)
- `GET /api/admin/leads/stats` - Dashboard stats (total, newThisWeek, pipeline counts)
- `GET /api/admin/leads/export.csv` - CSV export of all leads
- `GET /api/admin/leads/:id` - Get single lead
- `PATCH /api/admin/leads/:id` - Update lead (status, tags, assignedTo, lastContactedAt)
- `POST /api/admin/leads/:id/notes` - Add note
- `GET /api/admin/leads/:id/notes` - List notes
- `GET /api/admin/leads/:id/activity` - Activity log
- `GET /api/admin/docs` - Project documentation JSON

## Admin Auth
- Single admin user via ADMIN_PASSWORD environment variable (default: brushwhackers2026)
- Username: admin
- Session-based with express-session + MemoryStore
- All /api/admin/* routes (except login) protected by requireAdmin middleware

## Pricing Model
- Hourly: $250 minimum (first hour), then $175/hr
- Half-Day: $600 (4 hours, effective $150/hr)
- Full-Day: $1,000 (8 hours, effective $125/hr)
- By the Acre: Starting at $900/acre

## SEO Approach
- Each page has unique title and meta description via usePageMeta hook
- H1 tags include service name + "Charlotte, NC"
- Regional references throughout all content

## Running Locally
1. `npm install`
2. Set up environment variables (DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD)
3. `npm run db:push` to create database tables
4. `npm run dev` (starts on port 5000)

## User Preferences
- Brand color: Blue
- Target area: Charlotte, NC & surrounding counties (50mi radius)
- Modern, beautiful, engaging design
- SEO-driven content with local keywords
- Multi-step quote form for lead capture
- Admin CRM for managing leads
