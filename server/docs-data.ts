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
      title: "Media Upload API",
      bodyMarkdown: `The Media Upload system supports local file uploads with metadata storage in the \`cms_media\` database table. The architecture is designed for future migration to S3/R2 without code rewrites — only the storage adapter needs to change.

**Upload Endpoint:**
\`\`\`
POST /api/admin/cms/media/upload
Content-Type: multipart/form-data
Auth: Required (admin)

Form Fields:
  file     (required) - Image file (jpeg, png, webp)
  alt      (optional) - Alt text
  title    (optional) - Display title (defaults to filename)

Response 201:
{
  "id": "uuid",
  "url": "/uploads/1706000000-abc123.jpg",
  "width": 1920,
  "height": 1080,
  "mimeType": "image/jpeg",
  "sizeBytes": 245000,
  "alt": "Forestry mulching site",
  "title": "job-site-photo",
  "tags": [],
  "createdAt": "2026-02-06T..."
}
\`\`\`

**List Media (paginated):**
\`\`\`
GET /api/admin/cms/media?search=forest&page=1&pageSize=24
Auth: Required (admin)

Response 200:
{
  "items": [ CmsMediaItem[] ],
  "total": 42
}
\`\`\`

**Update Media Metadata:**
\`\`\`
PATCH /api/admin/cms/media/:id
Auth: Required (admin)
Body: { "alt": "Updated alt", "title": "New title", "tags": ["landscape"] }

Response 200: CmsMediaItem
\`\`\`

**Delete Media:**
\`\`\`
DELETE /api/admin/cms/media/:id
Auth: Required (admin)
Response 200: { "ok": true }
\`\`\`
Deleting a media item also removes the file from disk if it is a local upload.

**Add External URL (legacy):**
\`\`\`
POST /api/admin/cms/media
Body: { "url": "https://example.com/img.jpg", "alt": "...", "title": "..." }
\`\`\`

**Storage Strategy:**
- **Current:** Local file storage in \`server/uploads/\` served via \`/uploads/\` static route
- **Future:** Swap multer disk storage for S3/R2 adapter; change URL prefix from \`/uploads/\` to bucket URL
- The \`cms_media.url\` field stores the path — all code references this URL, making the swap transparent

**Database Fields (cms_media):**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| url | text | File URL (local path or external) |
| alt | text | Alt text for accessibility |
| title | text | Display title |
| width | int | Image width in px |
| height | int | Image height in px |
| mimeType | text | MIME type (image/jpeg, etc.) |
| sizeBytes | int | File size in bytes |
| tags | jsonb | Array of string tags |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update date |`,
      updatedAt: now,
      tags: ["media", "upload", "API", "storage"],
    },
    {
      category: "Media",
      title: "Media Library UI",
      bodyMarkdown: `The Media Library admin page at \`/admin/cms/media\` provides a visual interface for managing uploaded images.

**Features:**
- **Upload Button:** Opens a modal with drag-and-drop upload area
- **Drag & Drop:** Drop zone accepts multiple files; validates type and size client-side before upload
- **Grid Gallery:** Responsive grid (2-4 columns) showing image thumbnails with title and file info
- **Search:** Filters media by title and alt text
- **Pagination:** Page through results (24 items per page) with prev/next controls
- **Detail Panel:** Click any image to open a side panel with:
  - Image preview
  - Dimensions, type, and file size
  - Editable Title, Alt Text, and Tags fields
  - Save, Copy URL, and Delete buttons
- **Copy URL:** One-click copy of the full image URL to clipboard (also available on hover in grid)

**Navigation:**
Admin sidebar → CMS → Media, or directly at \`/admin/cms/media\`

**Upload Flow:**
1. Click "Upload" button in toolbar
2. Drop files or click to browse
3. Preview file list with names and sizes
4. Click "Upload N files" to start
5. Progress indicators show per-file status
6. Gallery refreshes automatically after upload`,
      updatedAt: now,
      tags: ["media", "UI", "gallery", "upload", "drag-drop"],
    },
    {
      category: "Media",
      title: "Block Media Picker Integration",
      bodyMarkdown: `Image fields in the CMS page builder block inspector include a "Choose from Media Library" button that opens a picker dialog.

**How It Works:**
1. The \`BlockPropertyEditor\` detects image fields by key name (\`imageUrl\`, \`backgroundImage\`, \`src\`, etc.) or schema type \`"image"\`
2. Image fields render with:
   - A standard URL text input
   - An image preview thumbnail (if URL is set)
   - A "Choose from Media Library" button
3. Clicking the button opens the \`MediaPickerDialog\` modal
4. The modal shows a searchable grid of uploaded media items
5. Selecting an image sets the field value to the image URL
6. If the selected media has alt text, it auto-suggests the alt text for the corresponding \`imageAlt\` field (if present and empty)

**Detected Image Field Keys:**
- \`imageUrl\` / \`image_url\`
- \`backgroundImage\`
- \`featuredImageUrl\`
- \`ogImage\`
- \`src\`

**Schema-Based Detection:**
Blocks using the schema system can set \`type: "image"\` on a field definition:
\`\`\`json
{
  "fields": [
    { "key": "imageUrl", "label": "Image", "type": "image" },
    { "key": "imageAlt", "label": "Alt Text", "type": "text" }
  ]
}
\`\`\`

**Alt Text Auto-Suggest:**
When selecting a media item, the picker attempts to auto-fill the corresponding alt text field:
- \`imageUrl\` → looks for \`imageAlt\`
- \`backgroundImage\` → looks for \`backgroundImageAlt\`
- Only auto-fills if the alt field is currently empty`,
      updatedAt: now,
      tags: ["media", "picker", "blocks", "inspector", "integration"],
    },
    {
      category: "Security",
      title: "File Upload Security Constraints",
      bodyMarkdown: `The media upload system enforces several security constraints to prevent abuse and ensure safe file handling.

**Allowed File Types:**
| MIME Type | Extension | Notes |
|-----------|-----------|-------|
| image/jpeg | .jpg, .jpeg | Most common photo format |
| image/png | .png | Supports transparency |
| image/webp | .webp | Modern, smaller file sizes |

All other file types are rejected with a 400 error.

**Maximum File Size:**
- 10 MB per file
- Enforced both server-side (multer config) and client-side (pre-validation)
- Files exceeding the limit return a 413 error

**Rate Limiting:**
- 10 uploads per minute per IP address
- Exceeding the limit returns 429 Too Many Requests
- Rate limit resets after 60 seconds

**Authentication:**
- All media endpoints require admin authentication (\`requireAdmin\` middleware)
- Unauthenticated requests receive 401
- Session-based auth via Passport.js

**File Naming:**
- Uploaded files are renamed to \`{timestamp}-{random-hex}{ext}\`
- Original filenames are stored as the media \`title\`
- This prevents path traversal and filename collision attacks

**Static File Serving:**
- \`/uploads/\` route only accepts GET requests (other methods return 405)
- Files served with 7-day cache headers
- No directory listing is exposed

**Deletion:**
- Deleting a media record also removes the physical file from disk
- File deletion is fire-and-forget (non-blocking)
- Only local uploads (URLs starting with \`/uploads/\`) trigger file deletion`,
      updatedAt: now,
      tags: ["security", "upload", "validation", "rate-limiting"],
    },
    {
      category: "CMS",
      title: "Page Revisions & Rollback",
      bodyMarkdown: `Page versioning lets admins create, view, and restore revision snapshots of CMS pages.

**Database Table:** \`cms_page_revisions\`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Revision identifier |
| pageId | UUID FK | References cms_pages.id |
| createdAt | timestamp | When the revision was saved |
| createdBy | text | Who created the revision (default: "admin") |
| message | text | Optional note (e.g. "Updated hero + SEO") |
| snapshot | JSONB | Full page snapshot (title, slug, blocks, seo, status, templateId, pageType, description) |

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | \`/api/admin/cms/pages/:id/revisions\` | List all revisions for a page (newest first) |
| POST | \`/api/admin/cms/pages/:id/revisions\` | Create a revision snapshot of current page state |
| POST | \`/api/admin/cms/pages/:id/revisions/:revId/restore\` | Restore page content from a revision |

**Create Revision Request:**
\`\`\`json
{
  "message": "Updated hero section",
  "createdBy": "admin"
}
\`\`\`
Both fields are optional. The snapshot is built automatically from the current page state.

**Restore Behavior:**
- Replaces page title, slug, description, blocks, SEO, templateId, and status with the revision snapshot
- The page \`updatedAt\` is refreshed to the current time
- Published state is restored as-is from the snapshot (if the snapshot had status "draft", the page becomes draft again)
- No new revision is auto-created on restore — admin can manually save one before restoring

**Auto-Revision on Publish:**
When a page status changes from draft to published via the PATCH endpoint, a revision is automatically saved with the message "Auto-saved before publish".

**Retention Policy:**
- Maximum 50 revisions per page
- After creating a new revision, the system prunes (deletes) the oldest revisions beyond the limit
- Pruning happens in the POST /revisions endpoint and in the auto-save on publish flow

**UI Integration:**
The page builder's right panel includes a "Revisions" tab (history icon) that shows:
- Revision count badge
- "Save Revision" button with optional message input
- Chronological list of revisions with date, message, status, block count, and slug
- Restore button on each revision with a confirmation dialog
- Restore replaces all page fields in the editor immediately`,
      updatedAt: now,
      tags: ["cms", "revisions", "versioning", "rollback", "history"],
    },
    {
      category: "Security",
      title: "Revision Data Sensitivity",
      bodyMarkdown: `This document describes the data stored in CMS page revision snapshots and security considerations.

**What Is Stored:**
Each revision snapshot is a JSONB object containing:
- \`title\` — Page title (string)
- \`slug\` — URL slug (string)
- \`description\` — Page description (string, nullable)
- \`status\` — Draft or published state (string)
- \`pageType\` — Page type classification (string)
- \`templateId\` — Template UUID reference (string, nullable)
- \`blocks\` — Array of block instances with all property values
- \`seo\` — SEO metadata object (title, metaDescription, og tags)

**Data Sensitivity:**
- Block content may include user-generated text, image URLs, link targets, and inline styles
- SEO data may contain marketing copy and social media metadata
- No authentication credentials, passwords, or API keys are stored in snapshots
- Image URLs in blocks reference media library assets or external URLs — no binary data is stored

**Access Control:**
- All revision endpoints require admin authentication (requireAdmin middleware)
- Revisions are scoped to a page via pageId — cross-page access is prevented
- The restore endpoint validates that the revision belongs to the target page before applying

**Retention:**
- Revisions are automatically pruned to keep the last 50 per page
- Deleted revisions are permanently removed (no soft delete)
- When a page is deleted, all its revisions are cascade-deleted via the pageId relationship

**No PII Stored:**
Revision snapshots contain only CMS content data. They do not store:
- User session tokens or cookies
- Admin passwords or credentials
- Visitor analytics or tracking data
- Customer/lead personal information`,
      updatedAt: now,
      tags: ["security", "revisions", "data-privacy", "access-control"],
    },
  ];
}
