import db from '../db/index.ts';
import { verifyAccessToken } from '../infrastructure/auth.ts';
import DomainError from '../models/DomainError.ts';
import type Role from '../models/Role.ts';

interface CreateRoleParameters {
	accessToken: string;
	name: Role['name'];
}
async function createRole({ accessToken, name }: CreateRoleParameters): Promise<Role> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	let role: Role | null;
	try {
		role = await db.roles.insert(name);
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

	if (!role) {
		throw new DomainError('internal-error', {
			message: 'No role was added',
		});
	}

	return role;
}

interface UpdateRoleParameters {
	accessToken: string;
	roleId: Role['id'];
	updates: {
		name?: Role['name'];
	};
}
async function updateRole({ accessToken, roleId, updates }: UpdateRoleParameters): Promise<Role> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	if (!updates.name) {
		throw new DomainError('validation-error', {
			message: 'at least one update field is required.',
		});
	}

	let role: Role | null;
	try {
		role = await db.roles.update({
			id: roleId,
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

	if (!role) {
		throw new DomainError('not-found');
	}

	return role;
}

interface GetRoleParameters {
	accessToken: string;
	roleId: Role['id'];
}
async function getRole({ accessToken, roleId }: GetRoleParameters): Promise<Role> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	const role = await db.roles.getById(roleId);
	if (!role) {
		throw new DomainError('not-found');
	}

	return role;
}

interface GetAllParameters {
	accessToken: string;
	pointerId?: Role['id'];
	limit?: number;
}
async function getAll({ accessToken, pointerId, limit }: GetAllParameters): Promise<Role[]> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	return await db.roles.getAll({
		pointerId,
		limit,
	});
}

interface DeleteRoleParameters {
	accessToken: string;
	roleId: Role['id'];
}
async function deleteRole({ accessToken, roleId }: DeleteRoleParameters): Promise<void> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	const result = await db.roles.deleteById({ id: roleId });
	if (!result) {
		throw new DomainError('not-found');
	}
}

const role = {
	createRole,
	updateRole,
	getAll,
	getRole,
	deleteRole,
};

export default role;
