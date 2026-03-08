import db from '../db/index.ts';
import Company from '../models/Company.ts';
import DomainError from '../models/DomainError.ts';

interface ActorContext {
	userId: string;
	roleId: string;
	email: string;
}

interface CreateCompanyParameters {
	name: string;
	actor: ActorContext;
}
async function createCompany({ name, actor }: CreateCompanyParameters): Promise<Company> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('company.create')) {
		throw new DomainError('not-authorized');
	}

	let company: Company | null;

	try {
		company = await db.companies.insert(name);
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', {
			error,
		});
	}

	if (!company) {
		throw new DomainError('internal-error');
	}

	return company;
}

interface UpdateCompanyParameters {
	companyId: string;
	actor: ActorContext;
	updates: {
		name: string;
	};
}
async function updateCompany({ companyId, actor, updates }: UpdateCompanyParameters): Promise<Company> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('company.update')) {
		throw new DomainError('not-authorized');
	}

	let company: Company | null;

	try {
		company = await db.companies.update({
			id: companyId,
			updates,
		});
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', {
			error,
		});
	}

	if (!company) {
		throw new DomainError('not-found');
	}

	return company;
}

interface GetCompanyParameters {
	companyId: string;
	actor: ActorContext;
}
async function getCompany({ companyId, actor }: GetCompanyParameters): Promise<Company> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('company.read')) {
		throw new DomainError('not-authorized');
	}

	const employee = await db.employees.getByEmail(actor.email);
	const userCompanyId = employee?.companyId;

	if (userCompanyId && userCompanyId !== companyId) {
		throw new DomainError('not-authorized');
	}

	const company = await db.companies.getById({
		id: companyId,
	});

	if (!company) {
		throw new DomainError('not-found');
	}

	return company;
}

interface GetAllParameters {
	pointerId?: Company['id'];
	limit?: number;
	actor: ActorContext;
}
async function getAll({ pointerId, limit, actor }: GetAllParameters): Promise<Company[]> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('company.list')) {
		throw new DomainError('not-authorized');
	}

	return await db.companies.getAll({
		pointerId,
		limit,
	});
}

interface DeleteCompanyParameters {
	companyId: string;
	actor: ActorContext;
}
async function deleteCompany({ companyId, actor }: DeleteCompanyParameters): Promise<void> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('company.delete')) {
		throw new DomainError('not-authorized');
	}

	const result = await db.companies.deleteById({
		id: companyId,
	});

	if (!result) {
		throw new DomainError('not-found');
	}
}

const companiesUsecase = {
	createCompany,
	updateCompany,
	getAll,
	getCompany,
	deleteCompany,
};

export default companiesUsecase;
