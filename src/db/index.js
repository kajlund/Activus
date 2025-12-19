import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { getConfig } from '../utils/config.js';
import * as schema from './schemas.js';

const cnf = getConfig();

const client = createClient({
  url: cnf.dbConnection,
});

const db = drizzle(client, { schema });

export default db;
