import type { Express } from "express";
import { storage } from "./storage";
import { requireAdmin } from "./auth";
import {
  insertCmsPageSchema, updateCmsPageSchema,
  insertCmsTemplateSchema, updateCmsTemplateSchema,
  insertCmsBlockSchema,
  insertCmsMediaSchema,
  insertCmsRedirectSchema,
} from "@shared/schema";

export function registerCmsRoutes(app: Express) {
  app.get("/api/admin/cms/pages", requireAdmin, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        pageType: req.query.pageType as string | undefined,
        search: req.query.search as string | undefined,
      };
      const pages = await storage.getCmsPages(filters);
      return res.json(pages);
    } catch (err) {
      console.error("Failed to fetch CMS pages:", err);
      return res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.post("/api/admin/cms/pages", requireAdmin, async (req, res) => {
    try {
      const parsed = insertCmsPageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const existing = await storage.getCmsPageBySlug(parsed.data.slug);
      if (existing) {
        return res.status(409).json({ error: "A page with this slug already exists" });
      }
      const page = await storage.createCmsPage(parsed.data);
      return res.status(201).json(page);
    } catch (err) {
      console.error("Failed to create CMS page:", err);
      return res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.get("/api/admin/cms/pages/:id", requireAdmin, async (req, res) => {
    try {
      const page = await storage.getCmsPage(req.params.id);
      if (!page) return res.status(404).json({ error: "Page not found" });
      return res.json(page);
    } catch (err) {
      console.error("Failed to fetch CMS page:", err);
      return res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.patch("/api/admin/cms/pages/:id", requireAdmin, async (req, res) => {
    try {
      const parsed = updateCmsPageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      if (parsed.data.slug) {
        const existing = await storage.getCmsPageBySlug(parsed.data.slug);
        if (existing && existing.id !== req.params.id) {
          return res.status(409).json({ error: "A page with this slug already exists" });
        }
      }
      const updated = await storage.updateCmsPage(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Page not found" });
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update CMS page:", err);
      return res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/cms/pages/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCmsPage(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Page not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete CMS page:", err);
      return res.status(500).json({ error: "Failed to delete page" });
    }
  });

  app.get("/api/admin/cms/templates", requireAdmin, async (_req, res) => {
    try {
      const templates = await storage.getCmsTemplates();
      return res.json(templates);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      return res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/admin/cms/templates", requireAdmin, async (req, res) => {
    try {
      const parsed = insertCmsTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const template = await storage.createCmsTemplate(parsed.data);
      return res.status(201).json(template);
    } catch (err) {
      console.error("Failed to create template:", err);
      return res.status(500).json({ error: "Failed to create template" });
    }
  });

  app.get("/api/admin/cms/templates/:id", requireAdmin, async (req, res) => {
    try {
      const template = await storage.getCmsTemplate(req.params.id);
      if (!template) return res.status(404).json({ error: "Template not found" });
      return res.json(template);
    } catch (err) {
      console.error("Failed to fetch template:", err);
      return res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.patch("/api/admin/cms/templates/:id", requireAdmin, async (req, res) => {
    try {
      const parsed = updateCmsTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updated = await storage.updateCmsTemplate(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Template not found" });
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update template:", err);
      return res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/admin/cms/templates/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCmsTemplate(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Template not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete template:", err);
      return res.status(500).json({ error: "Failed to delete template" });
    }
  });

  app.get("/api/admin/cms/blocks", requireAdmin, async (_req, res) => {
    try {
      const blocks = await storage.getCmsBlocks();
      return res.json(blocks);
    } catch (err) {
      console.error("Failed to fetch blocks:", err);
      return res.status(500).json({ error: "Failed to fetch blocks" });
    }
  });

  app.post("/api/admin/cms/blocks", requireAdmin, async (req, res) => {
    try {
      const parsed = insertCmsBlockSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const block = await storage.createCmsBlock({ ...parsed.data, isSystem: false });
      return res.status(201).json(block);
    } catch (err) {
      console.error("Failed to create block:", err);
      return res.status(500).json({ error: "Failed to create block" });
    }
  });

  app.get("/api/admin/cms/media", requireAdmin, async (req, res) => {
    try {
      const filters = { search: req.query.search as string | undefined };
      const media = await storage.getCmsMedia(filters);
      return res.json(media);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      return res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.post("/api/admin/cms/media", requireAdmin, async (req, res) => {
    try {
      const parsed = insertCmsMediaSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const media = await storage.createCmsMedia(parsed.data);
      return res.status(201).json(media);
    } catch (err) {
      console.error("Failed to create media:", err);
      return res.status(500).json({ error: "Failed to create media" });
    }
  });

  app.delete("/api/admin/cms/media/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCmsMedia(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Media not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete media:", err);
      return res.status(500).json({ error: "Failed to delete media" });
    }
  });

  app.get("/api/admin/cms/themes", requireAdmin, async (_req, res) => {
    try {
      const presets = await storage.getThemePresets();
      return res.json(presets);
    } catch (err) {
      console.error("Failed to fetch themes:", err);
      return res.status(500).json({ error: "Failed to fetch themes" });
    }
  });

  app.post("/api/admin/cms/themes/:id/activate", requireAdmin, async (req, res) => {
    try {
      const preset = await storage.activateThemePreset(req.params.id);
      return res.json(preset);
    } catch (err) {
      console.error("Failed to activate theme:", err);
      return res.status(500).json({ error: "Failed to activate theme" });
    }
  });

  app.get("/api/admin/cms/redirects", requireAdmin, async (_req, res) => {
    try {
      const redirects = await storage.getCmsRedirects();
      return res.json(redirects);
    } catch (err) {
      console.error("Failed to fetch redirects:", err);
      return res.status(500).json({ error: "Failed to fetch redirects" });
    }
  });

  app.post("/api/admin/cms/redirects", requireAdmin, async (req, res) => {
    try {
      const parsed = insertCmsRedirectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const redirect = await storage.createCmsRedirect(parsed.data);
      return res.status(201).json(redirect);
    } catch (err) {
      console.error("Failed to create redirect:", err);
      return res.status(500).json({ error: "Failed to create redirect" });
    }
  });

  app.delete("/api/admin/cms/redirects/:id", requireAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteCmsRedirect(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Redirect not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete redirect:", err);
      return res.status(500).json({ error: "Failed to delete redirect" });
    }
  });

  app.get("/api/public/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getCmsPageBySlug(req.params.slug);
      if (!page || page.status !== "published") {
        return res.status(404).json({ error: "Page not found" });
      }
      return res.json(page);
    } catch (err) {
      console.error("Failed to fetch public page:", err);
      return res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.get("/api/public/theme", async (_req, res) => {
    try {
      const preset = await storage.getActiveThemePreset();
      if (!preset) return res.json(null);
      return res.json(preset);
    } catch (err) {
      console.error("Failed to fetch theme:", err);
      return res.status(500).json({ error: "Failed to fetch theme" });
    }
  });
}
