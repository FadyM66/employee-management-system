import * as schemas from './schema.ts';
import Company from '../models/Company.ts';
import db from './instance.ts';
import { and, asc, eq, gt, type SQL } from 'drizzle-orm';

export async function insert(name: string): Promise<Company | null> {
	const [company] = await db.insert(schemas.companies).values({ name }).returning();

	return company || null;
}

interface UpdateParameters {
	id: string;
	updates: {
		name: string;
	};
}
export async function update({ id, updates }: UpdateParameters): Promise<Company | null> {
	const [company] = await db.update(schemas.companies).set(updates).where(eq(schemas.companies.id, id)).returning();

	return company || null;
}

interface GetByIdParameters {
	id: string;
}
export async function getById({ id }: GetByIdParameters): Promise<Company | null> {
	const [company] = await db.select().from(schemas.companies).where(eq(schemas.companies.id, id));

	return company || null;
}

interface GetAllParameters {
	pointerId?: Company['id'];
	limit?: number;
}
export async function getAll({ pointerId, limit = 10 }: GetAllParameters): Promise<Company[]> {
	const filters: SQL[] = [];

	if (pointerId) {
		filters.push(gt(schemas.companies.id, pointerId));
	}

	const companies = await db
		.select()
		.from(schemas.companies)
		.where(filters.length ? and(...filters) : undefined)
		.orderBy(asc(schemas.companies.id))
		.limit(limit);

	return companies;
}

interface DeleteByIdParameters {
	id: string;
}
export async function deleteById({ id }: DeleteByIdParameters): Promise<boolean> {
	const company = await db
		.delete(schemas.companies)
		.where(eq(schemas.companies.id, id))
		.returning({ id: schemas.companies.id });

	return company.length > 0;
}
