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
    showDetailsView: asyncHandler(async (req, res) => {}),
    showAddView: asyncHandler(async (req, res) => {}),
    showEditView: asyncHandler(async (req, res) => {}),
    createActivityKind: asyncHandler(async (req, res) => {}),
    updateActivityKind: asyncHandler(async (req, res) => {}),
    deleteActivityKind: asyncHandler(async (req, res) => {}),
  };
}
