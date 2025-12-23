import express from 'express';

import { getHomeRoutes } from './home.routes.js';
import { getActivityKindRoutes } from './activitykind.routes.js';
import { getActivityRoutes } from './activity.routes.js';

export function getRouter(cnf, log) {
  const homeRoutes = getHomeRoutes(cnf, log);
  const kindRoutes = getActivityKindRoutes(cnf, log);
  const activitiesRoutes = getActivityRoutes(cnf, log);

  const groups = [homeRoutes, kindRoutes, activitiesRoutes];
  const router = express.Router();

  groups.forEach(({ group, routes }) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
      log.info(`Route: ${method} ${group.prefix}${path}`);
      router[method](
        group.prefix + path,
        [...(group.middleware || []), ...middleware],
        handler,
      );
    });
  });

  return router;
}
