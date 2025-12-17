import { asyncHandler } from '../utils/async-handler.js';
import { getActivityKindsService } from '../services/activitykind.service.js';

export function getActivityKindsController(cnf, log) {
  const svc = getActivityKindsService(cnf, log);

  return {
    showActivityKindViews: asyncHandler(async (req, res) => {
      const kinds = await svc.queryActivityKinds();
      res.render('kinds/list', {
        title: 'Activity Kinds',
        page: 'kinds',
        kinds,
      });
    }),
    showAddView: asyncHandler(async (req, res) => {
      res.render('kinds/edit', {
        title: 'Add ActivityKind',
        page: 'kinds',
        insertMode: true,
        kind: {
          name: '',
          description: '',
        },
        errors: {},
      });
    }),
    showEditView: asyncHandler(async (req, res) => {
      const kind = await svc.getActivityKindById(req.params.id);
      if (!kind) {
        // req.flash('error', 'ActivityKind not found');
        return res.redirect('/activitykinds');
      }
      res.render('kinds/edit', {
        title: 'Edit ActivityKind',
        page: 'kinds',
        insertMode: false,
        kind,
        errors: {},
      });
    }),
    createActivityKind: asyncHandler(async (req, res) => {
      const payload = req.body;
      log.info({ payload }, 'Creating activity kind');
      const { data, error } = await svc.createActivityKind(payload);
      if (error) {
        log.info({ error }, 'Validation errors creating activity kind');
        res.render('kinds/edit', {
          title: 'Add ActivityKind',
          page: 'kinds',
          insertMode: true,
          kind: payload,
          error,
        });
      } else {
        log.info({ data }, 'ActivityKind created successfully');
        // req.flash('success', 'ActivityKind created successfully');
        res.redirect('/activitykinds');
      }
    }),
    updateActivityKind: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const payload = req.body;
      log.info({ id, payload }, 'Updating activity kind');
      const { data, error } = await svc.updateActivityKind(id, payload);
      if (error) {
        log.info({ error }, 'Validation errors updating activity kind');
        res.render('kinds/edit', {
          title: 'Add ActivityKind',
          page: 'kinds',
          insertMode: false,
          kind: payload,
          error,
        });
      } else {
        log.info({ data }, 'ActivityKind updated successfully');
        // req.flash('success', 'ActivityKind updated');
        res.redirect('/activitykinds');
      }
    }),
    deleteActivityKind: asyncHandler(async (req, res) => {
      const { id } = req.params;
      log.info({ id }, 'Deleting activity kind');
      const deleted = await svc.deleteActivityKind(id);
      if (!deleted) {
        // req.flash('error', 'Delete ActivityKind failed');
      }
      log.info({ deleted }, 'ActivityKind deleted successfully');
      // req.flash('success', 'ActivityKind deleted');
      res.redirect('/activitykinds');
    }),
  };
}
