import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

const timestamps = {
  createdAt: text('createdAt')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updatedAt')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
};

export const activityKinds = sqliteTable('ActivityKinds', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text().notNull().unique(),
  description: text().notNull().default(''),
  ...timestamps,
});

export const activities = sqliteTable('Activities', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  when: text()
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  kindId: text('kindId')
    .notNull()
    .references(() => activityKinds.id),
  title: text().notNull(),
  description: text().notNull().default(''),
  distance: integer({ mode: 'number' }).notNull().default(0),
  duration: integer({ mode: 'number' }).notNull().default(0),
  elevation: integer({ mode: 'number' }).notNull().default(0),
  calories: integer({ mode: 'number' }).notNull().default(0),
  ...timestamps,
});

export const goals = sqliteTable('Challenges', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text().notNull().default(''),
  description: text().notNull().default(''),
  starts: text()
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  ends: text()
    .notNull()
    .default(sql`(CURRENT_DATE)`),
  distance: real().notNull().default(0),
  duration: integer({ mode: 'number' }).notNull().default(0),
  activities: integer({ mode: 'number' }).notNull().default(0),
});
