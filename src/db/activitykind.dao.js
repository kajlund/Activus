import { eq } from 'drizzle-orm';
import db from './index.js';
import { activityKinds } from './schemas.js';

export function getActivityKindsDAO(log) {
  return {
    create: async (payload) => {
      const time = new Date();
      payload.createdAt = time;
      payload.updatedAt = time;
      const [created] = await db
        .insert(activityKinds)
        .values(payload)
        .returning();
      log.debug(created, 'Created activity kind:');
      return created;
    },
    deleteById: async (id) => {
      const [deleted] = await db
        .delete(activityKinds)
        .where(eq(activityKinds.id, id))
        .returning();
      log.debug(deleted, 'Deleted activity kind:');
      return deleted;
    },
    findById: async (id) => {
      const activityKind = await db
        .select()
        .from(activityKinds)
        .where(eq(activityKinds.id, id))
        .limit(1)
        .then((rows) => rows[0]);
      log.debug(activityKind, 'Fetched activity kind by ID:');
      return activityKind;
    },
    findByName: async (name) => {
      const kinds = await db
        .select()
        .from(activityKinds)
        .where(eq(activityKinds.name, name));
      log.debug(kinds, 'Fetched activity kind by name:');
      return kinds;
    },
    findAll: async () => {
      const result = await db
        .select()
        .from(activityKinds)
        .orderBy(activityKinds.name);
      log.debug(result, 'Fetched all activity kinds:');
      return result;
    },
    updateById: async (id, payload) => {
      payload.updatedAt = new Date();
      const [updated] = await db
        .update(activityKinds)
        .set(payload)
        .where(eq(activityKinds.id, id))
        .returning();
      log.debug(updated, 'Updated activity kind:');
      return updated;
    },
  };
}
