import db from '../db/index.ts';
import Company from '../models/Company.ts';
import DomainError from '../models/DomainError.ts';

interface CreateCompanyParameters {
	name: string;
}
async function createCompany({ name }: CreateCompanyParameters): Promise<Company> {
	// TODO: apply RBAC

	//   const user = await db.users.getById(result.id);
	//   const role_permissions =

	const company = await db.companies.insert(name);

	return company;
}

interface UpdateCompanyParameters {
	companyId: string;
	updates: {
		name: string;
	};
}
async function updateCompany({ companyId, updates }: UpdateCompanyParameters): Promise<Company> {
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
	companyId: string;
}
async function getCompany({ companyId }: GetCompanyParameters): Promise<Company> {
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
	pointerId?: Company['id'];
	limit?: number;
}
async function getAll({ pointerId, limit }: GetAllParameters): Promise<Company[]> {
	// TODO: apply RBAC

	//   const user = await db.users.getById(result.id);
	//   const role_permissions =

	return await db.companies.getAll({
		pointerId,
		limit,
	});
}

interface DeleteCompanyParameters {
	companyId: string;
}
async function deleteCompany({ companyId }: DeleteCompanyParameters): Promise<void> {
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
