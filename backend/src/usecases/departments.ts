import db from '../db/index.ts';
import type Department from '../models/Department.ts';
import DomainError from '../models/DomainError.ts';

interface CreateDepartmentParameters {
	name: Department['name'];
	companyId: Department['companyId'];
	head?: Department['head'];
}
async function createDepartment({ name, companyId, head }: CreateDepartmentParameters): Promise<Department> {
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
	departmentId: Department['id'];
	updates: {
		name?: Department['name'];
		companyId?: Department['companyId'];
		head?: Department['head'];
	};
}
async function updateDepartment({ departmentId, updates }: UpdateDepartmentParameters): Promise<Department> {
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
	departmentId: Department['id'];
}
async function getDepartment({ departmentId }: GetDepartmentParameters): Promise<Department> {
	const department = await db.departments.getById({ id: departmentId });
	if (!department) {
		throw new DomainError('not-found');
	}

	return department;
}

interface GetAllParameters {
	pointerId?: Department['id'];
	limit?: number;
}
async function getAll({ pointerId, limit }: GetAllParameters): Promise<Department[]> {
	return await db.departments.getAll({
		pointerId,
		limit,
	});
}

interface DeleteDepartmentParameters {
	departmentId: Department['id'];
}
async function deleteDepartment({ departmentId }: DeleteDepartmentParameters): Promise<void> {
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
