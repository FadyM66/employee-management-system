import db from '../db/index.ts';
import { verifyAccessToken } from '../infrastructure/auth.ts';
import Company from '../models/Company.ts';
import DomainError from '../models/DomainError.ts';

interface CreateCompanyParameters {
	accessToken: string;
	name: string;
}
async function createCompany({ accessToken, name }: CreateCompanyParameters): Promise<Company> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	// TODO: apply RBAC

	//   const user = await db.users.getById(result.id);
	//   const role_permissions =

	const company = await db.companies.insert(name);

	return company;
}

interface UpdateCompanyParameters {
	accessToken: string;
	companyId: string;
	updates: {
		name: string;
	};
}
async function updateCompany({ accessToken, companyId, updates }: UpdateCompanyParameters): Promise<Company> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	// TODO: apply RBAC

	//   const user = await db.users.getById(result.id);
	//   const role_permissions =

	const company = await db.companies.update({
		id: companyId,
		updates,
	});

	return company;
}

interface GetCompanyParameters {
	accessToken: string;
	companyId: string;
}
async function getCompany({ accessToken, companyId }: GetCompanyParameters): Promise<Company> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	// TODO: apply RBAC

	//   const user = await db.users.getById(result.id);
	//   const role_permissions =

	const company = await db.companies.getById({
		id: companyId,
	});

	if (!company) {
		throw new DomainError('not-found');
	}

	return company;
}

interface GetAllParameters {
	accessToken: string;
	pointerId?: Company['id'];
	limit?: number;
}
async function getAll({ accessToken, pointerId, limit }: GetAllParameters): Promise<Company[]> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	// TODO: apply RBAC

	//   const user = await db.users.getById(result.id);
	//   const role_permissions =

	return await db.companies.getAll({
		pointerId,
		limit,
	});
}

interface DeleteCompanyParameters {
	accessToken: string;
	companyId: string;
}
async function deleteCompany({ accessToken, companyId }: DeleteCompanyParameters): Promise<void> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	// TODO: apply RBAC

	//   const user = await db.users.getById(result.id);
	//   const role_permissions =

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
