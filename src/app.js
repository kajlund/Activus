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
  const nj = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: cnf.isDev,
  });
  app.set('view engine', 'njk'); // set as default

  nj.addFilter('formatSeconds', function (sec) {
    if (!sec) return '00:00:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    // Helper to add leading zeros
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  });

  nj.addFilter('shortDate', function (date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });

  nj.addFilter('dateIso', function (date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns "2025-12-21"
  });

  nj.addFilter('floor', function (num) {
    return Math.floor(num);
  });

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
