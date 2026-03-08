import db from '../db/index.ts';
import type Department from '../models/Department.ts';
import DomainError from '../models/DomainError.ts';

interface ActorContext {
	userId: string;
	roleId: string;
	email: string;
}

interface CreateDepartmentParameters {
	name: Department['name'];
	companyId: Department['companyId'];
	head?: Department['head'];
	actor: ActorContext;
}
async function createDepartment({ name, companyId, head, actor }: CreateDepartmentParameters): Promise<Department> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('department.create')) {
		throw new DomainError('not-authorized');
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
		throw new DomainError('internal-error');
	}

	return department;
}

interface UpdateDepartmentParameters {
	departmentId: Department['id'];
	actor: ActorContext;
	updates: {
		name?: Department['name'];
		companyId?: Department['companyId'];
		head?: Department['head'];
	};
}
async function updateDepartment({ departmentId, actor, updates }: UpdateDepartmentParameters): Promise<Department> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('department.update')) {
		throw new DomainError('not-authorized');
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
	actor: ActorContext;
}
async function getDepartment({ departmentId, actor }: GetDepartmentParameters): Promise<Department> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('department.read')) {
		throw new DomainError('not-authorized');
	}

	const employee = await db.employees.getByEmail(actor.email);
	const userDepartmentId = employee?.departmentId;

	if (userDepartmentId && userDepartmentId !== departmentId) {
		throw new DomainError('not-authorized');
	}

	const department = await db.departments.getById({ id: departmentId });
	if (!department) {
		throw new DomainError('not-found');
	}

	return department;
}

interface GetAllParameters {
	pointerId?: Department['id'];
	limit?: number;
	actor: ActorContext;
}
async function getAll({ pointerId, limit, actor }: GetAllParameters): Promise<Department[]> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('department.list')) {
		throw new DomainError('not-authorized');
	}

	return await db.departments.getAll({
		pointerId,
		limit,
	});
}

interface DeleteDepartmentParameters {
	departmentId: Department['id'];
	actor: ActorContext;
}
async function deleteDepartment({ departmentId, actor }: DeleteDepartmentParameters): Promise<void> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('department.delete')) {
		throw new DomainError('not-authorized');
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
