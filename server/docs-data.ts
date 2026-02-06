export interface DocsEntry {
  category: string;
  title: string;
  bodyMarkdown: string;
  updatedAt: string;
  tags: string[];
}

export function getDocsEntries(): DocsEntry[] {
  const now = "2026-02-06";

  return [
    {
      category: "CMS",
      title: "Page Builder Overview",
      bodyMarkdown: `The CMS Page Builder is a three-panel drag-and-drop editor for building custom pages.

**Panels:**
- **Left**: Block library sidebar with search and categorized blocks
- **Center**: Sortable canvas with device preview (Desktop/Tablet/Mobile)
- **Right**: Inspector with Block properties, SEO, and Content Checklist tabs

**Block Types (10 system blocks):**
| Block | Key | Description |
|-------|-----|-------------|
| Hero | \`hero\` | Full-width hero with headline, subheadline, background image, CTA |
| Rich Text | \`rich_text\` | Free-form text content block |
| Image Banner | \`image_banner\` | Full-width image with optional overlay text |
| Feature Grid | \`feature_grid\` | 3-column feature cards with heading/description |
| Service Cards | \`service_cards\` | Linked service cards grid |
| Testimonials | \`testimonial_row\` | 3-column testimonial cards |
| CTA Band | \`cta_band\` | Full-width call-to-action with button |
| FAQ | \`faq\` | Collapsible question/answer list |
| Pricing Table | \`pricing_table\` | Tiered pricing cards |
| Contact CTA | \`contact_cta\` | Contact info with CTA button |

**Block Instance Format:**
\`\`\`json
{
  "id": "uuid",
  "type": "hero",
  "props": { "headline": "...", "subheadline": "..." },
  "style": {},
  "meta": { "label": "My Hero", "hidden": false }
}
\`\`\`

**API Endpoints:**
- \`GET /api/admin/cms/pages\` - List pages (filters: status, pageType, search)
- \`POST /api/admin/cms/pages\` - Create page
- \`GET /api/admin/cms/pages/:id\` - Get page by ID
- \`PATCH /api/admin/cms/pages/:id\` - Update page
- \`DELETE /api/admin/cms/pages/:id\` - Delete page
- \`GET /api/public/pages/:slug\` - Get published page by slug`,
      updatedAt: now,
      tags: ["pages", "blocks", "builder", "drag-and-drop"],
    },
    {
      category: "CMS",
      title: "Builder UX Enhancements",
      bodyMarkdown: `The page builder includes several UX enhancements for better content editing.

**Device Preview Switcher:**
The toolbar includes Desktop (1280px), Tablet (768px), and Mobile (375px) width presets. The canvas viewport adjusts width accordingly to preview responsive layouts.

**Inline Editing:**
Common block fields can be edited directly in the canvas without opening the inspector:
- \`hero\`: headline, subheadline
- \`cta_band\`: heading, buttonText
- \`rich_text\`: content

Inline edits update the block state and persist when you click Save.

**Save Status Indicator:**
Shows real-time status in the toolbar:
- "Unsaved changes" (amber) when edits differ from last save
- "Saved" (green check) when current state matches last save
- "Saving..." during save operations

**Block Validation:**
Click the shield icon to run validation checks:
- Required fields present (based on block schema)
- Image blocks must have \`imageUrl\` and \`imageAlt\`
- Link fields must be valid paths (\`/\`), URLs (\`http\`), or \`mailto:\`/\`tel:\` protocols
- Warnings are non-blocking and shown in the Checklist panel

**Content Checklist Panel (right side):**
The "Check" tab shows SEO and accessibility status:
- Page title presence and length
- SEO title length (30-60 chars recommended)
- Meta description length (50-160 chars recommended)
- OG image presence for social sharing
- H1/headline presence
- Internal CTA to /quote
- Alt text coverage on image blocks
- Link format validation`,
      updatedAt: now,
      tags: ["builder", "inline-editing", "validation", "checklist", "UX"],
    },
    {
      category: "CMS",
      title: "Preview Tokens (Draft Preview)",
      bodyMarkdown: `Draft pages can be previewed using secure, time-limited preview tokens.

**How it works:**
1. Admin clicks the "Preview" button (eye icon) in the page builder toolbar
2. Backend generates a random 32-byte hex token stored in memory
3. Token is associated with the page ID and expires in 15 minutes
4. Browser opens \`/p/:slug?previewToken=TOKEN\` in a new tab
5. Public renderer fetches the page with the token parameter
6. If token is valid and not expired, draft content is returned
7. A yellow "Draft Preview" banner is shown at the top of the page

**API Endpoint:**
\`\`\`
POST /api/admin/cms/pages/:id/preview-token
Auth: Required (admin)
Response: { token: string, slug: string, expiresIn: 900 }
\`\`\`

**Modified Public Endpoint:**
\`\`\`
GET /api/public/pages/:slug?previewToken=TOKEN
- If page is published: returns page (no token needed)
- If page is draft + valid token: returns page with _preview: true
- If page is draft + no/invalid token: returns 404
\`\`\`

**Token Expiration:**
- Tokens expire after 15 minutes
- Expired tokens are cleaned up every 60 seconds
- Each preview request generates a new token
- Tokens are stored in server memory (cleared on restart)`,
      updatedAt: now,
      tags: ["preview", "draft", "tokens", "API"],
    },
    {
      category: "CMS",
      title: "Templates & Block Library",
      bodyMarkdown: `**Templates:**
Reusable page templates storing pre-configured block arrays.

- \`GET /api/admin/cms/templates\` - List templates
- \`POST /api/admin/cms/templates\` - Create template (name, description, blocks)
- \`PATCH /api/admin/cms/templates/:id\` - Update template
- \`DELETE /api/admin/cms/templates/:id\` - Delete template

**Block Library:**
System and custom block definitions with schemas.

- \`GET /api/admin/cms/blocks\` - List all block definitions
- \`POST /api/admin/cms/blocks\` - Create custom block

Each block definition includes:
- \`key\` (unique identifier), \`name\`, \`category\`, \`icon\`
- \`schema\` (JSON): field definitions with types (text, textarea, select, array)
- \`defaultProps\` (JSON): default values for new instances
- \`isSystem\`: true for built-in blocks (cannot be deleted)`,
      updatedAt: now,
      tags: ["templates", "blocks", "library"],
    },
    {
      category: "CMS",
      title: "Media Library & Themes",
      bodyMarkdown: `**Media Library:**
Stores external image URLs with metadata for reuse across CMS pages.

- \`GET /api/admin/cms/media\` - List media (search filter)
- \`POST /api/admin/cms/media\` - Add media item (url, alt, title, mimeType, sizeBytes)
- \`DELETE /api/admin/cms/media/:id\` - Remove media item

**Theme Presets:**
10 pre-built theme presets with color tokens, font, radius, shadow settings.

- \`GET /api/admin/cms/themes\` - List all theme presets
- \`POST /api/admin/cms/themes/:id/activate\` - Activate a preset
- \`GET /api/public/theme\` - Get active theme (public)

Active by default: "Earth Pro" (warm browns, sage greens).`,
      updatedAt: now,
      tags: ["media", "images", "themes", "presets"],
    },
    {
      category: "Security",
      title: "Preview Token Security Model",
      bodyMarkdown: `Preview tokens provide secure, time-limited access to unpublished CMS pages.

**Security Properties:**
- Tokens are 32-byte cryptographically random hex strings (64 chars)
- Stored server-side in memory (Map<token, {pageId, expiresAt}>)
- Each token is scoped to a specific page ID
- Tokens expire after exactly 15 minutes (900 seconds)
- Expired tokens cannot be reused
- Tokens are cleaned up every 60 seconds automatically

**Access Control:**
- Only authenticated admins can generate preview tokens
- Preview tokens do NOT grant access to admin APIs
- Tokens only allow reading the specific draft page they were created for
- Published pages are always accessible without tokens

**Threat Mitigations:**
- Token theft: Limited 15-minute window reduces exposure
- Replay attacks: Tokens are single-page scoped
- Server restart: All tokens are invalidated (memory-only)
- Token enumeration: 256-bit randomness makes guessing infeasible`,
      updatedAt: now,
      tags: ["security", "preview", "tokens", "authentication"],
    },
    {
      category: "Security",
      title: "Authentication & Authorization",
      bodyMarkdown: `**Authentication Method:**
Session-based authentication with Passport.js LocalStrategy.

**Admin Access:**
- Single admin user: username \`admin\`
- Password set via \`ADMIN_PASSWORD\` environment variable
- Session stored in MemoryStore with 24-hour cookie expiry
- All \`/api/admin/*\` routes (except login) protected by \`requireAdmin\` middleware

**API Endpoints:**
- \`POST /api/admin/login\` - Login with { username, password }
- \`POST /api/admin/logout\` - Logout, destroy session
- \`GET /api/admin/me\` - Check current auth status

**Rate Limiting:**
- Public lead submission: 5 requests/minute/IP
- Honeypot field for spam protection on quote form`,
      updatedAt: now,
      tags: ["auth", "passport", "session", "admin"],
    },
    {
      category: "CRM",
      title: "Lead Management",
      bodyMarkdown: `**Lead Pipeline:**
Leads flow through statuses: New -> Contacted -> Scheduled -> Won/Lost.

**API Endpoints:**
- \`GET /api/admin/leads\` - List with filters (status, county, service, search, date range, pagination)
- \`GET /api/admin/leads/stats\` - Dashboard stats (total, newThisWeek, pipeline counts)
- \`GET /api/admin/leads/export.csv\` - CSV export
- \`GET /api/admin/leads/:id\` - Single lead
- \`PATCH /api/admin/leads/:id\` - Update (status, tags, assignedTo, lastContactedAt)
- \`POST /api/admin/leads/:id/notes\` - Add note
- \`GET /api/admin/leads/:id/notes\` - List notes
- \`GET /api/admin/leads/:id/activity\` - Activity log

**Lead Sources:**
Leads are captured via the multi-step quote form at /quote (4 steps: contact info, property details, services needed, budget/timeline).`,
      updatedAt: now,
      tags: ["leads", "CRM", "pipeline", "quotes"],
    },
    {
      category: "SEO",
      title: "SEO Implementation",
      bodyMarkdown: `**Per-Page SEO:**
Each page uses the \`usePageMeta\` hook to set unique title and meta description.

**CMS Page SEO:**
The page builder includes an SEO tab with:
- SEO Title (appears in browser tab and search results)
- Meta Description (search result snippet)
- OG Title, OG Description, OG Image (social sharing)

**Best Practices Applied:**
- Unique, descriptive title tags per page
- H1 tags include service name + "Charlotte, NC"
- Regional references (Charlotte area counties and towns)
- 8 SEO-optimized blog articles with local focus
- Problem/solution messaging style

**Content Checklist:**
The builder's Checklist tab validates:
- Title length (10+ chars recommended)
- SEO title length (30-60 chars)
- Meta description length (50-160 chars)
- OG image presence
- H1/headline presence
- CTA to /quote
- Image alt text coverage`,
      updatedAt: now,
      tags: ["SEO", "meta", "OG", "checklist"],
    },
    {
      category: "Theming",
      title: "Branding & Color System",
      bodyMarkdown: `**Branding Settings:**
Managed via site_settings table (single row) and the /admin/branding page.

**Configurable Values:**
- Company name, phone, email, service area
- Logo URL
- Primary color (HSL format: "28 65% 42%")
- Secondary color (HSL format: "85 35% 38%")
- Font family (default: Inter)
- CTA button text
- Social media links (Facebook, Instagram, YouTube, Google)

**CSS Variable Injection:**
SiteSettingsProvider context loads settings and injects \`--primary\` CSS variable into \`:root\` for Tailwind compatibility.

**Applied Locations:**
- TopNav: logo, company name, CTA text
- Footer: contact info, social links, company name
- StickyQuoteButton: CTA text
- CSS variables: primary color throughout site`,
      updatedAt: now,
      tags: ["branding", "colors", "CSS", "settings"],
    },
    {
      category: "Routing",
      title: "URL Redirects",
      bodyMarkdown: `**Redirect Management:**
Admin-managed URL redirects with 301 (permanent) and 302 (temporary) support.

**API Endpoints:**
- \`GET /api/admin/cms/redirects\` - List all redirects
- \`POST /api/admin/cms/redirects\` - Create redirect (fromPath, toPath, code)
- \`DELETE /api/admin/cms/redirects/:id\` - Delete redirect

**Implementation:**
- Redirect middleware runs before API routes
- Redirects are cached in memory for performance
- Cache refreshes every 60 seconds
- Supports both absolute and relative paths`,
      updatedAt: now,
      tags: ["redirects", "routing", "301", "302"],
    },
    {
      category: "Routing",
      title: "Frontend Routes",
      bodyMarkdown: `**Public Pages:**
| Path | Description |
|------|-------------|
| \`/\` | Home page with hero, services, pricing |
| \`/services\` | Services overview |
| \`/services/:slug\` | Service detail (6 services) |
| \`/pricing\` | Pricing tiers |
| \`/blog\` | Blog listing |
| \`/blog/:slug\` | Blog post view |
| \`/quote\` | Multi-step quote form |
| \`/p/:slug\` | CMS custom pages |

**Admin Pages:**
| Path | Description |
|------|-------------|
| \`/admin\` | Dashboard with pipeline stats |
| \`/admin/leads\` | CRM leads list |
| \`/admin/leads/:id\` | Lead detail |
| \`/admin/cms\` | CMS home |
| \`/admin/cms/pages\` | CMS pages list |
| \`/admin/cms/pages/new\` | Page builder (new) |
| \`/admin/cms/pages/:id\` | Page builder (edit) |
| \`/admin/cms/templates\` | Templates |
| \`/admin/cms/blocks\` | Block library |
| \`/admin/cms/media\` | Media library |
| \`/admin/cms/themes\` | Theme presets |
| \`/admin/cms/redirects\` | URL redirects |
| \`/admin/branding\` | Branding settings |
| \`/admin/docs\` | Documentation |`,
      updatedAt: now,
      tags: ["routes", "pages", "navigation"],
    },
    {
      category: "Media",
      title: "Image & Media Handling",
      bodyMarkdown: `**Media Library:**
CMS media items store external image URLs with metadata.

**Stock Images:**
The app uses curated stock image URLs defined in \`client/src/lib/stock-images.ts\` for forestry/land clearing themed imagery.

**Image Best Practices:**
- All images should have alt text for accessibility
- The Content Checklist validates alt text coverage
- Hero and Image Banner blocks require both imageUrl and imageAlt
- OG images should be set for social sharing preview`,
      updatedAt: now,
      tags: ["images", "media", "accessibility", "alt-text"],
    },
  ];
}
