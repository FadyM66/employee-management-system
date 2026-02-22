import { drizzle } from 'drizzle-orm/node-postgres';
import { dbCredentials } from './drizzle.config.ts';

const db = drizzle({
	connection: dbCredentials,
});

export default db;
