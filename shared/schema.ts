import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dids = pgTable("dids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  did: text("did").notNull().unique(),
  method: text("method").notNull(),
  document: jsonb("document").notNull(),
  keyStored: boolean("key_stored").default(true),
  syncInterval: text("sync_interval").default("2m"),
  dwnEndpoints: jsonb("dwn_endpoints"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const didResolutions = pgTable("did_resolutions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  did: text("did").notNull(),
  document: jsonb("document"),
  resolvedAt: timestamp("resolved_at").defaultNow(),
  success: boolean("success").default(true),
  error: text("error"),
});

export const systemLogs = pgTable("system_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: text("level").notNull(), // INFO, DEBUG, SUCCESS, ERROR
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  data: jsonb("data"),
});

export const insertDidSchema = createInsertSchema(dids).pick({
  method: true,
  keyStored: true,
  syncInterval: true,
  dwnEndpoints: true,
});

export const insertDidResolutionSchema = createInsertSchema(didResolutions).pick({
  did: true,
});

export const insertSystemLogSchema = createInsertSchema(systemLogs).pick({
  level: true,
  message: true,
  data: true,
});

export type InsertDid = z.infer<typeof insertDidSchema>;
export type Did = typeof dids.$inferSelect;
export type InsertDidResolution = z.infer<typeof insertDidResolutionSchema>;
export type DidResolution = typeof didResolutions.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SystemLog = typeof systemLogs.$inferSelect;

// Web5 specific types
export const didCreationRequestSchema = z.object({
  method: z.enum(["auto", "custom", "community"]),
  didMethod: z.enum(["dht", "jwk", "ion"]).default("dht"),
  syncInterval: z.enum(["30s", "2m", "5m", "off"]).default("2m"),
  keyStored: z.boolean().default(true),
  dwnEndpoints: z.array(z.string().url()).optional(),
});

export type DidCreationRequest = z.infer<typeof didCreationRequestSchema>;
