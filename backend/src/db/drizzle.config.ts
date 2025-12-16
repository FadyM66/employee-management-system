import { defineConfig } from 'drizzle-kit';

export const dbCredentials = {
  host: process.env.DATABASE_HOST!,
  port: Number(process.env.DATABASE_PORT!) || 5432,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  ssl: process.env.DATABASE_SSL != 'false',
};

export default defineConfig({
  out: './src/db/migrations',
  dialect: 'postgresql',
  schema: './src/db/schema.ts',

  dbCredentials,

  introspect: {
    casing: 'camel',
  },

  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public',
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
