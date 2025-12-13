import cookieParser from 'cookie-parser';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { Liquid } from 'liquidjs';
import httpLogger from 'pino-http';

import { getRouter } from './routes/index.js';
import { getErrorHandler } from './middleware/errorhandler.js';
import { getNotFoundHandler } from './middleware/notfoundhandler.js';

export function getApp(cnf, log) {
  const app = express();

  // Add middleware
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(cnf.cookieSecret));
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      limit: 1000, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
      standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
      // store: ... , // Redis, Memcached, etc. See below.
    }),
  );

  // Set view engine
  const engine = new Liquid({
    cache: process.env.NODE_ENV !== 'development',
    root: 'views',
    layouts: 'views/layouts',
    partials: 'views/partials',
    extname: '.liquid',
  });
  app.engine('liquid', engine.express()); // register liquid engine
  app.set('view engine', 'liquid'); // set as default

  // Serve public
  app.use(express.static('public'));

  // Logging Middleware
  if (cnf.logHttp) {
    app.use(httpLogger({ logger: log }));
  }

  // Add routes
  app.use(getRouter(cnf, log));

  // Add 404 handler
  app.use(getNotFoundHandler());

  // Add Generic Error handler
  app.use(getErrorHandler(log));

  return app;
}
