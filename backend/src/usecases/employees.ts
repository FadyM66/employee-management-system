import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';
import type Employee from '../models/Employee.ts';

interface ActorContext {
	userId: string;
	roleId: string;
	email: string;
}

interface CreateEmployeeParameters {
	email: Employee['email'];
	name: Employee['name'];
	designation: Employee['designation'];
	status?: Employee['status'];
	mobile?: Employee['mobile'];
	address?: Employee['address'];
	companyId: Employee['companyId'];
	departmentId: Employee['departmentId'];
	hiredOn?: Employee['hiredOn'];
	actor: ActorContext;
}
async function createEmployee({
	email,
	name,
	designation,
	status,
	mobile,
	address,
	companyId,
	departmentId,
	hiredOn,
	actor,
}: CreateEmployeeParameters): Promise<Employee> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('employee.create')) {
		throw new DomainError('not-authorized');
	}

	const actorEmployee = await db.employees.getByEmail(actor.email);

	if (actorEmployee && actorEmployee.departmentId !== departmentId) {
		throw new DomainError('not-authorized');
	}

	let employee: Employee | null;

	try {
		employee = await db.employees.insert({
			email,
			name,
			designation,
			status,
			mobile,
			address,
			companyId,
			departmentId,
			hiredOn,
		});
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', { ...error });
	}

	if (!employee) {
		throw new DomainError('internal-error');
	}

	return employee;
}

interface UpdateEmployeeParameters {
	employeeId: Employee['id'];
	actor: ActorContext;
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
async function updateEmployee({ employeeId, actor, updates }: UpdateEmployeeParameters): Promise<Employee> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('employee.update')) {
		throw new DomainError('not-authorized');
	}

	const currentEmployee = await db.employees.getById({ id: employeeId });

	if (!currentEmployee) {
		throw new DomainError('not-found');
	}

	const actorEmployee = await db.employees.getByEmail(actor.email);

	if (actorEmployee) {
		if (currentEmployee.departmentId !== actorEmployee.departmentId) {
			throw new DomainError('not-authorized');
		}

		if (updates.departmentId && updates.departmentId !== actorEmployee.departmentId) {
			throw new DomainError('not-authorized');
		}
	}

	try {
		const employee = await db.employees.update({
			id: employeeId,
			updates,
		});

		return employee;
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', { error });
	}
}

interface GetEmployeeParameters {
	employeeId: Employee['id'];
	actor: ActorContext;
}
async function getEmployee({ employeeId, actor }: GetEmployeeParameters): Promise<Employee> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);
	const canReadEmployee = permissionNames.includes('employee.read');
	const canReadSelfEmployee = permissionNames.includes('employee.read_self');

	if (!canReadEmployee && !canReadSelfEmployee) {
		throw new DomainError('not-authorized');
	}

	const employee = await db.employees.getById({ id: employeeId });

	if (!employee) {
		throw new DomainError('not-found');
	}

	const actorEmployee = await db.employees.getByEmail(actor.email);

	if (actorEmployee) {
		if (canReadSelfEmployee && !canReadEmployee && actorEmployee.id !== employee.id) {
			throw new DomainError('not-authorized');
		}

		if (canReadEmployee && actorEmployee.departmentId !== employee.departmentId) {
			throw new DomainError('not-authorized');
		}
	}

	return employee;
}

interface GetAllParameters {
	pointerId?: Employee['id'];
	limit?: number;
	actor: ActorContext;
}
async function getAll({ pointerId, limit, actor }: GetAllParameters): Promise<Employee[]> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('employee.list')) {
		throw new DomainError('not-authorized');
	}

	const actorEmployee = await db.employees.getByEmail(actor.email);

	if (actorEmployee) {
		return await db.employees.getAll({
			pointerId,
			departmentId: actorEmployee.departmentId,
			limit,
		});
	}

	return await db.employees.getAll({
		pointerId,
		limit,
	});
}

interface DeleteEmployeeParameters {
	employeeId: Employee['id'];
	actor: ActorContext;
}
async function deleteEmployee({ employeeId, actor }: DeleteEmployeeParameters): Promise<void> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('employee.delete')) {
		throw new DomainError('not-authorized');
	}

	const currentEmployee = await db.employees.getById({ id: employeeId });

	if (!currentEmployee) {
		throw new DomainError('not-found');
	}

	const actorEmployee = await db.employees.getByEmail(actor.email);

	if (actorEmployee && currentEmployee.departmentId !== actorEmployee.departmentId) {
		throw new DomainError('not-authorized');
	}

	const result = await db.employees.deleteById({ id: employeeId });

	if (!result) {
		throw new DomainError('internal-error');
	}
}

const employees = {
	createEmployee,
	updateEmployee,
	getAll,
	getEmployee,
	deleteEmployee,
};

export default employees;
