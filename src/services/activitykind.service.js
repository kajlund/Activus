import { getActivityKindsDAO } from '../db/activitykind.dao.js';

export function getActivityKindsService(cnf, log) {
  const dao = getActivityKindsDAO(log);

  return {
    createActivityKind: async (payload) => {
      // Validation logic can be added here
      const created = await dao.create(payload);
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
      // Validation logic can be added here
      const updated = await dao.updateById(id, payload);
      return updated;
    },
  };
}
