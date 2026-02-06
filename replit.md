# BrushWhackers - Land Clearing & Brush Removal

## Overview
BrushWhackers is a full-stack web application for a professional land clearing and brush removal business targeting the Charlotte, North Carolina area. Built with React + Vite frontend and Node/Express backend.

## Current Phase
Phase 1: Baseline Architecture + Branding + Shared UI

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Wouter (routing) + TanStack Query
- **Styling**: Tailwind CSS + Shadcn UI components
- **Backend**: Node.js + Express
- **Font**: Inter (applied globally)
- **Brand Color**: Blue (primary: 217 91% 60%)

## Project Structure
```
client/src/
  components/
    layout/          - SiteLayout, TopNav, Footer
    ui/              - Shadcn UI components
  pages/
    home.tsx         - Landing page
    services.tsx     - Services overview
    service-detail.tsx - Individual service pages
    pricing.tsx      - Pricing tiers
    blog.tsx         - Blog listing
    blog-post.tsx    - Blog post view
    quote.tsx        - Quote request form
    admin/
      dashboard.tsx  - Admin dashboard
      leads.tsx      - CRM leads shell
      cms.tsx        - Content manager shell
      branding.tsx   - Branding settings shell
      docs.tsx       - Docs library (fetches from /api/admin/docs)
  lib/
    stock-images.ts  - Stock image URL constants
    services-data.ts - Service definitions and data
    queryClient.ts   - TanStack Query config
server/
  routes.ts          - API endpoints (/api/health, /api/admin/docs)
  storage.ts         - Storage interface
  index.ts           - Express server entry
shared/
  schema.ts          - Drizzle schema definitions
```

## Running Locally
1. `npm install`
2. `npm run dev` (starts on port 5000)

## Key Routes
- Frontend: /, /services, /services/:slug, /pricing, /blog, /blog/:slug, /quote, /admin, /admin/leads, /admin/cms, /admin/branding, /admin/docs
- Backend: GET /api/health, GET /api/admin/docs

## User Preferences
- Brand color: Blue
- Target area: Charlotte, NC
- Modern, beautiful, engaging design
- Preparing for CMS + Admin portal + Docs Library + CRM leads
