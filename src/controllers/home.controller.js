import { asyncHandler } from '../utils/async-handler.js';

// eslint-disable-next-line no-unused-vars
export function getHomeController(cnf, log) {
  return {
    showHomeView: asyncHandler(async (req, res) => {
      res.render('home', { title: 'Home', page: 'home' });
    }),
  };
}
