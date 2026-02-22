import { eq } from 'drizzle-orm';
import type Role from '../models/Role.ts';
import type User from '../models/User.ts';
import db from './instance.ts';
import * as schemas from './schema.ts';

export async function getByEmail(email: string): Promise<User | null> {
	const [user] = await db.select().from(schemas.users).where(eq(schemas.users.email, email));

	return user || null;
}

export async function insert(
	email: User['email'],
	hashedPassword: User['hashedPassword'],
	role: User['role'],
): Promise<Omit<User, 'hashedPassword'> | null> {
	const [user] = await db.insert(schemas.users).values({ email, hashedPassword, role }).returning({
		id: schemas.users.id,
		email: schemas.users.email,
		role: schemas.users.role,
	});

	return user || null;
}

export async function getById(id: User['id']): Promise<Omit<User, 'hashedPassword'> | null> {
	const [user] = await db
		.select({
			id: schemas.users.id,
			email: schemas.users.email,
			role: schemas.users.role,
		})
		.from(schemas.users)
		.where(eq(schemas.users.id, id));

	return user || null;
}

interface UpdateParameters {
	id: User['id'];
	updates: {
		email?: User['email'];
		hashedPassword?: User['hashedPassword'];
		role?: Role['id'];
	};
}
export async function update({ id, updates }: UpdateParameters): Promise<Omit<User, 'hashedPassword'> | null> {
	const [user] = await db.update(schemas.users).set(updates).where(eq(schemas.users.id, id)).returning({
		id: schemas.users.id,
		email: schemas.users.email,
		role: schemas.users.role,
	});

	return user || null;
}

interface DeleteByIdParameters {
	id: User['id'];
}
export async function deleteById({ id }: DeleteByIdParameters): Promise<boolean> {
	const user = await db.delete(schemas.users).where(eq(schemas.users.id, id)).returning({ id: schemas.users.id });

	return user.length > 0;
}
