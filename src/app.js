import cookieParser from 'cookie-parser';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import session from 'express-session';
import nunjucks from 'nunjucks';
import httpLogger from 'pino-http';

import { getRouter } from './routes/index.js';
import { getErrorHandler } from './middleware/errorhandler.js';
import { getMessagesHandler } from './middleware/messages.handler.js';
import { getNotFoundHandler } from './middleware/notfoundhandler.js';

export function getApp(cnf, log) {
  const app = express();

  // Add middleware
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(cookieParser(cnf.cookieSecret));
  app.use(express.static('public'));

  app.use(
    session({
      secret: cnf.cookieSecret,
      resave: true,
      saveUninitialized: false,
      cookie: {
        // sameSite: 'lax',
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    }),
  );
  app.use(getMessagesHandler());

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
  nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: process.env.NODE_ENV !== 'production',
  });
  app.set('view engine', 'njk'); // set as default

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
