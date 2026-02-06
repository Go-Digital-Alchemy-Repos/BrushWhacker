# BrushWhackers - Forestry Mulching & Land Clearing

## Overview
BrushWhackers is a full-stack web application for a professional forestry mulching and land clearing business targeting the Charlotte, North Carolina area. Built with React + Vite frontend, Node/Express backend, and PostgreSQL database. Includes a complete admin portal with CRM lead management, blog CMS, site-wide branding customization, and a comprehensive CMS with drag-and-drop page builder, block library, templates, media library, theme presets, and URL redirects management. Features role-based access control (RBAC) with 4 admin roles and performance caching with ETag support. Content style follows BrushWorksco.com approach with problem/solution messaging and forestry mulching focus.

## Current Phase
Phase 9: RBAC & Performance

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Wouter (routing) + TanStack Query
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon-backed via Drizzle ORM)
- **Auth**: Passport.js LocalStrategy + express-session (MemoryStore) + bcrypt password hashing
- **RBAC**: 4 roles (super_admin, admin, editor, sales) with server-side enforcement
- **Caching**: In-memory cache with ETag headers for public endpoints
- **Font**: Inter (configurable via branding settings)
- **Brand Color**: Earth tones (primary: 28 65% 42% warm brown, secondary: 85 35% 38% sage green, configurable via branding settings)

