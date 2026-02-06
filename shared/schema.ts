import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, jsonb, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const LEAD_STATUSES = ["New", "Contacted", "Scheduled", "Won", "Lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  jobAddress: text("job_address").notNull(),
  county: text("county").notNull(),
  servicesNeeded: text("services_needed").array().notNull(),
  propertyType: text("property_type").notNull(),
  approximateArea: text("approximate_area").notNull(),
  accessFlags: text("access_flags").array(),
  accessNotes: text("access_notes"),
  desiredOutcome: text("desired_outcome"),
  timeline: text("timeline").notNull(),
  budgetComfort: text("budget_comfort").notNull(),
  status: text("status").notNull().default("New"),
  source: text("source").default("Website Quote Form"),
  tags: text("tags").array(),
  assignedTo: text("assigned_to"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  status: true,
  source: true,
  tags: true,
  assignedTo: true,
  lastContactedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  tags: z.array(z.string()).optional(),
  assignedTo: z.string().nullable().optional(),
  lastContactedAt: z.string().nullable().optional(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  note: text("note").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeadNoteSchema = createInsertSchema(leadNotes).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadNote = z.infer<typeof insertLeadNoteSchema>;
export type LeadNote = typeof leadNotes.$inferSelect;

export const ACTIVITY_TYPES = ["STATUS_CHANGE", "NOTE_ADDED", "ASSIGNED", "EXPORTED"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const leadActivity = pgTable("lead_activity", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  type: text("type").notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeadActivitySchema = createInsertSchema(leadActivity).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadActivity = z.infer<typeof insertLeadActivitySchema>;
export type LeadActivity = typeof leadActivity.$inferSelect;

export const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImageUrl: text("featured_image_url"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: text("status").notNull().default("draft"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  updatedAt: true,
});

export const updateBlogPostSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  featuredImageUrl: z.string().nullable().optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(POST_STATUSES).optional(),
  publishedAt: z.string().nullable().optional(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
