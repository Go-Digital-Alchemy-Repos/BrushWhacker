import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/admin/docs", (_req, res) => {
    res.json({
      phase: "Phase 1: Baseline Architecture + Branding + Shared UI",
      overview:
        "BrushWhackers is a full-stack web application for a land clearing and brush removal business targeting the Charlotte, North Carolina area. The app features a modern React frontend with Tailwind CSS styling, an Express backend, and is prepared for CMS, Admin Portal, Docs Library, and CRM leads management.",
      frontendRoutes: [
        { path: "/", description: "Home page with hero, services overview, stats, benefits, and CTA sections" },
        { path: "/services", description: "Services overview listing all available services" },
        { path: "/services/land-clearing", description: "Land clearing service detail page" },
        { path: "/services/brush-removal", description: "Brush removal service detail page" },
        { path: "/services/forestry-mulching", description: "Forestry mulching service detail page" },
        { path: "/services/lot-clearing", description: "Lot clearing service detail page" },
        { path: "/services/stump-grinding", description: "Stump grinding service detail page" },
        { path: "/services/driveway-trail-cutting", description: "Driveway & trail cutting service detail page" },
        { path: "/services/storm-cleanup", description: "Storm cleanup service detail page" },
        { path: "/pricing", description: "Pricing tiers (Residential, Commercial, Emergency) and FAQs" },
        { path: "/blog", description: "Blog listing with article cards" },
        { path: "/blog/:slug", description: "Individual blog post view" },
        { path: "/quote", description: "Quote request form with contact information" },
        { path: "/admin", description: "Admin dashboard with links to all admin sections" },
        { path: "/admin/leads", description: "CRM leads management shell" },
        { path: "/admin/cms", description: "Content management shell" },
        { path: "/admin/branding", description: "Branding settings shell" },
        { path: "/admin/docs", description: "Technical documentation library (this page)" },
      ],
      backendRoutes: [
        { method: "GET", path: "/api/health", description: "Health check endpoint returning status and timestamp" },
        { method: "GET", path: "/api/admin/docs", description: "Returns project documentation as JSON" },
      ],
      components: [
        { name: "SiteLayout", description: "Main layout wrapper with TopNav and Footer" },
        { name: "TopNav", description: "Site-wide navigation with services dropdown, mobile menu, and CTA button" },
        { name: "Footer", description: "Site footer with service links, company links, and contact info" },
        { name: "Button", description: "Shadcn button component with multiple variants (default, outline, ghost, secondary)" },
        { name: "Card", description: "Shadcn card component for content grouping" },
        { name: "Badge", description: "Shadcn badge component for labels and status indicators" },
        { name: "Input", description: "Shadcn input component for form fields" },
        { name: "Textarea", description: "Shadcn textarea for multi-line input" },
        { name: "Select", description: "Shadcn select dropdown component" },
        { name: "Label", description: "Shadcn label component for form accessibility" },
      ],
      envVars: [
        { name: "PORT", description: "Server port (default: 5000)" },
        { name: "NODE_ENV", description: "Environment mode (development/production)" },
        { name: "SESSION_SECRET", description: "Session encryption secret" },
      ],
      runLocally: [
        "Clone the repository",
        "Run `npm install` to install dependencies",
        "Set up environment variables (PORT, SESSION_SECRET)",
        "Run `npm run dev` to start the development server",
        "Open http://localhost:5000 in your browser",
      ],
    });
  });

  return httpServer;
}
