import * as schemas from './schema.ts';
import { eq } from 'drizzle-orm';
import db from './instance.ts';
import type User from '../models/User.ts';
import type Role from '../models/Role.ts';

export async function getByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(schemas.users)
    .where(eq(schemas.users.email, email));

  return user;
}

interface InsertReturn {
  id: string;
  email: string;
  role: string;
}
export async function insert(
  email: string,
  hashedPassword: string,
  role: Role['id'],
): Promise<InsertReturn> {
  const [user] = await db
    .insert(schemas.users)
    .values({ email, password: hashedPassword, role })
    .returning();

  return { id: user.id, email: user.email, role: user.role };
}
