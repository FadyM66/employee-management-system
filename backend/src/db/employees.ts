import { eq } from 'drizzle-orm';
import type Employee from '../models/Employee.ts';
import db from './instance.ts';
import * as schemas from './schema.ts';

interface InsertParameters {
	email: Employee['email'];
	name: Employee['name'];
	designation: Employee['designation'];
	status?: Employee['status'];
	mobile?: Employee['mobile'];
	address?: Employee['address'];
	companyId: Employee['companyId'];
	departmentId: Employee['departmentId'];
	hiredOn?: Employee['hiredOn'];
}
export async function insert({
	email,
	name,
	designation,
	status,
	mobile,
	address,
	companyId,
	departmentId,
	hiredOn,
}: InsertParameters): Promise<Employee | null> {
	const [employee] = await db
		.insert(schemas.employees)
		.values({
			email,
			name,
			designation,
			status,
			mobile,
			address,
			companyId,
			departmentId,
			hiredOn,
		})
		.returning({
			id: schemas.employees.id,
			email: schemas.employees.email,
			name: schemas.employees.name,
			designation: schemas.employees.designation,
			status: schemas.employees.status,
			mobile: schemas.employees.mobile,
			address: schemas.employees.address,
			companyId: schemas.employees.companyId,
			departmentId: schemas.employees.departmentId,
			hiredOn: schemas.employees.hiredOn,
		});

	return employee || null;
}

interface UpdateParameters {
	id: Employee['id'];
	updates: {
		email?: Employee['email'];
		name?: Employee['name'];
		designation?: Employee['designation'];
		status?: Employee['status'];
		mobile?: Employee['mobile'];
		address?: Employee['address'];
		companyId?: Employee['companyId'];
		departmentId?: Employee['departmentId'];
		hiredOn?: Employee['hiredOn'];
	};
}
export async function update({ id, updates }: UpdateParameters): Promise<Employee | null> {
	const [employee] = await db
		.update(schemas.employees)
		.set(updates)
		.where(eq(schemas.employees.id, id))
		.returning({
			id: schemas.employees.id,
			email: schemas.employees.email,
			name: schemas.employees.name,
			designation: schemas.employees.designation,
			status: schemas.employees.status,
			mobile: schemas.employees.mobile,
			address: schemas.employees.address,
			companyId: schemas.employees.companyId,
			departmentId: schemas.employees.departmentId,
			hiredOn: schemas.employees.hiredOn,
		});

	return employee || null;
}

interface GetByIdParameters {
	id: Employee['id'];
}
export async function getById({ id }: GetByIdParameters): Promise<Employee | null> {
	const [employee] = await db
		.select({
			id: schemas.employees.id,
			email: schemas.employees.email,
			name: schemas.employees.name,
			designation: schemas.employees.designation,
			status: schemas.employees.status,
			mobile: schemas.employees.mobile,
			address: schemas.employees.address,
			companyId: schemas.employees.companyId,
			departmentId: schemas.employees.departmentId,
			hiredOn: schemas.employees.hiredOn,
		})
		.from(schemas.employees)
		.where(eq(schemas.employees.id, id));

	return employee || null;
}

interface DeleteByIdParameters {
	id: Employee['id'];
}
export async function deleteById({ id }: DeleteByIdParameters): Promise<boolean> {
	const employee = await db
		.delete(schemas.employees)
		.where(eq(schemas.employees.id, id))
		.returning({ id: schemas.employees.id });

	return employee.length > 0;
}
