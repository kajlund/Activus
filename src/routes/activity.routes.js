import { getActivityController } from '../controllers/activity.controller.js';

export function getActivityRoutes(cnf, log) {
  const ctrl = getActivityController(cnf, log);

  return {
    group: {
      prefix: '/activities',
      middleware: [],
    },
    routes: [
      {
        method: 'get',
        path: '/',
        middleware: [],
        handler: ctrl.showActivitiesViews,
      },
      {
        method: 'get',
        path: '/new',
        middleware: [],
        handler: ctrl.showAddView,
      },
      {
        method: 'get',
        path: '/:id',
        middleware: [],
        handler: ctrl.showDetailsView,
      },
      {
        method: 'get',
        path: '/:id/edit',
        middleware: [],
        handler: ctrl.showEditView,
      },
      {
        method: 'post',
        path: '/create',
        middleware: [],
        handler: ctrl.createActivity,
      },
      {
        method: 'post',
        path: '/:id/update',
        middleware: [],
        handler: ctrl.updateActivity,
      },
      {
        method: 'post',
        path: '/:id/delete',
        middleware: [],
        handler: ctrl.deleteActivity,
      },
    ],
  };
}
