import { eq } from 'drizzle-orm';
import type Role from '../models/Role.ts';
import db from './instance.ts';
import * as schemas from './schema.ts';

export async function insert(name: Role['name']): Promise<Role | null> {
	const [role] = await db.insert(schemas.roles).values({ name }).returning({
		id: schemas.roles.id,
		name: schemas.roles.name,
	});

	return role || null;
}

export async function getById(id: Role['id']): Promise<Role | null> {
	const [role] = await db
		.select({
			id: schemas.roles.id,
			name: schemas.roles.name,
		})
		.from(schemas.roles)
		.where(eq(schemas.roles.id, id));

	return role || null;
}

interface UpdateParameters {
	id: Role['id'];
	updates: {
		name?: Role['name'];
	};
}
export async function update({ id, updates }: UpdateParameters): Promise<Role | null> {
	const [role] = await db
		.update(schemas.roles)
		.set(updates)
		.where(eq(schemas.roles.id, id))
		.returning({
			id: schemas.roles.id,
			name: schemas.roles.name,
		});

	return role || null;
}

interface DeleteByIdParameters {
	id: Role['id'];
}
export async function deleteById({ id }: DeleteByIdParameters): Promise<boolean> {
	const role = await db
		.delete(schemas.roles)
		.where(eq(schemas.roles.id, id))
		.returning({ id: schemas.roles.id });

	return role.length > 0;
}
