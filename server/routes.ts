import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";

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

  app.get("/api/admin/leads", async (_req, res) => {
    try {
      const allLeads = await storage.getLeads();
      return res.json(allLeads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/docs", (_req, res) => {
    res.json({
      phase: "Phase 3: Pricing + Quote Form + Leads API",
      overview:
        "BrushWhackers is a full-stack web application for a land clearing and brush removal business targeting the Charlotte, North Carolina area. The app features a modern React frontend with Tailwind CSS styling, an Express backend with PostgreSQL database, SEO-optimized pages, a multi-step quote form, and a leads management system.",
      frontendRoutes: [
        { path: "/", description: "Home page with hero, What We Clear cards, services grid, process steps, Why BrushWhackers, service area, testimonials, and CTA" },
        { path: "/services", description: "Services overview with SEO meta, intro paragraph, and service cards" },
        { path: "/services/land-clearing", description: "Land clearing - full SEO content with Best For, What's Included, Typical Projects, FAQs" },
        { path: "/services/brush-removal", description: "Brush removal - full SEO content" },
        { path: "/services/forestry-mulching", description: "Forestry mulching - full SEO content" },
        { path: "/services/lot-clearing", description: "Lot clearing - full SEO content" },
        { path: "/services/stump-grinding", description: "Stump grinding - full SEO content" },
        { path: "/services/driveway-trail-cutting", description: "Driveway & trail cutting - full SEO content" },
        { path: "/services/storm-cleanup", description: "Storm cleanup - full SEO content" },
        { path: "/pricing", description: "Pricing with 4 tiers (Hourly, Half-Day, Full-Day, By the Acre), What Affects Price, FAQ" },
        { path: "/blog", description: "Blog listing with article cards" },
        { path: "/blog/:slug", description: "Individual blog post view" },
        { path: "/quote", description: "Multi-step quote form (Project Basics, Property Details, Your Goals, Confirm) submitting to /api/public/leads" },
        { path: "/admin", description: "Admin dashboard with links to all admin sections" },
        { path: "/admin/leads", description: "CRM leads management (reads from /api/admin/leads)" },
        { path: "/admin/cms", description: "Content management shell" },
        { path: "/admin/branding", description: "Branding settings shell" },
        { path: "/admin/docs", description: "Technical documentation library" },
      ],
      backendRoutes: [
        { method: "GET", path: "/api/health", description: "Health check endpoint returning status and timestamp" },
        { method: "POST", path: "/api/public/leads", description: "Create a new lead from quote form. Validates with Zod, rate-limited (5/min/IP), honeypot spam protection. Returns { leadId }" },
        { method: "GET", path: "/api/admin/leads", description: "Returns all leads ordered by creation date" },
        { method: "GET", path: "/api/admin/docs", description: "Returns project documentation as JSON" },
      ],
      leadSchema: {
        fields: [
          "fullName (text, required)",
          "phone (text, required)",
          "email (text, required)",
          "jobAddress (text, required)",
          "county (text, required)",
          "servicesNeeded (text[], required)",
          "propertyType (text, required)",
          "approximateArea (text, required)",
          "accessNotes (text, optional)",
          "desiredOutcome (text, optional)",
          "timeline (text, required)",
          "budgetComfort (text, required)",
        ],
        autoFields: ["id (serial PK)", "status (default: 'new')", "createdAt (timestamp)"],
      },
      spamProtection: {
        rateLimit: "5 requests per minute per IP (in-memory)",
        honeypot: "Hidden 'company' field must be empty to pass",
      },
      pricingModel: {
        hourly: "$250 minimum (first hour), then $175/hr",
        halfDay: "$600 (4 hours, effective $150/hr)",
        fullDay: "$1,000 (8 hours, effective $125/hr)",
        byTheAcre: "Starting at $900/acre",
        disclaimer: "All pricing is estimated. Final price depends on access, density, terrain, and disposal. A quote confirms exact pricing.",
      },
      seoApproach: "Each page has unique <title> and meta description set via usePageMeta hook. H1 tags include service name + Charlotte, NC. Regional references to Mecklenburg, Union, Cabarrus, Gaston counties, Lake Norman, Matthews, Mint Hill, etc. Internal links between service pages.",
      components: [
        { name: "SiteLayout", description: "Main layout wrapper with TopNav, Footer, and sticky quote button" },
        { name: "TopNav", description: "Site-wide navigation with services dropdown, mobile menu, and CTA button" },
        { name: "Footer", description: "Site footer with service links, company links, and contact info" },
        { name: "StickyQuoteButton", description: "Fixed-position 'Get a Quote' button visible on desktop" },
        { name: "usePageMeta", description: "React hook to set document title and meta description per page" },
      ],
      envVars: [
        { name: "PORT", description: "Server port (default: 5000)" },
        { name: "NODE_ENV", description: "Environment mode (development/production)" },
        { name: "SESSION_SECRET", description: "Session encryption secret" },
        { name: "DATABASE_URL", description: "PostgreSQL connection string" },
      ],
      imageConstants: "client/src/lib/stock-images.ts - STOCK_IMAGES and SERVICE_IMAGES objects with Unsplash URLs",
      runLocally: [
        "Clone the repository",
        "Run `npm install` to install dependencies",
        "Set up environment variables (PORT, SESSION_SECRET, DATABASE_URL)",
        "Run `npm run db:push` to create database tables",
        "Run `npm run dev` to start the development server",
        "Open http://localhost:5000 in your browser",
      ],
    });
  });

  return httpServer;
}
