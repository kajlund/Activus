import { asyncHandler } from '../utils/async-handler.js';
import { getActivityKindsService } from '../services/activitykind.service.js';

export function getActivityKindsController(cnf, log) {
  const svc = getActivityKindsService(cnf, log);

  return {
    showActivityKindViews: asyncHandler(async (req, res) => {
      const activityKinds = await svc.queryActivityKinds();
      res.render('kinds/index', {
        title: 'Activity Kinds',
        page: 'kinds',
        activityKinds,
      });
    }),
    showAddView: asyncHandler(async (req, res) => {
      res.render('kinds/add', {
        title: 'Add ActivityKind',
        page: 'kinds',
        kind: {},
        errors: {},
      });
    }),
    showEditView: asyncHandler(async (req, res) => {
      const kind = await svc.getActivityKindById(req.params.id);
      if (!kind) {
        req.flash('error', 'ActivityKind not found');
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
      const result = await svc.createActivityKind(payload);
      if (result.error) {
        res.render('kinds/add', {
          title: 'New ActivityKind',
          page: 'kinds',
          kind: payload,
          error: result.error,
          messages: { error: ['Validation errors'] },
        });
      } else {
        req.flash('success', 'ActivityKind created');
        res.redirect('/activitykinds');
      }
    }),
    updateActivityKind: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const payload = req.body;
      const result = await svc.updateActivityKind(id, payload);
      if (result.error) {
        res.render('kinds/edit', {
          title: 'Add ActivityKind',
          page: 'kinds',
          insertMode: false,
          kind: payload,
          error: result.error,
          messages: { error: ['Validation errors'] },
        });
      } else {
        req.flash('success', 'ActivityKind updated');
        res.redirect('/activitykinds');
      }
    }),
    deleteActivityKind: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const deleted = await svc.deleteActivityKind(id);
      if (!deleted) {
        req.flash('error', 'Delete failed');
        return res.redirect('/activitykinds');
      }
      req.flash('success', 'ActivityKind deleted');
      res.redirect('/activitykinds');
    }),
  };
}
