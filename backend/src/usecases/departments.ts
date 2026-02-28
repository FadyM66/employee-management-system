import db from '../db/index.ts';
import { verifyAccessToken } from '../infrastructure/auth.ts';
import type Department from '../models/Department.ts';
import DomainError from '../models/DomainError.ts';

interface CreateDepartmentParameters {
	accessToken: string;
	name: Department['name'];
	companyId: Department['companyId'];
	head?: Department['head'];
}
async function createDepartment({
	accessToken,
	name,
	companyId,
	head,
}: CreateDepartmentParameters): Promise<Department> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	let department: Department | null;
	try {
		department = await db.departments.insert({ name, companyId, head });
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', { error });
	}

	if (!department) {
		throw new DomainError('internal-error', {
			message: 'No department was added',
		});
	}

	return department;
}

interface UpdateDepartmentParameters {
	accessToken: string;
	departmentId: Department['id'];
	updates: {
		name?: Department['name'];
		companyId?: Department['companyId'];
		head?: Department['head'];
	};
}
async function updateDepartment({
	accessToken,
	departmentId,
	updates,
}: UpdateDepartmentParameters): Promise<Department> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	if (!updates.name && !updates.companyId && !updates.head) {
		throw new DomainError('validation-error', {
			message: 'at least one update field is required.',
		});
	}

	let department: Department | null;
	try {
		department = await db.departments.update({
			id: departmentId,
			updates,
		});
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', { error });
	}

	if (!department) {
		throw new DomainError('not-found');
	}

	return department;
}

interface GetDepartmentParameters {
	accessToken: string;
	departmentId: Department['id'];
}
async function getDepartment({ accessToken, departmentId }: GetDepartmentParameters): Promise<Department> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	const department = await db.departments.getById({ id: departmentId });
	if (!department) {
		throw new DomainError('not-found');
	}

	return department;
}

interface GetAllParameters {
	accessToken: string;
	pointerId?: Department['id'];
	limit?: number;
}
async function getAll({ accessToken, pointerId, limit }: GetAllParameters): Promise<Department[]> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	return await db.departments.getAll({
		pointerId,
		limit,
	});
}

interface DeleteDepartmentParameters {
	accessToken: string;
	departmentId: Department['id'];
}
async function deleteDepartment({ accessToken, departmentId }: DeleteDepartmentParameters): Promise<void> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	const result = await db.departments.deleteById({ id: departmentId });
	if (!result) {
		throw new DomainError('not-found');
	}
}

const departments = {
	createDepartment,
	updateDepartment,
	getAll,
	getDepartment,
	deleteDepartment,
};

export default departments;
