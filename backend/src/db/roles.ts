import * as schemas from './schema.ts';
import db from './instance.ts';
import type Role from '../models/Role.ts';

export async function insert(name: string): Promise<Role> {
  const [role] = await db.insert(schemas.roles).values({ name }).returning();

  return role;
}
