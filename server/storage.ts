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
  type CmsPageRevision,
  type AdminUser, type InsertAdminUser, type UpdateAdminUser,
  type CrmProject, type InsertCrmProject, type UpdateCrmProject,
  type CmsTestimonial, type InsertCmsTestimonial, type UpdateCmsTestimonial,
  type DocsEntry, type InsertDocsEntry,
  leads, leadNotes, leadActivity, blogPosts, siteSettings,
  cmsPages, cmsTemplates, cmsBlockLibrary, cmsMedia, themePresets, cmsRedirects,
  cmsPageRevisions, adminUsers, crmProjects, cmsTestimonials, docsEntries,
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
  getCmsMedia(filters?: { search?: string; page?: number; pageSize?: number }): Promise<{ items: CmsMediaItem[]; total: number }>;
  getCmsMediaById(id: string): Promise<CmsMediaItem | undefined>;
  createCmsMedia(data: InsertCmsMedia): Promise<CmsMediaItem>;
  updateCmsMedia(id: string, data: Partial<{ alt: string; title: string; tags: string[] }>): Promise<CmsMediaItem | undefined>;
  deleteCmsMedia(id: string): Promise<boolean>;
  getThemePresets(): Promise<ThemePreset[]>;
  getActiveThemePreset(): Promise<ThemePreset | undefined>;
  activateThemePreset(id: string): Promise<ThemePreset>;
  getCmsRedirects(): Promise<CmsRedirect[]>;
  createCmsRedirect(data: InsertCmsRedirect): Promise<CmsRedirect>;
  deleteCmsRedirect(id: string): Promise<boolean>;
  getPageRevisions(pageId: string): Promise<CmsPageRevision[]>;
  getPageRevision(id: string): Promise<CmsPageRevision | undefined>;
  createPageRevision(data: { pageId: string; createdBy?: string; message?: string; snapshot: Record<string, any> }): Promise<CmsPageRevision>;
  prunePageRevisions(pageId: string, keep: number): Promise<number>;
  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(data: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, data: Partial<UpdateAdminUser>): Promise<AdminUser | undefined>;
  deleteAdminUser(id: string): Promise<boolean>;
  getCrmProjects(): Promise<CrmProject[]>;
  getCrmProject(id: string): Promise<CrmProject | undefined>;
  createCrmProject(data: InsertCrmProject): Promise<CrmProject>;
  updateCrmProject(id: string, data: Partial<UpdateCrmProject>): Promise<CrmProject | undefined>;
  deleteCrmProject(id: string): Promise<boolean>;
  getPublishedProjects(): Promise<CrmProject[]>;
  getProjectBySlug(slug: string): Promise<CrmProject | undefined>;
  getProjectByLeadId(leadId: number): Promise<CrmProject | undefined>;
  getTestimonials(): Promise<CmsTestimonial[]>;
  getTestimonial(id: string): Promise<CmsTestimonial | undefined>;
  createTestimonial(data: InsertCmsTestimonial): Promise<CmsTestimonial>;
  updateTestimonial(id: string, data: Partial<UpdateCmsTestimonial>): Promise<CmsTestimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  getPublishedTestimonials(): Promise<CmsTestimonial[]>;
  getDocsEntries(filters?: { category?: string; search?: string }): Promise<DocsEntry[]>;
  getDocsEntry(id: string): Promise<DocsEntry | undefined>;
  getDocsEntryBySlug(slug: string): Promise<DocsEntry | undefined>;
  createDocsEntry(data: InsertDocsEntry): Promise<DocsEntry>;
  updateDocsEntry(id: string, data: Partial<InsertDocsEntry>): Promise<DocsEntry | undefined>;
  deleteDocsEntry(id: string): Promise<boolean>;
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

  async getCmsMedia(filters: { search?: string; page?: number; pageSize?: number } = {}): Promise<{ items: CmsMediaItem[]; total: number }> {
    const conditions: any[] = [];
    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(or(ilike(cmsMedia.alt, term), ilike(cmsMedia.title, term)));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;
    const offset = (page - 1) * pageSize;
    const [items, countResult] = await Promise.all([
      db.select().from(cmsMedia).where(whereClause).orderBy(desc(cmsMedia.createdAt)).limit(pageSize).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(cmsMedia).where(whereClause),
    ]);
    return { items, total: countResult[0]?.count || 0 };
  }

  async getCmsMediaById(id: string): Promise<CmsMediaItem | undefined> {
    const [item] = await db.select().from(cmsMedia).where(eq(cmsMedia.id, id));
    return item;
  }

  async createCmsMedia(data: InsertCmsMedia): Promise<CmsMediaItem> {
    const [created] = await db.insert(cmsMedia).values(data).returning();
    return created;
  }

  async updateCmsMedia(id: string, data: Partial<{ alt: string; title: string; tags: string[] }>): Promise<CmsMediaItem | undefined> {
    const updates: any = { ...data, updatedAt: new Date() };
    if (data.tags) updates.tags = data.tags;
    const [updated] = await db.update(cmsMedia).set(updates).where(eq(cmsMedia.id, id)).returning();
    return updated;
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

  async getPageRevisions(pageId: string): Promise<CmsPageRevision[]> {
    return db
      .select()
      .from(cmsPageRevisions)
      .where(eq(cmsPageRevisions.pageId, pageId))
      .orderBy(desc(cmsPageRevisions.createdAt));
  }

  async getPageRevision(id: string): Promise<CmsPageRevision | undefined> {
    const [rev] = await db.select().from(cmsPageRevisions).where(eq(cmsPageRevisions.id, id));
    return rev;
  }

  async createPageRevision(data: {
    pageId: string;
    createdBy?: string;
    message?: string;
    snapshot: Record<string, any>;
  }): Promise<CmsPageRevision> {
    const [created] = await db
      .insert(cmsPageRevisions)
      .values({
        pageId: data.pageId,
        createdBy: data.createdBy || null,
        message: data.message || null,
        snapshot: data.snapshot,
      })
      .returning();
    return created;
  }

  async prunePageRevisions(pageId: string, keep: number): Promise<number> {
    const all = await db
      .select({ id: cmsPageRevisions.id })
      .from(cmsPageRevisions)
      .where(eq(cmsPageRevisions.pageId, pageId))
      .orderBy(desc(cmsPageRevisions.createdAt));

    if (all.length <= keep) return 0;

    const toDelete = all.slice(keep).map((r) => r.id);
    const result = await db
      .delete(cmsPageRevisions)
      .where(inArray(cmsPageRevisions.id, toDelete))
      .returning();
    return result.length;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return db.select().from(adminUsers).orderBy(asc(adminUsers.email));
  }

  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase()));
    return user;
  }

  async createAdminUser(data: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db.insert(adminUsers).values({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      displayName: data.displayName || null,
      role: data.role,
    }).returning();
    return created;
  }

  async updateAdminUser(id: string, data: Partial<UpdateAdminUser>): Promise<AdminUser | undefined> {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.email) updateData.email = data.email.toLowerCase();
    const [updated] = await db.update(adminUsers).set(updateData).where(eq(adminUsers.id, id)).returning();
    return updated;
  }

  async deleteAdminUser(id: string): Promise<boolean> {
    const result = await db.delete(adminUsers).where(eq(adminUsers.id, id)).returning();
    return result.length > 0;
  }

  async getCrmProjects(): Promise<CrmProject[]> {
    return db.select().from(crmProjects).orderBy(desc(crmProjects.createdAt));
  }

  async getCrmProject(id: string): Promise<CrmProject | undefined> {
    const [project] = await db.select().from(crmProjects).where(eq(crmProjects.id, id));
    return project;
  }

  async createCrmProject(data: InsertCrmProject): Promise<CrmProject> {
    const [created] = await db.insert(crmProjects).values(data).returning();
    return created;
  }

  async updateCrmProject(id: string, data: Partial<UpdateCrmProject>): Promise<CrmProject | undefined> {
    const [updated] = await db.update(crmProjects).set({ ...data, updatedAt: new Date() } as any).where(eq(crmProjects.id, id)).returning();
    return updated;
  }

  async deleteCrmProject(id: string): Promise<boolean> {
    const result = await db.delete(crmProjects).where(eq(crmProjects.id, id)).returning();
    return result.length > 0;
  }

  async getPublishedProjects(): Promise<CrmProject[]> {
    return db.select().from(crmProjects).where(eq(crmProjects.publish, true)).orderBy(desc(crmProjects.createdAt));
  }

  async getProjectBySlug(slug: string): Promise<CrmProject | undefined> {
    const [project] = await db.select().from(crmProjects).where(eq(crmProjects.slug, slug));
    return project;
  }

  async getProjectByLeadId(leadId: number): Promise<CrmProject | undefined> {
    const [project] = await db.select().from(crmProjects).where(eq(crmProjects.leadId, leadId));
    return project;
  }

  async getTestimonials(): Promise<CmsTestimonial[]> {
    return db.select().from(cmsTestimonials).orderBy(desc(cmsTestimonials.createdAt));
  }

  async getTestimonial(id: string): Promise<CmsTestimonial | undefined> {
    const [testimonial] = await db.select().from(cmsTestimonials).where(eq(cmsTestimonials.id, id));
    return testimonial;
  }

  async createTestimonial(data: InsertCmsTestimonial): Promise<CmsTestimonial> {
    const [created] = await db.insert(cmsTestimonials).values(data).returning();
    return created;
  }

  async updateTestimonial(id: string, data: Partial<UpdateCmsTestimonial>): Promise<CmsTestimonial | undefined> {
    const [updated] = await db.update(cmsTestimonials).set({ ...data, updatedAt: new Date() } as any).where(eq(cmsTestimonials.id, id)).returning();
    return updated;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(cmsTestimonials).where(eq(cmsTestimonials.id, id)).returning();
    return result.length > 0;
  }

  async getPublishedTestimonials(): Promise<CmsTestimonial[]> {
    return db.select().from(cmsTestimonials).where(eq(cmsTestimonials.publish, true)).orderBy(desc(cmsTestimonials.createdAt));
  }

  async getDocsEntries(filters?: { category?: string; search?: string }): Promise<DocsEntry[]> {
    const conditions: any[] = [];
    if (filters?.category) conditions.push(eq(docsEntries.category, filters.category));
    if (filters?.search) {
      const q = `%${filters.search}%`;
      conditions.push(or(ilike(docsEntries.title, q), ilike(docsEntries.bodyMarkdown, q)));
    }
    return db.select().from(docsEntries)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(docsEntries.category), asc(docsEntries.title));
  }

  async getDocsEntry(id: string): Promise<DocsEntry | undefined> {
    const [entry] = await db.select().from(docsEntries).where(eq(docsEntries.id, id));
    return entry;
  }

  async getDocsEntryBySlug(slug: string): Promise<DocsEntry | undefined> {
    const [entry] = await db.select().from(docsEntries).where(eq(docsEntries.slug, slug));
    return entry;
  }

  async createDocsEntry(data: InsertDocsEntry): Promise<DocsEntry> {
    const [created] = await db.insert(docsEntries).values(data).returning();
    return created;
  }

  async updateDocsEntry(id: string, data: Partial<InsertDocsEntry>): Promise<DocsEntry | undefined> {
    const [updated] = await db.update(docsEntries).set({ ...data, updatedAt: new Date() } as any).where(eq(docsEntries.id, id)).returning();
    return updated;
  }

  async deleteDocsEntry(id: string): Promise<boolean> {
    const result = await db.delete(docsEntries).where(eq(docsEntries.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