## Project Structure
```
client/src/
  components/
    admin/
      admin-layout.tsx   - Admin layout with role-aware sidebar nav, auth guard, mobile support
    layout/              - SiteLayout (with sticky quote button), TopNav, Footer
    sticky-quote-button  - Fixed position CTA button on desktop (text from settings)
    ui/                  - Shadcn UI components
  hooks/
    use-admin-auth.ts    - Admin authentication hook with role helpers (login/logout/me/hasRole/canAccessCms/canAccessCrm/canManageUsers)
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
  auth.ts                - Passport.js setup, session config, requireAdmin + requireRole middleware, seedDefaultAdmin
  routes.ts              - All API endpoints (public + admin + user management) with caching
  storage.ts             - DatabaseStorage class (leads, blog, settings, admin users CRUD)
  seed-blog.ts           - Seeds 8 SEO blog articles on first startup
  db.ts                  - Drizzle ORM + pg pool setup
  index.ts               - Express server entry
shared/
  schema.ts              - Drizzle schema (users, leads, lead_notes, lead_activity, blog_posts, site_settings, admin_users) + Zod validation + RBAC types
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
- **admin_users**: id (UUID PK), email (unique), passwordHash, displayName, role (super_admin|admin|editor|sales), createdAt, updatedAt
- **leads**: id (serial PK), fullName, phone, email, jobAddress, county, servicesNeeded (text[]), propertyType, approximateArea, accessFlags (text[]), accessNotes, desiredOutcome, timeline, budgetComfort, status (New|Contacted|Scheduled|Won|Lost), source, tags (text[]), assignedTo, lastContactedAt, createdAt, updatedAt
- **lead_notes**: id (serial PK), leadId, note, createdBy, createdAt
- **lead_activity**: id (serial PK), leadId, type (STATUS_CHANGE|NOTE_ADDED|ASSIGNED|EXPORTED), payload (jsonb), createdAt
- **blog_posts**: id (UUID PK), slug (unique), title, excerpt, content (markdown), featuredImageUrl, category, tags (text[]), publishedAt, updatedAt, status (draft|published)
- **site_settings**: id (serial PK), companyName, phone, email, serviceArea, logoUrl, primaryColor (HSL), secondaryColor (HSL), fontFamily, ctaText, socialFacebook, socialInstagram, socialYoutube, socialGoogle, updatedAt

## RBAC (Role-Based Access Control)
### Roles
- **super_admin**: Full access to all features including user management
- **admin**: CMS + CRM + media library + branding (no user management)
- **editor**: CMS content only (pages, blog, media)
- **sales**: CRM leads only (view, edit, notes, export)

### Implementation
- **Server**: `requireRole(["role1", "role2"])` middleware enforces permissions on every admin route
- **Frontend**: `useAdminAuth()` hook provides `hasRole()`, `canAccessCms()`, `canAccessCrm()`, `canAccessBranding()`, `canManageUsers()` helpers
- **Navigation**: Admin sidebar dynamically shows/hides menu items based on user role
- **Blocked routes**: Shows "Insufficient Permissions" UI if user navigates to unauthorized section
- **User management**: SuperAdmin-only endpoints at `/api/admin/users` for CRUD operations
- **Default admin**: admin@brushwhackers.com seeded on startup with ADMIN_PASSWORD env var
- **Legacy login**: username "admin" + ADMIN_PASSWORD still works as super_admin for backward compatibility

## API Routes
### Public
- `GET /api/health` - Health check
- `POST /api/public/leads` - Create lead (Zod validated, rate-limited 5/min/IP, honeypot spam protection)
- `GET /api/public/settings` - Get public site settings (cached, ETag support)
- `GET /api/public/blog` - List published blog posts (cached, ETag support)
- `GET /api/public/blog/:slug` - Get published blog post by slug (cached, ETag support)
- `GET /api/public/blog/:slug/related` - Get related posts by category (cached, ETag support)
- `GET /sitemap.xml` - Dynamic XML sitemap (published CMS pages + blog posts)
- `GET /robots.txt` - Robots directives with sitemap link

### Auth
- `POST /api/admin/login` - Admin login (username/password, returns user with role)
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin user with role (or 401)

### Admin (Protected by role)
- `GET /api/admin/leads` - List leads (super_admin, admin, sales)
- `GET /api/admin/leads/stats` - Dashboard stats (super_admin, admin, sales)
- `GET /api/admin/leads/export.csv` - CSV export (super_admin, admin, sales)
- `GET /api/admin/leads/:id` - Get single lead (super_admin, admin, sales)
- `PATCH /api/admin/leads/:id` - Update lead (super_admin, admin, sales)
- `POST /api/admin/leads/:id/notes` - Add note (super_admin, admin, sales)
- `GET /api/admin/leads/:id/notes` - List notes (super_admin, admin, sales)
- `GET /api/admin/leads/:id/activity` - Activity log (super_admin, admin, sales)
- `GET /api/admin/settings` - Get site settings (super_admin, admin)
- `PUT /api/admin/settings` - Update site settings (super_admin, admin) - invalidates cache
- `GET /api/admin/blog` - List all blog posts (super_admin, admin, editor)
- `POST /api/admin/blog` - Create blog post (super_admin, admin, editor) - invalidates cache
- `GET /api/admin/blog/:id` - Get blog post by ID (super_admin, admin, editor)
- `PATCH /api/admin/blog/:id` - Update blog post (super_admin, admin, editor) - invalidates cache
- `DELETE /api/admin/blog/:id` - Delete blog post (super_admin, admin, editor) - invalidates cache
- `GET /api/admin/docs` - Project documentation JSON (all roles)
- `POST /api/admin/cms/media/upload` - Upload image file (super_admin, admin, editor)
- `GET /api/admin/cms/media` - List media (super_admin, admin, editor)
- `PATCH /api/admin/cms/media/:id` - Update media metadata (super_admin, admin, editor)
- `DELETE /api/admin/cms/media/:id` - Delete media (super_admin, admin, editor)
- `GET /api/admin/cms/pages/:id/revisions` - List page revision history (super_admin, admin, editor)
- `POST /api/admin/cms/pages/:id/revisions` - Create revision snapshot (super_admin, admin, editor)
- `POST /api/admin/cms/pages/:id/revisions/:revId/restore` - Restore page from revision (super_admin, admin, editor)

### User Management (SuperAdmin only)
- `GET /api/admin/users` - List all admin users
- `POST /api/admin/users` - Create admin user (email, password, displayName, role)
- `PATCH /api/admin/users/:id` - Update admin user (email, password, displayName, role)
- `DELETE /api/admin/users/:id` - Delete admin user (cannot delete self)

## Performance Caching
- **In-memory cache**: Public endpoints cached with configurable TTL (settings: 2min, blog: 1min)
- **ETag headers**: All cached endpoints return ETag headers for conditional requests
- **304 Not Modified**: Clients sending If-None-Match receive 304 responses when content unchanged
- **Cache-Control**: Public endpoints include Cache-Control headers for browser caching
- **Cache invalidation**: Admin mutations (settings update, blog create/update/delete) automatically invalidate relevant cache entries

## Branding System
- **site_settings table**: Single-row table stores all branding values
- **SiteSettingsProvider**: React context loads settings on app init, injects --primary CSS variable into :root
- **Color format**: HSL values (e.g. '28 65% 42%') for Tailwind CSS variable compatibility
- **Defaults**: Safe defaults if settings missing: BrushWhackers, warm brown primary, sage green secondary, Inter font
- **Applied locations**: TopNav (logo + company name + CTA text), Footer (contact info + social links + company name), StickyQuoteButton (CTA text)
- **Admin page**: /admin/branding with live preview card, color pickers, company info, social links

## Admin Auth
- Multi-user authentication with bcrypt password hashing
- Legacy single admin via ADMIN_PASSWORD env var (default: brushwhackers2026, username: admin)
- New admin_users table supports multiple users with different roles
- Default super admin seeded: admin@brushwhackers.com
- Session-based with express-session + MemoryStore
- All /api/admin/* routes protected by requireRole middleware with granular permissions

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
- Dynamic sitemap.xml with redirect-aware canonical URLs
- robots.txt with sitemap link and admin/API exclusions
- JSON-LD structured data presets (LocalBusiness, Service, FAQPage, Article)
- SEO validation tool in page builder
- OG image fallback chain (explicit > hero image > site default)
- Canonical URL support with redirect resolution
- PUBLIC_SITE_URL env var for absolute URL generation

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
