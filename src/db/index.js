import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getConfig } from '../utils/config.js';
import * as schema from './schemas.js';

const cnf = getConfig();

const client = postgres(cnf.dbUrl, { prepare: false });
const db = drizzle(client, { schema });

export default db;
