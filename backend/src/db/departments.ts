import { eq } from 'drizzle-orm';
import type Department from '../models/Department.ts';
import db from './instance.ts';
import * as schemas from './schema.ts';

interface InsertParameters {
	name: Department['name'];
	companyId: Department['companyId'];
	head: Department['head'];
}
export async function insert({
	name,
	companyId,
	head,
}: InsertParameters): Promise<Department | null> {
	const [department] = await db
		.insert(schemas.departments)
		.values({
			name,
			companyId,
			head,
		})
		.returning({
			id: schemas.departments.id,
			name: schemas.departments.name,
			companyId: schemas.departments.companyId,
			head: schemas.departments.head,
		});

	return department || null;
}

interface UpdateParameters {
	id: Department['id'];
	updates: {
		name?: Department['name'];
		companyId?: Department['companyId'];
		head?: Department['head'];
	};
}
export async function update({ id, updates }: UpdateParameters): Promise<Department | null> {
	const [department] = await db
		.update(schemas.departments)
		.set(updates)
		.where(eq(schemas.departments.id, id))
		.returning({
			id: schemas.departments.id,
			name: schemas.departments.name,
			companyId: schemas.departments.companyId,
			head: schemas.departments.head,
		});

	return department || null;
}

interface GetByIdParameters {
	id: Department['id'];
}
export async function getById({ id }: GetByIdParameters): Promise<Department | null> {
	const [department] = await db
		.select({
			id: schemas.departments.id,
			name: schemas.departments.name,
			companyId: schemas.departments.companyId,
			head: schemas.departments.head,
		})
		.from(schemas.departments)
		.where(eq(schemas.departments.id, id));

	return department || null;
}

interface DeleteByIdParameters {
	id: Department['id'];
}
export async function deleteById({ id }: DeleteByIdParameters): Promise<boolean> {
	const department = await db
		.delete(schemas.departments)
		.where(eq(schemas.departments.id, id))
		.returning({ id: schemas.departments.id });

	return department.length > 0;
}
