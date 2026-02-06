# BrushWhackers - Forestry Mulching & Land Clearing

## Overview
BrushWhackers is a full-stack web application for a professional forestry mulching and land clearing business targeting the Charlotte, North Carolina area. Built with React + Vite frontend, Node/Express backend, and PostgreSQL database. Includes a complete admin portal with CRM lead management, blog CMS, site-wide branding customization, and a comprehensive CMS with drag-and-drop page builder, block library, templates, media library, theme presets, and URL redirects management. Content style follows BrushWorksco.com approach with problem/solution messaging and forestry mulching focus.

## Current Phase
Phase 8: CMS & Page Builder

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Wouter (routing) + TanStack Query
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon-backed via Drizzle ORM)
- **Auth**: Passport.js LocalStrategy + express-session (MemoryStore)
- **Font**: Inter (configurable via branding settings)
- **Brand Color**: Earth tones (primary: 28 65% 42% warm brown, secondary: 85 35% 38% sage green, configurable via branding settings)

## Project Structure
```
client/src/
  components/
    admin/
      admin-layout.tsx   - Admin layout with sidebar nav, auth guard, mobile support
    layout/              - SiteLayout (with sticky quote button), TopNav, Footer
    sticky-quote-button  - Fixed position CTA button on desktop (text from settings)
    ui/                  - Shadcn UI components
  hooks/
    use-admin-auth.ts    - Admin authentication hook (login/logout/me)
    use-page-meta.ts     - Hook for per-page SEO (title + meta description)
    use-site-settings.tsx - SiteSettingsProvider context + useSiteSettings hook
    use-toast.ts         - Toast notifications hook
  pages/
    home.tsx             - SEO landing page (problem/solution messaging, 3-step process)
    services.tsx         - Services overview
    service-detail.tsx   - Individual service pages
    pricing.tsx          - 4 pricing tiers
    blog.tsx             - Blog listing (database-driven)
    blog-post.tsx        - Blog post view (database-driven)
    quote.tsx            - Multi-step quote form (4 steps)
    admin/
      login.tsx          - Admin login page (redirects to /admin after login)
      dashboard.tsx      - Dashboard with stats cards and pipeline overview
      leads.tsx          - CRM leads list with filters, search, pagination
      lead-detail.tsx    - Lead detail with status, notes, activity timeline
      cms.tsx            - Content manager shell
      blog-list.tsx      - Blog CMS list with status/category filters
      blog-editor.tsx    - Blog editor with markdown preview
      branding.tsx       - Branding settings with live preview
      docs.tsx           - Docs library documentation
  lib/
    stock-images.ts      - Stock image URL constants (forestry/land clearing themed)
    services-data.ts     - Full service definitions with SEO content (6 services)
    queryClient.ts       - TanStack Query config with apiRequest helper
server/
  auth.ts                - Passport.js setup, session config, requireAdmin middleware
  routes.ts              - All API endpoints (public + admin)
  storage.ts             - DatabaseStorage class (leads, blog, settings CRUD)
  seed-blog.ts           - Seeds 8 SEO blog articles on first startup
  db.ts                  - Drizzle ORM + pg pool setup
  index.ts               - Express server entry
shared/
  schema.ts              - Drizzle schema (users, leads, lead_notes, lead_activity, blog_posts, site_settings) + Zod validation
```

## Services (6 total)
1. **Forestry Mulching** (/services/forestry-mulching) - Flagship service, single-pass clearing
2. **Trail Cutting** (/services/trail-cutting) - Access lanes, hunting trails, pond access
3. **Hillside Mulching** (/services/hillside-mulching) - Steep slope and difficult terrain clearing
4. **Brush Hogging** (/services/brush-hogging) - Rotary mowing for fields and pastures
5. **Fence Line Clearing** (/services/fence-line-clearing) - Property boundary vegetation management
6. **Invasive Growth Removal** (/services/invasive-growth-removal) - Kudzu, privet, honeysuckle, wisteria

