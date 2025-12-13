import { getHomeController } from '../controllers/home.controller.js';

export function getHomeRoutes(cnf, log) {
  const ctrl = getHomeController(cnf, log);

  return {
    group: {
      prefix: '',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: ctrl.showHomeView,
      },
    ],
  };
}
