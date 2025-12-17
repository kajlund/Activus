import { getActivityKindsController } from '../controllers/activitykind.controller.js';

export function getActivityKindRoutes(cnf, log) {
  const ctrl = getActivityKindsController(cnf, log);

  return {
    group: {
      prefix: '/activitykinds',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: ctrl.showActivityKindViews,
      },
      {
        method: 'get',
        path: '/new',
        middleware: [],
        handler: ctrl.showAddView,
      },
      {
        method: 'get',
        path: '/edit/:id',
        middleware: [],
        handler: ctrl.showEditView,
      },
      {
        method: 'post',
        path: '/create',
        middleware: [],
        handler: ctrl.createActivityKind,
      },
      {
        method: 'post',
        path: '/update/:id',
        middleware: [],
        handler: ctrl.updateActivityKind,
      },
      {
        method: 'get',
        path: '/delete/:id',
        middleware: [],
        handler: ctrl.deleteActivityKind,
      },
    ],
  };
}
