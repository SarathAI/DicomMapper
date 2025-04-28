import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Create schema for mapping data
export const mappings = pgTable("mappings", {
  id: serial("id").primaryKey(),
  hl7Field: text("hl7_field").notNull(),
  dicomTag: text("dicom_tag").notNull(),
  description: text("description"),
  status: text("status").default("mapped"),
  userId: integer("user_id").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMappingSchema = createInsertSchema(mappings).pick({
  hl7Field: true,
  dicomTag: true,
  description: true,
  status: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMapping = z.infer<typeof insertMappingSchema>;
export type Mapping = typeof mappings.$inferSelect;

// Define types for the frontend
export type MappingData = Record<string, string>;

// Validation schema for mapping data
export const mappingDataSchema = z.record(z.string(), z.string());
