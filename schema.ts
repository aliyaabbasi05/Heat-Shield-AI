import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const sites = sqliteTable('sites', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  siteType: text('siteType').notNull(),
  operatingHours: text('operatingHours'),
  notes: text('notes'),
  createdAt: integer('createdAt').notNull(),
});

export const alerts = sqliteTable('alerts', {
  id: text('id').primaryKey(),
  siteId: text('siteId').notNull(),
  severity: text('severity').notNull(), // LOW, MODERATE, HIGH, CRITICAL
  message: text('message').notNull(),
  status: text('status').notNull(), // ACTIVE, RESOLVED
  createdAt: integer('createdAt').notNull(),
  resolvedAt: integer('resolvedAt'),
});
