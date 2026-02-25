import { z } from 'zod';

const configSchema = z.strictObject({
  env: z.enum(['development', 'production', 'test']).optional(),
  port: z.number().int().positive().gte(80).lte(65000),
  logLevel: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .optional(),
  logHttp: z.boolean().optional(),
  dbUrl: z.string().trim(),
  accessTokenSecret: z.string().min(30),
});

function getDefaultConfig() {
  return {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
    logHttp: process.env.LOG_HTTP === '1',
    dbUrl: process.env.DATABASE_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  };
}

export function getConfig(config = {}) {
  const cnf = { ...getDefaultConfig(), ...config };
  configSchema.parse(cnf);
  cnf.isDev = cnf.env === 'development';

  return cnf;
}
