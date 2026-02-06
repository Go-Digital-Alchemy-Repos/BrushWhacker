import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, updateLeadSchema, insertBlogPostSchema, updateBlogPostSchema, updateSiteSettingsSchema, LEAD_STATUSES } from "@shared/schema";
import { z } from "zod";
import passport from "passport";
import { requireAdmin } from "./auth";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json({ user: { id: user.id, username: user.username } });
      });
    })(req, res, next);
  });

  app.post("/api/admin/logout", (req, res) => {
    req.logout(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({ user: { id: req.user!.id, username: req.user!.username } });
    }
    return res.status(401).json({ error: "Not authenticated" });
  });

  app.post("/api/public/leads", async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      if (rateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
      }

      if (req.body.company && req.body.company.trim() !== "") {
        return res.status(200).json({ leadId: 0 });
      }

      const { company, ...leadData } = req.body;

      const parsed = insertLeadSchema.safeParse(leadData);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const lead = await storage.createLead(parsed.data);
      return res.status(201).json({ leadId: lead.id });
    } catch (err) {
      console.error("Failed to create lead:", err);
      return res.status(500).json({ error: "Failed to submit quote request" });
    }
  });

  app.get("/api/admin/leads", requireAdmin, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        county: req.query.county as string | undefined,
        service: req.query.service as string | undefined,
        search: req.query.search as string | undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 20,
      };
      const result = await storage.getLeads(filters);
      return res.json(result);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/leads/export.csv", requireAdmin, async (_req, res) => {
    try {
      const allLeads = await storage.getAllLeads();

      const headers = [
        "ID", "Full Name", "Phone", "Email", "Address", "County",
        "Services", "Property Type", "Area", "Access Notes",
        "Desired Outcome", "Timeline", "Budget", "Status",
        "Source", "Tags", "Assigned To", "Last Contacted", "Created At"
      ];

      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = allLeads.map((l) => [
        l.id, l.fullName, l.phone, l.email, l.jobAddress, l.county,
        (l.servicesNeeded || []).join("; "), l.propertyType, l.approximateArea,
        l.accessNotes || "", l.desiredOutcome || "", l.timeline, l.budgetComfort,
        l.status, l.source || "", (l.tags || []).join("; "), l.assignedTo || "",
        l.lastContactedAt ? new Date(l.lastContactedAt).toISOString() : "",
        l.createdAt ? new Date(l.createdAt).toISOString() : "",
      ].map(escapeCSV).join(","));

      const csv = [headers.join(","), ...rows].join("\n");

      await storage.createLeadActivity({
        leadId: 0,
        type: "EXPORTED",
        payload: { count: allLeads.length, exportedAt: new Date().toISOString() },
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`);
      return res.send(csv);
    } catch (err) {
      console.error("Failed to export leads:", err);
      return res.status(500).json({ error: "Failed to export leads" });
    }
  });

  app.get("/api/admin/leads/stats", requireAdmin, async (_req, res) => {
    try {
      const stats = await storage.getLeadStats();
      return res.json(stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      return res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid lead ID" });

      const lead = await storage.getLead(id);
      if (!lead) return res.status(404).json({ error: "Lead not found" });

      return res.json(lead);
    } catch (err) {
      console.error("Failed to fetch lead:", err);
      return res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.patch("/api/admin/leads/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid lead ID" });

      const parsed = updateLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }

      const existingLead = await storage.getLead(id);
      if (!existingLead) return res.status(404).json({ error: "Lead not found" });

      const updateData: any = {};
      if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
      if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;
      if (parsed.data.assignedTo !== undefined) updateData.assignedTo = parsed.data.assignedTo;
      if (parsed.data.lastContactedAt !== undefined) {
        updateData.lastContactedAt = parsed.data.lastContactedAt ? new Date(parsed.data.lastContactedAt) : null;
      }

      const updated = await storage.updateLead(id, updateData);

      if (parsed.data.status && parsed.data.status !== existingLead.status) {
        await storage.createLeadActivity({
          leadId: id,
          type: "STATUS_CHANGE",
          payload: { from: existingLead.status, to: parsed.data.status },
        });
      }

      if (parsed.data.assignedTo !== undefined && parsed.data.assignedTo !== existingLead.assignedTo) {
        await storage.createLeadActivity({
          leadId: id,
          type: "ASSIGNED",
          payload: { from: existingLead.assignedTo, to: parsed.data.assignedTo },
        });
      }

      return res.json(updated);
    } catch (err) {
      console.error("Failed to update lead:", err);
      return res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.post("/api/admin/leads/:id/notes", requireAdmin, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      if (isNaN(leadId)) return res.status(400).json({ error: "Invalid lead ID" });

      const noteSchema = z.object({ note: z.string().min(1) });
      const parsed = noteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Note text is required" });
      }

      const lead = await storage.getLead(leadId);
      if (!lead) return res.status(404).json({ error: "Lead not found" });

      const createdBy = req.user?.username || "admin";

      const note = await storage.createLeadNote({
        leadId,
        note: parsed.data.note,
        createdBy,
      });

      await storage.createLeadActivity({
        leadId,
        type: "NOTE_ADDED",
        payload: { noteId: note.id, preview: parsed.data.note.substring(0, 100) },
      });

      return res.status(201).json(note);
    } catch (err) {
      console.error("Failed to create note:", err);
      return res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.get("/api/admin/leads/:id/notes", requireAdmin, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      if (isNaN(leadId)) return res.status(400).json({ error: "Invalid lead ID" });
      const notes = await storage.getLeadNotes(leadId);
      return res.json(notes);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.get("/api/admin/leads/:id/activity", requireAdmin, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      if (isNaN(leadId)) return res.status(400).json({ error: "Invalid lead ID" });
      const activity = await storage.getLeadActivity(leadId);
      return res.json(activity);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
      return res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  // ---- Public Settings Route ----
  app.get("/api/public/settings", async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      return res.json(settings);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      return res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // ---- Public Blog Routes ----
  app.get("/api/public/blog", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
      };
      const posts = await storage.getPublishedBlogPosts(filters);
      return res.json(posts);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/public/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Post not found" });
      }
      return res.json(post);
    } catch (err) {
      console.error("Failed to fetch blog post:", err);
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/public/blog/:slug/related", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Post not found" });
      }
      const related = await storage.getRelatedPosts(post.id, post.category);
      return res.json(related);
    } catch (err) {
      console.error("Failed to fetch related posts:", err);
      return res.status(500).json({ error: "Failed to fetch related posts" });
    }
  });

  // ---- Admin Blog Routes ----
  app.get("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
      };
      const posts = await storage.getBlogPosts(filters);
      return res.json(posts);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", requireAdmin, async (req, res) => {
    try {
      const parsed = insertBlogPostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const existing = await storage.getBlogPostBySlug(parsed.data.slug);
      if (existing) {
        return res.status(409).json({ error: "A post with this slug already exists" });
      }
      const post = await storage.createBlogPost(parsed.data);
      return res.status(201).json(post);
    } catch (err) {
      console.error("Failed to create blog post:", err);
      return res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.get("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.json(post);
    } catch (err) {
      console.error("Failed to fetch blog post:", err);
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.patch("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const parsed = updateBlogPostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updateData: any = { ...parsed.data };
      if (parsed.data.publishedAt !== undefined) {
        updateData.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
      }
      if (parsed.data.status === "published" && !updateData.publishedAt) {
        const existing = await storage.getBlogPost(req.params.id);
        if (existing && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
      if (parsed.data.slug) {
        const existing = await storage.getBlogPostBySlug(parsed.data.slug);
        if (existing && existing.id !== req.params.id) {
          return res.status(409).json({ error: "A post with this slug already exists" });
        }
      }
      const updated = await storage.updateBlogPost(req.params.id, updateData);
      if (!updated) return res.status(404).json({ error: "Post not found" });
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update blog post:", err);
      return res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Post not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      return res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // ---- Admin Settings Routes ----
  app.get("/api/admin/settings", requireAdmin, async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      return res.json(settings);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      return res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const parsed = updateSiteSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updated = await storage.updateSiteSettings(parsed.data);
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update settings:", err);
      return res.status(500).json({ error: "Failed to update settings" });
    }
  });

  app.get("/api/admin/docs", requireAdmin, (_req, res) => {
    res.json({
      phase: "Phase 6: Branding Settings",
      overview:
        "BrushWhackers is a full-stack web application for a land clearing and brush removal business targeting the Charlotte, North Carolina area. Phase 6 adds site-wide branding settings managed through the admin portal, with live preview and automatic CSS variable injection for theme customization.",
      authentication: {
        method: "Session-based with Passport.js LocalStrategy",
        adminUser: "Single admin user authenticated via ADMIN_PASSWORD environment variable",
        session: "express-session with MemoryStore, 24-hour cookie expiry",
        protection: "All /api/admin/* routes (except login) require authentication via requireAdmin middleware",
      },
      frontendRoutes: [
        { path: "/", description: "Home page with hero, services, pricing, testimonials" },
        { path: "/services", description: "Services overview" },
        { path: "/services/:slug", description: "Individual service detail page" },
        { path: "/pricing", description: "Pricing tiers" },
        { path: "/blog", description: "Blog listing (database-driven)" },
        { path: "/blog/:slug", description: "Blog post view (database-driven)" },
        { path: "/quote", description: "Multi-step quote form" },
        { path: "/admin", description: "Admin dashboard with pipeline stats" },
        { path: "/admin/leads", description: "CRM leads list with filters, search, pagination" },
        { path: "/admin/leads/:id", description: "Lead detail with status management, notes, activity" },
        { path: "/admin/cms", description: "Content manager shell" },
        { path: "/admin/cms/blog", description: "Blog CMS list with filters" },
        { path: "/admin/cms/blog/:id", description: "Blog editor with markdown preview" },
        { path: "/admin/branding", description: "Branding settings with live preview" },
        { path: "/admin/docs", description: "Technical documentation library" },
      ],
      backendRoutes: [
        { method: "GET", path: "/api/health", description: "Health check" },
        { method: "POST", path: "/api/public/leads", description: "Create lead (public, rate-limited, honeypot)" },
        { method: "GET", path: "/api/public/settings", description: "Get public site settings (branding, colors, contact info)" },
        { method: "GET", path: "/api/public/blog", description: "List published blog posts with optional category/search filters" },
        { method: "GET", path: "/api/public/blog/:slug", description: "Get published blog post by slug" },
        { method: "GET", path: "/api/public/blog/:slug/related", description: "Get related posts by category" },
        { method: "POST", path: "/api/admin/login", description: "Admin login. Body: { username, password }. Returns { user }" },
        { method: "POST", path: "/api/admin/logout", description: "Admin logout. Returns { ok: true }" },
        { method: "GET", path: "/api/admin/me", description: "Get current admin user. Returns { user } or 401" },
        {
          method: "GET", path: "/api/admin/leads",
          description: "List leads with filters and pagination",
          queryParams: "status, county, service, search, dateFrom, dateTo, page, pageSize",
          response: "{ leads[], total, page, pageSize, totalPages }",
        },
        { method: "GET", path: "/api/admin/leads/stats", description: "Dashboard stats: { total, newThisWeek, pipeline: { New: n, Contacted: n, ... } }" },
        { method: "GET", path: "/api/admin/leads/export.csv", description: "Export all leads as CSV file download" },
        { method: "GET", path: "/api/admin/leads/:id", description: "Get single lead by ID" },
        { method: "PATCH", path: "/api/admin/leads/:id", description: "Update lead. Body: { status?, tags?, assignedTo?, lastContactedAt? }" },
        { method: "POST", path: "/api/admin/leads/:id/notes", description: "Add note. Body: { note: string }. Returns created note" },
        { method: "GET", path: "/api/admin/leads/:id/notes", description: "List notes for lead" },
        { method: "GET", path: "/api/admin/leads/:id/activity", description: "List activity log for lead" },
        { method: "GET", path: "/api/admin/settings", description: "Get site settings (admin). Returns full settings object" },
        { method: "PUT", path: "/api/admin/settings", description: "Update site settings. Body: { companyName?, phone?, email?, serviceArea?, logoUrl?, primaryColor?, secondaryColor?, fontFamily?, ctaText?, socialFacebook?, socialInstagram?, socialYoutube?, socialGoogle? }" },
        { method: "GET", path: "/api/admin/blog", description: "List all blog posts (admin, with status/category/search filters)" },
        { method: "POST", path: "/api/admin/blog", description: "Create blog post" },
        { method: "GET", path: "/api/admin/blog/:id", description: "Get blog post by ID" },
        { method: "PATCH", path: "/api/admin/blog/:id", description: "Update blog post" },
        { method: "DELETE", path: "/api/admin/blog/:id", description: "Delete blog post" },
        { method: "GET", path: "/api/admin/docs", description: "Project documentation JSON" },
      ],
      databaseSchema: {
        users: "id (varchar PK, UUID), username (unique), password",
        leads: "id (serial PK), fullName, phone, email, jobAddress, county, servicesNeeded (text[]), propertyType, approximateArea, accessFlags (text[]), accessNotes, desiredOutcome, timeline, budgetComfort, status (New|Contacted|Scheduled|Won|Lost), source, tags (text[]), assignedTo, lastContactedAt, createdAt, updatedAt",
        lead_notes: "id (serial PK), leadId (FK), note (text), createdBy (text), createdAt",
        lead_activity: "id (serial PK), leadId, type (STATUS_CHANGE|NOTE_ADDED|ASSIGNED|EXPORTED), payload (jsonb), createdAt",
        blog_posts: "id (UUID PK), slug (unique), title, excerpt, content (markdown), featuredImageUrl, category, tags (text[]), publishedAt, updatedAt, status (draft|published)",
        site_settings: "id (serial PK), companyName, phone, email, serviceArea, logoUrl, primaryColor (HSL), secondaryColor (HSL), fontFamily, ctaText, socialFacebook, socialInstagram, socialYoutube, socialGoogle, updatedAt",
      },
      brandingSystem: {
        settingsTable: "Single-row site_settings table stores all branding values",
        cssVariableInjection: "SiteSettingsProvider context loads settings on app init and injects --primary CSS variable into :root",
        colorFormat: "Colors stored as HSL values (e.g. '28 65% 42%') for compatibility with Tailwind CSS variable system",
        defaults: "Safe defaults applied if settings row missing: BrushWhackers, warm brown primary, sage green secondary, Inter font",
        livePreview: "Admin branding page includes a live preview card showing how changes will appear across the site",
        appliedLocations: "Settings are applied to: TopNav (logo + company name + CTA text), Footer (contact info + social links + company name), StickyQuoteButton (CTA text), CSS variables (primary color)",
      },
    });
  });

  return httpServer;
}
