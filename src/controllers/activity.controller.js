import { asyncHandler } from '../utils/async-handler.js';
import { getActivityService } from '../services/activity.service.js';
import { getActivityKindsService } from '../services/activitykind.service.js';
import { hmsToIsoTime, secToHms } from '../utils/helpers.js';

export function getActivityController(cnf, log) {
  const svc = getActivityService(cnf, log);
  const svcKinds = getActivityKindsService(cnf, log);

  return {
    showActivitiesViews: asyncHandler(async (req, res) => {
      const activityKinds = await svcKinds.queryActivityKinds();
      const activities = await svc.queryActivities();
      res.render('activities/index', {
        title: 'Activities',
        page: 'activities',
        activityKinds,
        activities,
      });
    }),
    showAddView: asyncHandler(async (req, res) => {
      const activityKinds = await svcKinds.queryActivityKinds();
      res.render('activities/add', {
        title: 'Add Activity',
        page: 'activities',
        activityKinds,
        payload: {},
        errors: {},
      });
    }),
    showDetailsView: asyncHandler(async (req, res) => {
      const activity = await svc.getActivityById(req.params.id);
      if (!activity) {
        req.flash('error', 'Activity not found');
        return res.redirect('/activities');
      }
      res.render('activities/detail', {
        title: 'Activity Details',
        page: 'activities',
        activity,
      });
    }),
    showEditView: asyncHandler(async (req, res) => {
      const activityKinds = await svcKinds.queryActivityKinds();
      const activity = await svc.getActivityById(req.params.id);
      if (!activity) {
        req.flash('error', 'Activity not found');
        return res.redirect('/activities');
      }

      // Transform duration for view
      res.locals = { ...secToHms(activity.duration) };

      res.render('activities/edit', {
        title: 'Edit Activity',
        page: 'activities',
        activity,
        activityKinds,
        errors: {},
      });
    }),
    createActivity: asyncHandler(async (req, res) => {
      const activityKinds = await svcKinds.queryActivityKinds();

      const { hrs, mins, secs } = req.body;
      delete req.body.hrs;
      delete req.body.mins;
      delete req.body.secs;
      req.body.duration = hmsToIsoTime(hrs, mins, secs);
      const payload = req.body;

      const result = await svc.createActivity(payload);
      if (result.error) {
        res.render('activities/add', {
          title: 'Add Activity',
          page: 'activities',
          activityKinds,
          payload,
          error: result.error,
          messages: { error: ['Validation errors'] },
        });
      } else {
        req.flash('success', 'Activity created');
        res.redirect('/activities');
      }
    }),
    updateActivity: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const activityKinds = await svcKinds.queryActivityKinds();

      const payload = req.body;
      const { hrs, mins, secs } = req.body;
      payload.duration = `${hrs.padStart(2, '0')}:${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`;
      delete payload.hrs;
      delete payload.mins;
      delete payload.secs;

      const result = await svc.updateActivity(id, payload);
      if (result.error) {
        res.render('activities/edit', {
          title: 'Add Activity',
          page: 'activities',
          insertMode: false,
          activity: payload,
          activityKinds,
          error: result.error,
          messages: { error: ['Validation errors'] },
        });
      } else {
        req.flash('success', 'Activity updated');
        res.redirect('/activities');
      }
    }),
    deleteActivity: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const deleted = await svc.deleteActivity(id);
      if (!deleted) {
        req.flash('error', 'Delete failed');
        return res.redirect('/activities');
      }
      req.flash('success', 'Activity deleted');
      res.redirect('/activities');
    }),
  };
}
