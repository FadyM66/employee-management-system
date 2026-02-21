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

type InsertReturn = Pick<User, 'id' | 'email' | 'role'>;
export async function insert(
  email: User['email'],
  hashedPassword: User['hashedPassword'],
  role: User['role'],
): Promise<InsertReturn> {
  const [user] = await db
    .insert(schemas.users)
    .values({ email, hashedPassword, role })
    .returning({
      id: schemas.users.id,
      email: schemas.users.email,
      role: schemas.users.role,
    });

  return user;
}

export async function getById(id: string): Promise<User | null> {
  const [user] = await db
    .select()
    .from(schemas.users)
    .where(eq(schemas.users.id, id));

  return user || null;
}
