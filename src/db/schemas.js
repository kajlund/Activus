import { createId } from '@paralleldrive/cuid2';
import {
  pgTable,
  index,
  text,
  timestamp,
  varchar,
  integer,
  real,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' })
    .notNull()
    .defaultNow(),
};

export const activityKinds = pgTable('ActivityKinds', {
  id: varchar()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar().notNull().unique(),
  iconName: varchar().notNull().default(''),
  description: varchar().notNull().default(''),
  ...timestamps,
});

export const activities = pgTable(
  'Activities',
  {
    id: varchar('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar('userId').notNull().default(''),
    when: timestamp('when', { precision: 3, mode: 'string' })
      .notNull()
      .defaultNow(),
    kindId: varchar('kindId')
      .notNull()
      .references(() => activityKinds.id),
    title: varchar().notNull().default(''),
    description: text().notNull().default(''),
    distance: real().notNull().default(0),
    duration: integer().notNull().default(0),
    elevation: integer().notNull().default(0),
    calories: integer().notNull().default(0),
    ...timestamps,
  },
  (table) => [
    index('activities_when_idx').on(table.when),
    index('activities_userId_idx').on(table.userId),
  ],
);

// export const goals = pgTable('Challenges', {
//   id: varchar('id')
//     .primaryKey()
//     .$defaultFn(() => createId()),
//   title: varchar().notNull().default(''),
//   description: text().notNull().default(''),
//   starts: timestamp().notNull().defaultNow(),
//   ends: timestamp().notNull().defaultNow(),
//   distance: real().notNull().default(0),
//   duration: integer().notNull().default(0),
//   activities: integer().notNull().default(0),
// });
