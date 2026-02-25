import { eq } from 'drizzle-orm';
import db from './index.js';
import { activityKinds } from './schemas.js';

export function getActivityKindsDAO(log) {
  return {
    create: async (payload) => {
      const time = new Date().toISOString();
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
      const [found] = await db
        .select()
        .from(activityKinds)
        .where(eq(activityKinds.id, id))
        .limit(1);
      log.debug(found, 'Found activitykind by ID:');
      return found;
    },
    findByName: async (name) => {
      const [found] = await db
        .select()
        .from(activityKinds)
        .where(eq(activityKinds.name, name))
        .limit(1);
      log.debug(found, 'Found activitykind by name:');
      return found;
    },
    findAll: async () => {
      const result = await db
        .select()
        .from(activityKinds)
        .orderBy(activityKinds.name);
      log.debug(result, 'Found activitykinds:');
      return result;
    },
    updateById: async (id, payload) => {
      payload.updatedAt = new Date().toISOString();
      const [updated] = await db
        .update(activityKinds)
        .set(payload)
        .where(eq(activityKinds.id, id))
        .returning();
      log.debug(updated, 'Updated activitykind:');
      return updated;
    },
  };
}
