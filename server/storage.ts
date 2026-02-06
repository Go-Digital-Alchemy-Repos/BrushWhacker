import {
  type User, type InsertUser,
  type Lead, type InsertLead,
  type LeadNote, type InsertLeadNote,
  type LeadActivity, type InsertLeadActivity,
  type BlogPost, type InsertBlogPost,
  type SiteSettings, type UpdateSiteSettings,
  type CmsPage, type InsertCmsPage, type UpdateCmsPage,
  type CmsTemplate, type InsertCmsTemplate, type UpdateCmsTemplate,
  type CmsBlock, type InsertCmsBlock,
  type CmsMediaItem, type InsertCmsMedia,
  type ThemePreset, type InsertThemePreset,
  type CmsRedirect, type InsertCmsRedirect,
  leads, leadNotes, leadActivity, blogPosts, siteSettings,
  cmsPages, cmsTemplates, cmsBlockLibrary, cmsMedia, themePresets, cmsRedirects,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, or, ilike, gte, lte, sql, inArray, ne, asc } from "drizzle-orm";

export interface LeadFilters {
  status?: string;
  county?: string;
  service?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(filters?: LeadFilters): Promise<PaginatedLeads>;
  getAllLeads(): Promise<Lead[]>;
  getLead(id: number): Promise<Lead | undefined>;
  updateLead(id: number, data: Partial<Pick<Lead, "status" | "tags" | "assignedTo" | "lastContactedAt">>): Promise<Lead | undefined>;
  createLeadNote(note: InsertLeadNote): Promise<LeadNote>;
  getLeadNotes(leadId: number): Promise<LeadNote[]>;
  createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity>;
  getLeadActivity(leadId: number): Promise<LeadActivity[]>;
  getLeadStats(): Promise<{ total: number; newThisWeek: number; pipeline: Record<string, number> }>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, data: Partial<Omit<BlogPost, "id">>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPosts(filters?: { status?: string; category?: string; search?: string }): Promise<BlogPost[]>;
  getPublishedBlogPosts(filters?: { category?: string; search?: string }): Promise<BlogPost[]>;
  getRelatedPosts(postId: string, category: string, limit?: number): Promise<BlogPost[]>;
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(data: UpdateSiteSettings): Promise<SiteSettings>;
  getCmsPages(filters?: { status?: string; pageType?: string; search?: string }): Promise<CmsPage[]>;
  getCmsPage(id: string): Promise<CmsPage | undefined>;
  getCmsPageBySlug(slug: string): Promise<CmsPage | undefined>;
  createCmsPage(data: InsertCmsPage): Promise<CmsPage>;
  updateCmsPage(id: string, data: Partial<UpdateCmsPage>): Promise<CmsPage | undefined>;
  deleteCmsPage(id: string): Promise<boolean>;
  getCmsTemplates(): Promise<CmsTemplate[]>;
  getCmsTemplate(id: string): Promise<CmsTemplate | undefined>;
  createCmsTemplate(data: InsertCmsTemplate): Promise<CmsTemplate>;
  updateCmsTemplate(id: string, data: Partial<UpdateCmsTemplate>): Promise<CmsTemplate | undefined>;
  deleteCmsTemplate(id: string): Promise<boolean>;
  getCmsBlocks(): Promise<CmsBlock[]>;
  createCmsBlock(data: InsertCmsBlock): Promise<CmsBlock>;
  getCmsMedia(filters?: { search?: string }): Promise<CmsMediaItem[]>;
  createCmsMedia(data: InsertCmsMedia): Promise<CmsMediaItem>;
  deleteCmsMedia(id: string): Promise<boolean>;
  getThemePresets(): Promise<ThemePreset[]>;
  getActiveThemePreset(): Promise<ThemePreset | undefined>;
  activateThemePreset(id: string): Promise<ThemePreset>;
  getCmsRedirects(): Promise<CmsRedirect[]>;
  createCmsRedirect(data: InsertCmsRedirect): Promise<CmsRedirect>;
  deleteCmsRedirect(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getLeads(filters: LeadFilters = {}): Promise<PaginatedLeads> {
    const page = Math.max(1, filters.page || 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize || 20));
    const offset = (page - 1) * pageSize;

    const conditions: any[] = [];

    if (filters.status) {
      conditions.push(eq(leads.status, filters.status));
    }
    if (filters.county) {
      conditions.push(eq(leads.county, filters.county));
    }
    if (filters.service) {
      conditions.push(sql`${filters.service} = ANY(${leads.servicesNeeded})`);
    }
    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(leads.fullName, term),
          ilike(leads.email, term),
          ilike(leads.phone, term),
        )
      );
    }
    if (filters.dateFrom) {
      conditions.push(gte(leads.createdAt, new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      conditions.push(lte(leads.createdAt, new Date(filters.dateTo)));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(whereClause);

    const total = countResult.count;

    const rows = await db
      .select()
      .from(leads)
      .where(whereClause)
      .orderBy(desc(leads.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      leads: rows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getAllLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async updateLead(
    id: number,
    data: Partial<Pick<Lead, "status" | "tags" | "assignedTo" | "lastContactedAt">>
  ): Promise<Lead | undefined> {
    const updateData: any = { ...data, updatedAt: new Date() };
    const [updated] = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, id))
      .returning();
    return updated;
  }

  async createLeadNote(note: InsertLeadNote): Promise<LeadNote> {
    const [created] = await db.insert(leadNotes).values(note).returning();
    return created;
  }

  async getLeadNotes(leadId: number): Promise<LeadNote[]> {
    return db
      .select()
      .from(leadNotes)
      .where(eq(leadNotes.leadId, leadId))
      .orderBy(desc(leadNotes.createdAt));
  }

  async createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity> {
    const [created] = await db.insert(leadActivity).values(activity).returning();
    return created;
  }

  async getLeadActivity(leadId: number): Promise<LeadActivity[]> {
    return db
      .select()
      .from(leadActivity)
      .where(eq(leadActivity.leadId, leadId))
      .orderBy(desc(leadActivity.createdAt));
  }

  async getLeadStats(): Promise<{ total: number; newThisWeek: number; pipeline: Record<string, number> }> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads);

    const [newWeekResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(gte(leads.createdAt, weekAgo));

    const pipelineRows = await db
      .select({
        status: leads.status,
        count: sql<number>`count(*)::int`,
      })
      .from(leads)
      .groupBy(leads.status);

    const pipeline: Record<string, number> = {};
    for (const row of pipelineRows) {
      pipeline[row.status] = row.count;
    }

    return {
      total: totalResult.count,
      newThisWeek: newWeekResult.count,
      pipeline,
    };
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [created] = await db.insert(blogPosts).values(post).returning();
    return created;
  }

  async updateBlogPost(id: string, data: Partial<Omit<BlogPost, "id">>): Promise<BlogPost | undefined> {
    const updateData = { ...data, updatedAt: new Date() };
    const [updated] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPosts(filters: { status?: string; category?: string; search?: string } = {}): Promise<BlogPost[]> {
    const conditions: any[] = [];
    if (filters.status) conditions.push(eq(blogPosts.status, filters.status));
    if (filters.category) conditions.push(eq(blogPosts.category, filters.category));
    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(or(ilike(blogPosts.title, term), ilike(blogPosts.excerpt, term)));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    return db.select().from(blogPosts).where(whereClause).orderBy(desc(blogPosts.updatedAt));
  }

  async getPublishedBlogPosts(filters: { category?: string; search?: string } = {}): Promise<BlogPost[]> {
    const conditions: any[] = [eq(blogPosts.status, "published")];
    if (filters.category) conditions.push(eq(blogPosts.category, filters.category));
    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(or(ilike(blogPosts.title, term), ilike(blogPosts.excerpt, term)));
    }
    return db.select().from(blogPosts).where(and(...conditions)).orderBy(desc(blogPosts.publishedAt));
  }

  async getRelatedPosts(postId: string, category: string, limit = 3): Promise<BlogPost[]> {
    return db
      .select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.status, "published"),
        eq(blogPosts.category, category),
        ne(blogPosts.id, postId),
      ))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const rows = await db.select().from(siteSettings).limit(1);
    if (rows.length > 0) return rows[0];
    const [created] = await db.insert(siteSettings).values({}).returning();
    return created;
  }

  async updateSiteSettings(data: UpdateSiteSettings): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();
    const [updated] = await db
      .update(siteSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteSettings.id, existing.id))
      .returning();
    return updated;
  }

  async getCmsPages(filters: { status?: string; pageType?: string; search?: string } = {}): Promise<CmsPage[]> {
    const conditions: any[] = [];
    if (filters.status) conditions.push(eq(cmsPages.status, filters.status));
    if (filters.pageType) conditions.push(eq(cmsPages.pageType, filters.pageType));
    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(or(ilike(cmsPages.title, term), ilike(cmsPages.slug, term)));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    return db.select().from(cmsPages).where(whereClause).orderBy(desc(cmsPages.updatedAt));
  }

  async getCmsPage(id: string): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.id, id));
    return page;
  }

  async getCmsPageBySlug(slug: string): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug));
    return page;
  }

  async createCmsPage(data: InsertCmsPage): Promise<CmsPage> {
    const [created] = await db.insert(cmsPages).values(data).returning();
    return created;
  }

  async updateCmsPage(id: string, data: Partial<UpdateCmsPage>): Promise<CmsPage | undefined> {
    const { publishedAt, ...rest } = data;
    const updateData: any = { ...rest, updatedAt: new Date() };
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    }
    const [updated] = await db
      .update(cmsPages)
      .set(updateData)
      .where(eq(cmsPages.id, id))
      .returning();
    return updated;
  }

  async deleteCmsPage(id: string): Promise<boolean> {
    const result = await db.delete(cmsPages).where(eq(cmsPages.id, id)).returning();
    return result.length > 0;
  }

  async getCmsTemplates(): Promise<CmsTemplate[]> {
    return db.select().from(cmsTemplates).orderBy(desc(cmsTemplates.updatedAt));
  }

  async getCmsTemplate(id: string): Promise<CmsTemplate | undefined> {
    const [template] = await db.select().from(cmsTemplates).where(eq(cmsTemplates.id, id));
    return template;
  }

  async createCmsTemplate(data: InsertCmsTemplate): Promise<CmsTemplate> {
    const [created] = await db.insert(cmsTemplates).values(data).returning();
    return created;
  }

  async updateCmsTemplate(id: string, data: Partial<UpdateCmsTemplate>): Promise<CmsTemplate | undefined> {
    const updateData = { ...data, updatedAt: new Date() };
    const [updated] = await db
      .update(cmsTemplates)
      .set(updateData)
      .where(eq(cmsTemplates.id, id))
      .returning();
    return updated;
  }

  async deleteCmsTemplate(id: string): Promise<boolean> {
    const result = await db.delete(cmsTemplates).where(eq(cmsTemplates.id, id)).returning();
    return result.length > 0;
  }

  async getCmsBlocks(): Promise<CmsBlock[]> {
    return db.select().from(cmsBlockLibrary).orderBy(asc(cmsBlockLibrary.category), asc(cmsBlockLibrary.name));
  }

  async createCmsBlock(data: InsertCmsBlock): Promise<CmsBlock> {
    const [created] = await db.insert(cmsBlockLibrary).values(data).returning();
    return created;
  }

  async getCmsMedia(filters: { search?: string } = {}): Promise<CmsMediaItem[]> {
    const conditions: any[] = [];
    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(or(ilike(cmsMedia.alt, term), ilike(cmsMedia.title, term)));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    return db.select().from(cmsMedia).where(whereClause).orderBy(desc(cmsMedia.createdAt));
  }

  async createCmsMedia(data: InsertCmsMedia): Promise<CmsMediaItem> {
    const [created] = await db.insert(cmsMedia).values(data).returning();
    return created;
  }

  async deleteCmsMedia(id: string): Promise<boolean> {
    const result = await db.delete(cmsMedia).where(eq(cmsMedia.id, id)).returning();
    return result.length > 0;
  }

  async getThemePresets(): Promise<ThemePreset[]> {
    return db.select().from(themePresets).orderBy(asc(themePresets.name));
  }

  async getActiveThemePreset(): Promise<ThemePreset | undefined> {
    const [preset] = await db.select().from(themePresets).where(eq(themePresets.isActive, true));
    return preset;
  }

  async activateThemePreset(id: string): Promise<ThemePreset> {
    await db.update(themePresets).set({ isActive: false });
    const [activated] = await db
      .update(themePresets)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(themePresets.id, id))
      .returning();
    return activated;
  }

  async getCmsRedirects(): Promise<CmsRedirect[]> {
    return db.select().from(cmsRedirects).orderBy(desc(cmsRedirects.createdAt));
  }

  async createCmsRedirect(data: InsertCmsRedirect): Promise<CmsRedirect> {
    const [created] = await db.insert(cmsRedirects).values(data).returning();
    return created;
  }

  async deleteCmsRedirect(id: string): Promise<boolean> {
    const result = await db.delete(cmsRedirects).where(eq(cmsRedirects.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
