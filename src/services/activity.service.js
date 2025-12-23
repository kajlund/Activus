import { z } from 'zod';

import { getActivitiesDAO } from '../db/activity.dao.js';
import { getActivityKindsDAO } from '../db/activitykind.dao.js';
import { generateErrrorObject } from '../utils/helpers.js';
import { isoTimeToSec } from '../utils/helpers.js';

const ActivitySchema = z
  .object({
    when: z.iso.date('Format must be YYYY-MM-DD'),
    kindId: z.string(),
    title: z.string().min(2).max(50).trim(),
    description: z.string().trim().optional(),
    distance: z.coerce.number().optional().default(0),
    duration: z.iso.time('Format must be hh:mm or hh:mm:ss'),
    elevation: z.coerce.number().int().gte(0).optional().default(0),
    calories: z.coerce.number().int().gte(0).optional().default(0),
  })
  .strict();

export function getActivityService(cnf, log) {
  const dao = getActivitiesDAO(log);
  const daoKinds = getActivityKindsDAO(log);

  return {
    createActivity: async (payload) => {
      // Validate payload
      const result = ActivitySchema.safeParse(payload);
      if (!result.success) {
        return {
          data: undefined,
          error: generateErrrorObject(result.error),
        };
      }

      result.data.duration = isoTimeToSec(result.data.duration);
      const created = await dao.insert(result.data);
      return {
        data: created,
        error: undefined,
      };
    },
    deleteActivity: async (id) => {
      const deleted = await dao.deleteById(id);
      return deleted;
    },
    getActivityById: async (id) => {
      const found = await dao.findById(id);
      return found;
    },
    queryActivities: async (qry) => {
      const data = await dao.query(qry);
      return data;
    },
    updateActivity: async (id, payload) => {
      const result = ActivitySchema.safeParse(payload);
      if (!result.success) {
        return {
          error: generateErrrorObject(result.error),
        };
      }
      result.data.duration = isoTimeToSec(result.data.duration);
      // Verify kindId is valid
      const kind = await daoKinds.findById(result.data.kindId);
      if (!kind) {
        return {
          error: { kindId: 'Activity kind was not found' },
        };
      }
      const updated = await dao.updateById(id, result.data);
      return updated;
    },
  };
}
