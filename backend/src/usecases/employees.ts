import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';
import type Employee from '../models/Employee.ts';

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
}: CreateEmployeeParameters): Promise<Employee> {
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
		throw new DomainError('internal-error', {
			message: 'No employee was added',
		});
	}

	return employee;
}

interface UpdateEmployeeParameters {
	employeeId: Employee['id'];
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
async function updateEmployee({ employeeId, updates }: UpdateEmployeeParameters): Promise<Employee> {
	if (
		!updates.email &&
		!updates.name &&
		!updates.designation &&
		!updates.status &&
		!updates.mobile &&
		!updates.address &&
		!updates.companyId &&
		!updates.departmentId &&
		!updates.hiredOn
	) {
		throw new DomainError('validation-error', {
			message: 'at least one update field is required.',
		});
	}

	let employee: Employee | null;

	try {
		employee = await db.employees.update({
			id: employeeId,
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

	if (!employee) {
		throw new DomainError('not-found');
	}

	return employee;
}

interface GetEmployeeParameters {
	employeeId: Employee['id'];
}
async function getEmployee({ employeeId }: GetEmployeeParameters): Promise<Employee> {
	const employee = await db.employees.getById({ id: employeeId });

	if (!employee) {
		throw new DomainError('not-found');
	}

	return employee;
}

interface GetAllParameters {
	pointerId?: Employee['id'];
	limit?: number;
}
async function getAll({ pointerId, limit }: GetAllParameters): Promise<Employee[]> {
	return await db.employees.getAll({
		pointerId,
		limit,
	});
}

interface DeleteEmployeeParameters {
	employeeId: Employee['id'];
}
async function deleteEmployee({ employeeId }: DeleteEmployeeParameters): Promise<void> {
	const result = await db.employees.deleteById({ id: employeeId });

	if (!result) {
		throw new DomainError('not-found');
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
