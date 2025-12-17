import { z } from 'zod';

import { getActivityKindsDAO } from '../db/activitykind.dao.js';

const ActivityKindSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().optional(),
  })
  .strict();

function generateErrrorObject(zodError) {
  const flattened = z.flattenError(zodError)?.fieldErrors;
  const error = {};
  for (const key in flattened) {
    error[key] = flattened[key]?.join(', ');
  }
  return error;
}

export function getActivityKindsService(cnf, log) {
  const dao = getActivityKindsDAO(log);

  return {
    createActivityKind: async (payload) => {
      // Validate payload
      const result = ActivityKindSchema.safeParse(payload);
      if (!result.success) {
        return {
          data: undefined,
          error: generateErrrorObject(result.error),
        };
      }
      // Check for duplicate name
      const names = await dao.findByName(payload.name);
      if (names.length > 0) {
        return {
          data: undefined,
          error: { name: 'An activity kind with this name already exists' },
        };
      }

      const created = await dao.create(result.data);
      return created;
    },
    deleteActivityKind: async (id) => {
      const deleted = await dao.deleteById(id);
      return deleted;
    },
    getActivityKindById: async (id) => {
      const found = await dao.findById(id);
      return found;
    },
    queryActivityKinds: async (qry) => {
      const data = await dao.findAll(qry);
      return data;
    },
    updateActivityKind: async (id, payload) => {
      const result = ActivityKindSchema.safeParse(payload);
      if (!result.success) {
        return {
          data: undefined,
          error: generateErrrorObject(result.error),
        };
      }
      // Check for duplicate name
      const names = await dao.findByName(payload.name);
      if (names.length > 0 && names[0].id !== id) {
        return {
          data: undefined,
          error: { name: 'An activity kind with this name already exists' },
        };
      }
      const updated = await dao.updateById(id, payload);
      return updated;
    },
  };
}
