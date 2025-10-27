import { pgTable, text, varchar, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Campus locations (buildings, departments, points of interest)
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  type: varchar("type").notNull(), // building, department, amenity, parking
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  buildingCode: text("building_code"),
  description: text("description"),
  isAccessible: boolean("is_accessible").default(true),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Obstacles (temporary barriers, closures, construction)
export const obstacles = pgTable("obstacles", {
  id: varchar("id").primaryKey(),
  locationId: varchar("location_id").references(() => locations.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: varchar("severity").notNull(), // low, medium, high
  type: varchar("type").notNull(), // construction, closure, weather, accessibility
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertObstacleSchema = createInsertSchema(obstacles).omit({ 
  id: true, 
  reportedAt: true 
});
export type InsertObstacle = z.infer<typeof insertObstacleSchema>;
export type Obstacle = typeof obstacles.$inferSelect;

// Route information (for caching popular routes)
export interface RouteRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  mode: 'walking' | 'bicycling';
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
  startLocation?: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
}

export interface RouteResponse {
  distance: string;
  duration: string;
  steps: RouteStep[];
  overview_polyline: string;
}
