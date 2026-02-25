import { eq, desc } from 'drizzle-orm';

import db from './index.js';
import { activities, activityKinds } from './schemas.js';

export function getActivitiesDAO(log) {
  return {
    deleteById: async function (id) {
      const [deleted] = await db
        .delete(activities)
        .where(eq(activities.id, id))
        .returning();
      log.debug(deleted, `Deleted activity id ${id}`);
      return deleted;
    },
    findById: async function (id) {
      const [found] = await db
        .select({
          id: activities.id,
          when: activities.when,
          kindId: activities.kindId,
          kindName: activityKinds.name,
          title: activities.title,
          description: activities.description,
          distance: activities.distance,
          duration: activities.duration,
          elevation: activities.elevation,
          calories: activities.calories,
          createdAt: activities.createdAt,
          updatedAt: activities.updatedAt,
        })
        .from(activities)
        .innerJoin(activityKinds, eq(activities.kindId, activityKinds.id))
        .where(eq(activities.id, id))
        .limit(1);
      log.debug(found, `Found activity id ${id}`);
      return found;
    },
    insert: async function (data) {
      const time = new Date().toISOString();
      data.createdAt = time;
      data.updatedAt = time;
      const [newActivity] = await db
        .insert(activities)
        .values(data)
        .returning();
      log.debug(activities, 'Created activity');
      return newActivity;
    },
    query: async function (qry) {
      log.debug(qry, 'Querying activities');
      const result = await db
        .select({
          id: activities.id,
          when: activities.when,
          kindId: activities.kindId,
          kindName: activityKinds.name,
          title: activities.title,
          description: activities.description,
          distance: activities.distance,
          duration: activities.duration,
          elevation: activities.elevation,
          calories: activities.calories,
          createdAt: activities.createdAt,
          updatedAt: activities.updatedAt,
        })
        .from(activities)
        .innerJoin(activityKinds, eq(activities.kindId, activityKinds.id))
        .orderBy(desc(activities.when), desc(activities.createdAt));
      log.debug(result, 'Found activities');
      return result;
    },
    updateById: async function (id, data) {
      data.updatedAt = new Date().toISOString();
      const [updated] = await db
        .update(activities)
        .set(data)
        .where(eq(activities.id, id))
        .returning();
      log.debug(updated, `Updated activity id ${id}`);
      return updated;
    },
  };
}