## Database Schema
- **users**: id (varchar PK), username, password
- **leads**: id (serial PK), fullName, phone, email, jobAddress, county, servicesNeeded (text[]), propertyType, approximateArea, accessFlags (text[]), accessNotes, desiredOutcome, timeline, budgetComfort, status (New|Contacted|Scheduled|Won|Lost), source, tags (text[]), assignedTo, lastContactedAt, createdAt, updatedAt
- **lead_notes**: id (serial PK), leadId, note, createdBy, createdAt
- **lead_activity**: id (serial PK), leadId, type (STATUS_CHANGE|NOTE_ADDED|ASSIGNED|EXPORTED), payload (jsonb), createdAt
- **blog_posts**: id (UUID PK), slug (unique), title, excerpt, content (markdown), featuredImageUrl, category, tags (text[]), publishedAt, updatedAt, status (draft|published)
- **site_settings**: id (serial PK), companyName, phone, email, serviceArea, logoUrl, primaryColor (HSL), secondaryColor (HSL), fontFamily, ctaText, socialFacebook, socialInstagram, socialYoutube, socialGoogle, updatedAt

## API Routes
### Public
- `GET /api/health` - Health check
- `POST /api/public/leads` - Create lead (Zod validated, rate-limited 5/min/IP, honeypot spam protection)
- `GET /api/public/settings` - Get public site settings (branding, colors, contact info)
- `GET /api/public/blog` - List published blog posts (optional category/search filters)
- `GET /api/public/blog/:slug` - Get published blog post by slug
- `GET /api/public/blog/:slug/related` - Get related posts by category

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
- `GET /api/admin/settings` - Get site settings (admin)
- `PUT /api/admin/settings` - Update site settings
- `GET /api/admin/blog` - List all blog posts (admin, with filters)
- `POST /api/admin/blog` - Create blog post
- `GET /api/admin/blog/:id` - Get blog post by ID
- `PATCH /api/admin/blog/:id` - Update blog post
- `DELETE /api/admin/blog/:id` - Delete blog post
- `GET /api/admin/docs` - Project documentation JSON
- `POST /api/admin/cms/media/upload` - Upload image file (multipart, jpeg/png/webp, 10MB max)
- `GET /api/admin/cms/media` - List media (pagination: page, pageSize, search)
- `PATCH /api/admin/cms/media/:id` - Update media metadata (alt, title, tags)
- `DELETE /api/admin/cms/media/:id` - Delete media (removes file from disk)
- `GET /api/admin/cms/pages/:id/revisions` - List page revision history
- `POST /api/admin/cms/pages/:id/revisions` - Create revision snapshot
- `POST /api/admin/cms/pages/:id/revisions/:revId/restore` - Restore page from revision

## Branding System
- **site_settings table**: Single-row table stores all branding values
- **SiteSettingsProvider**: React context loads settings on app init, injects --primary CSS variable into :root
- **Color format**: HSL values (e.g. '28 65% 42%') for Tailwind CSS variable compatibility
- **Defaults**: Safe defaults if settings missing: BrushWhackers, warm brown primary, sage green secondary, Inter font
- **Applied locations**: TopNav (logo + company name + CTA text), Footer (contact info + social links + company name), StickyQuoteButton (CTA text)
- **Admin page**: /admin/branding with live preview card, color pickers, company info, social links

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
- Regional references throughout all content (Charlotte area counties and towns)
- 8 SEO-optimized blog articles with Charlotte-area focus
- Problem/solution messaging style (BrushWorksco approach)

## Color Scheme
- **Light mode**: Warm cream/beige backgrounds, brown primary (#b07430), sage green accents
- **Dark mode**: Deep brown/charcoal backgrounds, warm amber primary, earthy tones
- Earth tone palette throughout: warm browns, sage greens, natural olives

## Running Locally
1. `npm install`
2. Set up environment variables (DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD)
3. `npm run db:push` to create database tables
4. `npm run dev` (starts on port 5000)

## User Preferences
- Brand color: Earth tones / warm brown (configurable)
- Target area: Charlotte, NC & surrounding counties (50mi radius)
- Modern, beautiful, engaging design
- SEO-driven content with local keywords
- Multi-step quote form for lead capture
- Admin CRM for managing leads
- Full blog CMS with markdown editor
- Site-wide branding customization
- Content style: BrushWorksco.com approach (problem/solution, forestry mulching focus)
