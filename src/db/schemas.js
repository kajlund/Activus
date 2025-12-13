import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
// import { sql } from 'drizzle-orm';

const timestamps = {
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'string' })
    .notNull()
    .defaultNow(),
};

export const activityKinds = pgTable('ActivityKinds', {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 50 }).notNull().unique(),
  description: text().notNull().default(''),
  ...timestamps,
});

export const activities = pgTable('Activities', {
  id: uuid().primaryKey().defaultRandom(),
  when: date().notNull().defaultNow(),
  kindId: uuid()
    .references(() => activityKinds.id)
    .notNull(),
  title: varchar({ length: 50 }).notNull(),
  description: text().notNull().default(''),
  distance: numeric().notNull().default(0),
  duration: integer().notNull().default(0),
  elevation: integer().notNull().default(0),
  calories: integer().notNull().default(0),
  threadmill: boolean().notNull().default(false),
  ...timestamps,
});

export const goals = pgTable('Goals', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull().default(''),
  description: text().notNull().default(''),
  starts: date().notNull().defaultNow(),
  ends: date().notNull().defaultNow(),
  distance: numeric().notNull().default(0),
  duration: integer().notNull().default(0),
  activities: integer().notNull().default(0),
});
